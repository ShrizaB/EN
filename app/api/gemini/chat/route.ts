import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the correct API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Valid messages array is required" }, { status: 400 })
    }

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Convert our message format to Gemini's chat format
    const chat = model.startChat({
      history: messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    })

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "user") {
      throw new Error("Last message must be from user")
    }

    const result = await chat.sendMessage(lastMessage.content)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("Error in Gemini chat API:", error)
    return NextResponse.json({
      content: "I'm sorry, I couldn't process your request at this time. Please try again later.",
    })
  }
}