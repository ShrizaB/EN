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

    // Add retry logic for overloaded API
    const maxRetries = 2
    let lastError

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🤖 Gemini API attempt ${attempt}/${maxRetries}`)
        
        // Generate content
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        console.log("✅ Gemini API success!")
        return NextResponse.json({ content: text })
        
      } catch (error) {
        lastError = error
        
        // Check if it's an overload error
        const isOverloaded = error instanceof Error && error.message.includes('503') && error.message.includes('overloaded')
        
        if (isOverloaded && attempt < maxRetries) {
          console.log(`⏳ API overloaded, retrying in ${attempt * 2} seconds... (attempt ${attempt}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, attempt * 2000)) // 2s, 4s delay
          continue
        }
        
        // If it's not retryable or we've exhausted retries, break
        break
      }
    }

    // If we get here, all retries failed
    throw lastError
  } catch (error) {
    console.error("Error in Gemini API:", error)

    // Check if it's a 503 overload error
    const isOverloaded = error instanceof Error && error.message.includes('503') && error.message.includes('overloaded')
    
    if (isOverloaded) {
      console.log("🔄 Gemini API is temporarily overloaded. Using fallback content.")
    }

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