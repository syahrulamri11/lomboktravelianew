import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function GET() {
  try {
    const token = cookies().get("session")?.value;
    const { payload: session } = await jwtVerify(token, key, { alg: "HS256" });
    return Response.json(session);
  } catch (err) {
    return Response.json(null);
  }
}