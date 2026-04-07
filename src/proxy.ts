import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function authSecret() {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
}

/** Debe coincidir con el prefijo de cookie que usó Auth.js al iniciar sesión (http → authjs.*, https → __Secure-authjs.*). */
function inferSecureCookie(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-proto");
  if (forwarded === "https") return true;
  if (forwarded === "http") return false;
  return req.nextUrl.protocol === "https:";
}

async function readSessionToken(req: NextRequest, secret: string) {
  const secure = inferSecureCookie(req);
  let token = await getToken({ req, secret, secureCookie: secure });
  if (!token) {
    token = await getToken({ req, secret, secureCookie: !secure });
  }
  return token;
}

export async function proxy(req: NextRequest) {
  const secret = authSecret();
  if (!secret) {
    console.error("Falta AUTH_SECRET para el proxy de sesión.");
    return NextResponse.next();
  }

  const token = await readSessionToken(req, secret);

  if (req.nextUrl.pathname.startsWith("/admin") && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
