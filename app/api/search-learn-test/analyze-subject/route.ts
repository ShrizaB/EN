import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "")

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Analyze which subject the topic belongs to
    const prompt = `
      Analyze the following topic: "${topic}"
      
      Determine which ONE subject from this list it is MOST related to:
      - mathematics
      - science
      - reading
      - coding
      - art
      - music
      - geography
      - logic
      
      Return ONLY the subject name in lowercase, with no additional text, punctuation, or explanation.
      For example, if the topic is "photosynthesis", you would return only: science
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const subject = response.text().trim().toLowerCase()

    // Validate that the response is one of our expected subjects
    const validSubjects = ["mathematics", "science", "reading", "coding", "art", "music", "geography", "logic", "history"]

    // If the response isn't a valid subject, default to "general"
    const validatedSubject = validSubjects.includes(subject) ? subject : "general"

    // Map "mathematics" to "math" for consistency with our system
    const normalizedSubject = validatedSubject === "mathematics" ? "math" : validatedSubject

    return NextResponse.json({ subject: normalizedSubject })
  } catch (error) {
    console.error("Error analyzing subject:", error)
    return NextResponse.json({ subject: "general", error: "Failed to analyze subject" })
  }
}