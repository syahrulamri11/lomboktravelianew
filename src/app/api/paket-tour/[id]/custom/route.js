import pool from "@/utils/dbConfig";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { nanoid } from "nanoid";

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function POST(request, {params}){
    try {
        const { id } = params;
        const token = request.cookies.get("session")?.value;
        if(!token){
            return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });
        }
        const { payload: session } = await jwtVerify(token, key, { alg: "HS256" });

        const { nama_destinasi } = await request.json();

        const query = "SELECT * FROM paket_tour WHERE id_tour = $1";
        const { rows: paket } = await pool.query(query, [id]);

        if(paket.length === 0){
            return NextResponse.json({ status: 404, message: "Paket tidak ada" }, { status: 404 });
        }

        const query2 = "SELECT * FROM picture WHERE id_tour = $1";
        const { rows: picture } = await pool.query(query2, [id]);
        const query3 = "SELECT id_destinasi FROM paket_tour_destinasi WHERE id_tour = $1";
        const { rows: destinasi } = await pool.query(query3, [id]);
        const query4 = "SELECT deskripsi FROM itinerary WHERE id_tour = $1";
        const { rows: itinerary } = await pool.query(query4, [id]);
        const query5 = "SELECT deskripsi FROM inclusion WHERE id_tour = $1";
        const { rows: inclusion } = await pool.query(query5, [id]);
        const query6 = "SELECT deskripsi FROM exclusion WHERE id_tour = $1";
        const { rows: exclusion } = await pool.query(query6, [id]);
        

        const targetPaket = {
            ...paket[0],
            picture: picture.length>0? picture[0].image_url : null,
            nama_destinasi: destinasi.map(d => d.id_destinasi),
            itinerary: itinerary.map(i => i.deskripsi),
            inclusion: inclusion.map(i => i.deskripsi),
            exclusion: exclusion.map(e => e.deskripsi),
        }

        const customIdTour = nanoid(20);

        const insertCustomPaketQuery = {
            text: "INSERT INTO paket_tour (id_tour, nama_paket, jenis_paket, deskripsi, harga, durasi, is_available, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            values: [customIdTour, targetPaket.nama_paket, targetPaket.jenis_paket, targetPaket.deskripsi, targetPaket.harga, nama_destinasi.length, targetPaket.is_available, session.id_user],
        }
        
        const { rows: customPaket } = await pool.query(insertCustomPaketQuery);
        
        const idPicture = nanoid(20);

        const pictureCustomPaketQuery = {
            text: "INSERT INTO picture (id_tour, id_picture, image_url) VALUES ($1, $2, $3) RETURNING image_url",
            values: [customIdTour, idPicture, targetPaket.picture],
        };

        await pool.query(pictureCustomPaketQuery);

        const destinasiQueries = nama_destinasi.map(destinasi => ({
            text: "INSERT INTO paket_tour_destinasi (id_tour, id_destinasi) VALUES ($1, $2)",
            values: [customIdTour, destinasi],
        }));
        
        await Promise.all(destinasiQueries.map(query => pool.query(query)));

        const deletedDestinasiIndex = destinasi.map(d => d.id_destinasi).map((num, index) => nama_destinasi.includes(num) ? null : index).filter(index => index !== null);

        const restOfItinerary = itinerary.map(i => i.deskripsi).filter((_, index) => deletedDestinasiIndex.includes(index) === false);

        const itineraryQueries = restOfItinerary.map(item => ({
            text: "INSERT INTO itinerary (id_tour, deskripsi) VALUES ($1, $2)",
            values: [customIdTour, item],
        }));
        await Promise.all(itineraryQueries.map(query => pool.query(query)));

        
        const inclusionQueries = targetPaket.inclusion.map(item => ({
            text: "INSERT INTO inclusion (id_tour, deskripsi) VALUES ($1, $2)",
            values: [customIdTour, item],
        }));
        await Promise.all(inclusionQueries.map(query => pool.query(query)));
    

        const exclusionQueries = targetPaket.exclusion.map(item => ({
            text: "INSERT INTO exclusion (id_tour, deskripsi) VALUES ($1, $2)",
            values: [customIdTour, item],
        }));
        await Promise.all(exclusionQueries.map(query => pool.query(query)));

        return NextResponse.json({status: 201, data: {
            ...customPaket[0],
        }}, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}