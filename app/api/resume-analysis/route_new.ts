import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'

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
  improvements: string[]
  missingSkills: string[]
}

/**
 * Extract text from PDF using pdf-parse
 */
async function extractPDFText(buffer: Buffer): Promise<string> {
  try {
    console.log('📄 Starting PDF text extraction with pdf-parse...')
    const data = await pdf(buffer)
    const extractedText = data.text.trim()
    
    console.log(`✅ PDF text extraction successful: ${extractedText.length} characters`)
    console.log('📝 Extracted text preview:', extractedText.substring(0, 500) + '...')
    
    return extractedText
  } catch (error) {
    console.error('❌ PDF text extraction error:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

/**
 * Convert PDF text to base64 and log it
 */
function convertTextToBase64(text: string): string {
  console.log('🔄 Converting extracted text to base64...')
  const base64Text = Buffer.from(text, 'utf-8').toString('base64')
  console.log(`✅ Text converted to base64: ${base64Text.length} characters`)
  console.log('📋 Base64 text (first 500 chars):', base64Text.substring(0, 500) + '...')
  console.log('📋 Full Base64 text:', base64Text)
  return base64Text
}

/**
 * Analyze resume with Groq's llama3-70b-8192 model
 */
async function analyzeResumeWithGroq(text: string, base64Text: string): Promise<ResumeAnalysisResult> {
  const groqApiKey = process.env.GROQ_API_KEY
  
  if (!groqApiKey) {
    throw new Error('Groq API key not configured')
  }

  console.log('🤖 Starting resume analysis with llama3-70b-8192...')

  const prompt = `You are an expert resume analyzer and career counselor. Analyze the following resume text and provide a comprehensive analysis.

RESUME TEXT:
${text}

BASE64 VERSION (for reference):
${base64Text.substring(0, 1000)}...

Please provide a detailed analysis in the following JSON format:

{
  "score": [overall score out of 100],
  "analysis": {
    "contentQuality": [score out of 70 - writing quality, completeness, job relevance],
    "experienceSkills": [score out of 30 - experience relevance and skills alignment]
  },
  "profile": {
    "name": "[extracted full name]",
    "location": "[extracted location/address]", 
    "phone": "[extracted phone number]",
    "email": "[extracted email address]",
    "skills": ["skill1", "skill2", "skill3", ...],
    "experience": [
      {
        "title": "[job title]",
        "company": "[company name]", 
        "duration": "[employment duration]",
        "description": "[job description/responsibilities]"
      }
    ],
    "education": [
      {
        "degree": "[degree name]",
        "institution": "[school/university name]",
        "year": "[graduation year or duration]", 
        "details": "[additional details like GPA, honors, etc.]"
      }
    ]
  },
  "summary": "[2-3 sentence professional summary of the candidate]",
  "improvements": [
    "[improvement suggestion 1]",
    "[improvement suggestion 2]", 
    "[improvement suggestion 3]"
  ],
  "missingSkills": [
    "[missing skill 1 that would strengthen the resume]",
    "[missing skill 2 that would strengthen the resume]",
    "[missing skill 3 that would strengthen the resume]"
  ]
}

IMPORTANT INSTRUCTIONS:
1. Extract ALL information accurately from the resume text
2. If any profile information is missing, use empty string or empty array
3. Provide practical improvement suggestions
4. Suggest relevant missing skills based on the career field
5. Be thorough in extracting work experience and education details
6. Maintain professional tone in summary and suggestions
7. Score based on completeness, clarity, and professional presentation
8. Return ONLY valid JSON, no additional text or markdown formatting`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
      signal: AbortSignal.timeout(60000) // 60 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Groq API error (${response.status}):`, errorText)
      throw new Error(`Groq API error: ${response.status}`)
    }

    const result = await response.json()
    const analysisText = result.choices?.[0]?.message?.content?.trim()
    
    if (!analysisText) {
      throw new Error('No analysis content received from Groq')
    }

    console.log('📝 Raw Groq response:', analysisText.substring(0, 500) + '...')

    // Clean and parse JSON response
    let cleanedText = analysisText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/`/g, '')
      .trim()

    // Extract JSON from response if it's wrapped in other text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      cleanedText = jsonMatch[0]
    }

    const analysis = JSON.parse(cleanedText) as ResumeAnalysisResult
    
    console.log('✅ Resume analysis completed successfully')
    console.log('📊 Analysis summary:', {
      score: analysis.score,
      profileName: analysis.profile?.name,
      skillsCount: analysis.profile?.skills?.length || 0,
      experienceCount: analysis.profile?.experience?.length || 0,
      educationCount: analysis.profile?.education?.length || 0
    })

    return analysis

  } catch (error) {
    console.error('❌ Resume analysis error:', error)
    
    // Provide fallback analysis
    return {
      score: 60,
      analysis: {
        contentQuality: 40,
        experienceSkills: 20
      },
      profile: {
        name: "Name not extracted",
        location: "Location not provided", 
        phone: "Phone not provided",
        email: "Email not provided",
        skills: [],
        experience: [],
        education: []
      },
      summary: "Resume analysis could not be completed. Please ensure the PDF contains clear, readable text.",
      improvements: [
        "Ensure all text in the PDF is clear and readable",
        "Include complete contact information",
        "Add relevant skills and experience details"
      ],
      missingSkills: [
        "Technical skills relevant to your field",
        "Soft skills like communication and leadership", 
        "Industry-specific certifications"
      ]
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting PDF-only resume analysis...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      console.error('❌ No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log(`📁 File received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`)

    // Only support PDF files
    if (file.type !== 'application/pdf') {
      console.error(`❌ Unsupported file type: ${file.type}`)
      return NextResponse.json(
        { error: 'Only PDF files are supported. Please upload a PDF resume.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    console.log('📋 File converted to buffer successfully')

    // Convert entire buffer to base64 and log it
    const fileBase64 = buffer.toString('base64')
    console.log('📄 PDF File Base64 (length):', fileBase64.length)
    console.log('📄 PDF File Base64 (first 500 chars):', fileBase64.substring(0, 500) + '...')
    console.log('📄 Full PDF File Base64:', fileBase64)

    // Extract text from PDF
    const extractedText = await extractPDFText(buffer)
    
    if (!extractedText || extractedText.length < 50) {
      console.error('❌ Insufficient text extracted from PDF')
      return NextResponse.json(
        { error: 'Could not extract readable text from PDF. Please ensure the PDF contains selectable text.' },
        { status: 400 }
      )
    }

    // Convert extracted text to base64 and log it  
    const textBase64 = convertTextToBase64(extractedText)

    // Analyze resume with Groq llama3-70b-8192
    const analysisResult = await analyzeResumeWithGroq(extractedText, textBase64)

    console.log('✅ Resume analysis completed successfully')

    return NextResponse.json({
      success: true,
      analysisResult,
      extractedText: extractedText.substring(0, 1000) + '...' // First 1000 chars for frontend display
    })

  } catch (error) {
    console.error('❌ Resume analysis error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false 
      },
      { status: 500 }
    )
  }
}
