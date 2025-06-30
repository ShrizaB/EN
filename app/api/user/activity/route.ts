import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    console.log("Fetching activities for user:", userId)

    const client = await clientPromise
    const db = client.db()

    const activities = await db.collection("activities").find({ userId }).sort({ timestamp: -1 }).limit(20).toArray()

    console.log("Found", activities.length, "activities for user", userId)

    return NextResponse.json({ activities }, { status: 200 })
  } catch (error) {
    console.error("Get activities error:", error)
    return NextResponse.json({ error: "An error occurred while fetching activities." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    const activityData = await req.json()

    if (!activityData.type) {
      return NextResponse.json({ error: "Activity type is required" }, { status: 400 })
    }

    console.log("Logging activity for user:", userId, activityData)

    const client = await clientPromise
    const db = client.db()

    // Check for duplicate session if sessionId is provided
    if (activityData.sessionId) {
      const existingActivity = await db.collection("activities").findOne({
        userId,
        sessionId: activityData.sessionId,
        type: activityData.type
      })
      
      if (existingActivity) {
        console.log("Duplicate activity detected, updating existing instead of creating new:", activityData.sessionId)
        
        // Update the existing activity instead of creating a new one
        const updateResult = await db.collection("activities").updateOne(
          { _id: existingActivity._id },
          {
            $set: {
              ...activityData,
              timestamp: activityData.timestamp ? new Date(activityData.timestamp) : new Date(),
              updatedAt: new Date(),
            }
          }
        )
        
        return NextResponse.json({ 
          success: true, 
          activityId: existingActivity._id, 
          updated: true 
        }, { status: 200 })
      }
    }

    // Insert the activity
    const now = new Date()
    const activity = {
      userId,
      ...activityData,
      timestamp: activityData.timestamp ? new Date(activityData.timestamp) : now,
      createdAt: now,
    }

    const result = await db.collection("activities").insertOne(activity)
    console.log("Activity logged:", result.insertedId)

    // Update user stats
    await updateUserStats(db, userId, activityData)

    // If this is a quiz or learning activity, update subject progress
    if (
      (activityData.type === "quiz" || activityData.type === "learning") &&
      activityData.subject &&
      activityData.score
    ) {
      await updateSubjectProgress(db, userId, activityData.subject, activityData.score)
    }

    return NextResponse.json({ success: true, activityId: result.insertedId }, { status: 200 })
  } catch (error) {
    console.error("Log activity error:", error)
    return NextResponse.json({ error: "An error occurred while logging activity." }, { status: 500 })
  }
}

// Helper function to update user stats
async function updateUserStats(db: any, userId: string, activity: any) {
  try {
    const updateData: any = {
      "stats.lastActive": new Date(),
    }

    // Update specific stats based on activity type
    if (activity.type === "quiz") {
      updateData["$inc"] = {
        "stats.totalQuizzesTaken": 1,
        "stats.totalQuestionsAnswered": activity.totalQuestions || 0,
        "stats.correctAnswers": activity.score
          ? Math.round((activity.score / 100) * (activity.totalQuestions || 0))
          : 0,
        "stats.totalTimeSpent": activity.timeSpent || 0,
      }
    } else if (activity.type === "game") {
      updateData["$inc"] = {
        "stats.gamesPlayed": 1,
        "stats.totalTimeSpent": activity.timeSpent || 0,
      }
    } else {
      // For other activity types, just increment time spent
      updateData["$inc"] = {
        "stats.totalTimeSpent": activity.timeSpent || 0,
      }
    }

    const result = await db.collection("users").updateOne({ _id: new ObjectId(userId) }, updateData)
    console.log("User stats updated:", result.modifiedCount > 0)
  } catch (error) {
    console.error("Error updating user stats:", error)
  }
}

// Helper function to update the user's overall progress for a subject
async function updateSubjectProgress(db: any, userId: string, subject: string, score: number) {
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
    const newProgress = Math.max(currentProgress, score)

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
