import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
    sslmode: "require",
  },
});

export async function PUT(request) {
  try {
    const { id_user, picture_url } = await request.json();
    const query =
      'UPDATE public."user" SET picture_url = $1 WHERE id_user = $2';
    const values = [picture_url, id_user];

    const result = await pool.query(query, values);

    return Response.json({
      status: "success",
      message: "The user information has been updated",
    });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "An error occurred while updating data",
      },
      { status: 500 }
    );
  }
}
