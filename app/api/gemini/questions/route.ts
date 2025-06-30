import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the correct API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { degree, skills, jobTitle, interviewType } = await req.json()

    if (!jobTitle || !interviewType) {
      return NextResponse.json({ error: "Job title and interview type are required" }, { status: 400 })
    }

    // Compose the prompt for Gemini
    let prompt = ""
    if (interviewType === "technical") {
      prompt = `Generate 10 technical interview questions for the role of "${jobTitle}". The candidate has a degree in "${degree}" and skills: ${skills?.join(
        ", "
      )}. Return as an array of objects: [{id: string, question: string, type: 'technical'}]`
    } else if (interviewType === "behavioral") {
      prompt = `Generate 10 behavioral interview questions for the role of "${jobTitle}". The candidate has a degree in "${degree}" and skills: ${skills?.join(
        ", "
      )}. Return as an array of objects: [{id: string, question: string, type: 'behavioral'}]`
    } else if (interviewType === "both") {
      prompt = `Generate 5 technical and 5 behavioral interview questions for the role of "${jobTitle}". The candidate has a degree in "${degree}" and skills: ${skills?.join(
        ", "
      )}. Return as an array of objects: [{id: string, question: string, type: 'technical'|'behavioral'}]`
    }

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to extract JSON from the response
    try {
      // Find JSON array in the response
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        let questions = JSON.parse(jsonStr)
        // Ensure each question has id, question, and type
        questions = questions.map((q: any, idx: number) => ({
          id: q.id || `q${idx + 1}`,
          question: q.question || q.text || "",
          type:
            q.type ||
            (interviewType === "both"
              ? idx < 5
                ? "technical"
                : "behavioral"
              : interviewType),
        }))
        // Always return max 10
        return NextResponse.json({ questions: questions.slice(0, 10) })
      } else {
        // If no valid JSON found, provide fallback questions
        return NextResponse.json({
          questions: getFallbackQuestions(interviewType, jobTitle, degree, skills),
        })
      }
    } catch (parseError) {
      console.error("Error parsing questions:", parseError)
      return NextResponse.json({
        questions: getFallbackQuestions(interviewType, jobTitle, degree, skills),
      })
    }
  } catch (error) {
    console.error("Error in Gemini API:", error)
    return NextResponse.json({ questions: getFallbackQuestions("both", "", "", []) })
  }
}

// Function to provide fallback questions if the API fails
function getFallbackQuestions(interviewType: string, jobTitle: string, degree: string, skills: string[]) {
  const base = (type: string, n: number) =>
    Array(n)
      .fill(0)
      .map((_, i) => ({
        id: `${type}-${i + 1}`,
        question: `${type === "technical" ? "Technical" : "Behavioral"} question for ${
          jobTitle || "the role"
        } #${i + 1}`,
        type,
      }))
  if (interviewType === "technical") return base("technical", 10)
  if (interviewType === "behavioral") return base("behavioral", 10)
  return [...base("technical", 5), ...base("behavioral", 5)]
}