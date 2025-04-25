import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

export async function POST(request: NextRequest) {
  try {
    const { answers, questions, resumeAnalysis } = await request.json()

    if (!answers || !questions || !resumeAnalysis) {
      return NextResponse.json({ error: "Answers, questions, and resume analysis are required" }, { status: 400 })
    }

    // Format the answers and questions for the prompt
    const formattedQuestionsAndAnswers = questions.map((question: any) => {
      return {
        id: question.id,
        text: question.text,
        type: question.type,
        answer: answers[question.id] || "",
      }
    })

    // Prompt for Gemini to evaluate the answers
    const prompt = `
      You are an expert HR interviewer and career coach. I'm going to provide you with a set of interview questions, the candidate's answers, and a resume analysis.
      
      Questions and Answers:
      ${JSON.stringify(formattedQuestionsAndAnswers, null, 2)}
      
      Resume Analysis:
      ${JSON.stringify(resumeAnalysis, null, 2)}
      
      Please evaluate the candidate's interview performance:
      
      1. For each answer, provide:
         - A score from 0-10
         - Specific feedback on the answer's strengths and weaknesses
      
      2. Calculate overall scores:
         - Overall score (0-100)
         - Technical score (0-100)
         - Analytical score (0-100)
      
      3. Provide comprehensive overall feedback on the interview performance
      
      Format your response as a JSON object with the following structure:
      {
        "overallScore": 85,
        "technicalScore": 80,
        "analyticalScore": 90,
        "overallFeedback": "detailed feedback here...",
        "answers": [
          {
            "questionId": 1,
            "text": "original answer text",
            "feedback": "specific feedback on this answer",
            "score": 8
          },
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
    console.error("Error evaluating answers:", error)
    return NextResponse.json({ error: "Failed to evaluate answers" }, { status: 500 })
  }
}