import pool from "@/utils/dbConfig";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    const table = searchParams.get("table");
    const { rows } = await pool.query(`SELECT * FROM "${table}"`);
    return Response.json({
      status: 200,
      data: rows,
    });
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
