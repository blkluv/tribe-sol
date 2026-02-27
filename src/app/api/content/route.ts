import { NextRequest, NextResponse } from "next/server";
import { socialfi } from "@/utils/socialfi";

const apiKey = process.env.TAPESTRY_API_KEY || "";

/**
 * GET /api/content?profileId=...
 * Fetches a user's posts from Tapestry: GET /contents?profileId=...
 */
export async function GET(req: NextRequest) {
  const profileId = req.nextUrl.searchParams.get("profileId") || undefined;
  const requestingProfileId = req.nextUrl.searchParams.get("requestingProfileId") || undefined;
  const page = req.nextUrl.searchParams.get("page") || undefined;
  const pageSize = req.nextUrl.searchParams.get("pageSize") || undefined;

  try {
    const data = await socialfi.contents.contentsList({
      apiKey,
      profileId,
      requestingProfileId,
      page,
      pageSize,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content
 * Creates content on Tapestry: POST /contents/findOrCreate
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await socialfi.contents.findOrCreateCreate({ apiKey }, body);
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/content error:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}
