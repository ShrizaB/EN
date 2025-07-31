import { type NextRequest, NextResponse } from "next/server"
import { PerplexityAPI } from "@/lib/perplexity-api"

// Initialize the Perplexity API with the API key
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY
let perplexityAPI: PerplexityAPI | null = null

if (PERPLEXITY_API_KEY) {
  try {
    perplexityAPI = new PerplexityAPI(PERPLEXITY_API_KEY)
  } catch (error) {
    console.error('Failed to initialize Perplexity API:', error)
  }
} else {
  console.warn('PERPLEXITY_API_KEY environment variable is not set')
}

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
        if (!perplexityAPI) {
          throw new Error('Perplexity API not available')
        }
        
        const result = await perplexityAPI.generateContent(prompt)
        const text = result.text()
        
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

    // Use Perplexity API for career analysis - simplified prompt to avoid truncation
    const prompt = `
Generate a concise career analysis for "${jobRole}" in "${sector}" sector.

Provide this as valid JSON:
{
  "jobRole": "${jobRole}",
  "sector": "${sector}",
  "averageSalary": 600000,
  "entrySalary": 300000,
  "experiencedSalary": 1200000,
  "topSectors": [
    {"name": "IT Services", "percentage": 40, "category": "private"},
    {"name": "Startups", "percentage": 25, "category": "private"},
    {"name": "E-commerce", "percentage": 20, "category": "private"},
    {"name": "Government", "percentage": 15, "category": "government"}
  ],
  "learningPath": [
    {
      "step": 1,
      "title": "Foundation Skills",
      "description": "Learn basic technical skills and fundamentals",
      "duration": "2-3 weeks",
      "resources": ["Documentation", "Tutorials"],
      "videoId": "PkZNo7MFNFg"
    },
    {
      "step": 2,
      "title": "Intermediate Development",
      "description": "Build projects and gain practical experience", 
      "duration": "4-6 weeks",
      "resources": ["Project guides", "Practice platforms"],
      "videoId": "bMknfKXIFA8"
    },
    {
      "step": 3,
      "title": "Advanced Concepts",
      "description": "Master advanced techniques and best practices",
      "duration": "6-8 weeks", 
      "resources": ["Advanced courses", "Industry standards"],
      "videoId": "Ke90Tje7VS0"
    },
    {
      "step": 4,
      "title": "Real-world Projects",
      "description": "Build portfolio projects and gain experience",
      "duration": "8-10 weeks",
      "resources": ["Project templates", "Industry examples"],
      "videoId": "fBNz5xF-Kx4"
    }
  ]
}

Customize the learningPath steps for ${jobRole} with relevant skills and realistic timeframes.`

    // Improved API call with longer timeout and better error handling
    let result: any
    
    try {
      console.log('Starting Perplexity API call...')
      
      if (!perplexityAPI) {
        throw new Error('Perplexity API not available')
      }
      
      // Increased timeout to 60 seconds for more stable API calls
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Perplexity API timeout after 60 seconds')), 60000)
      })
      
      const apiPromise = perplexityAPI.generateContent(prompt, {
        model: 'sonar',
        maxTokens: 1200, // Further reduced to prevent truncation
        temperature: 0.7
      })
      result = await Promise.race([apiPromise, timeoutPromise])
      
      console.log('Perplexity API call successful')
    } catch (apiError) {
      console.error('Perplexity API call failed:', apiError)
      console.log('Using fallback mock data due to API failure')
      // Return fallback immediately instead of retrying
      return NextResponse.json(generateMockCareerData(jobRole, sector))
    }

    if (!result) {
      console.log('No result from Perplexity API, using fallback')
      return NextResponse.json(generateMockCareerData(jobRole, sector))
    }

    const text = result.text()

    if (!text || text.trim().length === 0) {
      console.log('Empty response from Perplexity API, using fallback')
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
        
        // Try to fix common JSON issues and handle truncated responses
        let fixedJson = jsonString
          .replace(/,\s*}/g, '}') // Remove trailing commas in objects
          .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
          .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes with regular quotes
          .replace(/[\u2018\u2019]/g, "'") // Replace smart single quotes

        // Check if JSON is truncated and try to complete it
        if (!fixedJson.endsWith('}') && !fixedJson.endsWith(']')) {
          console.log('Detected truncated JSON, attempting to complete...')
          
          // Handle incomplete strings by closing them
          if (fixedJson.includes('"') && !fixedJson.endsWith('"')) {
            // Check if we're in the middle of a string value
            const lastQuoteIndex = fixedJson.lastIndexOf('"');
            const afterLastQuote = fixedJson.substring(lastQuoteIndex + 1);
            
            // If there's content after the last quote that doesn't contain a closing quote
            if (afterLastQuote && !afterLastQuote.includes('"')) {
              // Find if we're in a property value by looking for ': "'
              const colonQuotePattern = /:\s*"[^"]*$/;
              if (colonQuotePattern.test(fixedJson)) {
                fixedJson += '"'; // Close the string
                console.log('Closed incomplete string value');
              }
            }
          }
          
          // Remove any trailing incomplete content (like incomplete numbers or words)
          fixedJson = fixedJson.replace(/,\s*"[^"]*:\s*[^",}\]]*$/, '');
          fixedJson = fixedJson.replace(/,\s*[^",}\]]*$/, '');
          
          // Count open braces vs closed braces
          const openBraces = (fixedJson.match(/{/g) || []).length;
          const closedBraces = (fixedJson.match(/}/g) || []).length;
          const missingBraces = openBraces - closedBraces;
          
          // Add missing closing braces
          for (let i = 0; i < missingBraces; i++) {
            fixedJson += '}';
          }
          
          // Also check for unclosed arrays
          const openBrackets = (fixedJson.match(/\[/g) || []).length;
          const closedBrackets = (fixedJson.match(/\]/g) || []).length;
          const missingBrackets = openBrackets - closedBrackets;
          
          for (let i = 0; i < missingBrackets; i++) {
            fixedJson += ']';
          }
          
          // Remove any trailing commas before closing
          fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');
        }

        try {
          jsonResponse = JSON.parse(fixedJson)
          console.log('JSON parsing successful after fixes')
        } catch (secondParseError) {
          console.error('JSON parsing failed even after fixes:', secondParseError)
          console.error('Raw response length:', text.length)
          console.error('Fixed JSON length:', fixedJson.length)
          console.error('Last 200 chars of response:', text.slice(-200))
          
          // If JSON parsing still fails, return mock data instead of throwing error
          console.log('Falling back to mock data due to JSON parsing failure')
          return NextResponse.json({
            jobRole: jobRole,
            sector: "private",
            averageSalary: 600000,
            entrySalary: 300000,
            experiencedSalary: 1200000,
            topSectors: [
              {"name": "Information Technology & Services", "percentage": 45, "category": "private"},
              {"name": "E-commerce", "percentage": 20, "category": "private"},
              {"name": "Financial Services", "percentage": 10, "category": "private"},
              {"name": "Startups", "percentage": 15, "category": "private"},
              {"name": "Government", "percentage": 10, "category": "government"}
            ],
            learningPath: [
              {
                "step": 1,
                "title": "HTML & CSS Fundamentals",
                "description": "Master the building blocks of web development with HTML structure and CSS styling.",
                "duration": "2-3 weeks",
                "resources": ["HTML5 documentation", "CSS3 tutorials", "Responsive design guides"],
                "videoId": "PkZNo7MFNFg"
              },
              {
                "step": 2,
                "title": "JavaScript Essentials",
                "description": "Learn core JavaScript concepts including variables, functions, and DOM manipulation.",
                "duration": "3-4 weeks",
                "resources": ["JavaScript MDN docs", "ES6+ features", "Browser DevTools"],
                "videoId": "bMknfKXIFA8"
              },
              {
                "step": 3,
                "title": "Frontend Framework",
                "description": "Choose and master a modern framework like React, Vue, or Angular.",
                "duration": "4-6 weeks",
                "resources": ["React documentation", "Component lifecycle", "State management"],
                "videoId": "Ke90Tje7VS0"
              },
              {
                "step": 4,
                "title": "Backend Development",
                "description": "Learn server-side programming with Node.js, Python, or PHP.",
                "duration": "4-5 weeks",
                "resources": ["Node.js tutorials", "Express.js framework", "API development"],
                "videoId": "fBNz5xF-Kx4"
              },
              {
                "step": 5,
                "title": "Database Management",
                "description": "Understand SQL and NoSQL databases for data storage and retrieval.",
                "duration": "3-4 weeks",
                "resources": ["MySQL tutorials", "MongoDB basics", "Database design"],
                "videoId": "HXV3zeQKqGY"
              },
              {
                "step": 6,
                "title": "Version Control & Deployment",
                "description": "Master Git for version control and learn deployment strategies.",
                "duration": "2-3 weeks",
                "resources": ["Git documentation", "GitHub workflow", "CI/CD pipelines"],
                "videoId": "RGOj5yH7evk"
              }
            ]
          });
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

// Update the mock data function to include role roadmap and realistic salaries
function generateMockCareerData(jobRole: string, sector: string) {
  // Base salary multipliers based on job role (in thousands)
  const baseSalaryMap: { [key: string]: number } = {
    "Software Engineer": 600, // 6 LPA base
    "Data Scientist": 800, // 8 LPA base  
    "Marketing Manager": 700, // 7 LPA base
    "Financial Analyst": 650, // 6.5 LPA base
    "Civil Engineer": 500, // 5 LPA base
    "Business Analyst": 650, // 6.5 LPA base
    "Product Manager": 1200, // 12 LPA base
    "DevOps Engineer": 800, // 8 LPA base
    "UI/UX Designer": 550, // 5.5 LPA base
  }
  
  // Get base salary for the role, default to Software Engineer if not found
  const baseSalary = baseSalaryMap[jobRole] || baseSalaryMap["Software Engineer"]
  
  // Convert to proper annual amounts (multiply by 1000 since base is in thousands)
  const annualBaseSalary = baseSalary * 1000
  
  // Generate dynamic companies based on job role and sector
  const generateCompaniesForRole = (role: string, sectorType: string, baseSalary: number) => {
    const allCompanies = {
      "Software Engineer": {
        private: [
          { 
            name: "Google", 
            sector: "private",
            details: "Global technology leader specializing in internet-related services and products, revolutionizing how people access and interact with information worldwide.\n\nKnown for its innovative work culture, cutting-edge technology, and commitment to solving complex global challenges through technology. Google offers exceptional career growth opportunities for software engineers across multiple domains including AI, machine learning, cloud computing, mobile technologies, and web development.\n\nThe company provides a highly competitive compensation package, comprehensive benefits, and an environment that encourages creativity, collaboration, and continuous learning. Engineers work on products used by billions of people worldwide, making a real impact on global scale.\n\nGoogle's engineering culture emphasizes technical excellence, innovation, and the famous '20% time' policy that allows engineers to pursue passion projects. The company is committed to diversity, inclusion, and creating technology that benefits everyone.",
            facilities: ["Free meals and snacks", "On-site gym and fitness center", "Comprehensive health insurance", "Stock options and equity", "Flexible working hours", "Learning and development programs", "Childcare facilities", "Transportation services", "Wellness programs", "Recreation areas"]
          },
          { 
            name: "Microsoft", 
            sector: "private",
            details: "Leading technology company focused on productivity software, cloud services, and empowering every person and organization on the planet to achieve more.\n\nMicrosoft offers a unique blend of enterprise and consumer product development opportunities, with strong emphasis on work-life balance and employee development. Engineers work on world-class products including Windows, Office 365, Azure cloud platform, Xbox gaming, and cutting-edge AI technologies.\n\nThe company is a leader in cloud computing with Azure platform, artificial intelligence, and enterprise solutions. Microsoft's culture promotes growth mindset, inclusion, and continuous learning, making it an ideal place for engineers who want to make a significant impact while maintaining work-life balance.\n\nWith a commitment to diversity and inclusion initiatives, Microsoft provides an environment where every engineer can thrive and contribute to technologies that transform how people work, learn, and connect globally.",
            facilities: ["Health and dental insurance", "Retirement savings plan", "Flexible work arrangements", "Professional development budget", "Employee discounts", "Wellness programs", "Parental leave benefits", "Volunteer time off", "Stock purchase plan", "Modern office facilities"]
          },
          { 
            name: "Amazon", 
            sector: "private",
            details: "Amazon is a global e-commerce and cloud computing giant that has revolutionized how people shop, consume digital content, and build scalable technology infrastructure worldwide.\n\nFrom a customer perspective, Amazon provides an unparalleled shopping experience with millions of products, lightning-fast delivery through Prime, streaming services, smart home devices like Alexa, and cloud storage solutions. The company has transformed retail, entertainment, and digital services globally.\n\nFrom an employee perspective, Amazon offers an incredibly dynamic and challenging work environment where engineers work on cutting-edge technologies that serve hundreds of millions of customers. You'll be part of teams building massive-scale distributed systems, artificial intelligence, machine learning algorithms, robotics, and cloud computing solutions through AWS (Amazon Web Services).\n\nAmazon's culture is built on 16 Leadership Principles including Customer Obsession, Ownership, and Invent and Simplify. Engineers have opportunities to work across diverse domains including e-commerce platforms, AWS cloud services, Prime Video streaming, Alexa AI, logistics and supply chain optimization, advertising technology, and emerging technologies like drone delivery.\n\nThe company offers exceptional career growth opportunities, competitive compensation including stock options, and the chance to make a real impact on billions of customers worldwide while working with some of the most talented engineers in the industry.",
            facilities: ["Career advancement programs", "Health insurance coverage", "Stock options", "Employee discounts", "Flexible schedules", "Learning opportunities", "Wellness benefits", "Parental benefits", "Transportation allowance", "Food services"]
          },
          { 
            name: "Apple", 
            sector: "private",
            details: "Apple is the world's most valuable technology company, renowned for creating revolutionary consumer electronics, software, and digital services that have fundamentally changed how people interact with technology.\n\nFrom a customer perspective, Apple delivers premium products and experiences through the iPhone, iPad, Mac, Apple Watch, AirPods, and services like App Store, Apple Music, iCloud, and Apple TV+. The company is synonymous with innovation, elegant design, user privacy, and seamless integration across all devices and services.\n\nFrom an employee perspective, Apple offers engineers the opportunity to work on products used and loved by over a billion people worldwide. You'll be part of teams that push the boundaries of hardware and software engineering, working on everything from custom silicon chips and advanced cameras to iOS, macOS, machine learning frameworks, and augmented reality technologies.\n\nApple's engineering culture emphasizes perfectionism, attention to detail, and collaborative innovation. Engineers work in small, focused teams on highly confidential projects that often define entire product categories. The company provides unmatched opportunities to work on cutting-edge technologies including custom processors, advanced materials, computer vision, natural language processing, and health technologies.\n\nWith a strong commitment to environmental responsibility, user privacy, and accessibility, Apple offers engineers the chance to make meaningful contributions to technology while maintaining the highest standards of ethics and social responsibility. The compensation and benefits are among the best in the industry, including substantial stock options that have created significant wealth for long-term employees.",
            facilities: ["Comprehensive health benefits", "Stock purchase program", "Employee product discounts", "Wellness and fitness programs", "Professional development", "Flexible work options", "Commuter benefits", "Food and beverage services", "Recreation facilities", "Learning resources"]
          },
          { 
            name: "Meta", 
            sector: "private",
            details: "Meta (formerly Facebook) is a leading social technology company that's building the next generation of social connection and immersive digital experiences, including the ambitious metaverse vision.\n\nFrom a customer perspective, Meta operates some of the world's most popular social platforms including Facebook (connecting 3+ billion users), Instagram (visual storytelling and social commerce), WhatsApp (global messaging), and is pioneering virtual and augmented reality through Meta Quest VR headsets and AR glasses. These platforms enable people to connect, share, discover content, and build communities across the globe.\n\nFrom an employee perspective, Meta offers software engineers the opportunity to work on technologies that connect billions of people worldwide while pioneering the future of digital interaction. Engineers work on massive-scale distributed systems, advanced AI and machine learning algorithms, computer vision, virtual and augmented reality, social algorithms, and cutting-edge hardware-software integration.\n\nMeta's engineering culture emphasizes bold innovation, rapid iteration, and 'Move Fast' mentality. Engineers have access to some of the world's largest datasets and most challenging technical problems in areas like social networking, content recommendation, real-time communications, immersive technologies, and privacy-preserving technologies.\n\nThe company is heavily investing in the metaverse - a shared virtual environment where people can work, play, and socialize. This includes developing VR/AR hardware, spatial computing, haptic feedback systems, and creating entirely new paradigms for human-computer interaction. Meta offers competitive compensation, excellent benefits, and the unique opportunity to shape the future of how humanity connects and interacts digitally.",
            facilities: ["Health and wellness benefits", "Stock options", "Free meals", "Fitness facilities", "Learning and development", "Flexible work arrangements", "Parental leave", "Mental health support", "Transportation benefits", "Recreation activities"]
          },
          { 
            name: "Netflix", 
            sector: "private",
            details: "Netflix is the world's leading streaming entertainment service, revolutionizing how people consume and discover movies, TV shows, and original content across more than 190 countries with over 230 million subscribers.\n\nFrom a customer perspective, Netflix provides an unparalleled entertainment experience with a vast library of content, award-winning original series and movies, personalized recommendations powered by sophisticated algorithms, and seamless streaming across all devices. The platform has fundamentally changed entertainment consumption patterns and created new forms of storytelling.\n\nFrom an employee perspective, Netflix offers engineers the opportunity to work on cutting-edge technology that delivers entertainment to hundreds of millions of users globally. Engineers build and maintain one of the world's largest content delivery networks, develop sophisticated recommendation algorithms using machine learning, create innovative user interfaces, and solve complex problems in video encoding, streaming optimization, and global content distribution.\n\nNetflix's unique culture emphasizes 'Freedom and Responsibility,' unlimited vacation, and treating employees like adults. The engineering teams work on fascinating challenges including real-time video streaming optimization, A/B testing at massive scale, content personalization algorithms, global CDN management, microservices architecture, and data analytics that guide billion-dollar content investments.\n\nThe company's data-driven approach means engineers work with enormous datasets to understand viewing patterns, optimize streaming quality, and predict content success. Netflix also pioneers new technologies in video compression, adaptive streaming, and content production workflows. With competitive compensation, stock options, and a culture that values high performance and innovation, Netflix offers engineers the chance to impact how the world enjoys entertainment.",
            facilities: ["Unlimited vacation policy", "Health insurance", "Stock options", "Professional development budget", "Flexible work arrangements", "Wellness programs", "Parental leave", "Learning resources", "Team building activities", "Modern office spaces"]
          }
        ],
        government: [
          { 
            name: "ISRO", 
            sector: "government",
            details: "Indian Space Research Organisation - India's national space agency.\nOpportunities to work on satellite technology and space missions.\nPrestigious government organization with cutting-edge research.\nContributes to national space programs and scientific advancement.\nOffers stable career with government benefits.",
            facilities: ["Government health scheme", "Provident fund", "Pension benefits", "Medical facilities", "Canteen services", "Transportation", "Housing allowance", "Leave travel concession", "Educational facilities", "Research opportunities"]
          },
          { 
            name: "DRDO", 
            sector: "government",
            details: "Defence Research and Development Organisation.\nWorks on advanced defense technologies and systems.\nOpportunities in aerospace, electronics, and combat systems.\nContributes to national security and defense capabilities.\nFocus on indigenous technology development.",
            facilities: ["Government medical benefits", "Provident fund", "Pension scheme", "Canteen facilities", "Transportation services", "Housing assistance", "Educational support", "Research facilities", "Library access", "Sports facilities"]
          },
          { 
            name: "CDAC", 
            sector: "government",
            details: "Centre for Development of Advanced Computing.\nLeading R&D organization in IT and electronics.\nWork on supercomputing, cyber security, and emerging technologies.\nBridge between academic research and industry applications.\nFocus on indigenous technology development.",
            facilities: ["Health insurance", "Provident fund", "Flexible working hours", "Training programs", "Canteen services", "Library facilities", "Conference participation", "Research support", "Modern labs", "Transportation"]
          },
          { 
            name: "NIC", 
            sector: "government",
            details: "National Informatics Centre - Premier IT organization of Government of India.\nWorks on e-governance and digital India initiatives.\nOpportunities in software development and system integration.\nContributes to digitalization of government services.\nStable career with government perks.",
            facilities: ["Medical benefits", "Provident fund", "Pension benefits", "Training opportunities", "Canteen facilities", "Transportation allowance", "Housing support", "Leave benefits", "Educational assistance", "IT infrastructure"]
          }
        ],
        both: [
          { 
            name: "Google", 
            sector: "private",
            details: "Global technology leader specializing in internet-related services and products.\nKnown for innovative work culture and cutting-edge technology.\nOffers excellent career growth opportunities for software engineers.\nFocus on AI, cloud computing, and mobile technologies.\nHighly competitive compensation and benefits package.",
            facilities: ["Free meals and snacks", "On-site gym and fitness center", "Comprehensive health insurance", "Stock options and equity", "Flexible working hours", "Learning and development programs", "Childcare facilities", "Transportation services", "Wellness programs", "Recreation areas"]
          },
          { 
            name: "Microsoft", 
            sector: "private",
            details: "Leading technology company focused on productivity software and cloud services.\nStrong emphasis on work-life balance and employee development.\nOpportunities to work on enterprise and consumer products.\nLeader in cloud computing with Azure platform.\nCommitted to diversity and inclusion initiatives.",
            facilities: ["Health and dental insurance", "Retirement savings plan", "Flexible work arrangements", "Professional development budget", "Employee discounts", "Wellness programs", "Parental leave benefits", "Volunteer time off", "Stock purchase plan", "Modern office facilities"]
          },
          { 
            name: "Amazon", 
            sector: "private",
            details: "E-commerce giant with strong presence in cloud computing and AI.\nFast-paced work environment with focus on customer obsession.\nOpportunities across various domains including AWS, retail, and logistics.\nEmphasis on innovation and ownership mindset.\nGlobal scale operations with diverse project opportunities.",
            facilities: ["Career advancement programs", "Health insurance coverage", "Stock options", "Employee discounts", "Flexible schedules", "Learning opportunities", "Wellness benefits", "Parental benefits", "Transportation allowance", "Food services"]
          },
          { 
            name: "ISRO", 
            sector: "government",
            details: "Indian Space Research Organisation - India's national space agency.\nOpportunities to work on satellite technology and space missions.\nPrestigious government organization with cutting-edge research.\nContributes to national space programs and scientific advancement.\nOffers stable career with government benefits.",
            facilities: ["Government health scheme", "Provident fund", "Pension benefits", "Medical facilities", "Canteen services", "Transportation", "Housing allowance", "Leave travel concession", "Educational facilities", "Research opportunities"]
          },
          { 
            name: "DRDO", 
            sector: "government",
            details: "Defence Research and Development Organisation.\nWorks on advanced defense technologies and systems.\nOpportunities in aerospace, electronics, and combat systems.\nContributes to national security and defense capabilities.\nFocus on indigenous technology development.",
            facilities: ["Government medical benefits", "Provident fund", "Pension scheme", "Canteen facilities", "Transportation services", "Housing assistance", "Educational support", "Research facilities", "Library access", "Sports facilities"]
          },
          { 
            name: "TCS", 
            sector: "private",
            details: "Tata Consultancy Services - India's largest IT services company.\nGlobal presence with opportunities in various technology domains.\nStrong focus on innovation and digital transformation.\nExcellent training programs for fresh graduates.\nPart of the prestigious Tata Group with strong values.",
            facilities: ["Health insurance", "Provident fund", "Performance bonuses", "Learning platforms", "Flexible work options", "Employee assistance programs", "Recreation facilities", "Canteen services", "Transportation", "Career development"]
          }
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
    
    // Return companies based on sector preference and add salary information
    let selectedCompanies
    if (sectorType === "government") {
      selectedCompanies = roleCompanies.government
    } else if (sectorType === "private") {
      selectedCompanies = roleCompanies.private
    } else {
      selectedCompanies = roleCompanies.both
    }

    // Add realistic salary information to each company
    return selectedCompanies.map((company: any) => ({
      ...company,
      entrySalary: Math.round(baseSalary * (0.6 + Math.random() * 0.3)), // 60-90% of base
      averageSalary: Math.round(baseSalary * (1.0 + Math.random() * 0.5)), // 100-150% of base  
      experiencedSalary: Math.round(baseSalary * (1.8 + Math.random() * 0.8)) // 180-260% of base
    }))
  }

  const mockData = {
    jobRole: jobRole,
    sector: sector,
    averageSalary: Math.round(annualBaseSalary * 1.2), // 20% above base
    entrySalary: Math.round(annualBaseSalary * 0.7), // 30% below base for entry level
    experiencedSalary: Math.round(annualBaseSalary * 2.2), // 2.2x base for experienced
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
    topCompanies: generateCompaniesForRole(jobRole, sector, annualBaseSalary),
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
        averageSalary: Math.round(annualBaseSalary * 1.3),
        costOfLiving: "High",
      },
      {
        location: "Hyderabad",
        description: "Growing tech hub with many multinational companies and a reasonable cost of living.",
        averageSalary: Math.round(annualBaseSalary * 1.2),
        costOfLiving: "Medium",
      },
      {
        location: "Mumbai",
        description: "Financial capital with diverse job opportunities across sectors.",
        averageSalary: Math.round(annualBaseSalary * 1.4),
        costOfLiving: "Very High",
      },
    ],
    careerPath: [
      {
        title: "Entry Level Position",
        description: "Start your career with foundational responsibilities and learning opportunities.",
        timeline: "0-2 years",
        salaryRange: `₹${Math.round(annualBaseSalary * 0.7).toLocaleString()} - ₹${Math.round(annualBaseSalary * 1.0).toLocaleString()}`,
      },
      {
        title: "Mid-Level Position",
        description: "Take on more complex projects and begin to specialize in your area of interest.",
        timeline: "2-5 years",
        salaryRange: `₹${Math.round(annualBaseSalary * 1.0).toLocaleString()} - ₹${Math.round(annualBaseSalary * 1.5).toLocaleString()}`,
      },
      {
        title: "Senior Position",
        description: "Lead projects and mentor junior team members while deepening your expertise.",
        timeline: "5-8 years",
        salaryRange: `₹${Math.round(annualBaseSalary * 1.5).toLocaleString()} - ₹${Math.round(annualBaseSalary * 2.2).toLocaleString()}`,
      },
      {
        title: "Management Role",
        description: "Transition to managing teams and departments, focusing on strategic initiatives.",
        timeline: "8+ years",
        salaryRange: `₹${Math.round(annualBaseSalary * 2.2).toLocaleString()}+`,
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