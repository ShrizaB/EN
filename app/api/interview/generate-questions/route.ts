import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCgYno9IqtTqF3rmxQpsV4gIypk7tWtbD4"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function POST(request: NextRequest) {
  try {
    const { degree, skills, jobTitle } = await request.json()

    if (!degree || !skills || !jobTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a prompt for Gemini to generate interview questions
    const prompt = `
      Generate personalized interview questions for a candidate with the following profile:
      
      Degree: ${degree}
      Skills: ${skills.join(", ")}
      Job Title: ${jobTitle}
      
      Please generate:
      1. 10 technical questions specific to the skills and job title
      2. 10 behavioral/analytical questions relevant for this role
      
      The technical questions should test the candidate's knowledge and problem-solving abilities related to their skills.
      The behavioral questions should assess soft skills, analytical thinking, and cultural fit.
      
      Format your response as a valid JSON object with this structure:
      {
        "technical": [
          {"id": "tech-1", "question": "Question text here"},
          ...
        ],
        "behavioral": [
          {"id": "behav-1", "question": "Question text here"},
          ...
        ]
      }
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)
    let questionsJson

    if (jsonMatch) {
      try {
        questionsJson = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } catch (e) {
        console.error("Error parsing JSON from Gemini response:", e)
        // Fallback to a simpler extraction method
        const startBrace = text.indexOf("{")
        const endBrace = text.lastIndexOf("}")
        if (startBrace !== -1 && endBrace !== -1) {
          try {
            questionsJson = JSON.parse(text.substring(startBrace, endBrace + 1))
          } catch (e) {
            console.error("Error parsing JSON with fallback method:", e)
            throw new Error("Failed to parse generated questions")
          }
        }
      }
    }

    if (!questionsJson || !questionsJson.technical || !questionsJson.behavioral) {
      // Fallback to default questions if parsing fails
      questionsJson = {
        technical: [
          { id: "tech-1", question: "Explain the difference between var, let, and const in JavaScript." },
          { id: "tech-2", question: "What is the difference between == and === in JavaScript?" },
          { id: "tech-3", question: "Explain the concept of closures in JavaScript." },
          { id: "tech-4", question: "What is the event loop in JavaScript?" },
          { id: "tech-5", question: "Describe the box model in CSS." },
          { id: "tech-6", question: "What are the different position values in CSS?" },
          { id: "tech-7", question: "Explain the concept of responsive design." },
          { id: "tech-8", question: "What is the difference between HTTP and HTTPS?" },
          { id: "tech-9", question: "Explain the concept of RESTful APIs." },
          { id: "tech-10", question: "What is the difference between client-side and server-side rendering?" },
        ],
        behavioral: [
          { id: "behav-1", question: "Describe a challenging project you worked on and how you overcame obstacles." },
          { id: "behav-2", question: "How do you prioritize tasks when working on multiple projects?" },
          {
            id: "behav-3",
            question: "Describe a situation where you had to make a difficult decision with limited information.",
          },
          { id: "behav-4", question: "How do you handle feedback and criticism?" },
          { id: "behav-5", question: "Describe a time when you had to learn a new technology quickly." },
          { id: "behav-6", question: "How do you approach problem-solving?" },
          { id: "behav-7", question: "Describe a situation where you had to work with a difficult team member." },
          { id: "behav-8", question: "How do you stay updated with the latest technologies and trends?" },
          {
            id: "behav-9",
            question: "Describe a time when you had to explain a complex technical concept to a non-technical person.",
          },
          { id: "behav-10", question: "What are your strengths and weaknesses as a developer?" },
        ],
      }
    }

    return NextResponse.json(questionsJson)
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
