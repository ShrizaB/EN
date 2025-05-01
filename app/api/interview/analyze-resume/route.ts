import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json()

    if (!resumeText) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 })
    }

    // Create a prompt for Gemini to analyze the resume
    const prompt = `
      Analyze the following resume and provide detailed feedback:
      
      ${resumeText}
      
      Please provide the following in your response as a JSON object:
      1. score: A numerical score from 0-100 representing the overall quality of the resume
      2. feedback: An array of strings with specific feedback points (strengths and weaknesses)
      3. improvementSuggestions: A detailed paragraph with suggestions for improving the resume
      4. keySkills: An array of strings representing the key skills identified in the resume
      5. experienceSummary: A brief summary of the candidate's experience
      
      Format your response as a valid JSON object with these fields.
    `

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)
    let analysisJson

    if (jsonMatch) {
      try {
        analysisJson = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } catch (e) {
        console.error("Error parsing JSON from Gemini response:", e)
        // Fallback to a simpler extraction method
        const startBrace = text.indexOf("{")
        const endBrace = text.lastIndexOf("}")
        if (startBrace !== -1 && endBrace !== -1) {
          try {
            analysisJson = JSON.parse(text.substring(startBrace, endBrace + 1))
          } catch (e) {
            console.error("Error parsing JSON with fallback method:", e)
            throw new Error("Failed to parse resume analysis")
          }
        }
      }
    }

    if (!analysisJson) {
      // If we still don't have valid JSON, create a basic structure
      analysisJson = {
        score: 70,
        feedback: ["Resume analysis could not be properly formatted", "Please try again or contact support"],
        improvementSuggestions: "Unable to generate specific suggestions at this time.",
        keySkills: [],
        experienceSummary: "Experience summary could not be generated.",
      }
    }

    return NextResponse.json(analysisJson)
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}
