import { NextRequest, NextResponse } from "next/server";
import { listChatSessions } from "@/lib/chat-session-service";

// GET /api/chat/history?userId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || undefined;
  const sessions = await listChatSessions(userId);
  return NextResponse.json({ sessions });
}
