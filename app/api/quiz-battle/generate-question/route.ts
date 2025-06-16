import { type NextRequest, NextResponse } from "next/server"
import { generateContent } from "@/lib/gemini-api"

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty = "medium" } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const prompt = `Generate a single multiple-choice question about "${topic}" at ${difficulty} difficulty level.

Format the response as a JSON object with this exact structure:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Brief explanation of the correct answer",
  "hint": "A helpful hint without giving away the answer"
}

Requirements:
- The question should be challenging but fair
- All options should be plausible
- correctAnswer should be the index (0-3) of the correct option
- Make sure the JSON is valid and properly formatted
- Focus on factual, educational content`

    const response = await generateContent(prompt)

    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }

      const questionData = JSON.parse(jsonMatch[0])

      // Validate the structure
      if (
        !questionData.question ||
        !Array.isArray(questionData.options) ||
        questionData.options.length !== 4 ||
        typeof questionData.correctAnswer !== "number"
      ) {
        throw new Error("Invalid question structure")
      }

      // Add additional metadata
      const question = {
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        topic,
        difficulty,
        timeLimit: 30,
        points: 10,
        ...questionData,
      }

      return NextResponse.json({ question })
    } catch (parseError) {
      console.error("Error parsing question:", parseError)
      console.error("Raw response:", response)

      // Fallback question
      const fallbackQuestion = {
        id: `q_${Date.now()}_fallback`,
        topic,
        difficulty,
        question: `What is a key concept in ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        explanation: "This is a fallback question.",
        hint: "Think about the fundamentals of the topic.",
        timeLimit: 30,
        points: 10,
      }

      return NextResponse.json({ question: fallbackQuestion })
    }
  } catch (error) {
    console.error("Error generating question:", error)
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 })
  }
}
