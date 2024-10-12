import admin from "@/utils/firebaseAdmin";
import bcrypt from "bcrypt";
import pg from "pg";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
    sslmode: "require",
  },
});

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function POST(request) {
  try {
    // Parse body dari request yang masuk
    const body = await request.json();
    
    // Cek apakah idToken ada di body
    if (!body || !body.idToken) {
      return new Response(
        JSON.stringify({ status: "Error", message: "idToken tidak ada" }),
        { status: 400 }
      );
    }

    const { idToken } = body;

    // Verifikasi idToken Google menggunakan Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;

    // Masukkan data pengguna ke database (jika email sudah ada, lakukan "DO NOTHING")
    const query = `
      INSERT INTO public."user" (email, nama, role, picture_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `;
    const values = [email, name, "user", picture];
    await pool.query(query, values);

    // Ambil data pengguna dari database
    const { rows } = await pool.query(
      `SELECT * FROM public."user" WHERE email = $1`, [email]
    );

    // Cek apakah user ditemukan
    if (!rows || rows.length === 0) {
      return new Response(
        JSON.stringify({ status: "Error", message: "Pengguna tidak ditemukan" }),
        { status: 404 }
      );
    }

    const { id_user, nama, role } = rows[0];

    // Buat token JWT
    const data = { id_user, nama, email, role };
    const token = await new SignJWT(data)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(`${process.env.EXPIRE_TIME}s`)
      .sign(key);

    const expires = new Date(Date.now() + process.env.EXPIRE_TIME * 1000);

    // Set cookie session dengan token JWT
    cookies().set("session", token, { expires, httpOnly: true });

    return new Response(JSON.stringify({ status: "success", user: { id_user, nama, email } }), { status: 200 });
  } catch (err) {
    // Logging error untuk debugging
    console.error("Error di /api/login/google:", err);

    return new Response(
      JSON.stringify({ status: "Error", message: err.message || "Terjadi kesalahan" }),
      { status: 500 }
    );
  }
}
