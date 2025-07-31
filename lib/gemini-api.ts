import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function generateContent(prompt: string) {
  try {
    const enhancedPrompt = `${prompt}

Please format your response using proper Markdown syntax:
- Use # for main headings, ## for subheadings, ### for smaller headings
- Use **text** for bold and *text* for italic
- Use - or * for bullet points
- Use 1. 2. 3. for numbered lists
- Use > for blockquotes
- Use \`code\` for inline code and \`\`\`code\`\`\` for code blocks
- Use tables with | syntax when needed

IMPORTANT: Do NOT include any diagrams, flowcharts, visual representations, or ASCII art. Focus only on text-based explanations, examples, and step-by-step written solutions.

Make the content well-structured with clear headings, subheadings, and organized information that's easy to read and understand. Use proper markdown formatting throughout.`

    const result = await model.generateContent(enhancedPrompt)
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
      const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        const questions = JSON.parse(jsonStr)

        // Validate and fix the questions format
        const validatedQuestions = questions.map((q: any) => {
          // Ensure correctAnswer is a number (index)
          let correctAnswerIndex =
            typeof q.correctAnswer === "number"
              ? q.correctAnswer
              : q.options.findIndex((opt: any) => opt === q.correctAnswer)

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

export async function generateCareerData(jobRole: string, sector: string) {
  try {
    const prompt = `Generate comprehensive career data for a ${jobRole} in the ${sector} sector. 
    Please return a JSON object with the following structure:

    {
      "topCompanies": [
        {
          "name": "Company Name",
          "sector": "${sector.toLowerCase()}",
          "details": "Multi-line company description",
          "facilities": ["facility1", "facility2", "facility3", "facility4", "facility5"],
          "entrySalary": 500000,
          "experiencedSalary": 1500000,
          "averageSalary": 1000000
        }
      ],
      "topSectors": [
        {
          "name": "Sector Name",
          "percentage": 45,
          "category": "${sector.toLowerCase()}"
        }
      ],
      "requiredSkills": [
        {
          "name": "Skill Name",
          "importance": 95
        }
      ],
      "hiringLocations": [
        {
          "name": "City Name",
          "percentage": 35
        }
      ],
      "skillResources": [
        {
          "title": "Resource Title",
          "description": "Resource description",
          "link": "https://example.com - actual working website URL"
        }
      ],
      "locationInsights": [
        {
          "location": "City Name",
          "description": "City description for job market",
          "averageSalary": 900000,
          "costOfLiving": "High/Medium/Low"
        }
      ]
    }

    Requirements:
    - Include at least 8-12 top companies hiring for ${jobRole} in ${sector}
    - Include realistic salary ranges in INR (Indian Rupees)
    - Include at least 4-6 sectors related to ${jobRole}
    - Include 8-10 essential skills for ${jobRole}
    - Include top 6-8 Indian cities for ${jobRole} jobs
    - Include practical skill development resources with REAL working website links
    - Include detailed location insights for job market
    - For skillResources, provide actual working website URLs like:
      * Educational platforms (Coursera, Udemy, edX, Pluralsight, etc.)
      * Documentation sites (MDN, official docs)
      * GitHub repositories for practice
      * Tutorial websites
      * Certification providers
    - Make sure all links are real, working URLs that provide value for ${jobRole} skill development

    Make sure to return ONLY valid JSON without any markdown formatting or additional text.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // Clean the response to extract JSON
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const careerData = JSON.parse(cleanedText)
      
      return careerData
    } catch (parseError) {
      console.error("Error parsing career data:", parseError)
      console.error("Raw response:", text)
      return null
    }
  } catch (error) {
    console.error("Error generating career data:", error)
    return null
  }
}

export async function generateCareerPath(jobRole: string, sector: string) {
  try {
    const prompt = `Generate a detailed career path roadmap for a ${jobRole} position in the ${sector} sector. 

    Return a JSON object with the following structure:
    {
      "careerPath": [
        {
          "title": "Job Title",
          "description": "Detailed description of the role and responsibilities",
          "timeline": "Experience timeline (e.g., 0-2 years, 2-5 years)",
          "salaryRange": "Salary range in LPA format (e.g., 3-6 LPA, 8-15 LPA)"
        }
      ],
      "additionalResources": [
        {
          "title": "Resource Title",
          "description": "Description of the resource and how it helps in career development",
          "link": "https://example.com - actual working website URL"
        }
      ]
    }

    Requirements:
    - Include 5-7 career progression steps from entry level to senior level
    - Include realistic salary ranges in LPA (Lakhs Per Annum) for Indian market
    - Include practical timeline expectations
    - Include 4-6 additional resources for career development with REAL working website links
    - Focus on ${sector} sector specific career progression for ${jobRole}
    - Include detailed descriptions for each career stage
    - For additionalResources, provide actual working website URLs like:
      * Educational platforms (Coursera, Udemy, edX, Pluralsight, etc.)
      * Documentation sites
      * GitHub repositories
      * Industry blogs and websites
      * Certification providers
      * Professional communities
    - Make sure all links are real, working URLs that provide value for ${jobRole} learning

    Make sure to return ONLY valid JSON without any markdown formatting or additional text.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // Clean the response to extract JSON
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const careerPathData = JSON.parse(cleanedText)
      
      return careerPathData
    } catch (parseError) {
      console.error("Error parsing career path data:", parseError)
      console.error("Raw response:", text)
      return null
    }
  } catch (error) {
    console.error("Error generating career path data:", error)
    return null
  }
}

export { genAI, model }