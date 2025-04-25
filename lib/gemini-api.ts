import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function generateContent(prompt: string) {
  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error("Error generating content:", error)
    return "I'm sorry, I couldn't generate content at this time. Please try again later."
  }
}

export async function generateQuestions(subject: string, topic: string, difficulty: string, count = 5) {
  try {
    const prompt = `Generate ${count} multiple-choice questions about ${topic} in ${subject} at a ${difficulty} difficulty level. 
    Format each question as a JSON object with the following structure:
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "A brief explanation of why this is the correct answer"
    }
    The correctAnswer should be the INDEX (0-3) of the correct option, not the text.
    Return the questions as a JSON array of these objects. Make sure the JSON is valid and properly formatted.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the response to get the questions
    try {
      // Find JSON array in the response
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s)
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        const questions = JSON.parse(jsonStr)

        // Validate and fix the questions format
        const validatedQuestions = questions.map((q) => {
          // Ensure correctAnswer is a number (index)
          let correctAnswerIndex =
            typeof q.correctAnswer === "number"
              ? q.correctAnswer
              : q.options.findIndex((opt) => opt === q.correctAnswer)

          // If still not found, default to 0
          if (correctAnswerIndex < 0) correctAnswerIndex = 0

          return {
            ...q,
            correctAnswer: correctAnswerIndex,
            options: Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"],
          }
        })

        return validatedQuestions
      } else {
        console.error("No valid JSON found in response:", text)
        return []
      }
    } catch (parseError) {
      console.error("Error parsing questions:", parseError)
      console.error("Raw response:", text)
      return []
    }
  } catch (error) {
    console.error("Error generating questions:", error)
    return []
  }
}

export async function generateChat(messages: { role: string; content: string }[]) {
  try {
    // Convert our message format to Gemini's chat format
    const chat = model.startChat({
      history: messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    })

    // Get the last user message
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()
    if (!lastUserMessage) {
      throw new Error("No user message found")
    }

    const result = await chat.sendMessage(lastUserMessage.content)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error("Error in chat:", error)
    return "I'm sorry, I couldn't process your request at this time. Please try again later."
  }
}

export { genAI, model }