import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
    sslmode: "require",
  },
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id_user = searchParams.get("id_user");
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  let query = `SELECT id_user, nama, email, picture_url, role FROM public."user"`;
  let conditions = [];
  let values = [];

  if (id_user) {
    conditions.push(`id_user = $${conditions.length + 1}`);
    values.push(id_user);
  }

  if (email) {
    conditions.push(`email = $${conditions.length + 1}`);
    values.push(email);
  }

  if (name) {
    conditions.push(`nama ILIKE $${conditions.length + 1}`);
    values.push(`%${name}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += ` ORDER BY id_user LIMIT $${values.length + 1} OFFSET $${
    values.length + 2
  }`;
  values.push(limit, offset);

  try {
    const { rows } = await pool.query(query, values);
    return Response.json({ status: "success", users: rows });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "An error occurred while fetching data",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id_user } = await request.json();
    const query = 'DELETE FROM public."user" WHERE id_user = $1';
    const values = [id_user];

    const result = await pool.query(query, values);

    return Response.json({
      status: "success",
      message: "The user has been eliminated from travelia",
    });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "An error occurred while fetching data",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id_user, name, email, picture_url } = await request.json();
    const query =
      'UPDATE public."user" SET nama = $1, email = $2, picture_url = $3 WHERE id_user = $4';
    const values = [name, email, picture_url, id_user];

    const result = await pool.query(query, values);

    return Response.json({
      status: "success",
      message: "The user information has been updated",
    });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "An error occurred while fetching data",
      },
      { status: 500 }
    );
  }
}