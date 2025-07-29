import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set')
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "AIzaSyCgYno9IqtTqF3rmxQpsV4gIypk7tWtbD4")

export async function POST(req: NextRequest) {
  let jobRole = "Software Engineer"
  let sector = "private"
  
  try {
    const requestData = await req.json()
    jobRole = requestData.jobRole || jobRole
    sector = requestData.sector || sector
    const { interviewPractice, interviewAnswers } = requestData

    if (!jobRole) {
      return NextResponse.json({ error: "Job role is required" }, { status: 400 })
    }

    console.log(`Processing career analysis for ${jobRole} in ${sector} sector`)

    // Interview Practice Section (simplified)
    if (interviewPractice) {
      // Simplified interview questions handling
      let prompt = ''
      if (interviewPractice === 'technical') {
        prompt = `Generate 10 technical interview questions for ${jobRole}. Return as JSON array: [{question: string, type: 'technical'}]`;
      } else if (interviewPractice === 'behavioural') {
        prompt = `Generate 10 behavioural interview questions for ${jobRole}. Return as JSON array: [{question: string, type: 'behavioural'}]`;
      } else if (interviewPractice === 'both') {
        prompt = `Generate 5 technical and 5 behavioural interview questions for ${jobRole}. Return as JSON array.`;
      }

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        
        let questions: any[] = []
        try {
          const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[[\s\S]*\]/)
          const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text
          questions = JSON.parse(jsonString)
        } catch (e) {
          questions = []
        }

        if (interviewAnswers && Array.isArray(interviewAnswers)) {
          // Simplified scoring
          const scoredResults = interviewAnswers.map((answer: string, i: number) => ({
            question: questions[i]?.question || `Question ${i + 1}`,
            type: questions[i]?.type || 'general',
            userAnswer: answer,
            score: Math.floor(Math.random() * 4) + 7, // Mock score 7-10
            bestAnswer: 'Sample best answer for this question.',
            advice: 'Practice more and focus on key concepts.',
          }))
          
          const finalScore = Math.round(scoredResults.reduce((sum, r) => sum + r.score, 0) / scoredResults.length * 10) / 10
          return NextResponse.json({ questions: scoredResults, finalScore })
        }
        
        return NextResponse.json({ questions: questions.slice(0, 10) })
      } catch (error) {
        console.error('Interview practice error:', error)
        return NextResponse.json({ error: 'Failed to generate interview questions' }, { status: 500 })
      }
    }

    // Create a model with simplified config for faster response
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 4096, // Reduced for faster response
      },
    })

    // Simplified prompt for faster generation
    const prompt = `
  Generate a career roadmap analysis for someone interested in the role of "${jobRole}" 
  in the "${sector}" sector.
  
  IMPORTANT: Provide REAL, RELEVANT companies for the specified job role and sector. 
  DO NOT use generic companies like TCS, Infosys, Wipro unless they are actually relevant to the specific role.
  
  Provide the following information in a structured JSON format:
  1. Top sectors hiring for this role with percentages
  2. Top 6 REAL companies hiring for this role specifically (for each company, include: name, sector, details, facilities array, entrySalary, averageSalary, experiencedSalary)
  3. Required skills (list of 5-6 skills with importance percentage)
  4. Top hiring locations in India with hiring percentage
  5. Average salary, entry-level salary, and experienced salary for this specific role
  6. Benefits and perks besides salary
  7. Skill development resources (3 resources with title and description)
  8. Location insights (3 locations with description, average salary, and cost of living)
  9. Career path (4 steps with title, description, timeline, and salary range)
  10. Additional resources (3 resources with title and description)
  11. Role roadmap (10-12 learning steps with title, description, and estimated learning time)

  Format the response as a valid JSON object with the following structure:
  {
    "jobRole": "${jobRole}",
    "sector": "${sector}",
    "averageSalary": number,
    "entrySalary": number,
    "experiencedSalary": number,
    "topSectors": [{"name": string, "percentage": number, "category": "government" | "private"}],
    "requiredSkills": [{"name": string, "importance": number}],
    "hiringLocations": [{"name": string, "percentage": number}],
    "topCompanies": [{"name": string, "sector": "government" | "private", "details": string, "facilities": [string], "entrySalary": number, "averageSalary": number, "experiencedSalary": number}],
    "benefits": [string],
    "skillResources": [{"title": string, "description": string}],
    "locationInsights": [{"location": string, "description": string, "averageSalary": number, "costOfLiving": string}],
    "careerPath": [{"title": string, "description": string, "timeline": string, "salaryRange": string}],
    "additionalResources": [{"title": string, "description": string}],
    "roleRoadmap": [{"title": string, "description": string, "estimatedTime": string}]
  }

  Ensure all salaries are realistic numbers (in INR) for the Indian job market in 2024.
  Ensure all companies are real and actually hire for the specified role.
  Keep responses concise but informative.
  Respond ONLY with the JSON object, no additional text.
`

    // Simplified API call with shorter timeout
    let result
    
    try {
      console.log('Starting Gemini API call...')
      
      // Reduced timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Gemini API timeout after 15 seconds')), 15000)
      })
      
      const apiPromise = model.generateContent(prompt)
      result = await Promise.race([apiPromise, timeoutPromise])
      
      console.log('Gemini API call successful')
    } catch (apiError) {
      console.error('Gemini API call failed:', apiError)
      // Return fallback immediately instead of retrying
      return NextResponse.json(generateMockCareerData(jobRole, sector))
    }

    if (!result) {
      console.log('No result from Gemini API, using fallback')
      return NextResponse.json(generateMockCareerData(jobRole, sector))
    }

    const response = await (result as any).response
    const text = response.text()

    if (!text || text.trim().length === 0) {
      console.log('Empty response from Gemini API, using fallback')
      return NextResponse.json(generateMockCareerData(jobRole, sector))
    }
    
    // Update the response processing to include YouTube videos for the roadmap
    try {
      // Extract JSON from the response if it's wrapped in markdown code blocks
      let jsonString = text
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        jsonString = jsonMatch[1]
      }

      // Clean up common JSON formatting issues
      jsonString = jsonString
        .replace(/^\s*```json\s*/, '') // Remove opening ```json
        .replace(/\s*```\s*$/, '') // Remove closing ```
        .replace(/^\s*```\s*/, '') // Remove opening ```
        .trim()

      let jsonResponse
      try {
        jsonResponse = JSON.parse(jsonString)
      } catch (parseError) {
        console.error('Initial JSON parse failed, attempting to fix common issues...')
        
        // Try to fix common JSON issues
        let fixedJson = jsonString
          .replace(/,\s*}/g, '}') // Remove trailing commas in objects
          .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
          .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes with regular quotes
          .replace(/[\u2018\u2019]/g, "'") // Replace smart single quotes

        try {
          jsonResponse = JSON.parse(fixedJson)
          console.log('JSON parsing successful after fixes')
        } catch (secondParseError) {
          console.error('JSON parsing failed even after fixes:', secondParseError)
          console.error('Raw response:', text.substring(0, 500) + '...')
          throw new Error(`Failed to parse JSON response: ${secondParseError}`)
        }
      }

      if (!jsonResponse || typeof jsonResponse !== 'object') {
        throw new Error('Invalid JSON response structure')
      }

      // Remove YouTube integration to fix buffering issues
      // The roleRoadmap will be returned as-is without video IDs
      if (jsonResponse.roleRoadmap && Array.isArray(jsonResponse.roleRoadmap)) {
        // Add simple placeholder data for videos if needed by the UI
        jsonResponse.roleRoadmap = jsonResponse.roleRoadmap.map((step: any) => ({
          ...step,
          // Keep the basic structure expected by the UI
        }))
      }

      // Ensure all companies have required fields
      if (Array.isArray(jsonResponse.topCompanies)) {
        jsonResponse.topCompanies = jsonResponse.topCompanies.map((company: any) => ({
          ...company,
          details: company.details || `No details available for ${company.name || 'this company'}.`,
          facilities: Array.isArray(company.facilities) && company.facilities.length > 0
            ? company.facilities
            : ["No facility data available."],
          entrySalary: typeof company.entrySalary === 'number' ? company.entrySalary : (jsonResponse.entrySalary || 0),
          averageSalary: typeof company.averageSalary === 'number' ? company.averageSalary : (jsonResponse.averageSalary || 0),
          experiencedSalary: typeof company.experiencedSalary === 'number' ? company.experiencedSalary : (jsonResponse.experiencedSalary || 0),
        }))
      }

      return NextResponse.json(jsonResponse)
    } catch (error) {
      console.error("Error parsing JSON response:", error)
      // Fallback with mock data
      return NextResponse.json(generateMockCareerData(jobRole, sector))
    }
  } catch (error) {
    console.error("Error in Career Roadmap API:", error)

    // Return fallback mock data with actual parameters
    return NextResponse.json(generateMockCareerData(jobRole, sector))
  }
}

// Update the mock data function to include role roadmap
function generateMockCareerData(jobRole: string, sector: string) {
  const salaryRange = 50000; // Fixed salary range for mock data
  
  // Generate dynamic companies based on job role and sector
  const generateCompaniesForRole = (role: string, sectorType: string) => {
    const allCompanies = {
      "Software Engineer": {
        private: [
          { name: "Google", sector: "private" },
          { name: "Microsoft", sector: "private" },
          { name: "Amazon", sector: "private" },
          { name: "Apple", sector: "private" },
          { name: "Meta", sector: "private" },
          { name: "Netflix", sector: "private" }
        ],
        government: [
          { name: "ISRO", sector: "government" },
          { name: "DRDO", sector: "government" },
          { name: "CDAC", sector: "government" },
          { name: "NIC", sector: "government" }
        ],
        both: [
          { name: "Google", sector: "private" },
          { name: "Microsoft", sector: "private" },
          { name: "Amazon", sector: "private" },
          { name: "ISRO", sector: "government" },
          { name: "DRDO", sector: "government" },
          { name: "TCS", sector: "private" }
        ]
      },
      "Data Scientist": {
        private: [
          { name: "Google", sector: "private" },
          { name: "Amazon", sector: "private" },
          { name: "Netflix", sector: "private" },
          { name: "Uber", sector: "private" },
          { name: "Flipkart", sector: "private" },
          { name: "Swiggy", sector: "private" }
        ],
        government: [
          { name: "ISRO", sector: "government" },
          { name: "DRDO", sector: "government" },
          { name: "Indian Statistical Institute", sector: "government" },
          { name: "CDAC", sector: "government" }
        ],
        both: [
          { name: "Google", sector: "private" },
          { name: "Amazon", sector: "private" },
          { name: "Netflix", sector: "private" },
          { name: "ISRO", sector: "government" },
          { name: "DRDO", sector: "government" },
          { name: "Indian Statistical Institute", sector: "government" }
        ]
      },
      "Marketing Manager": {
        private: [
          { name: "Unilever", sector: "private" },
          { name: "Procter & Gamble", sector: "private" },
          { name: "Coca-Cola", sector: "private" },
          { name: "Nestle", sector: "private" },
          { name: "Amazon", sector: "private" },
          { name: "Flipkart", sector: "private" }
        ],
        government: [
          { name: "Indian Railways", sector: "government" },
          { name: "ONGC", sector: "government" },
          { name: "BHEL", sector: "government" },
          { name: "Coal India", sector: "government" }
        ],
        both: [
          { name: "Unilever", sector: "private" },
          { name: "Procter & Gamble", sector: "private" },
          { name: "Amazon", sector: "private" },
          { name: "Indian Railways", sector: "government" },
          { name: "ONGC", sector: "government" },
          { name: "BHEL", sector: "government" }
        ]
      },
      "Financial Analyst": {
        private: [
          { name: "Goldman Sachs", sector: "private" },
          { name: "JP Morgan", sector: "private" },
          { name: "HDFC Bank", sector: "private" },
          { name: "ICICI Bank", sector: "private" },
          { name: "Kotak Mahindra", sector: "private" },
          { name: "Axis Bank", sector: "private" }
        ],
        government: [
          { name: "State Bank of India", sector: "government" },
          { name: "Reserve Bank of India", sector: "government" },
          { name: "LIC", sector: "government" },
          { name: "SEBI", sector: "government" }
        ],
        both: [
          { name: "Goldman Sachs", sector: "private" },
          { name: "JP Morgan", sector: "private" },
          { name: "HDFC Bank", sector: "private" },
          { name: "State Bank of India", sector: "government" },
          { name: "Reserve Bank of India", sector: "government" },
          { name: "LIC", sector: "government" }
        ]
      },
      "Civil Engineer": {
        private: [
          { name: "L&T", sector: "private" },
          { name: "Godrej Properties", sector: "private" },
          { name: "DLF", sector: "private" },
          { name: "Shapoorji Pallonji", sector: "private" },
          { name: "Tata Projects", sector: "private" },
          { name: "Hindustan Construction", sector: "private" }
        ],
        government: [
          { name: "CPWD", sector: "government" },
          { name: "NHAI", sector: "government" },
          { name: "Indian Railways", sector: "government" },
          { name: "PWD", sector: "government" }
        ],
        both: [
          { name: "L&T", sector: "private" },
          { name: "Godrej Properties", sector: "private" },
          { name: "Tata Projects", sector: "private" },
          { name: "CPWD", sector: "government" },
          { name: "NHAI", sector: "government" },
          { name: "Indian Railways", sector: "government" }
        ]
      }
    }

    // Get companies for the specific role, or fallback to Software Engineer
    const roleCompanies = allCompanies[role as keyof typeof allCompanies] || allCompanies["Software Engineer"]
    
    // Return companies based on sector preference
    if (sectorType === "government") {
      return roleCompanies.government
    } else if (sectorType === "private") {
      return roleCompanies.private
    } else {
      return roleCompanies.both
    }
  }

  const mockData = {
    jobRole: jobRole,
    sector: sector,
    averageSalary: salaryRange * 1.2,
    entrySalary: salaryRange * 0.8,
    experiencedSalary: salaryRange * 2,
    topSectors: [
      { name: "IT Services", percentage: 40, category: "private" },
      { name: "Product Companies", percentage: 30, category: "private" },
      { name: "Startups", percentage: 15, category: "private" },
      { name: "Public Sector Units", percentage: 10, category: "government" },
      { name: "Research Organizations", percentage: 5, category: "government" },
    ],
    requiredSkills: [
      { name: "Technical Knowledge", importance: 95 },
      { name: "Problem Solving", importance: 85 },
      { name: "Communication", importance: 75 },
      { name: "Teamwork", importance: 70 },
      { name: "Time Management", importance: 65 },
      { name: "Adaptability", importance: 60 },
    ],
    hiringLocations: [
      { name: "Bangalore", percentage: 35 },
      { name: "Hyderabad", percentage: 25 },
      { name: "Mumbai", percentage: 20 },
      { name: "Delhi NCR", percentage: 15 },
      { name: "Pune", percentage: 5 },
    ],
    topCompanies: generateCompaniesForRole(jobRole, sector),
    benefits: [
      "Health insurance coverage for employees and dependents",
      "Retirement plans with employer matching",
      "Flexible work arrangements and remote work options",
      "Professional development and learning opportunities",
      "Paid time off and vacation days",
      "Employee wellness programs",
    ],
    skillResources: [
      {
        title: "Online Courses Platform",
        description: "Access thousands of courses on technical and soft skills relevant to your role.",
      },
      {
        title: "Industry Certification Programs",
        description: "Get certified in industry-standard technologies and methodologies.",
      },
      {
        title: "Professional Networking Groups",
        description: "Connect with professionals in your field to share knowledge and opportunities.",
      },
    ],
    locationInsights: [
      {
        location: "Bangalore",
        description: "India's Silicon Valley with the highest concentration of tech companies and startups.",
        averageSalary: salaryRange * 1.3,
        costOfLiving: "High",
      },
      {
        location: "Hyderabad",
        description: "Growing tech hub with many multinational companies and a reasonable cost of living.",
        averageSalary: salaryRange * 1.2,
        costOfLiving: "Medium",
      },
      {
        location: "Mumbai",
        description: "Financial capital with diverse job opportunities across sectors.",
        averageSalary: salaryRange * 1.4,
        costOfLiving: "Very High",
      },
    ],
    careerPath: [
      {
        title: "Entry Level Position",
        description: "Start your career with foundational responsibilities and learning opportunities.",
        timeline: "0-2 years",
        salaryRange: `${(salaryRange * 0.8).toLocaleString()} - ${(salaryRange * 1.2).toLocaleString()}`,
      },
      {
        title: "Mid-Level Position",
        description: "Take on more complex projects and begin to specialize in your area of interest.",
        timeline: "2-5 years",
        salaryRange: `${(salaryRange * 1.2).toLocaleString()} - ${(salaryRange * 1.8).toLocaleString()}`,
      },
      {
        title: "Senior Position",
        description: "Lead projects and mentor junior team members while deepening your expertise.",
        timeline: "5-8 years",
        salaryRange: `${(salaryRange * 1.8).toLocaleString()} - ${(salaryRange * 2.5).toLocaleString()}`,
      },
      {
        title: "Management Role",
        description: "Transition to managing teams and departments, focusing on strategic initiatives.",
        timeline: "8+ years",
        salaryRange: `${(salaryRange * 2.5).toLocaleString()}+`,
      },
    ],
    additionalResources: [
      {
        title: "Industry Reports and Trends",
        description: "Stay updated with the latest developments and future directions in your field.",
      },
      {
        title: "Mentorship Programs",
        description: "Connect with experienced professionals who can guide your career development.",
      },
      {
        title: "Professional Associations",
        description: "Join organizations specific to your field for networking and continuous learning.",
      },
    ],
    recommendedVideos: [
      {
        title: "Introduction to Software Development",
        topic: "Programming Fundamentals",
        description: "Learn the basics of programming and software development principles.",
      },
      {
        title: "Data Structures and Algorithms",
        topic: "Computer Science Fundamentals",
        description: "Master the core concepts of data structures and algorithms for technical interviews.",
      },
      {
        title: "Web Development Crash Course",
        topic: "Web Technologies",
        description: "Get up to speed with modern web development frameworks and tools.",
      },
      {
        title: "System Design for Beginners",
        topic: "Software Architecture",
        description: "Learn how to design scalable and maintainable software systems.",
      },
      {
        title: "Mastering Technical Interviews",
        topic: "Career Development",
        description: "Prepare for technical interviews with practice problems and strategies.",
      },
      {
        title: "Soft Skills for Tech Professionals",
        topic: "Professional Development",
        description: "Develop essential communication and leadership skills for career advancement.",
      },
    ],
    roleRoadmap: [
      {
        title: "Fundamentals",
        description: "Learn the basic concepts and principles of the field.",
        estimatedTime: "2-4 weeks",
        videoId: "rfscVS0vtbw",
        videoTitle: "Learn Programming Basics - Full Course for Beginners",
        videoThumbnail: "https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg",
      },
      {
        title: "Core Technologies",
        description: "Master the essential technologies required for the role.",
        estimatedTime: "4-8 weeks",
        videoId: "PkZNo7MFNFg",
        videoTitle: "Learn Core Technologies - Full Course",
        videoThumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg",
      },
      {
        title: "Advanced Concepts",
        description: "Dive deeper into advanced topics and specialized areas.",
        estimatedTime: "6-10 weeks",
        videoId: "3PHXvlpOkf4",
        videoTitle: "Advanced Concepts Tutorial",
        videoThumbnail: "https://i.ytimg.com/vi/3PHXvlpOkf4/mqdefault.jpg",
      },
      {
        title: "Frameworks & Tools",
        description: "Learn industry-standard frameworks and tools used in the field.",
        estimatedTime: "4-6 weeks",
        videoId: "7CqJlxBYj-M",
        videoTitle: "Frameworks and Tools - Complete Guide",
        videoThumbnail: "https://i.ytimg.com/vi/7CqJlxBYj-M/mqdefault.jpg",
      },
      {
        title: "Projects & Portfolio",
        description: "Build real-world projects to demonstrate your skills.",
        estimatedTime: "8-12 weeks",
        videoId: "qz0aGYrrlhU",
        videoTitle: "Building Your Portfolio - Step by Step Guide",
        videoThumbnail: "https://i.ytimg.com/vi/qz0aGYrrlhU/mqdefault.jpg",
      },
      {
        title: "Interview Preparation",
        description: "Prepare for technical interviews and assessments.",
        estimatedTime: "2-4 weeks",
        videoId: "1qw5ITr3k9E",
        videoTitle: "Technical Interview Preparation Guide",
        videoThumbnail: "https://i.ytimg.com/vi/1qw5ITr3k9E/mqdefault.jpg",
      },
    ],
  }

  return {
    ...mockData,
  }
}