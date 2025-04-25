import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    console.log("Fetching learning history for user:", userId)

    const url = new URL(req.url)
    const subject = url.searchParams.get("subject")
    const topic = url.searchParams.get("topic")

    const client = await clientPromise
    const db = client.db()

    // If subject and topic are provided, get specific history
    if (subject && topic) {
      // Get the most recent entry for this topic
      const history = await db.collection("learning_history").findOne(
        {
          userId,
          subject,
          topic,
        },
        { sort: { lastAccessed: -1 } },
      )

      console.log("Found specific history:", history ? "yes" : "no")
      return NextResponse.json(
        { history },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      )
    }

    // Otherwise, get all history entries for the user, sorted by most recent first
    // Group by subject and topic to avoid duplicates in the response
    const pipeline = [
      { $match: { userId } },
      { $sort: { lastAccessed: -1 } },
      {
        $group: {
          _id: { subject: "$subject", topic: "$topic" },
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { lastAccessed: -1 } },
    ]

    const history = await db.collection("learning_history").aggregate(pipeline).toArray()

    console.log("Found", history.length, "unique history items for user", userId)

    return NextResponse.json(
      { history },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("Get learning history error:", error)
    return NextResponse.json({ error: "An error occurred while fetching learning history." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    const { subject, topic, content, progress, difficulty, visitId } = await req.json()

    if (!subject || !topic) {
      return NextResponse.json({ error: "Subject and topic are required" }, { status: 400 })
    }

    console.log("Received learning history update:", { userId, subject, topic, progress, difficulty, visitId })

    const client = await clientPromise
    const db = client.db()
    const now = new Date()

    // Generate a visit ID if not provided
    const currentVisitId = visitId || `${subject}-${topic}-${Date.now()}`

    // Check if there's already an entry with this visit ID to prevent duplicates
    const existingVisit = await db.collection("learning_history").findOne({
      userId,
      visitId: currentVisitId,
    })

    if (existingVisit) {
      console.log("Duplicate visit detected, updating existing entry instead")

      // Update the existing entry
      await db.collection("learning_history").updateOne(
        { _id: existingVisit._id },
        {
          $set: {
            content: content || existingVisit.content,
            progress: progress !== undefined ? progress : existingVisit.progress,
            difficulty: difficulty || existingVisit.difficulty,
            lastAccessed: now,
            updatedAt: now,
          },
        },
      )
    } else {
      // Check if history already exists for this topic
      const existingHistory = await db.collection("learning_history").findOne(
        {
          userId,
          subject,
          topic,
        },
        { sort: { lastAccessed: -1 } },
      )

      // Calculate visit count
      const visitCount = existingHistory ? (existingHistory.visitCount || 0) + 1 : 1

      // Create a new entry
      const insertResult = await db.collection("learning_history").insertOne({
        userId,
        subject,
        topic,
        content: content || "",
        progress: progress || 0,
        difficulty: difficulty || "beginner",
        lastAccessed: now,
        visitCount: visitCount,
        visitId: currentVisitId,
        visitDate: now,
        createdAt: now,
        updatedAt: now,
      })

      console.log("Created new history entry:", insertResult.insertedId)
    }

    // Also update the user's overall progress for this subject
    await updateSubjectProgress(db, userId, subject, progress || 0)

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("Update learning history error:", error)
    return NextResponse.json({ error: "An error occurred while updating learning history." }, { status: 500 })
  }
}

// Helper function to update the user's overall progress for a subject
async function updateSubjectProgress(db: any, userId: string, subject: string, progress: number) {
  try {
    // Get the user document
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })

    if (!user) {
      console.error("User not found for progress update")
      return
    }

    // Initialize progress object if it doesn't exist
    if (!user.progress) {
      user.progress = {}
    }

    // Update the progress for this subject
    // If the new progress is higher than the existing one, use the new progress
    const currentProgress = user.progress[subject] || 0
    const newProgress = Math.max(currentProgress, progress)

    // Update the user document
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          [`progress.${subject}`]: newProgress,
          updatedAt: new Date(),
        },
      },
    )

    console.log(`Updated user progress for ${subject}: ${newProgress}%`)
  } catch (error) {
    console.error("Error updating subject progress:", error)
  }
}