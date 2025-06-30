import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the correct API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    console.log("=== GEMINI API CALL START ===")
    const { messages } = await req.json()
    console.log("Received messages:", messages)

    if (!messages || !Array.isArray(messages)) {
      console.log("Invalid messages format")
      return NextResponse.json({ error: "Valid messages array is required" }, { status: 400 })
    }

    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set")
      return NextResponse.json({ 
        content: "Configuration error: API key is missing. Please check your environment variables." 
      }, { status: 500 })
    }

    console.log("API Key available:", GEMINI_API_KEY ? "Yes" : "No")

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "user") {
      console.log("Last message error:", lastMessage)
      throw new Error("Last message must be from user")
    }

    console.log("User message to send:", lastMessage.content)

    // Enhanced prompt to get better, more structured responses
    const enhancedPrompt = `You are Venom, a sophisticated AI assistant with a dark, edgy personality. Respond to this user query with helpful, well-structured information.

IMPORTANT FORMATTING RULES:
- Do NOT start responses with a main title or heading
- Use **bold text** for emphasis ONLY when necessary
- Structure information with clear paragraphs
- Use numbered lists (1., 2., 3.) for step-by-step information
- Use bullet points (•) for feature lists
- Keep responses informative but concise
- Avoid excessive use of asterisks or special characters
- Make sure bold formatting is properly closed (**)

User Query: ${lastMessage.content}

Provide a helpful, well-formatted response:`

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      },
    })

    console.log("Model created successfully")

    // Always use enhanced generation with better prompting
    console.log("Using enhanced generation with structured prompting")
    const result = await model.generateContent(enhancedPrompt)
    console.log("Got result from Gemini")
    
    const response = await result.response
    console.log("Got response object")
    
    const text = response.text()
    console.log("Gemini response text:", text)
    
    console.log("=== GEMINI API CALL SUCCESS ===")
    return NextResponse.json({ content: text })

  } catch (error) {
    console.error("=== GEMINI API CALL ERROR ===")
    console.error("Error in Gemini chat API:", error)
    console.error("Error type:", typeof error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    
    // Return more specific error information
    if (error instanceof Error) {
      return NextResponse.json({
        content: `API Error: ${error.message}`,
      }, { status: 500 })
    }
    
    return NextResponse.json({
      content: "Unknown error occurred in API",
    }, { status: 500 })
  }
}