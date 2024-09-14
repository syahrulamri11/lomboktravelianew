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
  const { idToken } = await request.json();
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;

    const query = `
        INSERT INTO public."user" (email, nama, role, picture_url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `;
    const values = [email, name, "user", picture];
    const result = await pool.query(query, values);

    const { rows } = await pool.query(
      `SELECT * FROM public."user" WHERE email = '${email}'`
    );

    const { id_user, nama, role } = rows[0];

    const data = { id_user, nama, email, role };
    const token = await new SignJWT(data)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(`${process.env.EXPIRE_TIME}s`)
      .sign(key);
    const expires = new Date(Date.now() + process.env.EXPIRE_TIME * 1000); // 60 second
    cookies().set("session", token, { expires, httpOnly: true });

    return Response.json({ status: "success", user: { id_user, nama, email } });
  } catch (err) {
    return Response.json({ status: "Error", err }, { status: 403 });
  }
}