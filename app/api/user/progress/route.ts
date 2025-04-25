import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = session.id
    const { subject, progress } = await req.json()

    if (!subject || typeof progress !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 422 })
    }

    const client = await clientPromise
    const db = client.db()

    // First, get the current user data to check existing progress
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get current progress for this subject (if any)
    const currentProgress = user.progress?.[subject] || 0

    // Only update if the new progress is higher than the current progress
    if (progress > currentProgress) {
      console.log(`Updating progress for ${subject} from ${currentProgress}% to ${progress}%`)

      const result = await db
        .collection("users")
        .updateOne({ _id: new ObjectId(userId) }, { $set: { [`progress.${subject}`]: progress } })

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json(
        {
          success: true,
          message: `Progress updated from ${currentProgress}% to ${progress}%`,
        },
        { status: 200 },
      )
    } else {
      console.log(
        `Not updating progress for ${subject} as current (${currentProgress}%) is higher than new (${progress}%)`,
      )
      return NextResponse.json(
        {
          success: true,
          message: "No update needed as current progress is higher",
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Update progress error:", error)
    return NextResponse.json({ error: "An error occurred while updating progress." }, { status: 500 })
  }
}