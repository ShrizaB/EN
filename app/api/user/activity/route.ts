import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { getSession } from "next-auth/react"
import clientPromise from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    const activityData = await req.json()

    console.log("Logging activity for user:", userId, activityData)

    if (!activityData.type) {
      return NextResponse.json({ error: "Activity type is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Create activity record
    const activity = {
      userId,
      type: activityData.type,
      subject: activityData.subject || null,
      topic: activityData.topic || null,
      score: activityData.score || null,
      totalQuestions: activityData.totalQuestions || null,
      timeSpent: activityData.timeSpent || 0,
      difficulty: activityData.difficulty || "standard",
      timestamp: new Date(),
    }

    await db.collection("user_activities").insertOne(activity)
    console.log("Activity logged successfully:", activity)

    // Update user stats
    const userCollection = db.collection("users")
    const user = await userCollection.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Initialize stats if they don't exist
    if (!user.stats) {
      user.stats = {
        totalQuizzesTaken: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        totalTimeSpent: 0,
        gamesPlayed: 0,
        lastActive: new Date(),
      }
    }

    // Update stats based on activity type
    const updateData: any = {
      "stats.lastActive": new Date(),
      "stats.totalTimeSpent": (user.stats.totalTimeSpent || 0) + (activityData.timeSpent || 0),
    }

    if (activityData.type === "quiz") {
      updateData["stats.totalQuizzesTaken"] = (user.stats.totalQuizzesTaken || 0) + 1
      updateData["stats.totalQuestionsAnswered"] =
        (user.stats.totalQuestionsAnswered || 0) + (activityData.totalQuestions || 0)
      updateData["stats.correctAnswers"] = (user.stats.correctAnswers || 0) + (activityData.score || 0)
    } else if (activityData.type === "game") {
      updateData["stats.gamesPlayed"] = (user.stats.gamesPlayed || 0) + 1
    }

    // Update user progress if subject is provided
    if (
      activityData.subject &&
      activityData.type === "quiz" &&
      activityData.score !== undefined &&
      activityData.totalQuestions
    ) {
      const progressPercentage = Math.round((activityData.score / activityData.totalQuestions) * 100)

      // Initialize progress if it doesn't exist
      if (!user.progress) {
        user.progress = {}
      }

      // Update progress for the subject (keep the higher value)
      const currentProgress = user.progress[activityData.subject] || 0
      if (progressPercentage > currentProgress) {
        updateData[`progress.${activityData.subject}`] = progressPercentage
      }
    }

    await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: updateData })
    console.log("User stats updated successfully")

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Log activity error:", error)
    return NextResponse.json({ error: "An error occurred while logging activity." }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.user.id) }, { projection: { activities: 1 } })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Sort activities by timestamp (newest first)
    const activities = user.activities || []
    activities.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}