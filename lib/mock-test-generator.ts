import { generateContent } from "@/lib/gemini-api"

export interface MockTestQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export async function generateMockTest(topic: string, subject: string, count = 20): Promise<MockTestQuestion[]> {
  try {
    const prompt = `Generate ${count} multiple-choice questions for a competitive government exam on the topic of "${topic}" in the subject area of "${subject}". 

Each question should:
1. Be challenging but fair for competitive exams
2. Have 4 options (A, B, C, D)
3. Include one correct answer
4. Have a brief explanation for the correct answer

Format the response as a JSON array with objects having these properties:
- question: the question text
- options: array of 4 option strings
- correctAnswer: index of correct answer (0-3)
- explanation: explanation of the correct answer

Make sure the questions are diverse and cover different aspects of ${topic}.`

    const response = await generateContent(prompt)

    try {
      // Try to parse the response as JSON
      const parsedQuestions = JSON.parse(response)

      // Validate and format the questions
      return parsedQuestions.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }))
    } catch (parseError) {
      console.error("Failed to parse generated questions:", parseError)

      // Fallback to a simpler format if JSON parsing fails
      return generateFallbackQuestions(topic, count)
    }
  } catch (error) {
    console.error("Error generating mock test:", error)
    return generateFallbackQuestions(topic, count)
  }
}

// Fallback function to generate basic questions if the API fails
function generateFallbackQuestions(topic: string, count: number): MockTestQuestion[] {
  const questions: MockTestQuestion[] = []

  for (let i = 0; i < count; i++) {
    questions.push({
      id: i + 1,
      question: `Sample question ${i + 1} about ${topic}?`,
      options: [
        `Option A for question ${i + 1}`,
        `Option B for question ${i + 1}`,
        `Option C for question ${i + 1}`,
        `Option D for question ${i + 1}`,
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `This is the explanation for question ${i + 1}.`,
    })
  }

  return questions
}