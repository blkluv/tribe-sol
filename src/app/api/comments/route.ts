import { NextRequest, NextResponse } from "next/server";
import { socialfi } from "@/utils/socialfi";

const apiKey = process.env.TAPESTRY_API_KEY || "";

export async function GET(req: NextRequest) {
  const contentId = req.nextUrl.searchParams.get("contentId") || undefined;
  const page = req.nextUrl.searchParams.get("page") || undefined;
  const pageSize = req.nextUrl.searchParams.get("pageSize") || undefined;

  try {
    const data = await socialfi.comments.commentsList({
      apiKey,
      contentId,
      page,
      pageSize,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await socialfi.comments.commentsCreate({ apiKey }, body);
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const data = await socialfi.comments.commentsDelete({ apiKey, id });
    return NextResponse.json(data);
  } catch (error) {
    console.error("DELETE /api/comments error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
