"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Brain, RefreshCw, Award, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the provided key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  id: string
  difficulty: string
  topic: string
  expectedTime: number // Expected time to answer in seconds
}

interface TopicPerformance {
  topic: string
  correct: number
  total: number
  averageTimeRatio: number // Ratio of time taken vs expected time
  needsImprovement: boolean
  recommendedLevel: string
  strengths: string[]
  weaknesses: string[]
  questions: {
    question: string
    userAnswer: string | null
    correctAnswer: string
    isCorrect: boolean
    timeSpent: number
    expectedTime: number
    difficulty: string
  }[]
}

interface SubjectInfo {
  name: string
  color: string
  icon: JSX.Element
  slug: string
  topics: string[]
}

const subjects: Record<string, SubjectInfo> = {
  math: {
    name: "Mathematics",
    color: "bg-math text-white",
    icon: <span className="text-2xl">🔢</span>,
    slug: "math",
    topics: ["Algebra", "Geometry", "Arithmetic", "Statistics", "Probability"],
  },
  science: {
    name: "Science",
    color: "bg-science text-white",
    icon: <span className="text-2xl">🔬</span>,
    slug: "science",
    topics: ["Biology", "Chemistry", "Physics", "Earth Science", "Astronomy"],
  },
  reading: {
    name: "Reading",
    color: "bg-reading text-white",
    icon: <span className="text-2xl">📚</span>,
    slug: "reading",
    topics: ["Comprehension", "Vocabulary", "Grammar", "Literature", "Poetry"],
  },
  coding: {
    name: "Coding",
    color: "bg-coding text-white",
    icon: <span className="text-2xl">💻</span>,
    slug: "coding",
    topics: ["HTML", "CSS", "JavaScript", "Python", "Algorithms"],
  },
  art: {
    name: "Art",
    color: "bg-art text-white",
    icon: <span className="text-2xl">🎨</span>,
    slug: "art",
    topics: ["Drawing", "Painting", "Sculpture", "Art History", "Digital Art"],
  },
  music: {
    name: "Music",
    color: "bg-music text-white",
    icon: <span className="text-2xl">🎵</span>,
    slug: "music",
    topics: ["Theory", "Instruments", "Composition", "Music History", "Rhythm"],
  },
  geography: {
    name: "Geography",
    color: "bg-geography text-white",
    icon: <span className="text-2xl">🌍</span>,
    slug: "geography",
    topics: ["Countries", "Landforms", "Climate", "Maps", "Human Geography"],
  },
  logic: {
    name: "Logic",
    color: "bg-logic text-white",
    icon: <span className="text-2xl">🧩</span>,
    slug: "logic",
    topics: ["Puzzles", "Critical Thinking", "Deduction", "Patterns", "Problem Solving"],
  },
}

export default function TestYourLevelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSubject = searchParams.get("subject") || ""

  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [testCompleted, setTestCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recommendedLevel, setRecommendedLevel] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  // Time tracking
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState<Record<number, number>>({})
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const testStartTimeRef = useRef<number>(0)

  // Topic performance tracking
  const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([])
  const [detailedAnalysis, setDetailedAnalysis] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({})

  // User answers tracking
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({})

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  // Toggle expanded state for a topic
  const toggleTopicExpanded = (topic: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }))
  }

  // Function to generate adaptive test questions
  const generateAdaptiveQuestions = async (subject: string) => {
    setLoading(true)
    setError(null)
    testStartTimeRef.current = Date.now()

    try {
      const subjectInfo = subjects[subject]
      if (!subjectInfo) throw new Error("Invalid subject")

      // Try to use the Gemini API
      try {
        const prompt = `Generate 10 quiz questions to test a student's knowledge level in ${subjectInfo.name}.
        
        IMPORTANT: Create 2 questions for each of these topics in ${subjectInfo.name}:
        ${subjectInfo.topics.slice(0, 5).join(", ")}
        
        Create questions with varying difficulty levels:
        - 2 VERY EASY questions (basic knowledge)
        - 2 EASY questions (elementary knowledge)
        - 2 INTERMEDIATE questions (average knowledge)
        - 2 ADVANCED questions (above average knowledge)
        - 2 EXPERT questions (expert knowledge)
        
        Each question must have:
        - A clear question text
        - Four answer choices
        - The index of the correct answer (0-3)
        - A brief explanation
        - The difficulty level explicitly marked
        - The specific topic it belongs to (one of: ${subjectInfo.topics.join(", ")})
        - An expected time to answer in seconds (between 15-60 seconds, with harder questions having more time)
        
        Return ONLY valid JSON formatted like this:
        [
          {
            "question": "What is 2 + 2?",
            "options": ["3", "4", "5", "6"],
            "correctAnswer": 1,
            "explanation": "2 + 2 equals 4.",
            "difficulty": "very easy",
            "topic": "Arithmetic",
            "expectedTime": 15
          }
        ]`

        const result = await model.generateContent(prompt)
        let responseText = result.response.text()

        // Fix: Remove unnecessary formatting
        responseText = responseText.replace(/```json|```/g, "").trim()

        // Parse the JSON
        const parsedQuestions: Question[] = JSON.parse(responseText)

        // Add unique IDs
        const questionsWithIds = parsedQuestions.map((q, index) => ({
          ...q,
          id: `level-test-${subject}-${Date.now()}-${index}`,
        }))

        if (questionsWithIds && questionsWithIds.length > 0) {
          // Shuffle the questions to mix difficulty levels
          const shuffledQuestions = [...questionsWithIds].sort(() => Math.random() - 0.5)

          setQuestions(shuffledQuestions)
          setCurrentQuestionIndex(0)
          setSelectedOption(null)
          setIsAnswerChecked(false)
          setScore(0)
          setTestCompleted(false)
          setShowExplanation(false)
          setTimeSpentPerQuestion({})
          setTopicPerformance([])
          setUserAnswers({})
          setTotalTimeSpent(0)
          setExpandedTopics({})

          // Start the timer for the first question
          if (shuffledQuestions.length > 0) {
            startQuestionTimer(shuffledQuestions[0].expectedTime)
          }

          setLoading(false)
          return
        }
      } catch (error) {
        console.error("Failed to generate with Gemini API, using fallback:", error)
        // Continue to fallback
      }

      // If we get here, the Gemini API failed, so use fallback questions
      const fallbackQuestions: Question[] = []

      // Generate 2 questions for each difficulty level
      const difficulties = ["very easy", "easy", "intermediate", "advanced", "expert"]
      const expectedTimes = [15, 20, 30, 45, 60]

      // Generate questions for each difficulty and topic
      for (let i = 0; i < 5; i++) {
        const difficulty = difficulties[i]
        const expectedTime = expectedTimes[i]

        // Create 2 questions per topic
        for (let j = 0; j < 2; j++) {
          const topicIndex = (i + j) % subjectInfo.topics.length
          const topic = subjectInfo.topics[topicIndex]

          fallbackQuestions.push({
            id: `level-test-${subject}-${Date.now()}-${i}-${j}`,
            question: `Test question about ${topic} (${difficulty} level)`,
            options: [
              `Answer option 1 for ${topic}`,
              `Answer option 2 for ${topic}`,
              `Answer option 3 for ${topic}`,
              `Answer option 4 for ${topic}`,
            ],
            correctAnswer: Math.floor(Math.random() * 4),
            explanation: `This is an explanation for a ${difficulty} level question about ${topic}.`,
            difficulty,
            topic,
            expectedTime,
          })
        }
      }

      // Shuffle the questions
      const shuffledQuestions = [...fallbackQuestions].sort(() => Math.random() - 0.5)

      setQuestions(shuffledQuestions)
      setCurrentQuestionIndex(0)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setScore(0)
      setTestCompleted(false)
      setShowExplanation(false)
      setTimeSpentPerQuestion({})
      setTopicPerformance([])
      setUserAnswers({})
      setTotalTimeSpent(0)
      setExpandedTopics({})

      // Start the timer for the first question
      if (shuffledQuestions.length > 0) {
        startQuestionTimer(shuffledQuestions[0].expectedTime)
      }
    } catch (err) {
      console.error("Error generating adaptive questions:", err)
      setError("Failed to generate questions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Start the test when a subject is selected
  useEffect(() => {
    if (selectedSubject && subjects[selectedSubject]) {
      generateAdaptiveQuestions(selectedSubject)
    }
  }, [selectedSubject])

  // Timer functions
  const startQuestionTimer = (seconds: number) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setTimeLeft(seconds)
    setQuestionStartTime(Date.now())
    setIsTimeUp(false)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!)
          setIsTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Handle time up
  useEffect(() => {
    if (isTimeUp && !isAnswerChecked) {
      // Auto-check answer when time is up
      if (selectedOption !== null) {
        checkAnswer()
      } else {
        // If no option selected, force move to next question
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
        setTimeSpentPerQuestion((prev) => ({
          ...prev,
          [currentQuestionIndex]: timeSpent,
        }))
        setTotalTimeSpent((prev) => prev + timeSpent)

        // Record that the user didn't answer
        setUserAnswers((prev) => ({
          ...prev,
          [currentQuestionIndex]: null,
        }))

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setSelectedOption(null)
          setIsAnswerChecked(false)
          setShowExplanation(false)
          startQuestionTimer(questions[currentQuestionIndex + 1].expectedTime)
        } else {
          completeTest()
        }
      }
    }
  }, [isTimeUp, isAnswerChecked])

  const handleOptionSelect = (index: number) => {
    if (!isAnswerChecked && !isTimeUp) {
      setSelectedOption(index)
    }
  }

  const checkAnswer = () => {
    if (selectedOption === null && !isTimeUp) return

    setIsAnswerChecked(true)
    setShowExplanation(true)

    // Record time spent
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    setTimeSpentPerQuestion((prev) => ({
      ...prev,
      [currentQuestionIndex]: timeSpent,
    }))
    setTotalTimeSpent((prev) => prev + timeSpent)

    // Record user's answer
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption,
    }))

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setShowExplanation(false)
      setIsTimeUp(false)

      // Start timer for next question
      startQuestionTimer(questions[currentQuestionIndex + 1].expectedTime)
    } else {
      completeTest()
    }
  }

  const completeTest = async () => {
    // Calculate topic performance
    const topicStats: Record<
      string,
      {
        correct: number
        total: number
        timeRatios: number[]
        questions: {
          question: string
          userAnswer: string | null
          correctAnswer: string
          isCorrect: boolean
          timeSpent: number
          expectedTime: number
          difficulty: string
        }[]
      }
    > = {}

    questions.forEach((q, index) => {
      const userAnswer = userAnswers[index]
      const isCorrect = userAnswer === q.correctAnswer
      const timeSpent = timeSpentPerQuestion[index] || q.expectedTime
      const timeRatio = timeSpent / q.expectedTime

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { correct: 0, total: 0, timeRatios: [], questions: [] }
      }

      topicStats[q.topic].total += 1
      if (isCorrect) topicStats[q.topic].correct += 1
      topicStats[q.topic].timeRatios.push(timeRatio)
      topicStats[q.topic].questions.push({
        question: q.question,
        userAnswer: userAnswer !== null ? q.options[userAnswer] : null,
        correctAnswer: q.options[q.correctAnswer],
        isCorrect,
        timeSpent,
        expectedTime: q.expectedTime,
        difficulty: q.difficulty,
      })
    })

    // Convert to array and calculate metrics
    const topicPerformanceData = Object.entries(topicStats).map(([topic, stats]) => {
      const correctRatio = stats.correct / stats.total
      const averageTimeRatio = stats.timeRatios.reduce((sum, ratio) => sum + ratio, 0) / stats.timeRatios.length

      // Determine if topic needs improvement
      const needsImprovement = correctRatio < 0.6 || averageTimeRatio > 1.5

      // Recommend level based on performance
      let recommendedLevel = "intermediate"
      if (correctRatio < 0.3) recommendedLevel = "easy"
      else if (correctRatio < 0.5) recommendedLevel = "beginner"
      else if (correctRatio > 0.8) recommendedLevel = "hard"

      // Identify strengths and weaknesses
      const strengths: string[] = []
      const weaknesses: string[] = []

      // Check performance on different difficulty levels
      const byDifficulty: Record<string, { correct: number; total: number }> = {
        "very easy": { correct: 0, total: 0 },
        easy: { correct: 0, total: 0 },
        intermediate: { correct: 0, total: 0 },
        advanced: { correct: 0, total: 0 },
        expert: { correct: 0, total: 0 },
      }

      stats.questions.forEach((q) => {
        const diff = q.difficulty.toLowerCase()
        if (byDifficulty[diff]) {
          byDifficulty[diff].total += 1
          if (q.isCorrect) byDifficulty[diff].correct += 1
        }
      })

      // Analyze time management
      if (averageTimeRatio < 0.8) {
        strengths.push("Excellent time management")
      } else if (averageTimeRatio > 1.5) {
        weaknesses.push("Needs to improve time management")
      }

      // Analyze performance by difficulty
      Object.entries(byDifficulty).forEach(([diff, perf]) => {
        if (perf.total > 0) {
          const ratio = perf.correct / perf.total
          if (ratio === 1) {
            strengths.push(`Perfect on ${diff} questions`)
          } else if (ratio >= 0.7) {
            strengths.push(`Strong on ${diff} questions`)
          } else if (ratio <= 0.3 && perf.total >= 2) {
            weaknesses.push(`Struggles with ${diff} questions`)
          }
        }
      })

      return {
        topic,
        correct: stats.correct,
        total: stats.total,
        averageTimeRatio,
        needsImprovement,
        recommendedLevel,
        strengths,
        weaknesses,
        questions: stats.questions,
      }
    })

    setTopicPerformance(topicPerformanceData)

    // Determine overall recommended level
    const finalScore = score + (selectedOption === currentQuestion?.correctAnswer ? 1 : 0)
    const percentage = (finalScore / questions.length) * 100

    if (percentage < 30) {
      setRecommendedLevel("easy")
    } else if (percentage < 50) {
      setRecommendedLevel("beginner")
    } else if (percentage < 75) {
      setRecommendedLevel("intermediate")
    } else {
      setRecommendedLevel("hard")
    }

    // Generate detailed analysis with Gemini
    setIsAnalyzing(true)
    try {
      // Prepare data for analysis
      const testData = {
        subject: subjects[selectedSubject].name,
        score: finalScore,
        totalQuestions: questions.length,
        totalTimeSpent: totalTimeSpent,
        topicPerformance: topicPerformanceData.map((t) => ({
          topic: t.topic,
          correct: t.correct,
          total: t.total,
          timeRatio: t.averageTimeRatio,
          recommendedLevel: t.recommendedLevel,
        })),
        questions: questions.map((q, i) => ({
          question: q.question,
          topic: q.topic,
          difficulty: q.difficulty,
          userAnswer: userAnswers[i] !== null ? q.options[userAnswers[i]!] : "No answer",
          correctAnswer: q.options[q.correctAnswer],
          isCorrect: userAnswers[i] === q.correctAnswer,
          timeSpent: timeSpentPerQuestion[i] || 0,
          expectedTime: q.expectedTime,
        })),
      }

      const analysisPrompt = `
        Analyze this student's test performance in ${subjects[selectedSubject].name}:
        
        Overall Score: ${finalScore}/${questions.length} (${Math.round(percentage)}%)
        Total Time Spent: ${Math.floor(totalTimeSpent / 60)} minutes ${totalTimeSpent % 60} seconds
        
        Topic Performance:
        ${topicPerformanceData
          .map(
            (t) =>
              `- ${t.topic}: ${t.correct}/${t.total} correct (${Math.round((t.correct / t.total) * 100)}%), Time ratio: ${t.averageTimeRatio.toFixed(2)}`,
          )
          .join("\n")}
        
        Provide a concise, personalized analysis (maximum 250 words) that:
        1. Identifies their strongest and weakest topics
        2. Analyzes their time management
        3. Suggests specific areas to focus on
        4. Recommends learning strategies based on their performance pattern
        
        Keep the tone encouraging but honest. Focus on actionable advice.
      `

      const result = await model.generateContent(analysisPrompt)
      const analysis = result.response.text()
      setDetailedAnalysis(analysis)
    } catch (error) {
      console.error("Error generating analysis:", error)
      setDetailedAnalysis(
        "We couldn't generate a detailed analysis at this time. Please review your topic performance for insights.",
      )
    } finally {
      setIsAnalyzing(false)
    }

    setTestCompleted(true)
  }

  // If no subject is selected, show subject selection
  if (!selectedSubject || !subjects[selectedSubject]) {
    return (
      <div className="container py-12 md:py-20">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
            <div className="absolute inset-0 pattern-dots opacity-10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text from-primary via-purple-500 to-pink-500">
                Test Your Knowledge Level
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Take a quick assessment to determine which difficulty level is right for you. Select a subject to begin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(subjects).map(([slug, subject]) => (
              <button
                key={slug}
                onClick={() => setSelectedSubject(slug)}
                className="p-6 rounded-xl bg-secondary/30 border border-secondary hover:bg-secondary/50 transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${subject.color} flex items-center justify-center`}>
                    {subject.icon}
                  </div>
                  <h3 className="text-xl font-bold">{subject.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Test your knowledge in {subject.name.toLowerCase()} and find the right difficulty level.
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <span className="ml-3 text-muted-foreground">Generating assessment questions...</span>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <Button
          onClick={() => generateAdaptiveQuestions(selectedSubject)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </Button>
      </div>
    )
  }

  // If test is completed, show results
  if (testCompleted) {
    const finalScore = score + (selectedOption === currentQuestion?.correctAnswer ? 1 : 0)
    const subjectInfo = subjects[selectedSubject]
    const percentage = Math.round((finalScore / questions.length) * 100)

    // Topics that need improvement
    const topicsNeedingImprovement = topicPerformance.filter((t) => t.needsImprovement)

    return (
      <div className="container py-12 md:py-20">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>

          <Card className="w-full">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Assessment Completed!</CardTitle>
              <CardDescription className="text-lg">
                You scored {finalScore} out of {questions.length} ({percentage}%)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="w-full max-w-xs mx-auto">
                <div className="relative h-4 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 bottom-0 ${subjectInfo.color.split(" ")[0]}`}
                    style={{ width: `${(finalScore / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-primary/10 border border-primary/30 max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-2">Recommended Level</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      recommendedLevel === "easy"
                        ? "bg-green-500"
                        : recommendedLevel === "beginner"
                          ? "bg-blue-500"
                          : recommendedLevel === "intermediate"
                            ? "bg-orange-500"
                            : "bg-red-500"
                    } text-white`}
                  >
                    {recommendedLevel.charAt(0).toUpperCase() + recommendedLevel.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your overall performance, we recommend you start with <strong>{recommendedLevel}</strong>{" "}
                  difficulty in {subjectInfo.name}.
                </p>
              </div>

              {/* Detailed AI Analysis */}
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-4">Personalized Analysis</h3>
                {isAnalyzing ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mr-2"></div>
                    <span className="text-muted-foreground">Analyzing your performance...</span>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {detailedAnalysis.split("\n").map((paragraph, i) => (
                      <p key={i} className={i === 0 ? "font-medium" : ""}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Topic-specific feedback with detailed question breakdown */}
              <div className="p-6 rounded-xl bg-secondary/50 border border-secondary max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-4">Detailed Topic Performance</h3>

                {topicPerformance.map((topic, topicIndex) => (
                  <div key={topicIndex} className="mb-6 last:mb-0">
                    <div
                      className="p-3 rounded-lg bg-secondary/70 border border-secondary cursor-pointer"
                      onClick={() => toggleTopicExpanded(topic.topic)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{topic.topic}</span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              topic.needsImprovement
                                ? "bg-amber-500/20 text-amber-600"
                                : "bg-green-500/20 text-green-600"
                            }`}
                          >
                            {topic.needsImprovement ? "Needs Improvement" : "Strong Performance"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">
                            {topic.correct}/{topic.total} correct
                          </span>
                          {expandedTopics[topic.topic] ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedTopics[topic.topic] && (
                      <div className="mt-2 pl-2 border-l-2 border-primary/30">
                        <div className="text-sm font-medium mb-2 text-primary">Question Breakdown:</div>
                        {topic.questions.map((q, qIndex) => (
                          <div
                            key={qIndex}
                            className="mb-3 last:mb-0 p-3 rounded-lg bg-secondary/30 border border-secondary"
                          >
                            <div className="flex items-start gap-2">
                              {q.isCorrect ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                              )}
                              <div>
                                <div className="font-medium text-sm">{q.question}</div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  <span className="inline-block px-1.5 py-0.5 rounded bg-secondary mr-2">
                                    {q.difficulty}
                                  </span>
                                  <span className="inline-flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {q.timeSpent}s / {q.expectedTime}s
                                  </span>
                                </div>

                                <div className="mt-2 grid grid-cols-1 gap-1">
                                  <div className="text-xs">
                                    <span className="text-muted-foreground">Your answer: </span>
                                    <span
                                      className={
                                        q.isCorrect ? "text-green-500 font-medium" : "text-red-500 font-medium"
                                      }
                                    >
                                      {q.userAnswer || "No answer provided"}
                                    </span>
                                  </div>

                                  {!q.isCorrect && (
                                    <div className="text-xs">
                                      <span className="text-muted-foreground">Correct answer: </span>
                                      <span className="text-green-500 font-medium">{q.correctAnswer}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Topic summary */}
                        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="text-sm font-medium mb-1">Topic Summary:</div>

                          {topic.strengths.length > 0 && (
                            <div className="mt-2">
                              <span className="text-green-500 text-xs font-medium">STRENGTHS:</span>
                              <ul className="text-xs mt-1 space-y-1">
                                {topic.strengths.map((strength, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5" />
                                    <span>{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {topic.weaknesses.length > 0 && (
                            <div className="mt-2">
                              <span className="text-red-500 text-xs font-medium">AREAS TO IMPROVE:</span>
                              <ul className="text-xs mt-1 space-y-1">
                                {topic.weaknesses.map((weakness, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <XCircle className="h-3 w-3 text-red-500 mr-1 mt-0.5" />
                                    <span>{weakness}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="mt-2 text-xs">
                            <span className="text-primary font-medium">Recommendation:</span> Start with{" "}
                            <span className="font-medium">{topic.recommendedLevel}</span> difficulty for this topic
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Time Analysis */}
              <div className="p-6 rounded-xl bg-secondary/30 border border-secondary max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-4">Time Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total time spent:</span>
                    <span className="font-medium">
                      {Math.floor(totalTimeSpent / 60)}m {totalTimeSpent % 60}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Average time per question:</span>
                    <span className="font-medium">{Math.round(totalTimeSpent / questions.length)}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Questions answered on time:</span>
                    <span className="font-medium">
                      {
                        Object.values(timeSpentPerQuestion).filter((time, idx) => time <= questions[idx]?.expectedTime)
                          .length
                      }{" "}
                      / {questions.length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center p-6">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestionIndex(0)
                  setSelectedOption(null)
                  setIsAnswerChecked(false)
                  setScore(0)
                  setTestCompleted(false)
                  generateAdaptiveQuestions(selectedSubject)
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retake Test
              </Button>

              <Button
                className={`${subjectInfo.color.split(" ")[0]} text-white`}
                onClick={() => {
                  router.push(`/subjects/${selectedSubject}?difficulty=${recommendedLevel}`)
                }}
              >
                Start Learning at {recommendedLevel.charAt(0).toUpperCase() + recommendedLevel.slice(1)} Level
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Show the test questions
  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
          <div className="absolute inset-0 pattern-dots opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${subjects[selectedSubject].color}`}>
                {subjects[selectedSubject].name}
              </div>
              <div className="text-xs text-muted-foreground">Knowledge Assessment</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Test Your Level</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Answer these questions to help us determine the right difficulty level for you.
            </p>
          </div>
        </div>

        {currentQuestion && (
          <Card className="w-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="text-sm font-medium">
                  Score: {score}/{currentQuestionIndex + (isAnswerChecked ? 1 : 0)}
                </div>
              </div>

              <Progress value={progress} className="h-1.5 bg-secondary mt-2" />

              {/* Timer display */}
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm font-medium">
                  Topic: <span className="text-primary">{currentQuestion.topic}</span>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    timeLeft && timeLeft < 10 ? "text-red-500 animate-pulse" : "text-muted-foreground"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  {timeLeft !== null ? `${timeLeft}s remaining` : "Time's up!"}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <h3 className="text-xl font-bold mb-6">{currentQuestion.question}</h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`answer-option p-4 rounded-lg cursor-pointer relative z-10 ${
                      selectedOption === index
                        ? "bg-primary/10 border border-primary"
                        : "bg-secondary/30 border border-secondary hover:bg-secondary/50"
                    } ${isAnswerChecked && index === currentQuestion.correctAnswer ? "bg-green-500/10 border border-green-500" : ""} ${
                      isAnswerChecked && selectedOption === index && selectedOption !== currentQuestion.correctAnswer
                        ? "bg-red-500/10 border border-red-500"
                        : ""
                    }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                            selectedOption === index
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          } ${
                            isAnswerChecked && index === currentQuestion.correctAnswer ? "bg-green-500 text-white" : ""
                          } ${
                            isAnswerChecked &&
                            selectedOption === index &&
                            selectedOption !== currentQuestion.correctAnswer
                              ? "bg-red-500 text-white"
                              : ""
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-md">{option}</span>
                      </div>

                      {isAnswerChecked && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {isAnswerChecked &&
                        selectedOption === index &&
                        selectedOption !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {showExplanation && currentQuestion.explanation && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
                    isAnswerChecked && selectedOption === currentQuestion.correctAnswer
                      ? "bg-green-500/10 border border-green-500/30"
                      : "bg-red-500/10 border border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Brain className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-primary">Explanation</p>
                      <p className="text-sm text-muted-foreground mt-1">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-4 pb-6">
              <Button
                onClick={isAnswerChecked ? nextQuestion : checkAnswer}
                disabled={selectedOption === null && !isTimeUp}
                className={`${subjects[selectedSubject].color.split(" ")[0]} text-white w-full`}
              >
                {isAnswerChecked
                  ? currentQuestionIndex < questions.length - 1
                    ? "Next Question"
                    : "Complete Assessment"
                  : "Check Answer"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}