import { type NextRequest, NextResponse } from "next/server"
import { generateContent } from "@/lib/gemini-api"

export async function POST(request: NextRequest) {
  try {
    const { code, question, executionResults, language } = await request.json()

    if (!code || !question || !executionResults) {
      return NextResponse.json({ error: "Code, question, and executionResults are required" }, { status: 400 })
    }

    // Use the provided language or fallback to question.language
    const codeLanguage = language || question.language

    // Create a prompt for Gemini to analyze the code
    const prompt = `
      You are an expert programming instructor evaluating a student's solution to a coding problem.
      
      PROBLEM:
      ${question.title}
      ${question.description.replace(/<[^>]*>?/gm, "")}
      
      STUDENT'S CODE:
      \\u00b6\u00b6\u00b6${codeLanguage}
      ${code}
      \\u00b6\u00b6\u00b6
      
      EXECUTION RESULTS:
      - Passed all test cases: ${executionResults.passed ? "Yes" : "No"}
      ${Array.isArray(executionResults.results)
        ? executionResults.results
            .map(
              (result: { input: string; expectedOutput: string; actualOutput: string; passed: boolean; error?: string }, i: number) => `
      Test Case ${i + 1}:
      - Input: ${result.input}
      - Expected Output: ${result.expectedOutput}
      - Actual Output: ${result.actualOutput}
      - Passed: ${result.passed ? "Yes" : "No"}
      ${result.error ? `- Error: ${result.error}` : ""}
      `,
            )
            .join("\n")
        : "No test case results available."}
      
      Please provide a detailed analysis of the student's code. Include:
      1. Whether the solution is correct and efficient
      2. Code quality assessment (readability, style, best practices)
      3. Time and space complexity analysis
      4. Specific suggestions for improvement
      5. Alternative approaches if applicable
      
      Format your response in HTML for better readability. Use <h3>, <p>, <ul>, <li>, <code>, etc. tags as appropriate.
      Keep your feedback constructive, educational, and encouraging.
    `

    // Get analysis from Gemini
    const feedback = await generateContent(prompt)

    return NextResponse.json({
      feedback: feedback || "Unable to generate feedback at this time.",
    })
  } catch (error) {
    console.error("Error in analyze route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
