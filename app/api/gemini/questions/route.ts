import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the correct API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to extract JSON from the response
    try {
      // Find JSON array in the response
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        const questions = JSON.parse(jsonStr)

        // Validate the questions format
        const validatedQuestions = questions.map((q: any) => {
          // Ensure correctAnswer is a number (index)
          let correctAnswerIndex =
            typeof q.correctAnswer === "number"
              ? q.correctAnswer
              : q.options.findIndex((opt: string) => opt === q.correctAnswer)

          // If still not found, default to 0
          if (correctAnswerIndex < 0) correctAnswerIndex = 0

          return {
            ...q,
            correctAnswer: correctAnswerIndex,
            options: Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"],
          }
        })

        return NextResponse.json({ questions: validatedQuestions })
      } else {
        // If no valid JSON found, provide fallback questions
        return NextResponse.json({ questions: getFallbackQuestions() })
      }
    } catch (parseError) {
      console.error("Error parsing questions:", parseError)
      return NextResponse.json({ questions: getFallbackQuestions() })
    }
  } catch (error) {
    console.error("Error in Gemini API:", error)
    return NextResponse.json({ questions: getFallbackQuestions() })
  }
}

// Function to provide fallback questions if the API fails
function getFallbackQuestions() {
  return [
    {
      question: "What is the main purpose of studying this topic?",
      options: ["To pass tests", "To gain practical knowledge", "To memorize facts", "To impress others"],
      correctAnswer: 1,
      explanation:
        "The main purpose of studying any topic is to gain practical knowledge that can be applied in real-world situations.",
    },
    {
      question: "Which learning approach is most effective?",
      options: [
        "Memorization only",
        "Practice and application",
        "Watching videos only",
        "Reading without taking notes",
      ],
      correctAnswer: 1,
      explanation: "Practice and application help solidify knowledge and develop skills.",
    },
    {
      question: "How can you improve your understanding of difficult concepts?",
      options: [
        "Give up when it gets hard",
        "Only study what's easy",
        "Break it down into smaller parts",
        "Study for long hours without breaks",
      ],
      correctAnswer: 2,
      explanation: "Breaking down complex concepts into smaller, manageable parts makes them easier to understand.",
    },
    {
      question: "What is the benefit of taking quizzes while learning?",
      options: ["It wastes time", "It helps reinforce knowledge", "It's only for grades", "It makes learning boring"],
      correctAnswer: 1,
      explanation: "Quizzes help reinforce knowledge through active recall, which strengthens memory.",
    },
    {
      question: "Why is it important to connect new knowledge to what you already know?",
      options: [
        "It isn't important",
        "It helps with memorization",
        "It creates meaningful learning",
        "It makes learning faster",
      ],
      correctAnswer: 2,
      explanation: "Connecting new information to existing knowledge creates meaningful learning experiences.",
    },
    {
      question: "What should you do if you don't understand something?",
      options: ["Skip it and move on", "Ask for help", "Pretend you understand", "Give up on the subject"],
      correctAnswer: 1,
      explanation: "Asking for help is an important part of the learning process.",
    },
    {
      question: "How often should you review what you've learned?",
      options: ["Never", "Only before tests", "Regularly, using spaced repetition", "Once a year"],
      correctAnswer: 2,
      explanation: "Regular review using spaced repetition helps move information into long-term memory.",
    },
    {
      question: "What is the value of making mistakes while learning?",
      options: [
        "There is no value",
        "They show what you need to work on",
        "They prove you're not smart",
        "They waste time",
      ],
      correctAnswer: 1,
      explanation: "Mistakes are valuable feedback that show what areas need more attention.",
    },
    {
      question: "How can you apply what you learn in real life?",
      options: ["You can't", "By looking for practical applications", "By memorizing facts", "By taking more tests"],
      correctAnswer: 1,
      explanation: "Looking for practical applications helps make learning relevant and useful.",
    },
    {
      question: "What is the best mindset for learning?",
      options: [
        "Fixed mindset - abilities are fixed",
        "Growth mindset - abilities can develop",
        "Competitive mindset",
        "Perfectionist mindset",
      ],
      correctAnswer: 1,
      explanation: "A growth mindset recognizes that abilities can be developed through dedication and hard work.",
    },
  ]
}