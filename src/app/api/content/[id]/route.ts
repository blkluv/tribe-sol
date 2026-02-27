import { NextRequest, NextResponse } from "next/server";
import { socialfi } from "@/utils/socialfi";

const apiKey = process.env.TAPESTRY_API_KEY || "";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const data = await socialfi.contents.contentsDetail({ apiKey, id });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/content/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const data = await socialfi.contents.contentsDelete({ apiKey, id });
    return NextResponse.json(data);
  } catch (error) {
    console.error("DELETE /api/content/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
