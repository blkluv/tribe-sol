import { NextRequest, NextResponse } from "next/server";
import { socialfi } from "@/utils/socialfi";

const apiKey = process.env.TAPESTRY_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nodeId, ...likeData } = body;
    if (!nodeId) {
      return NextResponse.json({ error: "nodeId is required" }, { status: 400 });
    }
    const data = await socialfi.likes.likesCreate({ apiKey, nodeId }, likeData);
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/likes error:", error);
    return NextResponse.json(
      { error: "Failed to create like" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { nodeId, ...likeData } = body;
    if (!nodeId) {
      return NextResponse.json({ error: "nodeId is required" }, { status: 400 });
    }
    const data = await socialfi.likes.likesDelete({ apiKey, nodeId }, likeData);
    return NextResponse.json(data);
  } catch (error) {
    console.error("DELETE /api/likes error:", error);
    return NextResponse.json(
      { error: "Failed to remove like" },
      { status: 500 }
    );
  }
}
