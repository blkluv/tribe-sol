import { NextRequest, NextResponse } from "next/server";
import { socialfi } from "@/utils/socialfi";

const apiKey = process.env.TAPESTRY_API_KEY || "";

export async function GET(req: NextRequest) {
  const walletAddress = req.nextUrl.searchParams.get("walletAddress") || undefined;

  try {
    const data = await socialfi.profiles.profilesList({
      apiKey,
      walletAddress,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/profiles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}
