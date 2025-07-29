"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, RefreshCw, Zap, Shield, Target, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuizEngine } from "@/components/quiz-engine"
import { GoogleGenerativeAI } from "@google/generative-ai"
import "./quiz-topics.css"

// Initialize the Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

// This would typically come from a database or API
const topicsData = {
  math: {
    counting: {
      title: "Counting & Numbers",
      description: "Learn to count and recognize numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "hq-red",
      level: "Beginner",
      ageRange: "3-5",
    },
    addition: {
      title: "Addition",
      description: "Master the basics of adding numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "hq-red",
      level: "Beginner",
      ageRange: "5-7",
    },
    subtraction: {
      title: "Subtraction",
      description: "Learn how to subtract numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "hq-red",
      level: "Beginner",
      ageRange: "5-7",
    },
    multiplication: {
      title: "Multiplication",
      description: "Understand multiplication concepts",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "hq-red",
      level: "Intermediate",
      ageRange: "7-9",
    },
    division: {
      title: "Division",
      description: "Learn how to divide numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "hq-red",
      level: "Intermediate",
      ageRange: "7-9",
    },
    fractions: {
      title: "Fractions",
      description: "Understand parts of a whole",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "hq-red",
      level: "Advanced",
      ageRange: "8-10",
    },
  },
  science: {
    animals: {
      title: "Animals & Habitats",
      description: "Learn about different animals and where they live",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "hq-green",
      level: "Beginner",
      ageRange: "3-6",
    },
    plants: {
      title: "Plants & Growth",
      description: "Discover how plants grow and change",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "hq-green",
      level: "Beginner",
      ageRange: "4-7",
    },
    weather: {
      title: "Weather & Seasons",
      description: "Learn about different weather patterns and seasons",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "hq-green",
      level: "Beginner",
      ageRange: "4-7",
    },
    "human-body": {
      title: "Human Body",
      description: "Explore the amazing human body and how it works",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "hq-green",
      level: "Intermediate",
      ageRange: "6-9",
    },
    space: {
      title: "Space & Planets",
      description: "Journey through our solar system and beyond",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "hq-green",
      level: "Intermediate",
      ageRange: "7-10",
    },
    "simple-machines": {
      title: "Simple Machines",
      description: "Learn about levers, pulleys, and other simple machines",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "hq-green",
      level: "Advanced",
      ageRange: "8-11",
    },
  },
  reading: {
    alphabet: {
      title: "Alphabet Recognition",
      description: "Learn to recognize and sound out letters",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "hq-purple",
      level: "Beginner",
      ageRange: "3-5",
    },
    phonics: {
      title: "Phonics & Word Sounds",
      description: "Connect letters with their sounds",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "hq-purple",
      level: "Beginner",
      ageRange: "4-6",
    },
    "sight-words": {
      title: "Sight Words",
      description: "Learn common words by sight",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "hq-purple",
      level: "Beginner",
      ageRange: "4-7",
    },
    vocabulary: {
      title: "Vocabulary Building",
      description: "Expand your word knowledge",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "hq-purple",
      level: "Intermediate",
      ageRange: "6-9",
    },
    comprehension: {
      title: "Reading Comprehension",
      description: "Understand and analyze what you read",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "hq-purple",
      level: "Intermediate",
      ageRange: "7-10",
    },
    grammar: {
      title: "Grammar & Punctuation",
      description: "Learn the rules of language",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "hq-purple",
      level: "Advanced",
      ageRange: "8-11",
    },
  },
  coding: {
    basics: {
      title: "Coding Basics",
      description: "Learn fundamental coding concepts",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "hq-red",
      level: "Beginner",
      ageRange: "5-8",
    },
    sequences: {
      title: "Sequences & Algorithms",
      description: "Create step-by-step instructions",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "hq-red",
      level: "Beginner",
      ageRange: "6-9",
    },
    loops: {
      title: "Loops & Repetition",
      description: "Learn how to repeat actions efficiently",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "hq-red",
      level: "Intermediate",
      ageRange: "7-10",
    },
    conditionals: {
      title: "Conditionals & Logic",
      description: "Make decisions in your code",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "hq-red",
      level: "Intermediate",
      ageRange: "8-11",
    },
    functions: {
      title: "Functions & Procedures",
      description: "Create reusable blocks of code",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "hq-red",
      level: "Advanced",
      ageRange: "9-12",
    },
    debugging: {
      title: "Debugging & Problem Solving",
      description: "Find and fix errors in code",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "hq-red",
      level: "Advanced",
      ageRange: "9-12",
    },
  },
  music: {
    instruments: {
      title: "Musical Instruments",
      description: "Learn about different musical instruments",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "hq-purple",
      level: "Beginner",
      ageRange: "4-7",
    },
    notes: {
      title: "Notes & Rhythms",
      description: "Understand basic musical notation",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "hq-purple",
      level: "Beginner",
      ageRange: "5-8",
    },
    composers: {
      title: "Famous Composers",
      description: "Learn about classical music composers",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "hq-purple",
      level: "Intermediate",
      ageRange: "7-10",
    },
    genres: {
      title: "Music Genres",
      description: "Explore different styles of music",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "hq-purple",
      level: "Intermediate",
      ageRange: "8-11",
    },
  },
  art: {
    colors: {
      title: "Colors & Mixing",
      description: "Learn about primary and secondary colors",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "hq-red",
      level: "Beginner",
      ageRange: "3-6",
    },
    artists: {
      title: "Famous Artists",
      description: "Discover well-known artists and their work",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "hq-red",
      level: "Intermediate",
      ageRange: "6-9",
    },
    styles: {
      title: "Art Styles",
      description: "Explore different artistic movements",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "hq-red",
      level: "Intermediate",
      ageRange: "7-10",
    },
    techniques: {
      title: "Art Techniques",
      description: "Learn about different ways to create art",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "hq-red",
      level: "Advanced",
      ageRange: "8-11",
    },
  },
  geography: {
    continents: {
      title: "Continents & Oceans",
      description: "Learn about the major landmasses and bodies of water",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "hq-green",
      level: "Beginner",
      ageRange: "5-8",
    },
    countries: {
      title: "Countries & Capitals",
      description: "Discover countries and their capital cities",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "hq-green",
      level: "Intermediate",
      ageRange: "7-10",
    },
    landforms: {
      title: "Landforms & Features",
      description: "Explore mountains, rivers, deserts, and more",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "hq-green",
      level: "Intermediate",
      ageRange: "7-10",
    },
    cultures: {
      title: "World Cultures",
      description: "Learn about different cultures around the world",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "hq-green",
      level: "Advanced",
      ageRange: "8-11",
    },
  },
  history: {
    ancient: {
      title: "Ancient Civilizations",
      description: "Explore early human societies and achievements",
      subject: "History",
      subjectSlug: "history",
      subjectColor: "hq-purple",
      level: "Intermediate",
      ageRange: "7-10",
    },
    explorers: {
      title: "Famous Explorers",
      description: "Learn about people who discovered new lands",
      subject: "History",
      subjectSlug: "history",
      subjectColor: "hq-purple",
      level: "Intermediate",
      ageRange: "7-10",
    },
    inventions: {
      title: "Important Inventions",
      description: "Discover inventions that changed the world",
      subject: "History",
      subjectSlug: "history",
      subjectColor: "hq-purple",
      level: "Intermediate",
      ageRange: "8-11",
    },
    leaders: {
      title: "Historical Leaders",
      description: "Learn about influential people throughout history",
      subject: "History",
      subjectSlug: "history",
      subjectColor: "hq-purple",
      level: "Advanced",
      ageRange: "9-12",
    },
  },
}

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  id: string
  difficulty?: string
}

function CustomCursor() {
  useEffect(() => {
    // Remove any existing custom cursor
    const old = document.getElementById("custom-cursor-img")
    if (old) old.remove()

    // Remove all pointer cursors from the page (force override)
    const style = document.createElement("style")
    style.innerHTML = `
      *:hover, *:active, *:focus, button:hover, a:hover, [role=button]:hover {
        cursor: none !important;
      }
      * {
        cursor: none !important;
      }
    `
    style.id = "force-no-pointer-cursor"
    document.head.appendChild(style)

    // Create the image element
    const img = document.createElement("img")
    img.src = "https://i.postimg.cc/MTq9RcCn/gun-pointer.png"
    img.id = "custom-cursor-img"
    img.className = "md:visible invisible"
    img.style.position = "fixed"
    img.style.pointerEvents = "none"
    img.style.zIndex = "999999"
    img.style.width = "40px"
    img.style.height = "40px"
    img.style.transform = "translate(-8px, -8px)"
    img.style.filter = "invert(1)"
    document.body.appendChild(img)

    // Move the image with the mouse
    const move = (e: MouseEvent) => {
      img.style.left = e.clientX + "px"
      img.style.top = e.clientY + "px"
    }
    window.addEventListener("mousemove", move)
    // Hide the default cursor
    document.body.style.cursor = "none"
    return () => {
      window.removeEventListener("mousemove", move)
      img.remove()
      document.body.style.cursor = ""
      const styleTag = document.getElementById("force-no-pointer-cursor")
      if (styleTag) styleTag.remove()
    }
  }, [])
  return null
}

export default function QuizTopicPage({ params }: { params: { subject: string; topic: string } }) {
  const { subject, topic } = params
  return <QuizTopicPageContent subject={subject} topic={topic} />
}

function QuizTopicPageContent({ subject, topic }: { subject: string; topic: string }) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLimit, setTimeLimit] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if the subject and topic exist in our data
  if (
    mounted &&
    (!(topicsData as any)[subject] ||
      !(topicsData as any)[subject][topic])
  ) {
    notFound()
  }

  // Function to fetch questions with difficulty using Gemini API
  const fetchQuestionsWithDifficulty = async (
    subject: string,
    topic: string,
    difficulty: string,
  ): Promise<Question[]> => {
    try {
      // Create a prompt based on the topic and subject with explicit instructions for difficulty
      const prompt = `Generate 10 multiple-choice quiz questions about "${topic}" for ${subject} subject for children.

      For ${difficulty} difficulty level:
      ${difficulty === "easy" ? "- Very basic concepts, simple vocabulary, obvious answers" : ""}
      ${difficulty === "beginner" ? "- Basic concepts, straightforward questions, some thought required" : ""}
      ${difficulty === "intermediate" ? "- More complex concepts, requires good understanding of the topic" : ""}
      ${difficulty === "hard" ? "- Advanced concepts, challenging questions, requires deep understanding" : ""}

      Each question must have:
      1. A clear, unique question
      2. Four distinct possible answers (options)
      3. The index of the correct answer (0-3, where 0 is the first option)
      4. A child-friendly explanation of the answer

      Format the response as a valid JSON array with objects having these properties:
      - question: string
      - options: string[] (array of 4 options)
      - correctAnswer: number (0-3 index of correct option)
      - explanation: string

      IMPORTANT: Return ONLY the JSON array, no other text.`

      const result = await model.generateContent(prompt)
      let responseText = result.response.text()

      // Fix: Remove unnecessary formatting
      responseText = responseText.replace(/```json|```/g, "").trim()

      try {
        // Parse the JSON
        const parsedQuestions: Question[] = JSON.parse(responseText)

        // Add unique IDs
        const questionsWithIds = parsedQuestions.map((q, index) => ({
          ...q,
          id: `${subject}-${topic}-${difficulty}-${Date.now()}-${index}`,
          difficulty: difficulty,
        }))

        return questionsWithIds
      } catch (parseError) {
        console.error("Error parsing JSON from API response", parseError)
        throw new Error("Error parsing JSON from API response")
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
      throw error
    }
  }

  // Function to generate new questions with difficulty
  const generateNewQuestionsWithDifficulty = async (difficulty: string) => {
    setLoading(true)
    setError(null)

    try {
      const topicData = (topicsData as any)[subject][topic]
      console.log(`Generating ${difficulty} questions for ${topicData.title} (${topicData.subject})`)

      // Set time limit based on difficulty
      const newTimeLimit =
        difficulty === "easy"
          ? 300
          : // 5 minutes
          difficulty === "beginner"
            ? 240
            : // 4 minutes
            difficulty === "intermediate"
              ? 180
              : // 3 minutes
              120 // 2 minutes for hard

      setTimeLimit(newTimeLimit)

      const generatedQuestions = await fetchQuestionsWithDifficulty(subject, topic, difficulty)

      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("No questions were generated. Please try again.")
      }

      console.log(`Successfully generated ${generatedQuestions.length} questions`)
      setQuestions(generatedQuestions)
      setShowQuiz(true)
    } catch (err) {
      console.error("Error generating questions:", err)
      setError("Failed to generate questions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (!mounted) return
  }, [mounted, subject, topic])

  if (!mounted) {
    return (
      <div className="hq-container hq-loading">
        <div className="hq-spinner"></div>
        <span className="hq-loading-text">Loading...</span>
      </div>
    )
  }

  const topicData = (topicsData as any)[subject][topic]

  // Helper to check for mobile
  const isMobile = () => {
    if (typeof window === "undefined") return false
    const ua = navigator.userAgent
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
      window.innerWidth <= 768
    )
  }

  return (
    <>
      {/* Only render custom cursor on desktop */}
      {typeof window !== 'undefined' && !isMobile() && <CustomCursor />}
      <div className="hq-main-container mt-4 bg-gradient-to-tr from-[#dc143c]/10 via-black to-[#4b0082]/20 ">

        <img
          src="https://i.postimg.cc/3wq9WSKx/erasebg-transformed.webp"
          alt="background"
          className=" absolute bottom-20 left-0 w-[600px] h-auto opacity-70 scale-x-[-1]"
        />
        <img
          src="https://i.postimg.cc/LhF8sT1Y/The-Joker-Comics.webp"
          alt="background"
          className=" absolute top-20 right-10 w-[300px] h-auto opacity-90 scale-x-[-1]"
        />

        <div className="hq-content-wrapper">
          <Link href={`/quiz/${subject}`} className="hq-back-link">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to {topicData.subject} Quizzes
          </Link>

          <div className="hq-hero-section bg-transparent">
            <div className="hq-hero-content">
              <div className="hq-badges">
                <div className={`hq-level-badge ${topicData.subjectColor}`}>{topicData.level}</div>
                <div className="hq-age-badge">Ages {topicData.ageRange}</div>
              </div>
              <h1 className="hq-hero-title">{topicData.title} Quiz</h1>
              <p className="hq-hero-description">Test your knowledge of {topicData.title.toLowerCase()}.</p>
            </div>
          </div>

          {!selectedDifficulty && !showQuiz ? (
            <div className="hq-difficulty-selector bg-transparent">
              <h2 className="hq-selector-title">Select Difficulty Level</h2>
              <div className="hq-difficulty-grid">
                <button
                  onClick={() => {
                    setSelectedDifficulty("easy")
                    generateNewQuestionsWithDifficulty("easy")
                  }}
                  className="hq-difficulty-card hq-easy bg-gradient-to-tr from-[#04a21c]/15 via-black to-gray-600/10 "
                >
                  <div className="hq-card-icon hq-green">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h3 className="hq-card-title">Easy</h3>
                  <p className="hq-card-description">Basic concepts for beginners</p>
                  <div className="hq-card-details">
                    <div className="hq-time-info">
                      <Clock className="h-3 w-3" />
                      <span>5 minutes</span>
                    </div>
                    <div className="hq-detail-text">Simple questions with obvious answers</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedDifficulty("beginner")
                    generateNewQuestionsWithDifficulty("beginner")
                  }}
                  className="hq-difficulty-card hq-beginner bg-gradient-to-tr from-yellow-500/10 via-black to-gray-600/10 "
                >
                  <div className="hq-card-icon hq-yellow">
                    <Zap className="h-8 w-8 text-yellow-400 " />
                  </div>
                  <h3 className="hq-card-title">Beginner</h3>
                  <p className="hq-card-description">Straightforward questions with some challenge</p>
                  <div className="hq-card-details">
                    <div className="hq-time-info">
                      <Clock className="h-3 w-3" />
                      <span>4 minutes</span>
                    </div>
                    <div className="hq-detail-text">Basic concepts requiring some thought</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedDifficulty("intermediate")
                    generateNewQuestionsWithDifficulty("intermediate")
                  }}
                  className="hq-difficulty-card hq-intermediate bg-gradient-to-tr from-[#4b0082]/15 via-black to-gray-600/10 "
                >
                  <div className="hq-card-icon hq-purple">
                    <Target className="h-8 w-8" />
                  </div>
                  <h3 className="hq-card-title">Intermediate</h3>
                  <p className="hq-card-description">More complex concepts for experienced learners</p>
                  <div className="hq-card-details">
                    <div className="hq-time-info">
                      <Clock className="h-3 w-3" />
                      <span>3 minutes</span>
                    </div>
                    <div className="hq-detail-text">Requires good understanding of the topic</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedDifficulty("hard")
                    generateNewQuestionsWithDifficulty("hard")
                  }}
                  className="hq-difficulty-card hq-hard bg-gradient-to-tr from-[#dc143c]/15 via-black to-gray-600/10"
                >
                  <div className="hq-card-icon hq-red">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="hq-card-title">Hard</h3>
                  <p className="hq-card-description">Advanced concepts for experts</p>
                  <div className="hq-card-details">
                    <div className="hq-time-info">
                      <Clock className="h-3 w-3" />
                      <span>2 minutes</span>
                    </div>
                    <div className="hq-detail-text">Challenging questions requiring deep understanding</div>
                  </div>
                </button>
              </div>
              <div className="hq-test-level-section">
                <p className="hq-test-prompt">Not sure which level to choose?</p>
                <Link href={`/test-your-level?subject=${subject}`}>
                  <Button variant="outline" className="hq-test-button">
                    Test Your Level
                  </Button>
                </Link>
              </div>
            </div>
          ) : loading ? (
            <div className="hq-loading-section">
              <div className="hq-loading-spinner"></div>
              <p className="hq-loading-title">Generating {selectedDifficulty} questions...</p>
              <p className="hq-loading-subtitle">
                This may take a moment as our AI creates personalized questions for you
              </p>
            </div>
          ) : error ? (
            <div className="hq-error-section">
              <div className="hq-error-icon">⚠️ {error}</div>
              <Button onClick={() => setSelectedDifficulty(null)} className="hq-retry-button">
                Try Again
              </Button>
            </div>
          ) : questions.length > 0 && showQuiz ? (
            <>
              {selectedDifficulty && (
                <div className="hq-quiz-header">
                  <div className="hq-difficulty-info">
                    <span className="hq-difficulty-label">Difficulty:</span>
                    <span className={`hq-difficulty-badge ${selectedDifficulty}`}>
                      {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                    </span>
                  </div>
                  <div className="hq-time-display">
                    <Clock className="h-4 w-4" />
                    <span>Time Limit: {formatTime(timeLimit)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDifficulty(null)
                      setShowQuiz(false)
                    }}
                    className="hq-change-difficulty"
                  >
                    Change Difficulty
                  </Button>
                </div>
              )}
              <QuizEngine
                questions={questions}
                subjectColor={topicData.subjectColor}
                subject={subject}
                topic={topic}
                difficulty={selectedDifficulty || undefined}
                timeLimit={timeLimit}
                onComplete={(score, total) => {
                  console.log(`Quiz completed with score ${score}/${total}`)
                  // Here you would typically save the progress to a database
                }}
              />
            </>
          ) : (
            <div className="hq-no-questions">
              <p>No questions available for this topic yet.</p>
            </div>
          )}
          {showQuiz && !loading && (
            <div className="hq-generate-section">
              <Button
                onClick={() => generateNewQuestionsWithDifficulty(selectedDifficulty || "beginner")}
                className={`hq-generate-button ${topicData.subjectColor}`}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Generate New Questions
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
