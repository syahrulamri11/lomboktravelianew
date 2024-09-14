import pool from "@/utils/dbConfig";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    const table = searchParams.get("table");
    let query;

    if (table === 'paket_tour_top3') {
      // Query untuk mendapatkan 3 paket tour dengan jumlah order terbanyak
      query = `
        SELECT p.*, COALESCE(o.order_count, 0) AS total_orders
        FROM paket_tour p
        LEFT JOIN (
          SELECT id_tour, COUNT(*) AS order_count
          FROM orders
          GROUP BY id_tour
        ) o ON p.id_tour = o.id_tour
        ORDER BY total_orders DESC
        LIMIT 3
      `;
    } else {
      // Query default untuk menandai custom paket tour
      query = `SELECT * FROM ${table} WHERE created_by IS NULL`;
    }

    const { rows: paket } = await pool.query(query);

    const paketWithPicture = await Promise.all(paket.map(async (paket) => {
      const query2 = 'SELECT * FROM picture WHERE id_tour = $1';
      const { rows: picture } = await pool.query(query2, [paket.id_tour]);
      return {
        ...paket,
        picture: picture.length > 0 ? picture[0].image_url : null
      };
    }));

    return NextResponse.json({
      status: 200,
      data: paketWithPicture,
    }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}