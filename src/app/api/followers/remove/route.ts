import { NextRequest, NextResponse } from "next/server";
import { socialfi } from "@/utils/socialfi";

const apiKey = process.env.TAPESTRY_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await socialfi.followers.removeCreate({ apiKey }, body);
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/followers/remove error:", error);
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}
