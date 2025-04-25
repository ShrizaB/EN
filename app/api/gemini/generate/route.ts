import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the correct API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("Error in Gemini API:", error)

    // Return fallback content instead of an error
    return NextResponse.json({
      content: `
Welcome to this educational topic!

This content is a fallback because we're having trouble connecting to our AI service. Don't worry - you can still learn about this topic and take the quiz.

The key concepts for this topic include understanding the fundamental principles, recognizing patterns, and applying what you learn to real-world situations. Take your time to read through this material, and when you're ready, you can test your knowledge with our quiz.

Remember, learning is a journey, and every step counts. Even if you don't understand everything right away, keep practicing and you'll improve over time.
      `,
    })
  }
}