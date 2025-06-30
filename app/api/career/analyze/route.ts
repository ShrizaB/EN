import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCgYno9IqtTqF3rmxQpsV4gIypk7tWtbD4"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { sector, jobRole, interviewPractice, interviewAnswers } = await req.json()

    if (!jobRole) {
      return NextResponse.json({ error: "Job role is required" }, { status: 400 })
    }

    // Interview Practice Section
    if (interviewPractice) {
      // Compose prompt for interview questions
      let prompt = ''
      if (interviewPractice === 'technical') {
        prompt = `Generate 10 technical interview questions for the role of "${jobRole}" in the "${sector}" sector. Return as an array of objects: [{question: string, type: 'technical'}]`;
      } else if (interviewPractice === 'behavioural') {
        prompt = `Generate 10 behavioural interview questions relevant to the role of "${jobRole}" in the "${sector}" sector. Return as an array of objects: [{question: string, type: 'behavioural'}]`;
      } else if (interviewPractice === 'both') {
        prompt = `Generate 5 technical and 5 behavioural interview questions for the role of "${jobRole}" in the "${sector}" sector. Return as an array of objects: [{question: string, type: 'technical'|'behavioural'}]`;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      let questions: any[] = []
      try {
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/````\n([\s\S]*?)\n```/)
        const jsonString = jsonMatch ? jsonMatch[1] : text
        questions = JSON.parse(jsonString)
        // Enforce correct number and type of questions
        if (interviewPractice === 'technical') {
          questions = questions.filter((q: any) => q.type === 'technical').slice(0, 10)
        } else if (interviewPractice === 'behavioural') {
          questions = questions.filter((q: any) => q.type === 'behavioural').slice(0, 10)
        } else if (interviewPractice === 'both') {
          const tech = questions.filter((q: any) => q.type === 'technical').slice(0, 5)
          const beh = questions.filter((q: any) => q.type === 'behavioural').slice(0, 5)
          questions = [...tech, ...beh].slice(0, 10)
        }
        // Always enforce max 10 questions
        questions = questions.slice(0, 10)
      } catch (e) {
        // fallback: try to parse as array
        questions = Array.isArray(text) ? text : []
      }
      // If user answers are provided, score and return results
      if (interviewAnswers && Array.isArray(interviewAnswers) && interviewAnswers.length === questions.length) {
        // For each question, get best answer and advice
        const scoredResults = []
        let totalScore = 0
        for (let i = 0; i < questions.length; i++) {
          const userAnswer = interviewAnswers[i]
          const q = questions[i]
          // Compose prompt for scoring and advice
          const evalPrompt = `Question: ${q.question}\nUser Answer: ${userAnswer}\nRole: ${jobRole}\nSector: ${sector}\nType: ${q.type}\nEvaluate the answer on a scale of 0-10.\nReturn a JSON object: {score: number (0-10), bestAnswer: string (the best possible answer), advice: string (advice to improve the answer)}`
          const evalResult = await model.generateContent(evalPrompt)
          const evalText = evalResult.response.text()
          let evalObj = { score: 0, bestAnswer: '', advice: '' }
          try {
            const jsonMatch = evalText.match(/```json\n([\s\S]*?)\n```/) || evalText.match(/````\n([\s\S]*?)\n```/)
            const jsonString = jsonMatch ? jsonMatch[1] : evalText
            evalObj = JSON.parse(jsonString)
          } catch (e) {}
          totalScore += evalObj.score || 0
          scoredResults.push({
            question: q.question,
            type: q.type,
            userAnswer,
            score: evalObj.score || 0, // out of 10
            bestAnswer: evalObj.bestAnswer || '',
            advice: evalObj.advice || '',
          })
        }
        // Final score out of 10
        const finalScore = Math.round((totalScore / questions.length) * 10) / 10
        return NextResponse.json({
          questions: scoredResults,
          finalScore, // out of 10
        })
      }
      // If no answers, just return questions
      return NextResponse.json({ questions })
    }

    // Create a model with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Generate career roadmap analysis
    const prompt = `
  Generate a detailed career roadmap analysis for someone interested in the role of "${jobRole}" 
  in the "${sector}" sector.
  
  Provide the following information in a structured JSON format:
  1. Top sectors hiring for this role with percentages (e.g., IT Services: 40%, Product Companies: 30%, etc.)
  2. Top companies hiring for this role (for each company, include: name, sector (government or private), 5-10 line details, top 10 facilities/benefits, entrySalary, averageSalary, experiencedSalary)
  3. Required skills (list of 5-7 skills with importance percentage)
  4. Top hiring locations in India with hiring percentage
  5. Average salary, entry-level salary, and experienced salary
  6. Benefits and perks besides salary
  7. Skill development resources (3-4 resources with title and description)
  8. Location insights (3-4 locations with description, average salary, and cost of living)
  9. Career path (4-5 steps with title, description, timeline, and salary range)
  10. Additional resources (3-4 resources with title and description)
  11. Recommended YouTube videos for learning key skills (4-6 videos with title, topic, and description)
  12. Role roadmap (15-20 learning steps with title, description, and estimated learning time)

  For each company in topCompanies, always include:
    - name
    - sector (government or private)
    - details (5-10 lines about the company, including what it does, its reputation, work culture, and opportunities)
    - facilities (array of top 10 facilities/benefits)
    - entrySalary (number)
    - averageSalary (number)
    - experiencedSalary (number)

  Format the response as a valid JSON object with the following structure:
  {
    "jobRole": string,
    "sector": string,
    "averageSalary": number,
    "entrySalary": number,
    "experiencedSalary": number,
    "topSectors": [{"name": string, "percentage": number, "category": "government" | "private"}],
    "requiredSkills": [{"name": string, "importance": number}],
    "hiringLocations": [{"name": string, "percentage": number}],
    "topCompanies": [{"name": string, "sector": "government" | "private"}],
    "benefits": [string],
    "skillResources": [{"title": string, "description": string}],
    "locationInsights": [{"location": string, "description": string, "averageSalary": number, "costOfLiving": string}],
    "careerPath": [{"title": string, "description": string, "timeline": string, "salaryRange": string}],
    "additionalResources": [{"title": string, "description": string}],
    "recommendedVideos": [{"title": string, "topic": string, "description": string}],
    "roleRoadmap": [{"title": string, "description": string, "estimatedTime": string}]
  }
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Use the provided YouTube API key directly
    const YOUTUBE_API_KEY = "AIzaSyCd4Nl9qskVrhr8J-Xt9pMXUaXInw_NY3k"

    // Add a function to fetch YouTube videos for each roadmap step
    async function fetchYouTubeVideos(topics: any[]) {
      const enhancedTopics = []
    
      for (const topic of topics) {
        try {
          // Modify search query to prioritize longer content
          const searchQuery = `${topic.title} full course OR comprehensive tutorial OR complete playlist`
    
          // First, prioritize finding playlists as they tend to be more comprehensive
          const playlistSearchRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&q=${encodeURIComponent(
              searchQuery,
            )}&type=playlist&key=${YOUTUBE_API_KEY}`,
          )
    
          if (!playlistSearchRes.ok) throw new Error(`YouTube API error: ${playlistSearchRes.status}`)
    
          const playlistData = await playlistSearchRes.json()
          let validItem = null
    
          // Try to find a valid playlist first
          for (const item of playlistData.items) {
            const id = item.id.playlistId
            
            // Verify playlist exists and is public
            const verifyUrl = `https://www.googleapis.com/youtube/v3/playlists?part=status,contentDetails&id=${id}&key=${YOUTUBE_API_KEY}`
            const verifyRes = await fetch(verifyUrl)
            
            if (!verifyRes.ok) continue
            
            const verifyData = await verifyRes.json()
            
            // Make sure playlist exists, is public, and has multiple items
            if (verifyData.items && 
                verifyData.items[0]?.status?.privacyStatus === "public" &&
                verifyData.items[0]?.contentDetails?.itemCount > 3) {
              validItem = {
                ...topic,
                videoId: id,
                videoTitle: item.snippet.title,
                videoThumbnail: item.snippet.thumbnails.medium.url,
                isPlaylist: true,
                itemCount: verifyData.items[0]?.contentDetails?.itemCount || 0
              }
              break
            }
          }
    
          // If no valid playlist found, try videos with duration filtering
          if (!validItem) {
            const videoSearchRes = await fetch(
              `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=relevance&q=${encodeURIComponent(
                searchQuery,
              )}&type=video&key=${YOUTUBE_API_KEY}`,
            )
    
            if (!videoSearchRes.ok) throw new Error(`YouTube API error: ${videoSearchRes.status}`)
    
            const videoData = await videoSearchRes.json()
            
            for (const item of videoData.items) {
              const videoId = item.id.videoId
              
              // Get video details including duration
              const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,status,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
              const detailsRes = await fetch(detailsUrl)
              
              if (!detailsRes.ok) continue
              
              const detailsData = await detailsRes.json()
              
              if (!detailsData.items || detailsData.items.length === 0) continue
              
              const videoDetails = detailsData.items[0]
              
              // Check if video is public
              if (videoDetails.status?.privacyStatus !== "public") continue
              
              // Parse duration (in ISO 8601 format)
              const duration = videoDetails.contentDetails?.duration
              if (!duration) continue
              
              // Convert ISO 8601 duration to minutes
              const durationMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
              if (!durationMatch) continue
              
              const hours = parseInt(durationMatch[1] || '0', 10)
              const minutes = parseInt(durationMatch[2] || '0', 10)
              const seconds = parseInt(durationMatch[3] || '0', 10)
              
              const totalMinutes = hours * 60 + minutes + seconds / 60
              
              // Only consider videos longer than 10 minutes
              if (totalMinutes >= 10) {
                validItem = {
                  ...topic,
                  videoId: videoId,
                  videoTitle: item.snippet.title,
                  videoThumbnail: item.snippet.thumbnails.medium.url,
                  isPlaylist: false,
                  duration: totalMinutes,
                  views: videoDetails.statistics?.viewCount || 0
                }
                break
              }
            }
          }
    
          enhancedTopics.push(validItem || topic)
        } catch (error) {
          console.error(`Error fetching YouTube video for ${topic.title}:`, error)
          enhancedTopics.push(topic)
        }
      }
    
      return enhancedTopics
    }
    
    // Update the response processing to include YouTube videos for the roadmap
    try {
      // Extract JSON from the response if it's wrapped in markdown code blocks
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/)
      const jsonString = jsonMatch ? jsonMatch[1] : text
      const jsonResponse = JSON.parse(jsonString)

      // Enhance the role roadmap with YouTube videos if it exists
      if (jsonResponse.roleRoadmap && Array.isArray(jsonResponse.roleRoadmap)) {
        try {
          jsonResponse.roleRoadmap = await fetchYouTubeVideos(jsonResponse.roleRoadmap)
        } catch (ytError) {
          // If YouTube API fails, fallback to original roadmap and add error info
          jsonResponse.roleRoadmap = jsonResponse.roleRoadmap.map((step: any) => ({
            ...step,
            youtubeError: 'YouTube API unavailable or quota exceeded.'
          }))
          jsonResponse.youtubeApiError = ytError instanceof Error ? ytError.message : String(ytError)
        }
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

    // Return fallback mock data
    return NextResponse.json(generateMockCareerData("Software Engineer", "private"))
  }
}

// Update the mock data function to include role roadmap
function generateMockCareerData(jobRole: string, sector: string) {
  const salaryRange = 50000; // Fixed salary range for mock data
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
    topCompanies: [
      { name: "TCS", sector: "private" },
      { name: "Infosys", sector: "private" },
      { name: "Wipro", sector: "private" },
      { name: "ISRO", sector: "government" },
      { name: "DRDO", sector: "government" },
      { name: "BHEL", sector: "government" },
    ],
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