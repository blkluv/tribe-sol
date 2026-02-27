import { NextRequest, NextResponse } from "next/server";

const TAPESTRY_BASE_URL =
  process.env.TAPESTRY_BASE_URL ?? "https://api.dev.usetapestry.dev/v1";
const TAPESTRY_API_KEY = process.env.TAPESTRY_API_KEY ?? "";

async function proxyRequest(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const tapestryPath = `/${path.join("/")}`;
  const search = req.nextUrl.searchParams.toString();
  const url = `${TAPESTRY_BASE_URL}${tapestryPath}${search ? `?${search}` : ""}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(TAPESTRY_API_KEY ? { "x-api-key": TAPESTRY_API_KEY } : {}),
  };

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.text()
      : undefined;

  const res = await fetch(url, {
    method: req.method,
    headers,
    body,
  });

  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
