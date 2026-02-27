import { NextRequest, NextResponse } from "next/server";
import { socialfi } from "@/utils/socialfi";

const apiKey = process.env.TAPESTRY_API_KEY || "";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  try {
    const data = await socialfi.profiles.profilesDetail({ apiKey, id: username });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/profiles/info error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data = await socialfi.profiles.profilesUpdate(
      { apiKey, id: username },
      body
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT /api/profiles/info error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
