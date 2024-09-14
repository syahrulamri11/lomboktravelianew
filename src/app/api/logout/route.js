import { cookies } from "next/headers";

export async function POST() {
  // Hapus cookie sesi untuk login biasa
  cookies().set("session", "", { expires: new Date(0) });

  return new Response(JSON.stringify({ status: "success" }), { status: 200 });
}
