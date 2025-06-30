import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { questions, answers } = await req.json()
    if (!Array.isArray(questions) || !Array.isArray(answers) || questions.length !== answers.length) {
      return NextResponse.json({ error: "Questions and answers arrays must be provided and have the same length." }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const results = []
    let totalScore = 0

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const userAnswer = answers[i]
      const evalPrompt = `Question: ${q.question}\nUser Answer: ${userAnswer}\nType: ${q.type}\nEvaluate the answer on a scale of 0-10. Return a JSON object: {score: number (0-10), bestAnswer: string, advice: string}`
      try {
        const evalResult = await model.generateContent(evalPrompt)
        const evalText = evalResult.response.text()
        let evalObj = { score: 0, bestAnswer: '', advice: '' }
        try {
          const jsonMatch = evalText.match(/```json\n([\s\S]*?)\n```/) || evalText.match(/````\n([\s\S]*?)\n```/)
          const jsonString = jsonMatch ? jsonMatch[1] : evalText
          evalObj = JSON.parse(jsonString)
        } catch (e) {}
        totalScore += evalObj.score || 0
        results.push({
          question: q.question,
          type: q.type,
          userAnswer,
          score: evalObj.score || 0,
          bestAnswer: evalObj.bestAnswer || '',
          advice: evalObj.advice || '',
        })
      } catch (err) {
        results.push({
          question: q.question,
          type: q.type,
          userAnswer,
          score: 0,
          bestAnswer: '',
          advice: 'Could not analyze answer.'
        })
      }
    }
    const finalScore = Math.round((totalScore / questions.length) * 10) / 10
    return NextResponse.json({ questions: results, finalScore })
  } catch (error) {
    console.error("Error in analyze-answers API:", error)
    return NextResponse.json({ error: "Failed to analyze answers." }, { status: 500 })
  }
}
