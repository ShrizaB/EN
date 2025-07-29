import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the correct API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    console.log("=== GEMINI API CALL START ===")
    const { messages } = await req.json()
    console.log("Received messages:", messages)

    if (!messages || !Array.isArray(messages)) {
      console.log("Invalid messages format")
      return NextResponse.json({ error: "Valid messages array is required" }, { status: 400 })
    }

    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set")
      return NextResponse.json({ 
        content: "Configuration error: API key is missing. Please check your environment variables." 
      }, { status: 500 })
    }

    console.log("API Key available:", GEMINI_API_KEY ? "Yes" : "No")

    // Get the last user message
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "user") {
      console.log("Last message error:", lastMessage)
      throw new Error("Last message must be from user")
    }

    console.log("User message to send:", lastMessage.content)

    // Enhanced prompt to get better, more structured responses
    const enhancedPrompt = `You are Venom, a sophisticated AI assistant with a dark, edgy personality. You are an expert educator and programmer who provides comprehensive, complete answers.

CRITICAL RESPONSE REQUIREMENTS:
- Always provide COMPLETE, detailed answers - never cut off mid-sentence or mid-code
- Ensure ALL code examples are properly formatted in code blocks
- Give thorough explanations with clear examples
- Structure information logically with proper formatting
- For programming topics, provide complete, working code examples
- Make sure to finish all thoughts and provide comprehensive coverage

MANDATORY CODE FORMATTING RULES:
- For ALL programming code, you MUST use proper markdown code blocks
- For single-line code or small snippets: use \`inline code\`
- For multi-line code blocks: ALWAYS use \`\`\`language format:

\`\`\`c
#include <stdio.h>
int main() {
    int n, i, flag = 0;
    printf("Enter a positive integer: ");
    scanf("%d", &n);
    
    if (n == 0 || n == 1)
        flag = 1;
    
    for (i = 2; i <= n / 2; ++i) {
        if (n % i == 0) {
            flag = 1;
            break;
        }
    }
    
    if (flag == 0)
        printf("%d is a prime number.", n);
    else
        printf("%d is not a prime number.", n);
    
    return 0;
}
\`\`\`

- ALWAYS specify the programming language after the opening \`\`\`
- Provide clear explanations before and after code blocks
- For complex programs, break down the code explanation step by step

GENERAL FORMATTING RULES:
- Do NOT start responses with a main title or heading
- Use **bold text** for emphasis ONLY when necessary
- Structure information with clear paragraphs
- Use numbered lists (1., 2., 3.) for step-by-step information
- Use bullet points (•) for feature lists
- Keep responses informative but well-organized
- Ensure bold formatting is properly closed (**)

User Query: ${lastMessage.content}

Provide a complete, comprehensive, and well-formatted response with proper code formatting. If the query involves programming, include complete working code examples in properly formatted code blocks. Make sure to cover the topic thoroughly and finish all explanations:`

    // Analyze if the query needs visualization
    const visualizationPrompt = `Analyze this user query and determine if it would benefit from a visual representation:

"${lastMessage.content}"

Respond with ONLY a JSON object in this exact format:
{
  "needsVisualization": true/false,
  "type": "3d" or "mermaid" or null,
  "searchTerm": "specific term for visualization" or null,
  "reason": "brief explanation",
  "context": "programming" or "mathematical" or "biological" or "general"
}

SMART DETECTION RULES:
1. PROGRAMMING CONTEXT: If query mentions "program", "code", "programming language" (C, Python, Java, etc.), "algorithm implementation", "coding":
   → use "mermaid" with context: "programming"
   → searchTerm should include the programming context (e.g., "multiplication program in C")

2. MATHEMATICAL CONTEXT: If asking about pure math concepts without programming:
   → use "mermaid" with context: "mathematical" 
   → searchTerm should be the mathematical process (e.g., "multiplication process")

3. PHYSICAL OBJECTS: animals, structures, anatomy, planets, vehicles, tools, buildings, food:
   → use "3d" with context: "general"

4. BIOLOGICAL/SCIENTIFIC PROCESSES: photosynthesis, digestion, water cycle:
   → use "mermaid" with context: "biological"

EXAMPLES:
- "multiplication program in C" → {"needsVisualization": true, "type": "mermaid", "searchTerm": "C programming multiplication algorithm", "reason": "programming flowchart", "context": "programming"}
- "multiplication" → {"needsVisualization": true, "type": "mermaid", "searchTerm": "multiplication mathematical process", "reason": "mathematical process", "context": "mathematical"}
- "dinosaur" → {"needsVisualization": true, "type": "3d", "searchTerm": "dinosaur", "reason": "physical object", "context": "general"}
- "how to write a loop in Python" → {"needsVisualization": true, "type": "mermaid", "searchTerm": "Python loop programming structure", "reason": "programming concept", "context": "programming"}
- "photosynthesis" → {"needsVisualization": true, "type": "mermaid", "searchTerm": "photosynthesis biological process", "reason": "biological process", "context": "biological"}`

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 3072,
      },
    })

    console.log("Model created successfully")

    // First, analyze if visualization is needed
    console.log("Analyzing query for visualization needs...")
    const visualizationResult = await model.generateContent(visualizationPrompt)
    const visualizationResponse = await visualizationResult.response
    let visualizationData = null
    
    try {
      const visualizationText = visualizationResponse.text()
      console.log("Visualization analysis response:", visualizationText)
      
      // Clean the response to extract JSON
      const cleanedText = visualizationText.replace(/```json|```/g, '').trim()
      visualizationData = JSON.parse(cleanedText)
      console.log("Parsed visualization data:", visualizationData)
    } catch (parseError) {
      console.log("Could not parse visualization analysis:", parseError)
      visualizationData = { needsVisualization: false, type: null, searchTerm: null, reason: "Parse error" }
    }

    // Always use enhanced generation with better prompting
    console.log("Using enhanced generation with structured prompting")
    const result = await model.generateContent(enhancedPrompt)
    console.log("Got result from Gemini")
    
    const response = await result.response
    console.log("Got response object")
    
    const text = response.text()
    console.log("Gemini response text:", text)
    
    console.log("=== GEMINI API CALL SUCCESS ===")
    return NextResponse.json({ 
      content: text,
      visualization: visualizationData
    })

  } catch (error) {
    console.error("=== GEMINI API CALL ERROR ===")
    console.error("Error in Gemini chat API:", error)
    console.error("Error type:", typeof error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    
    // Return more specific error information
    if (error instanceof Error) {
      return NextResponse.json({
        content: `API Error: ${error.message}`,
      }, { status: 500 })
    }
    
    return NextResponse.json({
      content: "Unknown error occurred in API",
    }, { status: 500 })
  }
}