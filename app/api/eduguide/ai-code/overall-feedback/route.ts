import { type NextRequest, NextResponse } from "next/server"
import { generateContent } from "@/lib/gemini-api"

export async function POST(request: NextRequest) {
  try {
    const { results, questions } = await request.json()

    if (!results || !Array.isArray(results) || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Results and questions arrays are required" }, { status: 400 })
    }

    // Create a prompt for Gemini to provide overall feedback
    const prompt = `
      You are an expert programming instructor providing overall feedback to a student who has completed a coding assessment with ${questions.length} problems.
      
      ASSESSMENT SUMMARY:
      ${results
        .map((result, i) => {
          const question = questions.find((q) => q.id === result.questionId)
          return `
        Problem ${i + 1}: ${question?.title} (${question?.difficulty})
        - Passed: ${result.passed ? "Yes" : "No"}
        `
        })
        .join("\n")}
      
      STUDENT'S CODE FOR EACH PROBLEM:
      ${results
        .map((result, i) => {
          const question = questions.find((q) => q.id === result.questionId)
          return `
        Problem ${i + 1}: ${question?.title}
        \`\`\`${question?.language}
        ${result.code}
        \`\`\`
        `
        })
        .join("\n")}
      
      Please provide comprehensive overall feedback on the student's performance across all problems. Include:
      1. General strengths and areas for improvement
      2. Patterns in their coding style and approach
      3. Specific skills they should focus on developing
      4. Recommendations for next steps in their learning journey
      5. Encouragement and positive reinforcement
      
      Format your response in HTML for better readability. Use <h3>, <p>, <ul>, <li>, <code>, etc. tags as appropriate.
      Keep your feedback constructive, educational, and encouraging.
    `

    // Get analysis from Gemini
    const feedback = await generateContent(prompt)

    return NextResponse.json({
      feedback: feedback || "Unable to generate overall feedback at this time.",
    })
  } catch (error) {
    console.error("Error in overall-feedback route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
