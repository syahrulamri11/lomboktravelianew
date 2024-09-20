// import admin from "@/utils/firebaseAdmin";
// import bcrypt from "bcrypt";
// import pg from "pg";
// import { cookies } from "next/headers";
// import { SignJWT } from "jose";

// const { Pool } = pg;
// const pool = new Pool({
//   connectionString: process.env.CONNECTION_STRING,
//   ssl: {
//     rejectUnauthorized: false,
//     sslmode: "require",
//   },
// });

// const secretKey = process.env.SECRET_KEY;
// const key = new TextEncoder().encode(secretKey);

// export async function POST(request) {
//   const { idToken } = await request.json();
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const { email, name, picture } = decodedToken;

//     const query = `
//         INSERT INTO public."user" (email, nama, role, picture_url)
//         VALUES ($1, $2, $3, $4)
//         ON CONFLICT (email) DO NOTHING
//       `;
//     const values = [email, name, "user", picture];
//     const result = await pool.query(query, values);

//     const { rows } = await pool.query(
//       `SELECT * FROM public."user" WHERE email = '${email}'`
//     );

//     const { id_user, nama, role } = rows[0];

//     const data = { id_user, nama, email, role };
//     const token = await new SignJWT(data)
//       .setProtectedHeader({ alg: "HS256" })
//       .setExpirationTime(`${process.env.EXPIRE_TIME}s`)
//       .sign(key);
//     const expires = new Date(Date.now() + process.env.EXPIRE_TIME * 1000); // 60 second
//     cookies().set("session", token, { expires, httpOnly: true });

//     return Response.json({ status: "success", user: { id_user, nama, email } });
//   } catch (err) {
//     return Response.json({ status: "Error", err }, { status: 403 });
//   }
// }

import admin from "@/utils/firebaseAdmin";
import pg from "pg";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

// Setup koneksi ke database PostgreSQL
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
    sslmode: "require",
  },
});

// Mengambil secret key dari environment variables
const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function POST(request) {
  let body;
  
  // Memastikan body request berisi data valid
  try {
    body = await request.json();
  } catch (error) {
    return Response.json({ status: "Error", message: "Invalid request body" }, { status: 400 });
  }

  // Memastikan idToken ada di body request
  const { idToken } = body;
  if (!idToken) {
    return Response.json({ status: "Error", message: "Token is missing" }, { status: 400 });
  }

  try {
    // Verifikasi token Google
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;

    // Query untuk insert user jika tidak ada (menggunakan ON CONFLICT untuk menghindari duplikasi email)
    const query = `
        INSERT INTO public."user" (email, nama, role, picture_url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `;
    const values = [email, name, "user", picture];
    await pool.query(query, values);

    // Ambil data user dari database berdasarkan email
    const { rows } = await pool.query(
      `SELECT * FROM public."user" WHERE email = $1`, [email]
    );

    // Cek apakah user ditemukan di database
    if (rows.length === 0) {
      return Response.json({ status: "Error", message: "User not found" }, { status: 404 });
    }

    const { id_user, nama, role } = rows[0];

    // Data untuk token JWT
    const data = { id_user, nama, email, role };
    const token = await new SignJWT(data)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(`${process.env.EXPIRE_TIME || 3600}s`) // Fallback waktu kadaluarsa token
      .sign(key);

    // Set cookies dengan token JWT
    const expires = new Date(Date.now() + (process.env.EXPIRE_TIME || 3600) * 1000);
    cookies().set("session", token, { expires, httpOnly: true });

    // Mengembalikan respons sukses
    return Response.json({ status: "success", user: { id_user, nama, email } });
  } catch (err) {
    // Penanganan error saat verifikasi token atau query database
    return Response.json({ status: "Error", message: err.message }, { status: 403 });
  }
}
