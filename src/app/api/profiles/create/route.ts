import { NextRequest, NextResponse } from "next/server";
import { socialfi } from "@/utils/socialfi";

const apiKey = process.env.TAPESTRY_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await socialfi.profiles.findOrCreateCreate({ apiKey }, body);
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/profiles/create error:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
