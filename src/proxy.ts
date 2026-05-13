import crypto from "crypto";
import { type NextProxy, type NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard"];

const applyCsp = (request: NextRequest) => {
  const nonce = crypto.randomBytes(16).toString("base64");

  const isDev = process.env.NODE_ENV === "development";

  const scriptSrc = isDev
    ? `'self' 'unsafe-inline' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}'`;

  const cspHeader = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const response = NextResponse.next({
    request: { headers: new Headers(request.headers) },
  });

  response.headers.set("x-nonce", nonce);
  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
};

const checkHasToken = (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return undefined;
};

export const proxy: NextProxy = async (request) => {
  const tokenResponse = checkHasToken(request);
  if (tokenResponse) return tokenResponse;
  return applyCsp(request);
};
