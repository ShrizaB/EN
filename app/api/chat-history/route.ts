import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: List all chat sessions for a user, or fetch a single session by id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const sessionId = searchParams.get("sessionId");
  const { db } = await connectToDatabase();

  if (sessionId) {
    // Fetch a single session with messages
    const session = await db
      .collection("chat_sessions")
      .findOne({ _id: new ObjectId(sessionId), userId });
    if (!session) return NextResponse.json({ session: null });
    // Convert _id to id for frontend
    session.id = session._id?.toString();
    if (session._id) delete (session as any)._id;
    return NextResponse.json({ session });
  }

  if (!userId) return NextResponse.json({ sessions: [] });
  const sessions = await db
    .collection("chat_sessions")
    .find({ userId })
    .project({ messages: 0 }) // Don't send messages in the list
    .sort({ createdAt: -1 })
    .toArray();
  // Convert _id to id for frontend
  sessions.forEach((s) => {
    s.id = s._id?.toString();
    if (s._id) delete (s as any)._id;
  });
  return NextResponse.json({ sessions });
}

// POST: Create a new session or update messages
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, title, sessionId, messages } = body;
  const { db } = await connectToDatabase();

  // Create new session
  if (userId && title && !sessionId) {
    const session = {
      userId,
      title,
      createdAt: new Date(),
      messages: [],
    };
    const result = await db.collection("chat_sessions").insertOne(session);
    return NextResponse.json({ sessionId: result.insertedId.toString() });
  }

  // Update messages for a session
  if (sessionId && Array.isArray(messages)) {
    await db.collection("chat_sessions").updateOne(
      { _id: new ObjectId(sessionId), userId },
      { $set: { messages } }
    );
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

// DELETE: Delete a session
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { db } = await connectToDatabase();
  await db.collection("chat_sessions").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
} 