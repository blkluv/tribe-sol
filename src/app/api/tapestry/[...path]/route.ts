import { NextRequest, NextResponse } from "next/server";

const TAPESTRY_BASE_URL =
  process.env.TAPESTRY_BASE_URL || "https://api.dev.usetapestry.dev/v1";
const TAPESTRY_API_KEY = process.env.TAPESTRY_API_KEY || "";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${TAPESTRY_BASE_URL}/${path.join("/")}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": TAPESTRY_API_KEY,
  };

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.text()
      : undefined;

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body,
    });

    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") || "application/json" },
    });
  } catch (error) {
    console.error("Tapestry proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request to Tapestry" },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
