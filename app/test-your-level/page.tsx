"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Brain, RefreshCw, Award, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  Calculator, Microscope, BookOpen, Code, Palette, Music, Globe, Lightbulb
} from "lucide-react"
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

import type { ReactElement } from "react"

interface SubjectInfo {
  name: string
  color: string
  icon: ReactElement
  slug: string
  topics: string[]
}

import "./moon-knight.css"

const subjects: Record<string, SubjectInfo> = {
  math: {
    name: "Mathematics",
    color: "moon-knight-primary",
    icon: <Calculator className="w-6 h-6" />,
    slug: "math",
    topics: ["Algebra", "Geometry", "Arithmetic", "Statistics", "Probability"],
  },
  science: {
    name: "Science",
    color: "moon-knight-secondary",
    icon: <Microscope className="w-6 h-6" />,
    slug: "science",
    topics: ["Biology", "Chemistry", "Physics", "Earth Science", "Astronomy"],
  },
  reading: {
    name: "Reading",
    color: "moon-knight-accent",
    icon: <BookOpen className="w-6 h-6" />,
    slug: "reading",
    topics: ["Comprehension", "Vocabulary", "Grammar", "Literature", "Poetry"],
  },
  coding: {
    name: "Coding",
    color: "moon-knight-primary",
    icon: <Code className="w-6 h-6" />,
    slug: "coding",
    topics: ["HTML", "CSS", "JavaScript", "Python", "Algorithms"],
  },
  art: {
    name: "Art",
    color: "moon-knight-secondary",
    icon: <Palette className="w-6 h-6" />,
    slug: "art",
    topics: ["Drawing", "Painting", "Sculpture", "Art History", "Digital Art"],
  },
  music: {
    name: "Music",
    color: "moon-knight-accent",
    icon: <Music className="w-6 h-6" />,
    slug: "music",
    topics: ["Theory", "Instruments", "Composition", "Music History", "Rhythm"],
  },
  geography: {
    name: "Geography",
    color: "moon-knight-primary",
    icon: <Globe className="w-6 h-6" />,
    slug: "geography",
    topics: ["Countries", "Landforms", "Climate", "Maps", "Human Geography"],
  },
  logic: {
    name: "Logic",
    color: "moon-knight-secondary",
    icon: <Lightbulb className="w-6 h-6" />,
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

  // Audio reference for Moon Knight theme
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

    // Start playing Moon Knight theme music during loading
    if (audioRef.current) {
      console.log('Starting Moon Knight theme music...')
      audioRef.current.currentTime = 0
      // Force play the audio
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio started successfully!')
          })
          .catch(error => {
            console.log("Audio autoplay prevented:", error)
            // Create a user interaction listener to start audio
            const startAudioOnInteraction = () => {
              if (audioRef.current) {
                console.log('Attempting to play audio on user interaction...')
                audioRef.current.play()
                  .then(() => console.log('Audio started after user interaction!'))
                  .catch(err => console.error('Failed to start audio:', err))
              }
              // Remove listeners after first attempt
              document.removeEventListener('click', startAudioOnInteraction)
              document.removeEventListener('keydown', startAudioOnInteraction)
              document.removeEventListener('touchstart', startAudioOnInteraction)
            }
            
            // Add multiple event listeners for user interaction
            document.addEventListener('click', startAudioOnInteraction, { once: true })
            document.addEventListener('keydown', startAudioOnInteraction, { once: true })
            document.addEventListener('touchstart', startAudioOnInteraction, { once: true })
          })
      }
    } else {
      console.warn('Audio ref is not available')
    }

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
          setShowExplanation(false)
          setUserAnswers({})
          setTimeSpentPerQuestion({})
          setTotalTimeSpent(0)

          // Start timer for first question
          if (shuffledQuestions[0]) {
            startQuestionTimer(shuffledQuestions[0].expectedTime)
          }
        } else {
          throw new Error("No questions generated")
        }
      } catch (aiError) {
        console.error("AI API error:", aiError)
        // Fallback to hardcoded questions
        const fallbackQuestions = generateFallbackQuestions(subject)
        setQuestions(fallbackQuestions)
        setCurrentQuestionIndex(0)
        setSelectedOption(null)
        setIsAnswerChecked(false)
        setScore(0)
        setShowExplanation(false)
        setUserAnswers({})
        setTimeSpentPerQuestion({})
        setTotalTimeSpent(0)

        if (fallbackQuestions[0]) {
          startQuestionTimer(fallbackQuestions[0].expectedTime)
        }
      }
    } catch (err) {
      console.error("Error generating questions:", err)
      setError("Failed to generate questions. Please try again.")
    } finally {
      setLoading(false)
      // Fade out and stop the music when loading is complete
      if (audioRef.current && !audioRef.current.paused) {
        const fadeOut = () => {
          if (audioRef.current && audioRef.current.volume > 0) {
            audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.05)
            if (audioRef.current.volume > 0) {
              setTimeout(fadeOut, 100)
            } else {
              audioRef.current.pause()
              audioRef.current.currentTime = 0
              audioRef.current.volume = 0.3 // Reset volume for next time
            }
          }
        }
        fadeOut()
      }
    }
  }

  // Fallback questions generator
  const generateFallbackQuestions = (subject: string): Question[] => {
    const subjectInfo = subjects[subject]
    const baseQuestions = [
      {
        question: `What is a basic concept in ${subjectInfo.name}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        explanation: "This is the correct answer.",
        difficulty: "easy",
        topic: subjectInfo.topics[0],
        expectedTime: 30,
      },
      // Add more fallback questions as needed
    ]

    return baseQuestions.map((q, index) => ({
      ...q,
      id: `fallback-${subject}-${index}`,
    }))
  }

  // Start the test when a subject is selected
  useEffect(() => {
    if (selectedSubject && subjects[selectedSubject]) {
      generateAdaptiveQuestions(selectedSubject)
    }
  }, [selectedSubject])

  // Initialize audio when component mounts
  useEffect(() => {
    // Initialize audio element for Moon Knight theme
    const audio = new Audio('sounds/moon-knight-theme.mp3')
    audio.loop = true
    audio.volume = 0.3
    audio.preload = 'auto'
    
    // Handle audio loading errors gracefully
    audio.addEventListener('error', () => {
      console.warn('Could not load Moon Knight theme music')
    })
    
    audioRef.current = audio

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

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
      checkAnswer()
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
      timerRef.current = null
    }

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setShowExplanation(false)
      setIsTimeUp(false)

      // Start timer for next question
      const nextQuestion = questions[currentQuestionIndex + 1]
      if (nextQuestion) {
        startQuestionTimer(nextQuestion.expectedTime)
      }
    } else {
      completeTest()
    }
  }

  const completeTest = async () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Calculate final test time
    const finalTime = Date.now() - testStartTimeRef.current
    setTotalTimeSpent(finalTime / 1000)

    // Calculate performance metrics
    const totalQuestions = questions.length
    const correctAnswers = score
    const percentageScore = Math.round((correctAnswers / totalQuestions) * 100)
    
    // Determine level based on performance
    let level = "Beginner"
    let levelDescription = "Keep practicing! You're just getting started."
    let levelColor = "text-yellow-500"
    
    if (percentageScore >= 90) {
      level = "Expert"
      levelDescription = "Outstanding! You have mastery-level knowledge."
      levelColor = "text-emerald-500"
    } else if (percentageScore >= 75) {
      level = "Advanced"
      levelDescription = "Excellent work! You have strong knowledge in this subject."
      levelColor = "text-blue-500"
    } else if (percentageScore >= 60) {
      level = "Intermediate"
      levelDescription = "Good job! You have a solid foundation to build upon."
      levelColor = "text-green-500"
    } else if (percentageScore >= 40) {
      level = "Novice"
      levelDescription = "You're making progress! Focus on the fundamentals."
      levelColor = "text-orange-500"
    }

    setRecommendedLevel(level)

    // Calculate topic-wise performance
    const topicStats: Record<string, { correct: number; total: number; questions: any[] }> = {}
    
    questions.forEach((question, index) => {
      const topic = question.topic
      if (!topicStats[topic]) {
        topicStats[topic] = { correct: 0, total: 0, questions: [] }
      }
      
      const userAnswer = userAnswers[index]
      const isCorrect = userAnswer === question.correctAnswer
      const timeSpent = timeSpentPerQuestion[index] || question.expectedTime
      
      topicStats[topic].total += 1
      if (isCorrect) topicStats[topic].correct += 1
      
      topicStats[topic].questions.push({
        question: question.question,
        userAnswer: userAnswer !== null ? question.options[userAnswer] : "No answer",
        correctAnswer: question.options[question.correctAnswer],
        isCorrect,
        timeSpent,
        expectedTime: question.expectedTime,
        difficulty: question.difficulty
      })
    })

    // Convert to TopicPerformance format
    const topicPerformanceData: TopicPerformance[] = Object.entries(topicStats).map(([topic, stats]) => {
      const accuracy = stats.correct / stats.total
      const avgTimeRatio = stats.questions.reduce((sum, q) => sum + (q.timeSpent / q.expectedTime), 0) / stats.questions.length
      
      return {
        topic,
        correct: stats.correct,
        total: stats.total,
        averageTimeRatio: avgTimeRatio,
        needsImprovement: accuracy < 0.6,
        recommendedLevel: accuracy >= 0.8 ? "Advanced" : accuracy >= 0.6 ? "Intermediate" : "Beginner",
        strengths: accuracy >= 0.7 ? [`Strong performance in ${topic}`] : [],
        weaknesses: accuracy < 0.6 ? [`Needs improvement in ${topic}`] : [],
        questions: stats.questions
      }
    })

    setTopicPerformance(topicPerformanceData)
    setTestCompleted(true)
  }

  // Add custom CSS animations and force cursor
  useEffect(() => {
    console.log('Setting up Moon Knight custom cursor overlay...');
    
    // Create animations and styles
    const style = document.createElement('style')
    style.id = 'moon-knight-cursor-styles'
    style.textContent = `
      /* Hide default cursor completely and consistently */
      *, *::before, *::after {
        cursor: none !important;
      }
      
      html, body {
        cursor: none !important;
      }
      
      /* Override all possible cursor styles including pointer */
      button, a, input, textarea, select, 
      [role="button"], [onclick], 
      .clickable, .moon-knight-subject-card, 
      .moon-knight-option, .moon-knight-button {
        cursor: none !important;
      }
      
      /* Force override any hover or pointer states */
      *:hover, *:focus, *:active, *:visited {
        cursor: none !important;
      }
      
      /* Ensure no element can override the cursor */
      .moon-knight-container *, 
      .container *, 
      div, span, p, h1, h2, h3, h4, h5, h6 {
        cursor: none !important;
      }
      
      /* Override any CSS classes that might set cursor pointer */
      .cursor-pointer, .pointer, [style*="cursor"] {
        cursor: none !important;
      }
      
      /* Custom cursor element */
      .moon-knight-cursor {
        position: fixed;
        width: 24px;
        height: 24px;
        pointer-events: none;
        z-index: 999999;
        background-image: url('https://i.postimg.cc/MKCjS52C/Screenshot-2025-06-29-193857-Photoroom.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        transform: translate(-16px, -16px);
        transition: transform 0.1s ease-out;
        opacity: 0.9;
        mix-blend-mode: normal;
        will-change: transform;
        rotate: 90deg;
      }
      
      .moon-knight-cursor.clicking {
        transform: translate(-16px, -16px) scale(0.85);
        opacity: 1;
      }
      
      .moon-knight-cursor.hovering {
        transform: translate(-16px, -16px) scale(1.2);
        opacity: 1;
        filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
      }
      
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes title-glow {
        0%, 100% { text-shadow: 0 0 20px var(--mk-golden-glow); }
        50% { text-shadow: 0 0 40px var(--mk-golden-glow), 0 0 60px var(--mk-ancient-gold); }
      }
      
      @keyframes text-shimmer {
        0% { opacity: 0.7; }
        50% { opacity: 1; }
        100% { opacity: 0.7; }
      }
      
      @keyframes cards-appear {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes card-hover {
        0% { transform: scale(1) translateY(0); }
        100% { transform: scale(1.05) translateY(-5px); }
      }
      
      .animate-fade-in {
        animation: fade-in 0.8s ease-out;
      }
      
      .animate-title-glow {
        animation: title-glow 3s ease-in-out infinite;
      }
      
      .animate-text-shimmer {
        animation: text-shimmer 2s ease-in-out infinite;
      }
      
      .animate-cards-appear {
        animation: cards-appear 0.8s ease-out 0.4s both;
      }
      
      .animate-card-hover:hover {
        animation: card-hover 0.3s ease-out forwards;
      }
      
      /* Crescent Blades Loading Animation */
      .crescent-blade-container {
        position: absolute;
        width: 500px;
        height: 500px;
        top: 50%;
        left: 50%;
        transform-origin: center;
        transition: all 2s ease-out;
        z-index: 15;
      }
      
      .crescent-blade-1 {
        transform: translate(-50%, -50%);
        animation: blade-rotate-and-slide-right 7s ease-out forwards;
      }
      
      .crescent-blade-2 {
        transform: translate(-50%, -50%) scaleX(-1);
        animation: blade-rotate-and-slide-left 7s ease-out forwards;
        opacity: 0.95;
      }
      
      .crescent-blade-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 0 40px var(--mk-golden-glow)) drop-shadow(0 0 80px var(--mk-ancient-gold));
      }
      
      /* Cloud Reveal Effect */
      .cloud-reveal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;
        background: radial-gradient(ellipse, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0.4) 20%, rgba(255, 215, 0, 0.2) 40%, rgba(255, 215, 0, 0.1) 60%, transparent 80%);
        border-radius: 50%;
        animation: cloud-reveal-expand 4s ease-out 4.5s forwards;
        opacity: 0;
        z-index: 10;
        box-shadow: 0 0 150px rgba(255, 215, 0, 0.5), inset 0 0 100px rgba(255, 215, 0, 0.2);
      }
      
      /* Assessment Text Reveal */
      .assessment-text-reveal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        animation: assessment-text-appear 3s ease-out 7s forwards;
        z-index: 5;
        text-align: center;
      }
      
      .assessment-subject-name {
        font-size: 3rem;
        font-weight: 900;
        background: linear-gradient(45deg, #FFD700, #FFA500, #FF8C00, #FFD700);
        background-size: 400% 400%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 60px rgba(255, 215, 0, 0.8);
        margin-bottom: 1.5rem;
        animation: text-gradient-flow 3s ease-in-out infinite, text-glow-pulse 4s ease-in-out infinite;
        filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
      }
      
      .assessment-subtitle {
        font-size: 1.4rem;
        font-weight: 600;
        color: #E6E6FA;
        text-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3);
        animation: text-mystical-glow 2.5s ease-in-out infinite alternate;
        letter-spacing: 2px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
      }
      
      @keyframes assessment-text-appear {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0) rotateX(90deg) rotateY(180deg);
        }
        20% {
          opacity: 0.2;
          transform: translate(-50%, -50%) scale(0.3) rotateX(60deg) rotateY(120deg);
        }
        40% {
          opacity: 0.5;
          transform: translate(-50%, -50%) scale(0.6) rotateX(30deg) rotateY(60deg);
        }
        60% {
          opacity: 0.7;
          transform: translate(-50%, -50%) scale(0.8) rotateX(15deg) rotateY(30deg);
        }
        80% {
          opacity: 0.9;
          transform: translate(-50%, -50%) scale(1.1) rotateX(-5deg) rotateY(-10deg);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1) rotateX(0deg) rotateY(0deg);
        }
      }
      
      @keyframes text-gradient-flow {
        0%, 100% { 
          background-position: 0% 50%;
        }
        50% { 
          background-position: 100% 50%;
        }
      }
      
      @keyframes text-glow-pulse {
        0%, 100% { 
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 40px rgba(255, 165, 0, 0.4));
          transform: scale(1);
        }
        50% { 
          filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 80px rgba(255, 165, 0, 0.6)) drop-shadow(0 0 120px rgba(255, 140, 0, 0.3));
          transform: scale(1.02);
        }
      }
      
      @keyframes text-mystical-glow {
        0% { 
          opacity: 0.8;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3);
          transform: translateY(0px);
        }
        100% { 
          opacity: 1;
          text-shadow: 0 0 50px rgba(255, 215, 0, 0.8), 0 0 100px rgba(255, 215, 0, 0.5), 0 0 150px rgba(255, 140, 0, 0.3);
          transform: translateY(-3px);
        }
      }
      
      /* Mystical Loading Orbs */
      .mystical-loading-orbs {
        position: fixed;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 15px;
        z-index: 20;
      }
      
      .loading-orb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: radial-gradient(circle, #FFD700, #FFA500);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4);
        animation: orb-pulse 1.5s ease-in-out infinite;
      }
      
      .loading-orb:nth-child(1) { animation-delay: 0s; }
      .loading-orb:nth-child(2) { animation-delay: 0.2s; }
      .loading-orb:nth-child(3) { animation-delay: 0.4s; }
      .loading-orb:nth-child(4) { animation-delay: 0.6s; }
      .loading-orb:nth-child(5) { animation-delay: 0.8s; }
      
      @keyframes orb-pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.6;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4);
        }
        50% {
          transform: scale(1.5);
          opacity: 1;
          box-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 60px rgba(255, 215, 0, 0.6), 0 0 90px rgba(255, 140, 0, 0.3);
        }
      }
      
      @keyframes blade-rotate-and-slide-right {
        0% { 
          transform: translate(-50%, -50%) rotate(0deg) scale(1);
          opacity: 1;
        }
        20% { 
          transform: translate(-50%, -50%) rotate(72deg) scale(1.1);
          opacity: 1;
        }
        40% { 
          transform: translate(-50%, -50%) rotate(144deg) scale(1.3);
          opacity: 0.95;
        }
        60% { 
          transform: translate(-50%, -50%) rotate(216deg) scale(1.6);
          opacity: 0.9;
        }
        70% { 
          transform: translate(-10%, -50%) rotate(288deg) scale(1.8);
          opacity: 0.8;
        }
        85% { 
          transform: translate(100%, -50%) rotate(340deg) scale(2.2);
          opacity: 0.4;
        }
        100% { 
          transform: translate(200%, -50%) rotate(360deg) scale(2.5);
          opacity: 0.1;
        }
      }
      
      @keyframes blade-rotate-and-slide-left {
        0% { 
          transform: translate(-50%, -50%) scaleX(-1) rotate(0deg) scale(1);
          opacity: 0.95;
        }
        20% { 
          transform: translate(-50%, -50%) scaleX(-1) rotate(72deg) scale(1.1);
          opacity: 0.9;
        }
        40% { 
          transform: translate(-50%, -50%) scaleX(-1) rotate(144deg) scale(1.3);
          opacity: 0.85;
        }
        60% { 
          transform: translate(-50%, -50%) scaleX(-1) rotate(216deg) scale(1.6);
          opacity: 0.8;
        }
        70% { 
          transform: translate(-110%, -50%) scaleX(-1) rotate(288deg) scale(1.8);
          opacity: 0.6;
        }
        85% { 
          transform: translate(-200%, -50%) scaleX(-1) rotate(340deg) scale(2.2);
          opacity: 0.3;
        }
        100% { 
          transform: translate(-300%, -50%) scaleX(-1) rotate(360deg) scale(2.5);
          opacity: 0.1;
        }
      }
      
      @keyframes cloud-reveal-expand {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0);
        }
        15% {
          opacity: 0.4;
          transform: translate(-50%, -50%) scale(1);
        }
        30% {
          opacity: 0.7;
          transform: translate(-50%, -50%) scale(3);
        }
        50% {
          opacity: 0.9;
          transform: translate(-50%, -50%) scale(6);
        }
        70% {
          opacity: 0.6;
          transform: translate(-50%, -50%) scale(12);
        }
        85% {
          opacity: 0.3;
          transform: translate(-50%, -50%) scale(18);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(25);
        }
      }
      
      @keyframes questions-appear {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0) rotateY(180deg);
        }
        30% {
          opacity: 0.3;
          transform: translate(-50%, -50%) scale(0.3) rotateY(90deg);
        }
        60% {
          opacity: 0.7;
          transform: translate(-50%, -50%) scale(0.7) rotateY(45deg);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1) rotateY(0deg);
        }
      }
      
      @keyframes loading-progress {
        0% {
          transform: translateX(-100%);
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          transform: translateX(100%);
          background-position: 0% 50%;
        }
      } 
    `
    document.head.appendChild(style)
    
    // Add a more aggressive cursor override
    const forceNoCursor = () => {
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.cursor = 'none';
        }
      });
    };
    
    // Force cursor override immediately and on any DOM changes
    forceNoCursor();
    
    // Set up mutation observer to catch dynamic content
    const observer = new MutationObserver(() => {
      forceNoCursor();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.className = 'moon-knight-cursor md:visible invisible';
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '999999';
    document.body.appendChild(cursor);
    
    // Track mouse movement with stable positioning
    let mouseX = 0;
    let mouseY = 0;
    let rafId: number | null = null;
    let currentHoveredElement: Element | null = null;
    
    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Cancel previous frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        // Update cursor position
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        
        // Check for interactive elements
        const elementUnderCursor = document.elementFromPoint(mouseX, mouseY);
        const isInteractive = elementUnderCursor && (
          elementUnderCursor.tagName === 'BUTTON' ||
          elementUnderCursor.tagName === 'A' ||
          elementUnderCursor.closest('button') ||
          elementUnderCursor.closest('a') ||
          elementUnderCursor.classList.contains('moon-knight-subject-card') ||
          elementUnderCursor.classList.contains('moon-knight-option') ||
          elementUnderCursor.classList.contains('moon-knight-button') ||
          elementUnderCursor.classList.contains('clickable') ||
          elementUnderCursor.getAttribute('role') === 'button'
        );
        
        // Update hover state
        if (isInteractive && !cursor.classList.contains('hovering')) {
          cursor.classList.add('hovering');
          currentHoveredElement = elementUnderCursor;
        } else if (!isInteractive && cursor.classList.contains('hovering')) {
          cursor.classList.remove('hovering');
          currentHoveredElement = null;
        }
      });
    };
    
    // Handle cursor visibility
    const showCursor = () => {
      cursor.style.opacity = '0.9';
    };
    
    const hideCursor = () => {
      cursor.style.opacity = '0';
    };
    
    // Handle mouse interactions
    const handleMouseDown = () => {
      cursor.classList.add('clicking');
    };
    
    const handleMouseUp = () => {
      cursor.classList.remove('clicking');
    };
    
    // Add event listeners
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseenter', showCursor);
    document.addEventListener('mouseleave', hideCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    console.log('Moon Knight cursor system initialized');
    
    return () => {
      // Cleanup
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', showCursor);
      document.removeEventListener('mouseleave', hideCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Stop mutation observer
      observer.disconnect();
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      if (cursor && cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
      
      const existingStyle = document.getElementById('moon-knight-cursor-styles');
      if (existingStyle && existingStyle.parentNode) {
        existingStyle.parentNode.removeChild(existingStyle);
      }
    };
  }, [])

  // If no subject is selected, show subject selection
  if (!selectedSubject || !subjects[selectedSubject]) {
    return (
      <div className="moon-knight-container">

        {/* Background Image with overlay */}
        <div className="absolute inset-0 flex h-auto w-auto">
          <img
            src="https://i.postimg.cc/T2ynnZtM/favpng-306783c776b1736dd8d34378982cda68.png"
            alt="background"
            className="opacity-100 w-[500px] h-auto mb-80 fixed top-20 right-10 z-10 drop-shadow-[0_0_40px_#ffffff] scale-x-[-1]"
          />
        </div>

        <div className="moon-knight-bg"></div>

        <div className="container py-12 md:py-20 relative z-10">
          <div className="mb-8">
            <Link
              href="/eduplay/dashboard"
              className="inline-flex items-center text-sm font-medium text-moon-knight-silver hover:text-moon-knight-gold mb-4 transition-colors duration-300"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>

            <div className="moon-knight-hero-card animate-fade-in">
              <div className="hieroglyphic-border"></div>
              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 moon-knight-title animate-title-glow">
                  Test Your Knowledge Level
                </h1>
                <p className="text-lg text-moon-knight-silver max-w-3xl animate-text-shimmer">
                  Take a quick assessment to determine which difficulty level is right for you. Select a subject to
                  begin your journey through the mysteries of knowledge.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-cards-appear">
              {Object.entries(subjects).map(([key, subject], index) => (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedSubject(key)
                    // Try to enable audio on user interaction
                    if (audioRef.current) {
                      console.log('User clicked subject, preparing audio...')
                      // Enable audio context on user gesture
                      audioRef.current.play().then(() => {
                        audioRef.current?.pause()
                        audioRef.current!.currentTime = 0
                        console.log('Audio context enabled!')
                      }).catch(console.error)
                    }
                  }}
                  className="moon-knight-subject-card animate-card-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="crescent-glow"></div>
                  <div className="relative z-10 text-left">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="moon-knight-icon-container">{subject.icon}</div>
                      <h3 className="text-lg font-bold text-moon-knight-gold">{subject.name}</h3>
                    </div>
                    <p className="text-sm text-moon-knight-silver mb-3">
                      Test your knowledge across {subject.topics.length} key areas
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {subject.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-black/50 text-xs rounded border border-mk-gold/30 text-moon-knight-silver"
                        >
                          {topic}
                        </span>
                      ))}
                      {subject.topics.length > 3 && (
                        <span className="px-2 py-1 bg-black/50 text-xs rounded border border-mk-gold/30 text-moon-knight-silver">
                          +{subject.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    // Try to play audio when loading screen is shown
    if (audioRef.current && audioRef.current.paused) {
      console.log('Loading screen shown, attempting to play audio...')
      audioRef.current.play()
        .then(() => console.log('Audio playing during loading screen!'))
        .catch(err => console.log('Auto-play blocked, will play on user interaction:', err))
    }

    return (
      <div className="moon-knight-container">
        <div className="moon-knight-bg"></div>
        <div className="container py-12 flex items-center justify-center min-h-[100vh] relative z-10 overflow-hidden">
          <div className="flex flex-col items-center justify-center animate-fade-in relative w-full h-full">
            {/* Crescent Blades Loading Animation */}
            <div className="relative mb-8 w-full h-96 flex items-center justify-center">
              {/* First Crescent Blade - Rotating Clockwise then sliding right */}
              <div className="crescent-blade-container crescent-blade-1">
                <img
                  src="https://i.postimg.cc/N06XbzFs/Crescent-Blades-Moon-Knight-PNG.png"
                  alt="Crescent Blade"
                  className="crescent-blade-image"
                />
              </div>
              
              {/* Second Crescent Blade - Rotating Counter-Clockwise then sliding left */}
              <div className="crescent-blade-container crescent-blade-2">
                <img
                  src="https://i.postimg.cc/N06XbzFs/Crescent-Blades-Moon-Knight-PNG.png"
                  alt="Crescent Blade"
                  className="crescent-blade-image"
                />
              </div>
              
              {/* Center Glow Effect that expands */}
              <div className="crescent-center-glow"></div>
              
              {/* Cloud Reveal Effect */}
              <div className="cloud-reveal"></div>
              
              {/* Assessment Text Reveal (stylish animated text instead of box) */}
              <div className="assessment-text-reveal">
                <div className="assessment-subject-name">
                  {subjects[selectedSubject]?.name}
                </div>
                <div className="assessment-subtitle">
                  Assessment Ready
                </div>
              </div>
            </div>
            
            {/* Mystical Loading Orbs instead of boring progress bar */}
            <div className="mystical-loading-orbs">
              <div className="loading-orb"></div>
              <div className="loading-orb"></div>
              <div className="loading-orb"></div>
              <div className="loading-orb"></div>
              <div className="loading-orb"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="moon-knight-container">
        {/* Background Image with overlay */}
        <div className="absolute inset-0 flex h-auto w-auto">
          <img
            src="https://i.postimg.cc/T2ynnZtM/favpng-306783c776b1736dd8d34378982cda68.png"
            alt="background"
            className="opacity-100 w-[500px] h-auto mb-80 fixed top-20 right-10 z-10 scale-x-[-1]"
          />
        </div>

        <div className="moon-knight-bg"></div>
        <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh] relative z-10">
          <div className="text-center animate-fade-in">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-moon-knight-gold mb-4">Assessment Unavailable</h2>
            <p className="text-moon-knight-silver mb-6">{error}</p>
            <Button onClick={() => generateAdaptiveQuestions(selectedSubject)} className="moon-knight-button">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show the test questions
  return (
    <div className="moon-knight-container">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex h-auto w-auto">
        <img
          src="https://i.postimg.cc/T2ynnZtM/favpng-306783c776b1736dd8d34378982cda68.png"
          alt="background"
          className="opacity-100 w-[500px] h-auto mb-80 fixed top-20 right-10 z-10 scale-x-[-1]"
        />
      </div>

      <div className="moon-knight-bg"></div>

      <div className="container py-12 md:py-20 relative z-10">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-moon-knight-silver hover:text-moon-knight-gold mb-4 transition-colors duration-300"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="moon-knight-hero-card mb-12 animate-fade-in">
            <div className="hieroglyphic-border"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="moon-knight-subject-badge">
                  {subjects[selectedSubject].name}
                </div>
                <div className="text-xs text-moon-knight-silver">Knowledge Assessment</div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 moon-knight-title animate-title-glow">Test Your Level</h1>
              <p className="text-lg text-moon-knight-silver max-w-3xl">
                Answer these questions to help us determine the right difficulty level for you.
              </p>
            </div>
          </div>

          {currentQuestion && !testCompleted && (
            <div className="animate-fade-in">
              <Card className="moon-knight-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-4">
                    <CardTitle className="text-xl text-moon-knight-gold">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-moon-knight-silver">
                        {currentQuestion.difficulty} • {currentQuestion.topic}
                      </div>
                      {timeLeft !== null && (
                        <div className={`flex items-center gap-1 text-sm ${timeLeft <= 10 ? "text-red-400" : "text-moon-knight-silver"
                          }`}>
                          <Clock className="w-4 h-4" />
                          {timeLeft}s
                        </div>
                      )}
                    </div>
                  </div>

                  <Progress value={progress} className="moon-knight-progress" />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-moon-knight-silver">Progress</span>
                    <span className="text-xs text-moon-knight-silver">{Math.round(progress)}%</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <h3 className="text-xl font-bold mb-6 text-moon-knight-gold animate-text-shimmer">
                    {currentQuestion.question}
                  </h3>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        className={`moon-knight-option flex items-center gap-3 ${selectedOption === index ? "selected" : ""
                          } ${isAnswerChecked
                            ? index === currentQuestion.correctAnswer
                              ? "correct"
                              : selectedOption === index
                                ? "incorrect"
                                : ""
                            : ""
                          }`}
                      >
                        <div
                          className={`moon-knight-option-letter ${selectedOption === index ? "selected" : ""
                            } ${isAnswerChecked
                              ? index === currentQuestion.correctAnswer
                                ? "correct"
                                : selectedOption === index
                                  ? "incorrect"
                                  : ""
                              : ""
                            }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    ))}
                  </div>

                  {showExplanation && currentQuestion.explanation && (
                    <div className={`mt-6 moon-knight-explanation ${isAnswerChecked && selectedOption === currentQuestion.correctAnswer ? "correct" : "incorrect"
                      } animate-fade-in`}>
                      <div className="flex items-start gap-2">
                        {selectedOption === currentQuestion.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium mb-1">
                            {selectedOption === currentQuestion.correctAnswer ? "Correct!" : "Incorrect"}
                          </p>
                          <p className="text-sm">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-4 pb-6">
                  <div className="w-full">
                    <Button
                      onClick={isAnswerChecked ? nextQuestion : checkAnswer}
                      disabled={selectedOption === null && !isTimeUp}
                      className="moon-knight-button w-full"
                    >
                      {isAnswerChecked
                        ? currentQuestionIndex < questions.length - 1
                          ? "Next Question"
                          : "Complete Assessment"
                        : "Check Answer"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Test Results Display */}
          {testCompleted && (
            <div className="animate-fade-in space-y-6">
              {/* Background Image for Results */}
              <div className="absolute inset-0 flex h-auto w-auto">
                <img
                  src="https://i.postimg.cc/T2ynnZtM/favpng-306783c776b1736dd8d34378982cda68.png"
                  alt="background"
                  className="opacity-100 w-[500px] h-auto mb-80 fixed top-20 right-10 z-10 scale-x-[-1]"
                />
              </div>
              {/* Overall Results Card */}
              <Card className="moon-knight-card">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <Award className="w-16 h-16 text-moon-knight-gold" />
                  </div>
                  <CardTitle className="text-3xl text-moon-knight-gold animate-title-glow">
                    Assessment Complete!
                  </CardTitle>
                  <CardDescription className="text-lg text-moon-knight-silver mt-2">
                    {subjects[selectedSubject]?.name} Knowledge Assessment
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Score Summary */}
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-moon-knight-gold animate-text-shimmer">
                      {Math.round((score / questions.length) * 100)}%
                    </div>
                    <div className="text-xl text-moon-knight-silver">
                      {score} out of {questions.length} questions correct
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="text-center">
                    <div className="inline-block moon-knight-subject-badge text-lg px-6 py-3">
                      Recommended Level: {recommendedLevel}
                    </div>
                    <p className="text-moon-knight-silver mt-2 text-sm">
                      {recommendedLevel === "Expert" && "Outstanding! You have mastery-level knowledge."}
                      {recommendedLevel === "Advanced" && "Excellent work! You have strong knowledge in this subject."}
                      {recommendedLevel === "Intermediate" && "Good job! You have a solid foundation to build upon."}
                      {recommendedLevel === "Novice" && "You're making progress! Focus on the fundamentals."}
                      {recommendedLevel === "Beginner" && "Keep practicing! You're just getting started."}
                    </p>
                  </div>

                  {/* Time Stats */}
                  <div className="flex justify-center space-x-8 text-center">
                    <div>
                      <div className="text-2xl font-bold text-moon-knight-gold">
                        {Math.round(totalTimeSpent / 60)}m {Math.round(totalTimeSpent % 60)}s
                      </div>
                      <div className="text-sm text-moon-knight-silver">Total Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-moon-knight-gold">
                        {Math.round(totalTimeSpent / questions.length)}s
                      </div>
                      <div className="text-sm text-moon-knight-silver">Avg per Question</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Question Review */}
              <Card className="moon-knight-card">
                <CardHeader>
                  <CardTitle className="text-xl text-moon-knight-gold flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Question-by-Question Analysis
                  </CardTitle>
                  <CardDescription className="text-moon-knight-silver">
                    Review each question with correct answers and explanations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questions.map((question, index) => {
                    const userAnswer = userAnswers[index]
                    const isCorrect = userAnswer === question.correctAnswer
                    const timeSpent = timeSpentPerQuestion[index] || question.expectedTime
                    
                    return (
                      <div key={index} className="border border-mk-gold/20 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-moon-knight-gold">
                              Question {index + 1}
                            </span>
                            <span className="text-xs px-2 py-1 bg-black/50 rounded border border-mk-gold/30 text-moon-knight-silver">
                              {question.topic}
                            </span>
                            <span className="text-xs px-2 py-1 bg-black/50 rounded border border-mk-gold/30 text-moon-knight-silver">
                              {question.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-xs text-moon-knight-silver">
                              {timeSpent}s / {question.expectedTime}s
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-moon-knight-silver font-medium">
                          {question.question}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className={`p-2 rounded border ${
                            userAnswer !== null
                              ? isCorrect
                                ? 'border-green-500/50 bg-green-500/10 text-green-400'
                                : 'border-red-500/50 bg-red-500/10 text-red-400'
                              : 'border-gray-500/50 bg-gray-500/10 text-gray-400'
                          }`}>
                            <strong>Your Answer:</strong> {
                              userAnswer !== null 
                                ? `${String.fromCharCode(65 + userAnswer)}) ${question.options[userAnswer]}`
                                : "No answer given"
                            }
                          </div>
                          <div className="p-2 rounded border border-green-500/50 bg-green-500/10 text-green-400">
                            <strong>Correct Answer:</strong> {String.fromCharCode(65 + question.correctAnswer)}) {question.options[question.correctAnswer]}
                          </div>
                        </div>
                        
                        <div className="p-2 bg-black/30 rounded border border-mk-gold/30">
                          <p className="text-xs text-moon-knight-silver">
                            <strong className="text-moon-knight-gold">Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Topic Performance with Detailed Analysis */}
              {topicPerformance.length > 0 && (
                <Card className="moon-knight-card">
                  <CardHeader>
                    <CardTitle className="text-xl text-moon-knight-gold flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Performance by Topic
                    </CardTitle>
                    <CardDescription className="text-moon-knight-silver">
                      Detailed breakdown of your performance across different topics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {topicPerformance.map((topic, index) => {
                      const accuracy = topic.correct / topic.total
                      const isStrong = accuracy >= 0.7
                      const needsWork = accuracy < 0.6
                      
                      return (
                        <div key={index} className="border border-mk-gold/20 rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-lg text-moon-knight-gold">{topic.topic}</h4>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-moon-knight-silver">
                                {topic.correct}/{topic.total} correct
                              </span>
                              <span className={`text-lg font-bold px-3 py-1 rounded ${
                                accuracy >= 0.8 ? 'text-green-400 bg-green-500/20 border border-green-500/50' :
                                accuracy >= 0.6 ? 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/50' : 
                                'text-red-400 bg-red-500/20 border border-red-500/50'
                              }`}>
                                {Math.round(accuracy * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          <Progress
                            value={accuracy * 100}
                            className="moon-knight-progress h-3"
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-moon-knight-gold mb-2">Performance Level</h5>
                              <div className={`px-3 py-2 rounded border text-sm ${
                                accuracy >= 0.9 ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' :
                                accuracy >= 0.75 ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' :
                                accuracy >= 0.6 ? 'border-green-500/50 bg-green-500/10 text-green-400' :
                                accuracy >= 0.4 ? 'border-orange-500/50 bg-orange-500/10 text-orange-400' :
                                'border-red-500/50 bg-red-500/10 text-red-400'
                              }`}>
                                <strong>{topic.recommendedLevel}</strong>
                                <p className="text-xs mt-1">
                                  {accuracy >= 0.9 && "Mastery level - You excel in this area!"}
                                  {accuracy >= 0.75 && accuracy < 0.9 && "Advanced level - Very strong performance!"}
                                  {accuracy >= 0.6 && accuracy < 0.75 && "Intermediate level - Good foundation!"}
                                  {accuracy >= 0.4 && accuracy < 0.6 && "Developing level - Room for growth!"}
                                  {accuracy < 0.4 && "Beginner level - Focus needed here!"}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-moon-knight-gold mb-2">Time Efficiency</h5>
                              <div className={`px-3 py-2 rounded border text-sm ${
                                topic.averageTimeRatio <= 0.8 ? 'border-green-500/50 bg-green-500/10 text-green-400' :
                                topic.averageTimeRatio <= 1.2 ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' :
                                'border-red-500/50 bg-red-500/10 text-red-400'
                              }`}>
                                <strong>
                                  {topic.averageTimeRatio <= 0.8 ? "Fast" :
                                   topic.averageTimeRatio <= 1.2 ? "Average" : "Slow"}
                                </strong>
                                <p className="text-xs mt-1">
                                  Avg: {Math.round(topic.averageTimeRatio * 100)}% of expected time
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Strengths and Weaknesses */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isStrong && (
                              <div className="border border-green-500/50 bg-green-500/10 rounded p-3">
                                <h6 className="font-medium text-green-400 mb-2 flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  Strengths
                                </h6>
                                <ul className="text-xs text-green-300 space-y-1">
                                  <li>• Strong accuracy in {topic.topic} concepts</li>
                                  {topic.averageTimeRatio <= 1.0 && <li>• Good time management</li>}
                                  {accuracy >= 0.8 && <li>• Ready for advanced topics</li>}
                                </ul>
                              </div>
                            )}
                            
                            {needsWork && (
                              <div className="border border-red-500/50 bg-red-500/10 rounded p-3">
                                <h6 className="font-medium text-red-400 mb-2 flex items-center gap-1">
                                  <XCircle className="w-4 h-4" />
                                  Areas for Improvement
                                </h6>
                                <ul className="text-xs text-red-300 space-y-1">
                                  <li>• Review fundamental {topic.topic} concepts</li>
                                  {topic.averageTimeRatio > 1.2 && <li>• Practice for better speed</li>}
                                  <li>• Focus on {topic.topic} practice problems</li>
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          {/* Questions in this topic */}
                          <div className="space-y-2">
                            <button
                              onClick={() => toggleTopicExpanded(topic.topic)}
                              className="flex items-center gap-2 text-sm text-moon-knight-gold hover:text-moon-knight-silver transition-colors"
                            >
                              {expandedTopics[topic.topic] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                              View {topic.total} question{topic.total > 1 ? 's' : ''} in this topic
                            </button>
                            
                            {expandedTopics[topic.topic] && (
                              <div className="space-y-2 ml-4 border-l border-mk-gold/30 pl-4">
                                {topic.questions.map((q, qIndex) => (
                                  <div key={qIndex} className={`p-2 rounded text-xs ${
                                    q.isCorrect 
                                      ? 'bg-green-500/10 border border-green-500/30' 
                                      : 'bg-red-500/10 border border-red-500/30'
                                  }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      {q.isCorrect ? (
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                      ) : (
                                        <XCircle className="w-3 h-3 text-red-400" />
                                      )}
                                      <span className="font-medium text-moon-knight-silver">
                                        {q.difficulty} difficulty
                                      </span>
                                      <span className="text-moon-knight-silver">
                                        {q.timeSpent}s / {q.expectedTime}s
                                      </span>
                                    </div>
                                    <p className="text-moon-knight-silver mb-1">
                                      <strong>Q:</strong> {q.question}
                                    </p>
                                    <p className={q.isCorrect ? 'text-green-300' : 'text-red-300'}>
                                      <strong>Your answer:</strong> {q.userAnswer}
                                    </p>
                                    {!q.isCorrect && (
                                      <p className="text-green-300">
                                        <strong>Correct answer:</strong> {q.correctAnswer}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Overall Improvement Recommendations */}
              <Card className="moon-knight-card">
                <CardHeader>
                  <CardTitle className="text-xl text-moon-knight-gold flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Personalized Study Recommendations
                  </CardTitle>
                  <CardDescription className="text-moon-knight-silver">
                    Based on your performance, here's your personalized improvement plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Strong Areas */}
                  {topicPerformance.filter(t => t.correct / t.total >= 0.7).length > 0 && (
                    <div className="border border-green-500/50 bg-green-500/10 rounded-lg p-4">
                      <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Your Strengths
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topicPerformance
                          .filter(t => t.correct / t.total >= 0.7)
                          .map((topic, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-300 text-sm">
                                <strong>{topic.topic}:</strong> {Math.round((topic.correct / topic.total) * 100)}% accuracy
                              </span>
                            </div>
                          ))}
                      </div>
                      <p className="text-green-300 text-sm mt-3">
                        <strong>Recommendation:</strong> You're doing great in these areas! Consider exploring more advanced topics or helping others learn these concepts.
                      </p>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {topicPerformance.filter(t => t.correct / t.total < 0.6).length > 0 && (
                    <div className="border border-red-500/50 bg-red-500/10 rounded-lg p-4">
                      <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" />
                        Priority Improvement Areas
                      </h4>
                      <div className="space-y-3">
                        {topicPerformance
                          .filter(t => t.correct / t.total < 0.6)
                          .sort((a, b) => (a.correct / a.total) - (b.correct / b.total))
                          .map((topic, idx) => (
                            <div key={idx} className="border border-red-400/30 rounded p-3 bg-red-500/5">
                              <div className="flex items-center gap-2 mb-2">
                                <XCircle className="w-4 h-4 text-red-400" />
                                <span className="text-red-300 font-medium">
                                  {topic.topic}: {Math.round((topic.correct / topic.total) * 100)}% accuracy
                                </span>
                              </div>
                              <ul className="text-red-200 text-xs space-y-1 ml-6">
                                <li>• Review basic {topic.topic} concepts and fundamentals</li>
                                <li>• Practice {topic.total * 2} more questions in this area</li>
                                {topic.averageTimeRatio > 1.2 && <li>• Focus on improving speed through timed practice</li>}
                                <li>• Consider seeking additional help or resources for {topic.topic}</li>
                              </ul>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  <div className="border border-mk-gold/50 bg-mk-gold/10 rounded-lg p-4">
                    <h4 className="font-bold text-moon-knight-gold mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Your Learning Path Forward
                    </h4>
                    <div className="space-y-2 text-sm text-moon-knight-silver">
                      <p><strong>Overall Level:</strong> {recommendedLevel}</p>
                      <p><strong>Study Focus:</strong> {
                        topicPerformance.filter(t => t.correct / t.total < 0.6).length > 0
                          ? `Prioritize ${topicPerformance.filter(t => t.correct / t.total < 0.6).map(t => t.topic).join(', ')}`
                          : "Continue building on your strengths and explore advanced topics"
                      }</p>
                      <p><strong>Recommended Practice:</strong> {
                        score / questions.length < 0.6 
                          ? "Take practice tests weekly and focus on weaker topics"
                          : score / questions.length < 0.8
                          ? "Take practice tests bi-weekly and challenge yourself with harder questions"
                          : "Maintain your skills with periodic reviews and explore advanced challenges"
                      }</p>
                      <p><strong>Time Management:</strong> {
                        Object.values(timeSpentPerQuestion).reduce((sum, time) => sum + time, 0) / Object.keys(timeSpentPerQuestion).length > 
                        questions.reduce((sum, q) => sum + q.expectedTime, 0) / questions.length
                          ? "Practice timed exercises to improve speed"
                          : "Good time management - maintain your pace"
                      }</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setSelectedSubject("")
                    setTestCompleted(false)
                    setQuestions([])
                    setScore(0)
                    setCurrentQuestionIndex(0)
                    setUserAnswers({})
                    setTimeSpentPerQuestion({})
                    setTotalTimeSpent(0)
                    setTopicPerformance([])
                  }}
                  className="moon-knight-button"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Take Another Test
                </Button>
                <Link href="/dashboard">
                  <Button className="moon-knight-button">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
