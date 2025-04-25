import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "")

export async function POST(req: NextRequest) {
  try {
    const { topic, subject } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Generate quiz questions about the topic
    const prompt = `
      Create 10 multiple-choice quiz questions about "${topic}" for children (ages 8-14).
      This topic is categorized under the subject: ${subject || "general"}.
      
      Each question should:
      1. Be age-appropriate and educational
      2. Have 4 possible answers (A, B, C, D)
      3. Include only one correct answer
      4. Be factually accurate
      5. Range from easy to moderate difficulty
      
      Format the response as a JSON array with this structure:
      [
        {
          "question": "What is...?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0  // Index of correct answer (0-3)
        },
        // more questions...
      ]
      
      Ensure the JSON is valid and properly formatted.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract the JSON array from the response
    let questions = []
    try {
      // Find JSON in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = text.match(/\[[\s\S]*\]/m)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No valid JSON found in response")
      }
    } catch (error) {
      console.error("Error parsing questions JSON:", error)
      // Fallback to empty questions array
      questions = []
    }

    return NextResponse.json({ questions, subject: subject || "general" })
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({
      questions: [],
      subject: req.body ? JSON.parse(req.body).subject || "general" : "general",
      error: "Failed to generate questions",
    })
  }
}