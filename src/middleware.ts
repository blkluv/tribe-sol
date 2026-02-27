import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const apiKey = process.env.TAPESTRY_API_KEY;

  if (apiKey) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-api-key", apiKey);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/tapestry/:path*",
};
