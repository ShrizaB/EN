import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, sanitizeUser } from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, age } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 422 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      age: age ? Number.parseInt(age.toString()) : null,
      createdAt: new Date(),
      lastLogin: new Date(),
      progress: {
        math: 0,
        science: 0,
        reading: 0,
        coding: 0,
        art: 0,
        music: 0,
        geography: 0,
        logic: 0,
        movies: 0,
        c_programming: 0,
        python: 0,
        java: 0,
      },
      stats: {
        totalQuizzesTaken: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        totalTimeSpent: 0,
        gamesPlayed: 0,
      },
    }

    const result = await db.collection("users").insertOne(newUser)
    const insertedUser = { ...newUser, _id: result.insertedId }

    // Create session
    const sessionUser = sanitizeUser(insertedUser)

    // Return user without password
    return NextResponse.json({ user: sessionUser, success: true })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration." }, { status: 500 })
  }
}
