import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "")

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Generate questions about the topic
    const prompt = `
      Create 20 multiple-choice questions about "${topic}" for children (ages 8-14).
      
      The questions should:
      1. Be kid-friendly and use simple language
      2. Cover key concepts about the topic
      3. Have 4 options each (A, B, C, D)
      4. Include one correct answer and three plausible but incorrect options
      5. Range from easy to moderately challenging
      6. Be factually accurate
      7. Include brief explanations for the correct answers
      
      Format the response as a JSON array with this structure:
      [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0, // Index of correct answer (0-3)
          "explanation": "Brief explanation of why this answer is correct"
        },
        // More questions...
      ]
      
      Make sure the JSON is valid and properly formatted.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON from the response
    // Find JSON content between ```json and ``` if present
    let jsonContent = text
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
    if (jsonMatch && jsonMatch[1]) {
      jsonContent = jsonMatch[1]
    }

    try {
      const questions = JSON.parse(jsonContent)
      return NextResponse.json({ questions })
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      throw new Error("Invalid JSON response from AI")
    }
  } catch (error) {
    console.error("Error generating questions:", error)

    // Return fallback questions
    return NextResponse.json({
      questions: [
        {
          question: "What is the best way to learn new information?",
          options: [
            "By connecting it to things you already know",
            "By memorizing without understanding",
            "By reading it once quickly",
            "By only listening to others explain it",
          ],
          correctAnswer: 0,
          explanation:
            "Connecting new information to existing knowledge helps your brain create stronger neural pathways.",
        },
        {
          question: "Which of these is NOT a good learning habit?",
          options: [
            "Taking regular breaks",
            "Studying in a quiet place",
            "Cramming all your studying into one long session",
            "Explaining concepts to someone else",
          ],
          correctAnswer: 2,
          explanation: "Spacing out your learning over time is much more effective than cramming everything at once.",
        },
        {
          question: "What happens in your brain when you learn something new?",
          options: [
            "Your brain creates new neural connections",
            "Your brain gets physically larger",
            "Your brain cells change color",
            "Your brain uses less energy",
          ],
          correctAnswer: 0,
          explanation: "Learning creates and strengthens neural connections in your brain.",
        },
        {
          question: "Which of these is a visual learning technique?",
          options: [
            "Creating mind maps or diagrams",
            "Listening to podcasts",
            "Reciting facts out loud",
            "Moving around while studying",
          ],
          correctAnswer: 0,
          explanation: "Mind maps and diagrams help visual learners process and remember information.",
        },
        {
          question: "What is active recall?",
          options: [
            "Testing yourself on information without looking at notes",
            "Reading your notes multiple times",
            "Highlighting important information",
            "Listening to recorded lectures",
          ],
          correctAnswer: 0,
          explanation: "Active recall involves retrieving information from memory, which strengthens learning.",
        },
        {
          question: "Which of these activities uses multiple learning styles at once?",
          options: [
            "Teaching a concept to someone else",
            "Reading silently",
            "Listening to a lecture",
            "Watching a video with no sound",
          ],
          correctAnswer: 0,
          explanation:
            "Teaching others involves visual, auditory, and kinesthetic elements as you explain, demonstrate, and interact.",
        },
        {
          question: "What is the 'forgetting curve'?",
          options: [
            "How quickly we forget information over time without review",
            "A graph showing how many facts the average person knows",
            "The maximum amount of information a person can learn in one day",
            "How memory improves as we get older",
          ],
          correctAnswer: 0,
          explanation:
            "The forgetting curve shows how information is lost over time when there is no attempt to retain it.",
        },
        {
          question: "Which study technique is most effective for long-term learning?",
          options: [
            "Spaced repetition",
            "Cramming the night before",
            "Reading without taking notes",
            "Studying in very long sessions",
          ],
          correctAnswer: 0,
          explanation:
            "Spaced repetition involves reviewing information at increasing intervals, which improves long-term retention.",
        },
        {
          question: "What is metacognition?",
          options: [
            "Thinking about your own thinking and learning processes",
            "Memorizing facts without understanding them",
            "Learning while sleeping",
            "Studying multiple subjects at the same time",
          ],
          correctAnswer: 0,
          explanation:
            "Metacognition involves awareness and understanding of your own thought processes and learning strategies.",
        },
        {
          question: "Which of these can help improve focus while studying?",
          options: [
            "Taking short breaks every 25-30 minutes",
            "Having the TV on in the background",
            "Checking social media frequently",
            "Skipping meals to save time",
          ],
          correctAnswer: 0,
          explanation:
            "Short, regular breaks (like in the Pomodoro Technique) help maintain focus and prevent mental fatigue.",
        },
        {
          question: "What is the recommended amount of sleep for optimal learning?",
          options: [
            "8-10 hours for children and teenagers",
            "4-5 hours is enough for everyone",
            "Sleep isn't important for learning",
            "Only 1 hour before an exam",
          ],
          correctAnswer: 0,
          explanation:
            "Children and teenagers need 8-10 hours of sleep for optimal brain function, memory consolidation, and learning.",
        },
        {
          question: "Which of these is an example of kinesthetic learning?",
          options: [
            "Building a model or doing an experiment",
            "Reading a textbook",
            "Watching a video",
            "Listening to a lecture",
          ],
          correctAnswer: 0,
          explanation: "Kinesthetic learning involves physical activities and hands-on experiences.",
        },
        {
          question: "What does it mean to have a 'growth mindset'?",
          options: [
            "Believing that abilities can be developed through dedication and hard work",
            "Thinking that intelligence is fixed and cannot be changed",
            "Only focusing on subjects you're already good at",
            "Avoiding challenges to prevent failure",
          ],
          correctAnswer: 0,
          explanation:
            "A growth mindset is the belief that abilities can be developed through dedication and hard work.",
        },
        {
          question: "Which of these activities helps with memory consolidation?",
          options: [
            "Getting enough sleep",
            "Staying up all night studying",
            "Eating lots of sugar",
            "Studying in a noisy environment",
          ],
          correctAnswer: 0,
          explanation: "Sleep is essential for memory consolidation, the process of stabilizing and storing memories.",
        },
        {
          question: "What is the best approach when you don't understand something?",
          options: [
            "Ask questions and seek help",
            "Skip it and hope it's not important",
            "Pretend you understand it",
            "Give up on the entire subject",
          ],
          correctAnswer: 0,
          explanation: "Asking questions is a sign of engagement and helps clarify misunderstandings.",
        },
        {
          question: "Which of these is NOT a good way to prepare for a test?",
          options: [
            "Only studying the night before",
            "Practicing with sample questions",
            "Teaching the material to someone else",
            "Reviewing notes regularly",
          ],
          correctAnswer: 0,
          explanation: "Last-minute cramming is not effective for long-term learning or test performance.",
        },
        {
          question: "What is the benefit of making mistakes while learning?",
          options: [
            "They provide opportunities to learn and improve",
            "There are no benefits to making mistakes",
            "They show you should give up on that subject",
            "They prove you're not smart enough",
          ],
          correctAnswer: 0,
          explanation: "Mistakes are valuable learning opportunities that help identify areas for improvement.",
        },
        {
          question: "Which of these foods is best for brain health?",
          options: ["Fatty fish like salmon", "Candy and soda", "Fast food", "Highly processed snacks"],
          correctAnswer: 0,
          explanation: "Fatty fish contains omega-3 fatty acids that support brain health and cognitive function.",
        },
        {
          question: "What is the 'testing effect' in learning?",
          options: [
            "The finding that taking tests improves long-term memory",
            "The stress that tests cause",
            "The idea that tests are the only way to measure learning",
            "The theory that tests are harmful to learning",
          ],
          correctAnswer: 0,
          explanation:
            "The testing effect is the finding that actively retrieving information through testing improves long-term retention.",
        },
        {
          question: "Which study environment is generally best for learning?",
          options: [
            "A quiet, well-lit space with minimal distractions",
            "A loud area with lots of people talking",
            "In bed under the covers",
            "In front of the TV",
          ],
          correctAnswer: 0,
          explanation:
            "A quiet, well-lit environment with minimal distractions helps maintain focus and concentration.",
        },
      ],
    })
  }
}
