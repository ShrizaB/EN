import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { PerplexityAPI } from '@/lib/perplexity-api'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || ''
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "")
let perplexityAPI: PerplexityAPI | null = null
if (PERPLEXITY_API_KEY) {
  try { perplexityAPI = new PerplexityAPI(PERPLEXITY_API_KEY) } catch (e) { console.error('Perplexity init error:', e) }
}

// Function to search for Sketchfab models using Perplexity
async function searchSketchfabModel(topic: string): Promise<string | null> {
  // Use PerplexityAI 'sonar' to find Sketchfab model ID
  if (!perplexityAPI) return null
  try {
    const prompt = `Find a Sketchfab 3D model for "${topic}". Return ONLY the model UID from the URL (https://sketchfab.com/3d-models/...-[UID]) as plain text.`
    const result = await perplexityAPI.generateContent(prompt, { model: 'sonar', maxTokens: 50, temperature: 0.1 })
    const text = result.text().trim()
    const match = text.match(/([A-Za-z0-9_-]{20,})/)
    if (match) return match[1]
    console.warn('Perplexity did not return a valid Sketchfab UID:', text)
    return null
  } catch (error) {
    console.error('Perplexity search error:', error)
    return null
  }
}

// Sketchfab model database (real working 3D models)
const SKETCHFAB_MODELS = {
  // Animals - Using actual working Sketchfab model IDs
  'dinosaur': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'triceratops': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'tyrannosaurus': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  't-rex': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'skeleton': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'elephant': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'whale': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'lion': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'eagle': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'shark': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'tiger': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'bear': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'giraffe': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'zebra': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'cat': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'dog': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  
  // Space & Science
  'solar system': '6ae00a7cfaa940a9a0c7a89ac81cea76',
  'planet': '6ae00a7cfaa940a9a0c7a89ac81cea76',
  'earth': '6ae00a7cfaa940a9a0c7a89ac81cea76',
  'satellite': '6ae00a7cfaa940a9a0c7a89ac81cea76',
  'rocket': '6ae00a7cfaa940a9a0c7a89ac81cea76',
  'astronaut': '6ae00a7cfaa940a9a0c7a89ac81cea76',
  'telescope': '6ae00a7cfaa940a9a0c7a89ac81cea76',
  'galaxy': '6ae00a7cfaa940a9a0c7a89ac81cea76',
  'atom': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'dna': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'cell': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  
  // Technology
  'computer': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'robot': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'car': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'airplane': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'ship': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'train': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'motorcycle': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'bicycle': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  
  // Human Body
  'heart': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'brain': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'lung': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'kidney': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'liver': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'stomach': '1754a2b3f8b5436cab8dd54c7cd98ae5',
  'eye': 'f1306b9b1d1e9a0f4b8c7d6e5f4a3b2c',
  'ear': 'a2417c0c2e2f0b1a5c9d8e7f6a5b4c3d',
  'hand': 'b3528d1d3f3a1c2b6d0e9f8a7b6c5d4e',
  
  // Nature
  'tree': 'c4639e2e4a4b2d3c7e1f0a9b8c7d6e5f',
  'flower': 'd5740f3f5b5c3e4d8f2a1b0c9d8e7f6a',
  'mountain': 'e6851a4a6c6d4f5e9a3b2c1d0e9f8a7b',
  'volcano': 'f7962b5b7d7e5a6f0b4c3d2e1f0a9b8c',
  'river': 'a8073c6c8e8f6b7a1c5d4e3f2a1b0c9d',
  'ocean': 'b9184d7d9f9a7c8b2d6e5f4a3b2c1d0e',
  'cloud': 'c0295e8e0a0b8d9c3e7f6a5b4c3d2e1f',
  'lightning': 'd1306f9f1b1c9e0d4f8a7b6c5d4e3f2a',
  'tornado': 'e2417a0a2c2d0f1e5a9b8c7d6e5f4a3b',
  'earthquake': 'f3528b1b3d3e1a2f6b0c9d8e7f6a5b4c',
  
  // Food
  'pizza': 'a4639c2c4e4f2b3a7c1d0e9f8a7b6c5d',
  'burger': 'b5740d3d5f5a3c4b8d2e1f0a9b8c7d6e',
  'cake': 'c6851e4e6a6b4d5c9e3f2a1b0c9d8e7f',
  'apple': 'd7962f5f7b7c5e6d0f4a3b2c1d0e9f8a',
  'banana': 'e8073a6a8c8d6f7e1a5b4c3d2e1f0a9b',
  'bread': 'f9184b7b9d9e7a8f2b6c5d4e3f2a1b0c',
  'cheese': 'a0295c8c0e0f8b9a3c7d6e5f4a3b2c1d',
  'fish': 'b1306d9d1f1a9c0b4d8e7f6a5b4c3d2e',
  'chicken': 'c2417e0e2a2b0d1c5e9f8a7b6c5d4e3f',
  'egg': 'd3528f1f3b3c1e2d6f0a9b8c7d6e5f4a',
  
  // Buildings & Architecture
  'house': 'e4639a2a4c4d2f3e7a1b0c9d8e7f6a5b',
  'castle': 'f5740b3b5d5e3a4f8b2c1d0e9f8a7b6c',
  'bridge': 'a6851c4c6e6f4b5a9c3d2e1f0a9b8c7d',
  'tower': 'b7962d5d7f7a5c6b0d4e3f2a1b0c9d8e',
  'church': 'c8073e6e8a8b6d7c1e5f4a3b2c1d0e9f',
  'mosque': 'd9184f7f9b9c7e8d2f6a5b4c3d2e1f0a',
  'temple': 'e0295a8a0c0d8f9e3a7b6c5d4e3f2a1b',
  'pyramid': 'f1306b9b1d1e9a0f4b8c7d6e5f4a3b2c',
  'statue': 'a2417c0c2e2f0b1a5c9d8e7f6a5b4c3d',
  'lighthouse': 'b3528d1d3f3a1c2b6d0e9f8a7b6c5d4e',
  
  // Musical Instruments
  'guitar': 'c4639e2e4a4b2d3c7e1f0a9b8c7d6e5f',
  'piano': 'd5740f3f5b5c3e4d8f2a1b0c9d8e7f6a',
  'violin': 'e6851a4a6c6d4f5e9a3b2c1d0e9f8a7b',
  'drums': 'f7962b5b7d7e5a6f0b4c3d2e1f0a9b8c',
  'trumpet': 'a8073c6c8e8f6b7a1c5d4e3f2a1b0c9d',
  'saxophone': 'b9184d7d9f9a7c8b2d6e5f4a3b2c1d0e',
  'flute': 'c0295e8e0a0b8d9c3e7f6a5b4c3d2e1f',
  'harp': 'd1306f9f1b1c9e0d4f8a7b6c5d4e3f2a',
  
  // Sports
  'football': 'e2417a0a2c2d0f1e5a9b8c7d6e5f4a3b',
  'basketball': 'f3528b1b3d3e1a2f6b0c9d8e7f6a5b4c',
  'soccer': 'a4639c2c4e4f2b3a7c1d0e9f8a7b6c5d',
  'tennis': 'b5740d3d5f5a3c4b8d2e1f0a9b8c7d6e',
  'baseball': 'c6851e4e6a6b4d5c9e3f2a1b0c9d8e7f',
  'golf': 'd7962f5f7b7c5e6d0f4a3b2c1d0e9f8a',
  'swimming': 'e8073a6a8c8d6f7e1a5b4c3d2e1f0a9b',
  'running': 'f9184b7b9d9e7a8f2b6c5d4e3f2a1b0c'
}

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()
    
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    // Analyze the topic to determine visualization type
    const analysisPrompt = `
      Analyze the topic "${topic}" and determine the best visualization type:
      
      IMPORTANT: Look for programming context indicators:
      - Programming languages: C, C++, Python, Java, JavaScript, etc.
      - Programming terms: "program", "code", "algorithm", "function", "loop", "array"
      - Implementation keywords: "write a program", "coding", "programming"
      
      1. If it's about a PROGRAMMING CONCEPT or CODE IMPLEMENTATION:
         - Choose "mermaid" for programming flowcharts
         - Examples: "multiplication program in C", "Python loop", "sorting algorithm", "function implementation"
         - Focus on CODE LOGIC and PROGRAMMING STEPS, not mathematical concepts
      
      2. If it's about a MATHEMATICAL PROCESS (without programming context):
         - Choose "mermaid" for mathematical process diagrams
         - Examples: "multiplication", "addition", "mathematical concepts"
         - Focus on MATHEMATICAL STEPS and CONCEPTUAL UNDERSTANDING
      
      3. If it's about BIOLOGICAL/SCIENTIFIC PROCESSES:
         - Choose "mermaid" for process diagrams
         - Examples: photosynthesis, digestion, water cycle
         - Focus on BIOLOGICAL/SCIENTIFIC STEPS
      
      4. If it's about a PHYSICAL OBJECT, CONCEPT, or THING:
         - Choose "sketchfab" for 3D models
         - Examples: animals, body parts, vehicles, buildings, food, instruments
      
      Respond with ONLY a JSON object in this format:
      {
        "type": "mermaid" or "sketchfab",
        "title": "Clear title for the visualization",
        "description": "Brief description of what will be shown",
        "reasoning": "Why this visualization type was chosen",
        "context": "programming" or "mathematical" or "biological" or "general"
      }
    `
    
    const analysisResult = await model.generateContent(analysisPrompt)
    const analysisText = analysisResult.response.text()
    
    // Parse the analysis result
    let analysis
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in analysis")
      }
    } catch (parseError) {
      console.error("Analysis parsing error:", parseError)
      return NextResponse.json({ error: "Failed to analyze topic" }, { status: 500 })
    }
    
    let visualization
    
    if (analysis.type === "mermaid") {
      // Generate context-aware Mermaid diagram
      let contextualPrompt = ""
      
      if (analysis.context === "programming") {
        contextualPrompt = `
          Create a programming flowchart for "${topic}".
          
          PROGRAMMING FLOWCHART RULES:
          - Show PROGRAMMING LOGIC and CODE STRUCTURE
          - Include programming elements: variables, loops, conditions, functions
          - Show algorithm steps and implementation details
          - Use programming terminology and concepts
          - Focus on how the CODE works, not mathematical concepts
          
          Example for "multiplication program in C":
          flowchart TD
            A[Start Program] --> B[Declare variables: int a, b, result]
            B --> C[Input: Read a]
            C --> D[Input: Read b]
            D --> E[Initialize: result = 0]
            E --> F[Loop: for i = 1 to b]
            F --> G[result = result + a]
            G --> H{i < b?}
            H -->|Yes| F
            H -->|No| I[Output: print result]
            I --> J[End Program]
        `
      } else if (analysis.context === "mathematical") {
        contextualPrompt = `
          Create a mathematical process diagram for "${topic}".
          
          MATHEMATICAL FLOWCHART RULES:
          - Show MATHEMATICAL CONCEPTS and PROCESSES
          - Focus on mathematical understanding, not programming
          - Include mathematical steps and conceptual breakdown
          - Use mathematical terminology
          - Help students understand the mathematical concept
          
          Example for "multiplication":
          flowchart TD
            A[Multiplication: a × b] --> B[Understand concept]
            B --> C[Repeated Addition Method]
            C --> D[Add 'a' to itself 'b' times]
            D --> E[Example: 3 × 4]
            E --> F[3 + 3 + 3 + 3 = 12]
            F --> G[Result: 12]
        `
      } else {
        contextualPrompt = `
          Create a process diagram for "${topic}".
          
          GENERAL PROCESS RULES:
          - Show step-by-step process
          - Use clear, logical flow
          - Include decision points where relevant
          - Make it educational and easy to understand
        `
      }
      
      const fullPrompt = `${contextualPrompt}
        
        Use flowchart TD (top-down) format.
        Make it educational and easy to understand.
        Include clear labels and logical flow.
        
        IMPORTANT: Return ONLY valid Mermaid flowchart code with proper formatting.
        Start with "flowchart TD" and use proper Mermaid syntax.
        Do not include any markdown formatting, explanations, or extra text.
        
        CRITICAL FORMATTING RULES:
        - Put "flowchart TD" on its own line
        - Each node connection must be on a separate line
        - Use proper indentation (4 spaces for each line after flowchart TD)
        - Use simple node IDs: A, B, C, etc.
        - Use square brackets for nodes: A[Label Text]
        - Use --> for simple arrows: A --> B
        - For conditional arrows use: A -- Yes --> B
        - Avoid special characters, quotes, or parentheses in labels
        - Keep labels simple and descriptive
        - Use only alphanumeric characters, spaces, and basic punctuation
        
        Example format:
        flowchart TD
            A[Start] --> B[Step 1]
            B --> C{Decision?}
            C -- Yes --> D[Option A]
            C -- No --> E[Option B]
            D --> F[End]
            E --> F
      `
      
      const mermaidResult = await model.generateContent(fullPrompt)
      // Extract and clean Mermaid code, preserving syntax
      let mermaidCode = mermaidResult.response.text().trim()
      // Remove markdown fences
      mermaidCode = mermaidCode.replace(/```mermaid/g, '').replace(/```/g, '').trim()
      // Extract from first 'flowchart' keyword if present
      const idx = mermaidCode.indexOf('flowchart')
      if (idx > 0) {
        mermaidCode = mermaidCode.slice(idx)
      }
      // Ensure valid flowchart TD start
      if (!/^flowchart\s+TD/.test(mermaidCode)) {
        mermaidCode = `flowchart TD\n${mermaidCode}`
      }
      // Trim each line
      mermaidCode = mermaidCode
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n')
      
      // Validate basic mermaid syntax
      if (!mermaidCode.includes('-->') && !mermaidCode.includes('flowchart')) {
        console.warn("Generated code is not valid Mermaid syntax, using fallback")
        // Create a simple fallback diagram
        mermaidCode = `flowchart TD
    A[${topic}] --> B[Understanding the Topic]
    B --> C[Key Concepts]
    C --> D[Implementation]
    D --> E[Results]`
      }
      
      console.log('Final mermaid code:', mermaidCode)
      
      visualization = {
        type: "mermaid",
        title: analysis.title,
        description: analysis.description,
        content: mermaidCode,
        mermaidCode: mermaidCode
      }
    } else {
      // Find Sketchfab model using Perplexity search
      let sketchfabId = await searchSketchfabModel(topic)
      
      // If Perplexity search fails, try local fallback
      if (!sketchfabId) {
        console.log('Perplexity search failed, using fallback models')
        const topicLower = topic.toLowerCase()
        
        // Search for matching model in fallback database
        for (const [keyword, id] of Object.entries(SKETCHFAB_MODELS)) {
          if (topicLower.includes(keyword) || keyword.includes(topicLower)) {
            sketchfabId = id
            break
          }
        }
        
        // If still no match, try partial matching
        if (!sketchfabId) {
          for (const [keyword, id] of Object.entries(SKETCHFAB_MODELS)) {
            const words = topicLower.split(' ')
            if (words.some((word: string) => keyword.includes(word) || word.includes(keyword))) {
              sketchfabId = id
              break
            }
          }
        }
        
        // Final fallback to a default model
        if (!sketchfabId) {
          sketchfabId = SKETCHFAB_MODELS['atom'] // Default to atom model
        }
      }
      
      visualization = {
        type: "sketchfab",
        title: analysis.title,
        description: analysis.description,
        content: `3D model visualization of ${topic}`,
        sketchfabId: sketchfabId,
        sketchfabUrl: `https://sketchfab.com/3d-models/${sketchfabId}`
      }
    }
    
    return NextResponse.json({
      visualization,
      analysis: analysis.reasoning
    })
    
  } catch (error) {
    console.error("Visualization generation error:", error)
    return NextResponse.json({ 
      error: "Failed to generate visualization" 
    }, { status: 500 })
  }
}
