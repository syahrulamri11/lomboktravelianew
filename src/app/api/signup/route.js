import bcrypt from "bcrypt";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
    sslmode: "require",
  },
});

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
        INSERT INTO public."user" (nama, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id_user
      `;

    const values = [name, email, hashedPassword, "user"];

    const { rows } = await pool.query(query, values);
    const user = rows[0];

    return Response.json(
      { status: "success", message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === "23505") {
      return Response.json(
        {
          status: "error",
          message: "User with this email already exists",
        },
        { status: 409 }
      );
    }
    return Response.json(
      {
        status: "error",
        message: "An error occurred while creating the user",
      },
      { status: 500 }
    );
  }
}
