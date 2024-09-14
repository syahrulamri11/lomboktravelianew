import { jwtVerify } from "jose";

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function middleware(request) {
  const sessionCookie = request.cookies.get("session")?.value;

  // user login nih.. ada session cookie nya
  if (sessionCookie) {
    try {
      const { role } = (await jwtVerify(sessionCookie, key)).payload; // asli gak nih... JWT nya... coba cek disini..
      if (
        role === "admin" &&
        (request.nextUrl.pathname.startsWith("/admin") ||
          request.nextUrl.pathname.startsWith("/api/admin"))
      ) {
        // wah user ternyata admin.. dan mau akses halaman admin... jadi kasi aja
        return;
      }
      if (
        request.nextUrl.pathname.startsWith("/admin") ||
        request.nextUrl.pathname.startsWith("/api/admin")
      ) {
        // user pengen akses admin, tp dia bukan si admin... jangan kasi >:(
        return handleResponse(request, 403, "Forbidden");
      }

      if (request.nextUrl.pathname.startsWith("/settings")) {
        return;
      }
    } catch (err) {
      return handleResponse(request, 401, "Unauthorized"); // session cookie nya KW nih... jangan kasi masuk
    }
  }

  if (
    !request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/api/admin") &&
    !request.nextUrl.pathname.startsWith("/settings")
  ) {
    // user belum login... kasi aja akses ke semua path, tapi jangan kasi path ke admin ya...
    return;
  }

  return handleResponse(request, 403, "Gabole !! >:("); // wah user belum login, tp dia coba coba buka halaman admin... JANGAN KASIH YAA :O
}

const handleResponse = (request, status, message) => {
  if (request.nextUrl.pathname.startsWith("/api")) {
    // user akses api... returnnya JSON ya kalau gagal :3
    return new Response(JSON.stringify({ message }), { status });
  } else {
    // user akses nya halaman... kalau gakbole kirim ke halaman login aja
    return Response.redirect(new URL("/login", request.url));
  }
};

export const config = {
  matcher: ["/((?!api/login|_next/static|_next/image|.*\\.png$).*)"],
};
