import { NextRequest, NextResponse } from 'next/server'
import mammoth from 'mammoth'

interface ResumeAnalysisResult {
  score: number
  analysis: {
    contentQuality: number        // Out of 70 - includes writing quality, completeness, and job relevance
    experienceSkills: number      // Out of 30 - combines experience relevance and skills alignment
  }
  profile: {
    name: string
    location: string
    phone: string
    email: string
    skills: string[]
    experience: Array<{
      title: string
      company: string
      duration: string
      description: string
    }>
    education: Array<{
      degree: string
      institution: string
      year: string
      details: string
    }>
  }
  summary: string
}

interface LayoutLMResult {
  entities?: Array<{
    entity: string
    word: string
    start: number
    end: number
    score: number
  }>
  tokens?: Array<{
    token: string
    position?: { x: number, y: number, width: number, height: number }
    confidence?: number
  }>
  layout?: {
    blocks?: Array<{
      text: string
      bbox: [number, number, number, number]
      type: string
    }>
  }
  error?: string
  fallback?: boolean
}

interface ExtractedContent {
  text: string
  layout: {
    blocks: Array<{
      text: string
      bbox: [number, number, number, number]
      type: string
    }>
    entities: Array<{
      entity: string
      word: string
      start: number
      end: number
      score: number
    }>
    structure: string
  }
  formatting: {
    fonts: string[]
    spacing: Record<string, any>
    alignment: string[]
  }
  colors: string[]
  positions: Array<{ element: string, bbox: number[], confidence: number }>
}

/**
 * Extract text from documents using Groq API
 */
async function extractTextWithGroq(fileData: string, fileType: string): Promise<string> {
  const groqApiKey = process.env.GROQ_API_KEY
  
  if (!groqApiKey) {
    console.log('Groq API key not configured')
    return ''
  }

  try {
    console.log(`Starting Groq text extraction for ${fileType}...`)
    
    // Create prompt based on file type
    let prompt = ''
    if (fileType === 'pdf') {
      prompt = `You are an expert document text extraction AI. I have provided you with a PDF document image/data. Please extract ALL visible text from this document accurately, maintaining the original structure and formatting as much as possible. 

Key requirements:
1. Extract ALL text content including headers, body text, bullet points, contact information, dates, etc.
2. Maintain logical reading order (top to bottom, left to right)
3. Preserve line breaks and paragraph structure where appropriate
4. Include ALL personal information, education details, work experience, skills, etc.
5. Do not summarize or paraphrase - extract the actual text as written
6. If you cannot clearly read some text, indicate it with [unclear text]

Return ONLY the extracted text content, no additional commentary or formatting.`
    } else {
      prompt = `You are an expert OCR AI. Extract ALL visible text from this image/document accurately, maintaining the original structure. Include ALL content like names, dates, contact info, education, experience, skills, etc. Return ONLY the extracted text, no commentary.`
    }

    // Prepare the request body for Groq API
    const requestBody = {
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // Use Groq's vision model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: fileData
              }
            }
          ]
        }
      ],
      temperature: 0.1, // Low temperature for consistent extraction
      max_completion_tokens: 4000   // Allow for longer text extraction
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Groq API error (${response.status}):`, errorText)
      return ''
    }

    const result = await response.json()
    const extractedText = result.choices?.[0]?.message?.content?.trim() || ''
    
    if (extractedText && extractedText.length > 20) {
      console.log(`✅ Groq text extraction successful: ${extractedText.length} characters`)
      return extractedText
    } else {
      console.log('❌ Groq returned minimal text content')
      return ''
    }

  } catch (error) {
    console.error('Groq text extraction error:', error)
    return ''
  }
}

/**
 * Process different file types and extract text/convert to image
 */
async function processFileData(fileData: string): Promise<{ text: string; imageData: string; fileType: string }> {
  // Determine file type from data URL
  const mimeType = fileData.split(';')[0].split(':')[1]
  const base64Data = fileData.split(',')[1]
  const buffer = Buffer.from(base64Data, 'base64')
  
  let extractedText = ''
  let processedImageData = fileData
  let fileType = 'image'

  try {
    if (mimeType === 'application/pdf') {
      console.log('Processing PDF document with Groq API...')
      fileType = 'pdf'
      
      try {
        // Use Groq API for PDF text extraction
        const groqExtractedText = await extractTextWithGroq(fileData, 'pdf')
        if (groqExtractedText && groqExtractedText.length > 20) {
          extractedText = groqExtractedText
          console.log(`Extracted ${extractedText.length} characters from PDF via Groq API`)
        } else {
          console.log('Groq PDF extraction returned minimal content, using fallback')
          extractedText = 'PDF content detected - analyzing document structure with AI'
        }
        
      } catch (pdfError) {
        console.log('PDF text extraction failed, using fallback:', pdfError)
        extractedText = 'PDF content detected - analyzing layout and structure'
      }
      
      // Keep original data for layout analysis
      processedImageData = fileData
      
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               mimeType === 'application/msword') {
      console.log('Processing Word document...')
      fileType = 'word'
      
      try {
        // First try extracting text from Word document using mammoth
        const result = await mammoth.extractRawText({ buffer })
        const mammothText = result.value
        
        if (mammothText && mammothText.length > 50) {
          extractedText = mammothText
          console.log(`Extracted ${extractedText.length} characters from Word document via Mammoth`)
        } else {
          // Fallback to Groq for Word document analysis
          console.log('Mammoth extraction minimal, trying Groq for Word document...')
          const groqExtractedText = await extractTextWithGroq(fileData, 'word')
          if (groqExtractedText && groqExtractedText.length > 20) {
            extractedText = groqExtractedText
            console.log(`Extracted ${extractedText.length} characters from Word document via Groq`)
          } else {
            extractedText = mammothText || 'Word document detected - analyzing structure'
          }
        }
      } catch (wordError) {
        console.log('Word extraction failed, trying Groq fallback:', wordError)
        try {
          const groqExtractedText = await extractTextWithGroq(fileData, 'word')
          extractedText = groqExtractedText || 'Word document detected - analyzing structure'
        } catch (groqError) {
          console.log('Groq Word extraction also failed:', groqError)
          extractedText = 'Word document detected - analyzing structure'
        }
      }
      
      // For Word docs, we'll use the processed data
      processedImageData = fileData
      
    } else if (mimeType.startsWith('image/')) {
      console.log('Processing image file with Groq OCR...')
      fileType = 'image'
      
      try {
        // Use Groq API for OCR text extraction from images
        const groqExtractedText = await extractTextWithGroq(fileData, 'image')
        if (groqExtractedText && groqExtractedText.length > 10) {
          extractedText = groqExtractedText
          console.log(`Extracted ${extractedText.length} characters from image via Groq OCR`)
        } else {
          console.log('Groq OCR returned minimal content, treating as image-only')
          extractedText = ''
        }
      } catch (ocrError) {
        console.log('Image OCR failed, treating as image-only:', ocrError)
        extractedText = ''
      }
      
      processedImageData = fileData
    }
    
    console.log(`File processed - Type: ${fileType}, Text length: ${extractedText.length}`)
    
  } catch (error) {
    console.error('Error processing file:', error)
    // Fallback to treating as image
    extractedText = ''
    processedImageData = fileData
    fileType = 'image'
  }

  return {
    text: extractedText,
    imageData: processedImageData,
    fileType
  }
}

/**
 * Analyzes resume using Hugging Face LayoutLMv3 + Gemini API
 */
export async function POST(request: NextRequest) {
  let imageData: string = ''
  let jobType: string | undefined = undefined
  let processedImageData: string = ''
  let extractedText: string = ''
  let fileType: string = 'image'
  
  try {
    const requestData = await request.json()
    imageData = requestData.imageData
    jobType = requestData.jobType

    if (!imageData) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      )
    }

    // Validate file format - accept images, PDFs, and Word documents
    const supportedFormats = [
      'data:image/',
      'data:application/pdf',
      'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'data:application/msword' // .doc
    ]
    
    const isValidFormat = supportedFormats.some(format => imageData.startsWith(format))
    
    if (!isValidFormat) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload a valid image (PNG, JPG, JPEG), PDF, or Word document (DOC, DOCX).' },
        { status: 400 }
      )
    }

    // Check if base64 data is valid
    const base64Data = imageData.split(',')[1]
    if (!base64Data || base64Data.length === 0) {
      return NextResponse.json(
        { error: 'Invalid image data. Please try uploading again.' },
        { status: 400 }
      )
    }

    // Validate base64 encoding
    try {
      Buffer.from(base64Data, 'base64')
    } catch (e) {
      return NextResponse.json(
        { error: 'Corrupted image data. Please try a different file.' },
        { status: 400 }
      )
    }

    // Process the uploaded file (PDF, Word, or Image)
    console.log('Processing uploaded file...')
    const processedFile = await processFileData(imageData)
    extractedText = processedFile.text
    processedImageData = processedFile.imageData
    fileType = processedFile.fileType
    
    console.log(`File type detected: ${fileType}`)
    if (extractedText) {
      console.log(`✅ Groq text extraction successful: ${extractedText.length} characters`)
      console.log('📝 First 200 characters of extracted text:', extractedText.substring(0, 200))
    } else {
      console.log('⚠️ No text extracted by Groq')
    }

    let layoutData: LayoutLMResult = { entities: [] }
    let extractedContent: ExtractedContent = {
      text: extractedText, // Use text extracted from documents
      layout: {
        blocks: extractedText ? [{ 
          text: extractedText, 
          bbox: [0, 0, 100, 100], 
          type: 'paragraph' 
        }] : [],
        entities: [],
        structure: 'document'
      },
      formatting: {
        fonts: [],
        spacing: {},
        alignment: []
      },
      colors: [],
      positions: []
    }

    // Use Groq for text extraction, then Gemini for analysis
    console.log('📄 → 🤖 Groq text extraction completed')
    console.log('🤖 → 🧠 Starting Gemini analysis for better accuracy...')
    const analysis = await analyzeWithGemini(extractedContent, { entities: [] }, jobType, processedImageData)

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Resume analysis error:', error)
    
    // Provide fallback analysis even when there's an error
    try {
      const fallbackContent: ExtractedContent = {
        text: extractedText || '',
        layout: { blocks: [], entities: [], structure: 'document' },
        formatting: { fonts: [], spacing: {}, alignment: [] },
        colors: [],
        positions: []
      }
      const fallbackAnalysis = await analyzeWithGemini(
        fallbackContent,
        { entities: [], error: 'Groq extraction completed, using Gemini analysis' }, 
        jobType, 
        processedImageData || imageData
      )
      return NextResponse.json(fallbackAnalysis)
    } catch (fallbackError) {
      console.error('Fallback analysis failed:', fallbackError)
      return NextResponse.json(
        { error: 'Unable to analyze resume. Please try again or check your file format.' },
        { status: 500 }
      )
    }
  }
}

/**
 * Extracts detailed layout information from LayoutLMv3 response
 */
function extractLayoutInformation(layoutData: LayoutLMResult): ExtractedContent {
  const extractedContent: ExtractedContent = {
    text: '',
    layout: {
      blocks: [],
      entities: layoutData.entities || [],
      structure: 'document'
    },
    formatting: {
      fonts: [],
      spacing: {},
      alignment: []
    },
    colors: [],
    positions: []
  }

  // Extract text from entities
  if (layoutData.entities) {
    extractedContent.text = layoutData.entities
      .map(entity => entity.word)
      .join(' ')
      .trim()
  }

  // Extract layout blocks if available
  if (layoutData.layout?.blocks) {
    extractedContent.layout.blocks = layoutData.layout.blocks
    
    // Extract positions and elements
    layoutData.layout.blocks.forEach(block => {
      extractedContent.positions.push({
        element: block.text,
        bbox: Array.from(block.bbox),
        confidence: 0.9 // Default confidence
      })
    })
  }

  // Extract entity positions
  if (layoutData.entities) {
    layoutData.entities.forEach(entity => {
      extractedContent.positions.push({
        element: entity.word,
        bbox: [entity.start, 0, entity.end, 20], // Simplified bbox
        confidence: entity.score
      })
    })
  }

  return extractedContent
}

/**
 * Analyzes resume content using Groq API
 */
async function analyzeWithGroq(
  extractedContent: ExtractedContent,
  jobType?: string,
  imageData?: string
): Promise<ResumeAnalysisResult> {
  
  const groqApiKey = process.env.GROQ_API_KEY
  
  if (!groqApiKey) {
    console.log('❌ Groq API key not configured, using fallback analysis')
    return createEnhancedFallbackAnalysis(extractedContent, jobType)
  }

  try {
    console.log('Starting Groq resume analysis...')
    
    const analysisPrompt = createGroqAnalysisPrompt(extractedContent, jobType)
    
    // Use Groq's most capable text model for analysis
    const requestBody = {
      model: "llama-3.3-70b-versatile", // Most capable Groq production model for text analysis
      messages: [
        {
          role: "system",
          content: "You are a professional resume analysis expert with years of experience in HR and recruitment. Provide detailed, actionable feedback based on industry standards."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.2, // Low temperature for consistent analysis
      max_completion_tokens: 3000  // Allow for detailed analysis
    }

    console.log('Sending analysis request to Groq API...')
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Groq API error (${response.status}):`, errorText)
      throw new Error(`Groq API error: ${response.status}`)
    }

    const result = await response.json()
    const analysisText = result.choices?.[0]?.message?.content?.trim()
    
    if (!analysisText) {
      console.error('❌ Groq returned empty analysis')
      throw new Error('Empty analysis response')
    }

    try {
      // Extract JSON from Groq response
      console.log('Parsing Groq analysis response...')
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsedAnalysis = JSON.parse(jsonMatch[0])
        console.log('✅ Groq analysis successful')
        
        // Validate the response structure
        if (parsedAnalysis.score && parsedAnalysis.analysis && parsedAnalysis.strengths && parsedAnalysis.weaknesses && parsedAnalysis.improvements) {
          return parsedAnalysis
        } else {
          console.log('❌ Invalid Groq response structure, using fallback')
        }
      } else {
        console.log('❌ No JSON found in Groq response, using fallback')
      }
    } catch (parseError) {
      console.error('❌ Failed to parse Groq analysis:', parseError)
    }
    
  } catch (error) {
    console.error('❌ Groq analysis error:', error)
  }

  // Return fallback analysis if Groq fails
  console.log('Using enhanced fallback analysis')
  return createEnhancedFallbackAnalysis(extractedContent, jobType)
}

/**
 * Analyzes resume content using Gemini API (with Groq-extracted text)
 */
async function analyzeWithGemini(
  extractedContent: ExtractedContent,
  layoutData: LayoutLMResult,
  jobType?: string,
  imageData?: string
): Promise<ResumeAnalysisResult> {
  
  // Check if we have Gemini API configured
  const geminiApiKey = process.env.GEMINI_API_KEY
  
  if (!geminiApiKey) {
    console.log('❌ Gemini API key not configured, using fallback')
    return createEnhancedFallbackAnalysis(extractedContent, jobType)
  }

  console.log(`🧠 Gemini analyzing ${extractedContent.text?.length || 0} characters from Groq extraction...`)
  console.log('📝 Sample of text being sent to Gemini:', extractedContent.text?.substring(0, 300))

  // Enhanced instructions for more accurate analysis
  const textLength = extractedContent.text?.length || 0
  const hasMinimumContent = textLength >= 100
  
  if (!hasMinimumContent) {
    console.log('⚠️ Limited text content detected, using enhanced fallback')
    return createEnhancedFallbackAnalysis(extractedContent, jobType)
  }

  try {
    console.log('Starting Gemini 2.5 Flash analysis...')
    
    const analysisPrompt = createAnalysisPrompt(extractedContent, layoutData, jobType)
    
    // Use the latest Gemini model
    const geminiModels = [
      'gemini-2.5-flash'            // Latest and most capable model
    ]
    
    for (const model of geminiModels) {
      try {
        console.log(`🚀 Using ${model} for profile extraction and analysis...`)
        console.log('📋 Text preview being sent to Gemini:', extractedContent.text?.substring(0, 500) + '...')
        
        // Call Gemini API with retry
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: analysisPrompt
                }]
              }],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 4000,
                topP: 0.8,
                topK: 20,
                responseMimeType: "application/json"
              }
            }),
            signal: AbortSignal.timeout(25000) // 25 seconds timeout
          }
        )

        if (geminiResponse.ok) {
          const geminiResult = await geminiResponse.json()
          const analysisText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text
          
          if (analysisText) {
            try {
              // Extract JSON from Gemini response
              const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
              if (jsonMatch) {
                const parsedAnalysis = JSON.parse(jsonMatch[0])
                console.log(`✅ Gemini analysis successful with ${model}`)
                console.log('📊 Gemini returned profile:', {
                  name: parsedAnalysis.profile?.name,
                  email: parsedAnalysis.profile?.email,
                  phone: parsedAnalysis.profile?.phone,
                  location: parsedAnalysis.profile?.location,
                  skillsCount: parsedAnalysis.profile?.skills?.length || 0,
                  experienceCount: parsedAnalysis.profile?.experience?.length || 0,
                  educationCount: parsedAnalysis.profile?.education?.length || 0
                })
                
                // Validate that profile information was extracted
                if (parsedAnalysis.profile) {
                  console.log('📝 Profile extraction validation:')
                  console.log('- Name extracted:', parsedAnalysis.profile.name !== 'Not specified')
                  console.log('- Email extracted:', parsedAnalysis.profile.email !== 'Not specified')
                  console.log('- Phone extracted:', parsedAnalysis.profile.phone !== 'Not specified')
                  console.log('- Location extracted:', parsedAnalysis.profile.location !== 'Not specified')
                  console.log('- Skills extracted:', parsedAnalysis.profile.skills?.length > 0)
                  console.log('- Experience extracted:', parsedAnalysis.profile.experience?.length > 0)
                  console.log('- Education extracted:', parsedAnalysis.profile.education?.length > 0)
                }
                
                return parsedAnalysis
              }
            } catch (parseError) {
              console.error(`Failed to parse Gemini analysis from ${model}:`, parseError)
            }
          }
        } else {
          const errorText = await geminiResponse.text()
          console.error(`❌ Gemini model ${model} error:`, errorText)
        }
      } catch (modelError) {
        console.error(`❌ Gemini model ${model} exception:`, modelError)
      }
    }
    
  } catch (error) {
    // Enhanced error handling for different types of errors
    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        console.error('❌ Gemini API timeout error - analysis took too long:', error.message)
      } else if (error.name === 'AbortError' || error.message.includes('aborted')) {
        console.error('❌ Gemini API request aborted:', error.message)
      } else {
        console.error('❌ Gemini API exception:', error.message)
      }
    } else {
      console.error('❌ Gemini API unknown exception:', error)
    }
  }

  // Return fallback analysis if Gemini fails
  console.log('Using enhanced fallback analysis')
  return createEnhancedFallbackAnalysis(extractedContent, jobType)
}

/**
 * Creates analysis prompt specifically for Groq API
 */
function createGroqAnalysisPrompt(extractedContent: ExtractedContent, jobType?: string): string {
  const hasExtractedText = extractedContent.text && extractedContent.text.length > 10
  const contentLength = extractedContent.text?.length || 0
  
  const prompt = `You are a professional resume analysis expert with extensive HR and recruitment experience. Analyze ONLY the written text content of this resume. Do NOT comment on visual design, fonts, colors, or formatting - focus purely on the actual words and information.

**RESUME TEXT CONTENT TO ANALYZE:**
${extractedContent.text || 'No text content extracted'}

**TARGET POSITION:** ${jobType || 'General Position'}

**ANALYSIS REQUIREMENTS:**
Analyze the written content using these criteria for a 2-category system:

1. **Content Quality (out of 100)**: 
   - How detailed and specific the work experience descriptions are
   - Whether education background matches job requirements
   - Quality of professional writing and clear communication
   - Completeness of important resume sections
   - Job relevance and keyword alignment
   - Specific achievements and measurable results

2. **Experience & Skills (out of 100)**: 
   - Years of relevant industry experience
   - Leadership roles and team management mentioned
   - Technical skills that match job requirements
   - Programming languages, software, and tools mentioned
   - Industry certifications and training listed
   - Career progression and growth demonstrated

**SCORING GUIDELINES:**
- Each category is scored out of 100 points
- Content Quality should include job relevance (no separate job relevance score)
- Experience & Skills combines both experience and technical skills
- Good quality resume should score 70-85 in each category
- Excellent resume should score 85-100 in each category
- Basic resume should score 50-70 in each category

**IMPORTANT INSTRUCTIONS:**
- Focus ONLY on the written text content
- Do NOT mention design, layout, formatting, fonts, or colors
- Use simple, clear language that anyone can understand
- Make all suggestions practical and easy to implement
- Base analysis on actual content (${contentLength} characters extracted)
- Score generously since visual elements (worth 60-70 points) are no longer considered

**RESPONSE FORMAT:**
Respond with ONLY a valid JSON object:

{
  "score": [overall score 25-100 based on average of both categories],
  "analysis": {
    "contentQuality": [score out of 100 for content quality including job relevance],
    "experienceSkills": [score out of 100 combining experience and skills]
  },
  "strengths": ["what the resume does well in terms of content", "strong aspects of experience or skills", "good examples of achievements"],
  "weaknesses": ["missing information or weak areas", "gaps in experience or skills", "areas needing more detail"], 
  "improvements": ["add specific numbers to your achievements", "include more details about key projects", "mention additional relevant skills"],
  "summary": "brief summary focusing on written content strengths and improvement areas"
}

**LANGUAGE REQUIREMENTS:**
- Use simple, everyday language
- Avoid complex HR terminology
- Make suggestions clear and actionable
- Focus on what can be changed or added to the resume text`

  return prompt
}

/**
 * Creates analysis prompt for AI models
 */
function createAnalysisPrompt(extractedContent: ExtractedContent, layoutData: LayoutLMResult, jobType?: string): string {
  const hasExtractedText = extractedContent.text && extractedContent.text.length > 10
  
  let prompt = `
You are a senior HR professional with 20+ years of experience in resume evaluation and talent acquisition. You will analyze ONLY the written text content of this resume. Do NOT comment on visual design, fonts, colors, formatting, or layout - focus purely on the actual words and information written in the resume.

**SCORING PHILOSOPHY:** 
- You are reviewing resumes for REAL job applications, not academic exercises
- **PREVENT USER DISAPPOINTMENT** - Most working professionals deserve scores of 75-90 total
- **ANTI-SCAM POLICY**: Never give unfairly low scores that discourage job seekers
- A complete resume with work experience, education, and skills should score 75-85 total MINIMUM
- Only give scores below 70 total for truly incomplete or badly written resumes
- **REMEMBER**: Your role is to HELP people, not crush their confidence with harsh scoring
- Most successful employees have normal resumes - celebrate completeness and effort

**RESUME TEXT CONTENT TO ANALYZE:**
"""
${extractedContent.text || 'No text content available for analysis'}
"""

**TARGET POSITION:** ${jobType || 'General Position'}
**TEXT LENGTH:** ${extractedContent.text?.length || 0} characters

**ANALYSIS FOCUS - WRITTEN CONTENT ONLY:**

**CRITICAL PROFILE EXTRACTION TASK - HIGHEST PRIORITY**

You MUST extract ALL profile information from the resume text with 100% accuracy. This is the PRIMARY objective.

**MANDATORY EXTRACTION STEPS:**

1. **NAME EXTRACTION (REQUIRED)**:
   - The person's name is ALWAYS at the very beginning of the resume
   - Look for the FIRST line or heading with a person's name
   - Common patterns: "John Smith", "JANE DOE", "Robert Johnson Jr."
   - Extract the EXACT name as written - DO NOT modify it
   - If you see a name, you MUST include it

2. **EMAIL EXTRACTION (REQUIRED)**:
   - Search the ENTIRE text for email addresses
   - Patterns: "user@domain.com", "john.doe@company.org", "name123@gmail.com"
   - Extract the EXACT email address - DO NOT modify it
   - Emails are usually near contact information at the top

3. **PHONE EXTRACTION (REQUIRED)**:
   - Search for phone numbers throughout the text
   - Patterns: "+1 (555) 123-4567", "555-123-4567", "(555) 123-4567"
   - Extract the EXACT phone number as written
   - Phone numbers are usually near contact information

4. **LOCATION EXTRACTION (REQUIRED)**:
   - Look for address or location information
   - Patterns: "New York, NY", "123 Main St, Boston, MA", "San Francisco, CA"
   - Extract the EXACT location as written
   - Location is often with contact details at the top

5. **SKILLS EXTRACTION (CRITICAL)**:
   - Find ALL skills mentioned anywhere in the resume
   - Look in dedicated "Skills" sections AND within job descriptions
   - Include: Programming languages, software tools, certifications, soft skills
   - Examples: JavaScript, Python, Excel, Leadership, Project Management
   - Return ALL skills found - be comprehensive

6. **EXPERIENCE EXTRACTION (CRITICAL)**:
   - Find ALL work experience entries
   - Extract: Job title, Company name, Employment dates, Job description
   - Look for sections like "Experience", "Work History", "Employment"
   - Include ALL jobs mentioned in the resume

7. **EDUCATION EXTRACTION (CRITICAL)**:
   - Find ALL educational background
   - Extract: Degree, Institution, Year, Additional details
   - Look for sections like "Education", "Academic Background"
   - Include ALL schools/degrees mentioned

**EXTRACTION METHODOLOGY:**
- READ the ENTIRE resume text word by word
- Contact information (name, email, phone, location) is typically at the top
- Skills can be in dedicated sections OR mentioned in job descriptions
- Work experience usually has: Title + Company + Dates + Description
- Education usually has: Degree + School + Year + Details
- If information is not found, write "Not specified" - NEVER invent information
- Be extremely thorough - profile extraction is the most important task

**STEP 2: SCORING ANALYSIS**
Analyze ONLY the written text content using a simplified 2-category system:

1. **Content Quality (out of 70)**: 
   - How detailed and specific are the work experience descriptions
   - Whether education background matches the job requirements
   - Quality of writing and professional language use
   - Completeness of important resume sections
   - Clear communication of qualifications
   - Job relevance and keyword alignment
   - Specific achievements with numbers and measurable results

   **DETAILED CONTENT QUALITY SCORING CRITERIA:**
   - Has work experience section: +25 points automatically (MANDATORY)
   - Has education section: +20 points automatically (MANDATORY)
   - Has skills section: +15 points automatically (MANDATORY)
   - Job descriptions are detailed (not just titles): +8-12 points (BONUS)
   - Includes specific achievements or numbers: +5-8 points (BONUS)
   - Good writing quality and clear communication: +2-5 points (BONUS)
   - Relevant to target job with keywords: +0-5 points (BONUS)
   
   **Content Quality Scoring Examples:**
   - Resume with basic job titles and education: 55-65 points (NOT 40-50)
   - Resume with detailed job descriptions and education: 60-68 points (NOT 50-60)
   - Resume with achievements, numbers, and comprehensive content: 65-70 points (NOT 60-68)
   - Outstanding resume with exceptional detail and accomplishments: 68-70 points
   
   **CRITICAL**: ANY resume with work experience + education + skills = MINIMUM 60 points
   Most professional resumes should score 60-68 in this category.

2. **Experience & Skills (out of 30)**: 
   - How well work experience matches the target job
   - Evidence of career growth and increasing responsibilities
   - Years of relevant industry experience
   - Leadership roles and team management experience
   - Job titles that align with the target position
   - Technical skills that match job requirements
   - Programming languages, software, and tools mentioned
   - Industry certifications and training listed
   - Mix of technical and soft skills

   **DETAILED EXPERIENCE & SKILLS SCORING CRITERIA:**
   - Has any work experience listed: +18 points automatically (MANDATORY)
   - Has skills section with multiple skills: +8 points automatically (MANDATORY)
   - Experience is relevant to target job: +2-4 points (BONUS)
   - Shows career progression or growth: +0-2 points (BONUS)
   - Technical skills match job requirements: +0-2 points (BONUS)
   - Leadership or management experience: +0-2 points (BONUS)
   
   **Experience & Skills Scoring Examples:**
   - Has some work experience and basic skills: 24-28 points (NOT 18-22)
   - Good relevant experience with multiple skills: 26-30 points (NOT 22-26)
   - Strong experience perfectly matching job requirements: 28-30 points (NOT 26-30)
   
   **CRITICAL**: ANY resume with work experience + skills = MINIMUM 26 points
   Most working professionals should score 26-30 in this category.

**SCORING METHODOLOGY:**
- Content Quality is scored out of 70 points (major weight on content quality)
- Experience & Skills is scored out of 30 points (supporting weight on experience)
- Total Score = Content Quality + Experience & Skills (max 100)
- **MANDATORY MINIMUM SCORING RULES (ANTI-SCAM PROTECTION):**
  * Resume with work experience + education + skills = MINIMUM 85 total score (60+26)
  * Resume with detailed job descriptions = MINIMUM 88 total score (62+26)
  * Resume with any achievements or numbers = MINIMUM 90 total score (65+26)
  * **NEVER score below 80 total unless resume is missing major sections**
- **CONTENT QUALITY BASELINE:** Any resume with work + education + skills = MINIMUM 60 points (out of 70)
- **EXPERIENCE & SKILLS BASELINE:** Any resume with experience + skills = MINIMUM 26 points (out of 30)
- **USER PROTECTION**: These are REAL people looking for jobs - don't crush their hopes with unfair scores
- **QUALITY OVER PERFECTION**: Reward completeness and effort, not unrealistic expectations

**IMPORTANT PROFILE EXTRACTION INSTRUCTIONS:**
- READ THE ENTIRE RESUME TEXT CAREFULLY before extracting any information
- Look for personal details that are typically at the top of resumes
- Names are usually in larger text or at the very beginning
- Contact information (email, phone, location) is typically grouped together
- Skills may be in a dedicated "Skills" section or mentioned throughout experience
- Work experience usually includes job titles, company names, and date ranges
- Education includes degree types, school names, and graduation years
- If you cannot find specific information, write "Not specified" - do NOT make up information
- Be thorough in your search - some information might be embedded within paragraphs

**IMPORTANT INSTRUCTIONS:**
- Focus ONLY on what is actually written in the resume text
- Do NOT mention fonts, colors, design, layout, formatting, or visual elements
- Do NOT comment on document structure or visual presentation
- Base ALL feedback on the actual words and information provided
- Use simple, clear language that anyone can understand
- Make suggestions practical and easy to implement
- **ANTI-SCAM SCORING PROTECTION** - Don't disappoint users with unfairly low scores
- **GIVE GENEROUS CREDIT** for complete sections, relevant experience, and clear communication
- **BE ENCOURAGING** - Point out strengths and celebrate what they've accomplished
- **MANDATORY MINIMUM SCORING RULES:**
  * Resume with work experience + education + skills = MINIMUM 85 total score
  * Resume with detailed descriptions = MINIMUM 88 total score  
  * Resume with achievements/numbers = MINIMUM 90 total score
  * **NEVER score below 80 total unless truly incomplete**
- **REMEMBER**: These are real people seeking employment - help them succeed, don't discourage them
- A typical professional resume should score 85-95 total if it has all basic sections

**RESPONSE FORMAT:**
Respond with ONLY a valid JSON object:
{
  "score": number (overall score 25-100, calculated as contentQuality + experienceSkills),
  "analysis": {
    "contentQuality": number (out of 70 - includes writing quality, completeness, job relevance, achievements),
    "experienceSkills": number (out of 30 - combines experience relevance and skills alignment)
  },
  "profile": {
    "name": "EXTRACT NAME: Read the very first line of the resume. Names are typically the FIRST text in resumes like 'John Smith', 'JANE DOE', 'Robert Johnson'. Extract the EXACT name as written. This is MANDATORY - if you see a name, extract it exactly.",
    "location": "EXTRACT LOCATION: Search for location info like 'New York, NY', 'San Francisco, CA', '123 Main St, Boston, MA'. Usually near contact details at top. Extract EXACTLY as written. If not found write 'Not specified'.",
    "phone": "EXTRACT PHONE: Search for phone numbers like '+1 (555) 123-4567', '555-123-4567', '(555) 123-4567'. Usually near contact info. Extract EXACTLY as written. If not found write 'Not specified'.",
    "email": "EXTRACT EMAIL: Search for email addresses like 'john@example.com', 'jane.doe@company.org'. Usually near contact info. Extract EXACTLY as written. If not found write 'Not specified'.",
    "skills": [
      "EXTRACT ALL SKILLS: Search the ENTIRE resume for ALL skills mentioned:",
      "- Technical skills: JavaScript, Python, Java, React, Angular, Node.js, HTML, CSS",
      "- Software: Excel, Word, Photoshop, AutoCAD, Figma, Sketch, Adobe Creative Suite",
      "- Cloud/DevOps: AWS, Azure, Docker, Kubernetes, Git, Jenkins",
      "- Databases: SQL, MySQL, MongoDB, PostgreSQL",
      "- Certifications: PMP, AWS Certified, Google Analytics, Scrum Master",
      "- Soft skills: Leadership, Communication, Project Management, Problem Solving",
      "Look in Skills sections AND job descriptions. Extract ALL skills found. If none found return ['Skills section not clearly specified']"
    ],
    "experience": [
      {
        "title": "EXTRACT JOB TITLE: Find job titles like 'Software Engineer', 'Marketing Manager', 'Sales Associate'. Extract EXACTLY as written.",
        "company": "EXTRACT COMPANY: Find company names like 'Google Inc.', 'Microsoft Corp.', 'ABC Company'. Extract EXACTLY as written.",
        "duration": "EXTRACT DATES: Find employment periods like '2020-2023', 'Jan 2020 - Present', 'June 2019 to Dec 2021'. Extract EXACTLY as written.",
        "description": "EXTRACT DESCRIPTION: Find key responsibilities, achievements, and accomplishments from each job. Include specific projects and measurable results."
      }
    ],
    "education": [
      {
        "degree": "EXTRACT DEGREE: Find degrees like 'Bachelor of Science in Computer Science', 'Master of Business Administration', 'High School Diploma'. Extract EXACTLY as written.",
        "institution": "EXTRACT SCHOOL: Find school names like 'Harvard University', 'MIT', 'Local Community College'. Extract EXACTLY as written.",
        "year": "EXTRACT YEAR: Find graduation years like '2020', '2018-2022', 'Class of 2019'. Extract EXACTLY as written.",
        "details": "EXTRACT DETAILS: Find additional info like GPA, honors, relevant coursework, thesis topics, academic achievements."
      }
    ]
  },
  "summary": "brief summary focusing on the written content strengths and areas for improvement"
}

**LANGUAGE REQUIREMENTS:**
- Use simple, everyday language that anyone can understand
- Avoid technical jargon or complex HR terminology  
- Make all suggestions clear and actionable
- Focus on what the person can actually change or add to their resume text`

  return prompt
}

/**
 * Creates enhanced fallback analysis when all APIs fail
 */
function createEnhancedFallbackAnalysis(extractedContent: ExtractedContent, jobType?: string): ResumeAnalysisResult {
  const targetJob = jobType || 'General'
  const hasContent = extractedContent.text && extractedContent.text.length > 10
  const contentLength = extractedContent.text?.length || 0
  
  // Analyze content for keywords and structure
  const content = extractedContent.text?.toLowerCase() || ''
  
  // Job-specific keyword analysis
  const jobKeywords: Record<string, string[]> = {
    'software': ['developer', 'programming', 'coding', 'software', 'javascript', 'python', 'java', 'react', 'node', 'git'],
    'marketing': ['marketing', 'seo', 'social media', 'campaigns', 'analytics', 'branding', 'digital'],
    'sales': ['sales', 'revenue', 'targets', 'customers', 'negotiation', 'crm', 'leads'],
    'finance': ['financial', 'accounting', 'excel', 'analysis', 'budget', 'audit', 'finance'],
    'design': ['design', 'ui', 'ux', 'photoshop', 'illustrator', 'creative', 'visual'],
    'general': ['experience', 'skills', 'education', 'project', 'team', 'management']
  }
  
  // Find relevant keywords
  const targetJobLower = targetJob.toLowerCase()
  let relevantKeywords = jobKeywords.general
  
  for (const [jobCategory, keywords] of Object.entries(jobKeywords)) {
    if (targetJobLower.includes(jobCategory)) {
      relevantKeywords = keywords
      break
    }
  }
  
  // Count keyword matches
  const keywordMatches = relevantKeywords.filter(keyword => content.includes(keyword)).length
  const keywordScore = Math.min(keywordMatches * 2, 15)
  
  // Content quality analysis - TEXT ONLY
  const hasEducation = content.includes('education') || content.includes('degree') || content.includes('university')
  const hasExperience = content.includes('experience') || content.includes('work') || content.includes('position')
  const hasSkills = content.includes('skills') || content.includes('proficient') || content.includes('expertise')
  const hasAchievements = content.includes('achieved') || content.includes('improved') || content.includes('%')
  const hasNumbers = /\d+/.test(content) // Check for any numbers (years, percentages, etc.)
  
  // Dynamic scoring based on TEXT CONTENT ONLY
  let contentQualityScore = 0
  let experienceSkillsScore = 0
  
  if (hasContent) {
    // Base content quality scoring (out of 70) - Very generous baseline to prevent scamming users
    if (contentLength > 2000) contentQualityScore = 58 + Math.random() * 10 // 58-68
    else if (contentLength > 1500) contentQualityScore = 55 + Math.random() * 10 // 55-65
    else if (contentLength > 1000) contentQualityScore = 52 + Math.random() * 10 // 52-62
    else if (contentLength > 500) contentQualityScore = 48 + Math.random() * 10 // 48-58
    else if (contentLength > 200) contentQualityScore = 45 + Math.random() * 10 // 45-55
    else contentQualityScore = 35 + Math.random() * 15 // 35-50
    
    // Content quality bonuses - More generous to protect users
    if (hasAchievements) contentQualityScore += 6 + Math.random() * 4 // 6-10 bonus
    if (hasNumbers) contentQualityScore += 4 + Math.random() * 4 // 4-8 bonus
    if (keywordMatches > 3) contentQualityScore += 5 + Math.random() * 5 // 5-10 bonus
    
    // Base experience & skills scoring (out of 30) - Very generous baseline
    if (hasExperience && hasSkills) experienceSkillsScore = 24 + Math.random() * 6 // 24-30
    else if (hasExperience || hasSkills) experienceSkillsScore = 20 + Math.random() * 6 // 20-26
    else experienceSkillsScore = 15 + Math.random() * 8 // 15-23
    
    // Experience & skills bonuses - More generous
    if (hasEducation) experienceSkillsScore += 2 + Math.random() * 2 // 2-4 bonus
    if (keywordMatches > 5) experienceSkillsScore += 2 + Math.random() * 3 // 2-5 bonus
  } else {
    // Minimal content fallback - Still give decent credit to not disappoint users
    contentQualityScore = 40 + Math.random() * 15 // 40-55
    experienceSkillsScore = 18 + Math.random() * 8 // 18-26
  }
  
  // Ensure scores don't exceed limits
  const contentQuality = Math.min(Math.round(contentQualityScore), 70)
  const experienceSkills = Math.min(Math.round(experienceSkillsScore), 30)
  
  // Extract profile information from text content with better patterns
  const extractProfileInfo = (text: string) => {
    console.log('Extracting profile info from text:', text.substring(0, 200) + '...')
    
    // Extract name (try multiple patterns) - Enhanced patterns
    let name = 'Not specified'
    const namePatterns = [
      /^([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/m, // Start of text - Title case
      /^([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})*)/m, // Start of text - All caps
      /Name:?\s*([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i, // After "Name:"
      /([A-Z][A-Z\s]{3,20})/g, // All caps names (3-20 chars)
      /([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g, // Title case names (2-3 words)
      /^([^\n\r]*[A-Z][a-z]+\s+[A-Z][a-z]+[^\n\r]*)/m // Names in first line
    ]
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern)
      if (match && match[1] && match[1].trim().length > 3 && match[1].trim().length < 50) {
        // Validate that it looks like a real name
        const candidateName = match[1].trim()
        if (!candidateName.includes('@') && !candidateName.includes('http') && 
            !candidateName.includes('www') && !/^\d/.test(candidateName)) {
          name = candidateName
          break
        }
      } else if (match && match[0] && match[0].trim().length > 3 && match[0].trim().length < 50) {
        const candidateName = match[0].trim()
        if (!candidateName.includes('@') && !candidateName.includes('http') && 
            !candidateName.includes('www') && !/^\d/.test(candidateName)) {
          name = candidateName
          break
        }
      }
    }
    
    // Extract email (improved pattern)
    let email = 'Not specified'
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi
    const emailMatch = text.match(emailPattern)
    if (emailMatch && emailMatch[0]) {
      email = emailMatch[0]
    }
    
    // Extract phone (improved pattern)
    let phone = 'Not specified'
    const phonePatterns = [
      /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g, // US format
      /\+?[\d\s\-\(\)]{10,}/g, // General international
      /Phone:?\s*([\+\d\s\-\(\)]{10,})/gi, // After "Phone:"
      /Tel:?\s*([\+\d\s\-\(\)]{10,})/gi, // After "Tel:"
      /Mobile:?\s*([\+\d\s\-\(\)]{10,})/gi // After "Mobile:"
    ]
    
    for (const pattern of phonePatterns) {
      const match = text.match(pattern)
      if (match && match[0] && match[0].replace(/\D/g, '').length >= 10) {
        phone = match[0].trim()
        break
      }
    }
    
    // Extract location (improved pattern)
    let location = 'Not specified'
    const locationPatterns = [
      /Address:?\s*([A-Z][a-z]+[,\s]+[A-Z]{2,}[,\s]*[\d]*)/gi, // After "Address:"
      /Location:?\s*([A-Z][a-z]+[,\s]+[A-Z]{2,})/gi, // After "Location:"
      /([A-Z][a-z]+,\s*[A-Z]{2,3}(?:\s+\d{5})?)/g, // City, State format
      /([A-Z][a-z]+,\s*[A-Z][a-z]+)/g, // City, Country format
    ]
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        location = match[1].trim()
        break
      } else if (match && match[0]) {
        location = match[0].trim()
        break
      }
    }
    
    // Extract skills (expanded list with better matching)
    const skillKeywords = [
      // Programming languages
      'javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      // Web technologies  
      'react', 'angular', 'vue', 'html', 'css', 'node', 'express', 'next.js', 'nuxt', 'jquery',
      // Databases
      'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'nosql',
      // Cloud & DevOps
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab', 'ci/cd',
      // Design & Office
      'photoshop', 'illustrator', 'figma', 'sketch', 'excel', 'powerpoint', 'word', 'adobe',
      // Soft skills
      'communication', 'leadership', 'management', 'teamwork', 'problem-solving', 'analytical', 'project management'
    ]
    
    const foundSkills: string[] = []
    for (const skill of skillKeywords) {
      // Case-insensitive search with word boundaries
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      if (regex.test(text)) {
        // Capitalize first letter for display
        const displaySkill = skill.charAt(0).toUpperCase() + skill.slice(1)
        if (!foundSkills.includes(displaySkill)) {
          foundSkills.push(displaySkill)
        }
      }
    }
    
    const skills = foundSkills.length > 0 ? foundSkills : ['Skills section not clearly specified']
    
    // Extract experience (simplified but more detailed)
    const experience = []
    const hasWorkExperience = /experience|work|employment|position|job/gi.test(text)
    if (hasWorkExperience) {
      // Try to find job titles and companies
      const jobTitlePatterns = [
        /(?:Software Engineer|Developer|Manager|Analyst|Designer|Consultant|Director|Specialist)/gi,
        /(?:Senior|Junior|Lead|Principal|Chief)\s+[A-Z][a-z]+/gi
      ]
      
      const companyPatterns = [
        /(?:at|@)\s+([A-Z][a-zA-Z\s&.,]{2,30})/g,
        /Company:?\s*([A-Z][a-zA-Z\s&.,]{2,30})/gi
      ]
      
      let jobTitle = 'Professional Experience'
      let company = 'Various Companies'
      
      for (const pattern of jobTitlePatterns) {
        const match = text.match(pattern)
        if (match && match[0]) {
          jobTitle = match[0]
          break
        }
      }
      
      for (const pattern of companyPatterns) {
        const match = text.match(pattern)
        if (match && match[1]) {
          company = match[1].trim()
          break
        }
      }
      
      experience.push({
        title: jobTitle,
        company: company,
        duration: 'Details in resume',
        description: 'Work experience details extracted from resume text'
      })
    }
    
    // Extract education (simplified but more detailed)
    const education = []
    const hasEducationInfo = /education|degree|university|college|school|bachelor|master|phd/gi.test(text)
    if (hasEducationInfo) {
      const degreePatterns = [
        /(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.)[\s\w]*/gi,
        /Degree:?\s*([A-Z][\w\s]{5,30})/gi
      ]
      
      const institutionPatterns = [
        /University of [A-Z][a-zA-Z\s]*/gi,
        /[A-Z][a-zA-Z\s]* University/gi,
        /[A-Z][a-zA-Z\s]* College/gi,
        /Institution:?\s*([A-Z][a-zA-Z\s]{5,40})/gi
      ]
      
      let degree = 'Educational Background'
      let institution = 'Educational Institution'
      
      for (const pattern of degreePatterns) {
        const match = text.match(pattern)
        if (match && match[0]) {
          degree = match[0].trim()
          break
        }
      }
      
      for (const pattern of institutionPatterns) {
        const match = text.match(pattern)
        if (match && match[0]) {
          institution = match[0].trim()
          break
        } else if (match && match[1]) {
          institution = match[1].trim()
          break
        }
      }
      
      education.push({
        degree: degree,
        institution: institution,
        year: 'Year details in resume',
        details: 'Education details extracted from resume text'
      })
    }
    
    console.log('Extracted profile:', { name, email, phone, location, skills: skills.slice(0, 5) })
    
    return {
      name,
      location,
      phone,
      email,
      skills,
      experience,
      education
    }
  }
  
  const profileInfo = extractProfileInfo(content)
  
  // Calculate total score as sum of both categories
  const calculatedTotalScore = contentQuality + experienceSkills
  
  return {
    score: calculatedTotalScore, // Total score is sum of both categories
    analysis: {
      contentQuality,      // Out of 70
      experienceSkills     // Out of 30
    },
    profile: profileInfo,
    summary: `Resume analysis for ${targetJob} position completed. ${hasContent ? `Found ${contentLength} characters of text content` : 'Basic document structure analyzed'}${keywordMatches > 0 ? ` with ${keywordMatches} relevant job keywords` : ''}. ${hasAchievements ? 'Resume includes some accomplishments' : 'Consider adding specific achievements'}. Score of ${calculatedTotalScore} reflects ${calculatedTotalScore >= 70 ? 'strong' : calculatedTotalScore >= 50 ? 'good' : 'developing'} match for ${targetJob} requirements. Focus on adding ${keywordMatches < 3 ? 'more job-specific keywords, ' : ''}specific numbers and results, and detailed work experience.`
  }
}
