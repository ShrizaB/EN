import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobTitle } = await request.json()

    if (!resumeText || !jobTitle) {
      return NextResponse.json({ error: "Resume text and job title are required" }, { status: 400 })
    }

    // Prompt for Gemini to analyze the resume and generate questions
    const prompt = `
      You are an expert HR interviewer and resume analyst. I'm going to provide you with a resume and a job title.
      
      Resume:
      ${resumeText}
      
      Job Title: ${jobTitle}
      
      Please analyze this resume and:
      
      1. Generate 20 interview questions based on the resume and job title:
         - 10 technical questions specific to the skills and experience mentioned in the resume
         - 10 analytical/behavioral questions to assess problem-solving and soft skills
      
      2. Provide a brief analysis of the resume, including:
         - 3-5 strengths
         - 3-5 areas for improvement
         - 3-5 specific suggestions to enhance the resume for the ${jobTitle} position
      
      Format your response as a JSON object with the following structure:
      {
        "questions": [
          {"id": 1, "text": "question text here", "type": "technical"},
          {"id": 2, "text": "question text here", "type": "analytical"},
          ...
        ],
        "resumeAnalysis": {
          "strengths": ["strength 1", "strength 2", ...],
          "weaknesses": ["weakness 1", "weakness 2", ...],
          "suggestions": ["suggestion 1", "suggestion 2", ...]
        }
      }
    `

    // Generate content using Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/({[\s\S]*})/)

    if (!jsonMatch) {
      throw new Error("Failed to parse Gemini response")
    }

    const parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0])

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}