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
    .project({ 
      title: 1, 
      createdAt: 1, 
      updatedAt: 1,
      messageCount: { $size: { $ifNull: ["$messages", []] } },
      lastMessage: { $last: "$messages.content" }
    })
    .sort({ updatedAt: -1 })
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
      updatedAt: new Date(),
      messages: []
    };
    const result = await db.collection("chat_sessions").insertOne(session);
    return NextResponse.json({ 
      sessionId: result.insertedId.toString(),
      session: { ...session, id: result.insertedId.toString() }
    });
  }

  // Update messages in existing session
  if (sessionId && messages) {
    const result = await db.collection("chat_sessions").updateOne(
      { _id: new ObjectId(sessionId) },
      { 
        $set: { 
          messages: messages,
          updatedAt: new Date()
        }
      }
    );
    return NextResponse.json({ success: result.modifiedCount > 0 });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

// PUT: Update session title or other properties
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { sessionId, title } = body;
  const { db } = await connectToDatabase();

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  const updateData: any = { updatedAt: new Date() };
  if (title) updateData.title = title;

  const result = await db.collection("chat_sessions").updateOne(
    { _id: new ObjectId(sessionId) },
    { $set: updateData }
  );

  return NextResponse.json({ success: result.modifiedCount > 0 });
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