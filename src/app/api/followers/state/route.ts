import { NextRequest, NextResponse } from "next/server";
import { socialfi } from "@/utils/socialfi";

const apiKey = process.env.TAPESTRY_API_KEY || "";

export async function GET(req: NextRequest) {
  const startId = req.nextUrl.searchParams.get("startId");
  const endId = req.nextUrl.searchParams.get("endId");

  if (!startId || !endId) {
    return NextResponse.json(
      { error: "startId and endId are required" },
      { status: 400 }
    );
  }

  try {
    const data = await socialfi.followers.stateList({ apiKey, startId, endId });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/followers/state error:", error);
    return NextResponse.json(
      { error: "Failed to check follow state" },
      { status: 500 }
    );
  }
}
