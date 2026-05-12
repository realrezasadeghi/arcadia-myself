import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const checkUserAccess = (request: NextRequest) => {
  const PROTECTED_PATHS = ["/dashboard"];
  const { pathname } = request.nextUrl;

  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtectedPath) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }
};

export function proxy(request: NextRequest) {
  const accessResponse = checkUserAccess(request);
  if (accessResponse) return accessResponse;
  return NextResponse.next({ headers: new Headers(request.headers) });
}
