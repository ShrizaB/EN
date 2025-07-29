import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "")

export async function POST(req: NextRequest) {
  try {
    const { topic, subject } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Generate educational content about the topic
    const prompt = `
      Create fun, engaging, and educational content about "${topic}" for children (ages 8-14). 
      This topic is categorized under the subject: ${subject || "general"}.
      The content should be:
      1. Kid-friendly with simple language but not talking down to them
      2. Engaging and fun with interesting facts and examples
      3. Educational and factually accurate
      4. Well-structured with clear sections
      5. Around 800-1000 words
      6. Include fun facts, interesting examples, and relatable comparisons
      7. Use an enthusiastic, friendly tone
      8. Avoid complex jargon - explain any necessary terms in simple language
      
      Format the content with clear paragraphs and section headings.
      Start with an exciting introduction that hooks the reader's interest.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()

    return NextResponse.json({ content, subject: subject || "general" })
  } catch (error) {
    console.error("Error generating content:", error)

    // Return fallback content
    return NextResponse.json({
      content: `
# ${req.body ? JSON.parse(req.body).topic : "Requested Topic"}

This is a placeholder content because we're having trouble connecting to our AI service. Here's some general information about learning new topics:

## Welcome to Your Learning Adventure!

Hey there, explorer! Are you ready for an exciting journey into the world of knowledge? Learning new things is like going on a treasure hunt - you never know what amazing discoveries you'll make along the way!

## Did You Know?

Your brain is like a super-powerful computer that can store more information than all the libraries in the world combined! Every time you learn something new, your brain creates special connections called "neural pathways" - it's like building your own superhighway of knowledge!

## Fun Ways to Learn

Learning doesn't have to be boring! You can turn it into a game, create colorful drawings about what you're learning, or even teach someone else. When you explain something to another person, your brain understands it even better!

## The Power of Questions

The most brilliant scientists, inventors, and explorers all have one thing in common - they ask LOTS of questions! Never be afraid to ask "Why?" or "How does that work?" Questions are like keys that unlock the doors to new discoveries.

## Your Learning Superpower

Everyone has different ways they learn best. Some people learn by seeing pictures (visual learners), others by listening (auditory learners), and some by doing hands-on activities (kinesthetic learners). What's your learning superpower?

When you're ready, you can test your understanding with our quiz feature. Good luck on your learning adventure!
      `,
      subject: req.body ? JSON.parse(req.body).subject || "general" : "general",
    })
  }
}