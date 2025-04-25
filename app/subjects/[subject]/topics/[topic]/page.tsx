"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle, XCircle, ChevronRight, Award, RefreshCw, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QuizEngine } from "@/components/quiz-engine"
import { useAuth } from "@/contexts/auth-context"
import { logActivity } from "@/lib/user-service"
import { getTopicLearningHistory, updateLearningHistory } from "@/lib/learning-history-service"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

// This would typically come from a database or API
const topicsData = {
  math: {
    counting: {
      title: "Counting & Numbers",
      description: "Learn to count and recognize numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Beginner",
      ageRange: "3-5",
    },
    addition: {
      title: "Addition",
      description: "Master the basics of adding numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Beginner",
      ageRange: "5-7",
    },
    subtraction: {
      title: "Subtraction",
      description: "Learn how to subtract numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Beginner",
      ageRange: "5-7",
    },
    multiplication: {
      title: "Multiplication",
      description: "Multiply numbers and learn times tables",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Intermediate",
      ageRange: "7-9",
    },
    division: {
      title: "Division",
      description: "Understand division concepts",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Intermediate",
      ageRange: "7-9",
    },
  },
  science: {
    animals: {
      title: "Animals & Habitats",
      description: "Learn about different animals and where they live",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "3-6",
    },
    plants: {
      title: "Plants & Growth",
      description: "Discover how plants grow and thrive",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "5-8",
    },
    weather: {
      title: "Weather & Seasons",
      description: "Explore different weather patterns and seasons",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "6-9",
    },
    solar_system: {
      title: "Solar System",
      description: "Learn about planets and space",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Intermediate",
      ageRange: "7-10",
    },
  },
  reading: {
    alphabet: {
      title: "Alphabet Recognition",
      description: "Learn letters and their sounds",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "3-5",
    },
    phonics: {
      title: "Phonics",
      description: "Connect letters with their sounds",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "4-6",
    },
    sight_words: {
      title: "Sight Words",
      description: "Learn common words by sight",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "5-7",
    },
    comprehension: {
      title: "Reading Comprehension",
      description: "Understand what you read",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Intermediate",
      ageRange: "7-10",
    },
  },
  coding: {
    basics: {
      title: "Coding Basics",
      description: "Introduction to coding concepts",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "5-7",
    },
    sequences: {
      title: "Sequences",
      description: "Learn about sequences and algorithms",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "6-8",
    },
    loops: {
      title: "Loops",
      description: "Discover how loops work in programming",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "7-9",
    },
    conditionals: {
      title: "Conditionals",
      description: "Learn about if-then statements and logic",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "8-10",
    },
  },
  // New subjects
  music: {
    notes: {
      title: "Musical Notes",
      description: "Learn to read and understand musical notes",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Beginner",
      ageRange: "5-8",
    },
    instruments: {
      title: "Musical Instruments",
      description: "Discover different musical instruments and their sounds",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Beginner",
      ageRange: "4-7",
    },
    rhythm: {
      title: "Rhythm & Beat",
      description: "Understand rhythm patterns and beats in music",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Intermediate",
      ageRange: "6-9",
    },
    composition: {
      title: "Music Composition",
      description: "Learn the basics of creating your own music",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Advanced",
      ageRange: "8-12",
    },
  },
  art: {
    colors: {
      title: "Colors & Mixing",
      description: "Learn about primary colors and how to mix them",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Beginner",
      ageRange: "3-6",
    },
    drawing: {
      title: "Basic Drawing",
      description: "Learn fundamental drawing techniques",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Beginner",
      ageRange: "5-8",
    },
    painting: {
      title: "Painting Techniques",
      description: "Explore different painting styles and methods",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Intermediate",
      ageRange: "7-10",
    },
    art_history: {
      title: "Art History",
      description: "Learn about famous artists and art movements",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Advanced",
      ageRange: "9-12",
    },
  },
  geography: {
    continents: {
      title: "Continents & Oceans",
      description: "Learn about the seven continents and five oceans",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Beginner",
      ageRange: "5-8",
    },
    countries: {
      title: "Countries & Capitals",
      description: "Explore different countries and their capital cities",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Intermediate",
      ageRange: "7-10",
    },
    landforms: {
      title: "Landforms & Features",
      description: "Learn about mountains, rivers, deserts, and other geographical features",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Intermediate",
      ageRange: "8-11",
    },
    climate: {
      title: "Climate Zones",
      description: "Understand different climate types around the world",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Advanced",
      ageRange: "9-12",
    },
  },
  logic: {
    patterns: {
      title: "Patterns & Sequences",
      description: "Identify and continue patterns in shapes, numbers, and objects",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Beginner",
      ageRange: "4-7",
    },
    puzzles: {
      title: "Logic Puzzles",
      description: "Solve fun puzzles that develop critical thinking skills",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Intermediate",
      ageRange: "7-10",
    },
    reasoning: {
      title: "Deductive Reasoning",
      description: "Learn to draw conclusions from given information",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Intermediate",
      ageRange: "8-11",
    },
    problem_solving: {
      title: "Problem Solving",
      description: "Develop strategies to solve complex problems",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Advanced",
      ageRange: "9-12",
    },
  },
  // Programming languages
  c_programming: {
    intro: {
      title: "Introduction to C",
      description: "Learn the basics of C programming language",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    variables: {
      title: "Variables & Data Types",
      description: "Understand different data types and how to use variables in C",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    control_flow: {
      title: "Control Flow",
      description: "Learn about if statements, loops, and switch cases in C",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "11-12",
    },
    functions: {
      title: "Functions",
      description: "Create and use functions in C programs",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "11-12",
    },
  },
  python: {
    intro: {
      title: "Introduction to Python",
      description: "Learn the basics of Python programming language",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "9-12",
    },
    variables: {
      title: "Variables & Data Types",
      description: "Understand different data types and how to use variables in Python",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "9-12",
    },
    control_flow: {
      title: "Control Flow",
      description: "Learn about if statements, loops, and conditional expressions in Python",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "10-12",
    },
    functions: {
      title: "Functions & Modules",
      description: "Create and use functions and modules in Python",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "10-12",
    },
  },
  java: {
    intro: {
      title: "Introduction to Java",
      description: "Learn the basics of Java programming language",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    variables: {
      title: "Variables & Data Types",
      description: "Understand different data types and how to use variables in Java",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    control_flow: {
      title: "Control Flow",
      description: "Learn about if statements, loops, and switch cases in Java",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "11-12",
    },
    classes: {
      title: "Classes & Objects",
      description: "Understand object-oriented programming concepts in Java",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Advanced",
      ageRange: "11-12",
    },
  },
  movies: {
    film_history: {
      title: "Film History",
      description: "Learn about the evolution of movies from silent films to modern cinema",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Intermediate",
      ageRange: "8-12",
    },
    genres: {
      title: "Movie Genres",
      description: "Explore different types of movies and their characteristics",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Beginner",
      ageRange: "6-10",
    },
    animation: {
      title: "Animation",
      description: "Discover how animated movies are made and their history",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Beginner",
      ageRange: "5-9",
    },
    storytelling: {
      title: "Storytelling in Film",
      description: "Learn how movies tell stories through visuals and sound",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Intermediate",
      ageRange: "8-12",
    },
  },
}

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  id?: string
}

interface LearningHistory {
  _id?: string
  userId?: string
  subject: string
  topic: string
  content: string
  lastAccessed?: Date
  visitCount?: number
  accessCount?: number
  progress?: number
  difficulty?: string
}

export default function TopicPage({ params }: { params: { subject: string; topic: string } }) {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [educationalContent, setEducationalContent] = useState("")
  const [previousContent, setPreviousContent] = useState<LearningHistory | null>(null)
  const [readingComplete, setReadingComplete] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeLimit, setTimeLimit] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activityStartTime, setActivityStartTime] = useState<number>(0)
  const [quizStartTime, setQuizStartTime] = useState<number>(0)
  const [visitCount, setVisitCount] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [usingDirectApi, setUsingDirectApi] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [activeTime, setActiveTime] = useState(0)
  const lastActivityTime = useRef(Date.now())
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    setMounted(true)
    // Start tracking time spent on this page
    setActivityStartTime(Date.now())

    // Log activity when component unmounts
    return () => {
      if (user && activityStartTime > 0) {
        const timeSpent = Math.floor((Date.now() - activityStartTime) / 1000) // Convert to seconds
        logPageActivity("subject", timeSpent)
      }
    }
  }, [])

  // Check if the subject and topic exist in our data
  if (
    mounted &&
    (!topicsData[params.subject as keyof typeof topicsData] ||
      !topicsData[params.subject as keyof typeof topicsData][params.topic as any])
  ) {
    notFound()
  }

  // Log activity function
  const logPageActivity = async (type: string, timeSpent: number) => {
    if (!user) return

    try {
      await fetch("/api/user/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          type,
          subject: params.subject,
          topic: params.topic,
          timeSpent,
        }),
      })
    } catch (error) {
      console.error("Error logging activity:", error)
    }
  }

  // Store learning history
  const storeLearningHistory = async (content: string, progress = 0, difficulty = "beginner") => {
    if (!user) return

    try {
      console.log("Storing learning history:", {
        subject: params.subject,
        topic: params.topic,
        progress,
        difficulty,
      })

      await updateLearningHistory(params.subject, params.topic, content, progress, difficulty)
      console.log("Learning history updated successfully")
    } catch (error) {
      console.error("Error storing learning history:", error)
    }
  }

  // Get previous learning history
  const getPreviousLearningHistory = async () => {
    if (!user) return null

    try {
      const history = await getTopicLearningHistory(params.subject, params.topic)
      console.log("Previous learning history:", history)

      if (history) {
        setVisitCount(history.visitCount || 1)
        return history
      }
      return null
    } catch (error) {
      console.error("Error getting learning history:", error)
      return null
    }
  }

  // Generate content directly with Gemini API
  const generateContentDirectly = async (
    title: string,
    subject: string,
    ageRange: string,
    isReturningUser = false,
    previousContent = "",
    visitCount = 0,
  ) => {
    try {
      let prompt = ""

      if (isReturningUser) {
        prompt = `
        Create an educational lesson about "${title}" for ${subject}.
        This is for children aged ${ageRange} who have already studied this topic ${visitCount} times.
        
        Their previous lesson covered:
        ${previousContent}
        
        Write a more advanced lesson that:
        1. Briefly summarizes what they learned before (2-3 lines)
        2. Introduces new, more advanced concepts on the same topic
        3. Provides more complex examples and applications
        4. Uses language appropriate for the age range but assumes prior knowledge
        5. Is about 3-4 paragraphs long (300-500 words)
        
        Format the content with proper paragraphs and make it visually readable.
      `
      } else {
        prompt = `
        Create an educational lesson about "${title}" for ${subject}.
        This is for children aged ${ageRange}.
        
        Write a comprehensive but engaging explanation that:
        1. Introduces the topic in a child-friendly way
        2. Explains key concepts clearly with examples
        3. Uses simple language appropriate for the age range
        4. Includes some interesting facts that children would find engaging
        5. Is about 3-4 paragraphs long (300-500 words)
        
        Format the content with proper paragraphs and make it visually readable.
      `
      }

      const contentResult = await model.generateContent(prompt)
      return contentResult.response.text()
    } catch (error) {
      console.error("Error generating content with direct Gemini API:", error)
      throw error
    }
  }

  // Generate questions directly with Gemini API
  const generateQuestionsDirectly = async (
    title: string,
    subject: string,
    ageRange: string,
    level: string,
    count = 10,
  ): Promise<Question[]> => {
    try {
      const prompt = `
      Create ${count} multiple-choice quiz questions about "${title}" for ${subject}.
      These questions are for children aged ${ageRange} with ${level} level knowledge.
      
      Each question must have:
      - A clear question text
      - Four answer choices
      - The index of the correct answer (0-3)
      - A brief explanation of why the answer is correct
      
      Return ONLY valid JSON formatted like this:
      [
        {
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "correctAnswer": 1,
          "explanation": "2 + 2 equals 4."
        }
      ]
    `

      const questionsResult = await model.generateContent(prompt)
      let responseText = questionsResult.response.text()

      // Fix: Remove unnecessary formatting
      responseText = responseText.replace(/```json|```/g, "").trim()

      // Parse the JSON
      const parsedQuestions: Question[] = JSON.parse(responseText)

      return parsedQuestions
    } catch (error) {
      console.error("Error generating questions with direct Gemini API:", error)
      throw error
    }
  }

  // Generate content with Gemini API through server
  const generateContentWithGemini = async (
    title: string,
    subject: string,
    ageRange: string,
    isReturningUser = false,
    previousContent = "",
    visitCount = 0,
  ) => {
    try {
      // Try direct API first
      if (usingDirectApi) {
        return await generateContentDirectly(title, subject, ageRange, isReturningUser, previousContent, visitCount)
      }

      let prompt = ""

      if (isReturningUser) {
        prompt = `
        Create an educational lesson about "${title}" for ${subject}.
        This is for children aged ${ageRange} who have already studied this topic ${visitCount} times.
        
        Their previous lesson covered:
        ${previousContent}
        
        Write a more advanced lesson that:
        1. Briefly summarizes what they learned before (2-3 lines)
        2. Introduces new, more advanced concepts on the same topic
        3. Provides more complex examples and applications
        4. Uses language appropriate for the age range but assumes prior knowledge
        5. Is about 3-4 paragraphs long (300-500 words)
        
        Format the content with proper paragraphs and make it visually readable.
      `
      } else {
        prompt = `
        Create an educational lesson about "${title}" for ${subject}.
        This is for children aged ${ageRange}.
        
        Write a comprehensive but engaging explanation that:
        1. Introduces the topic in a child-friendly way
        2. Explains key concepts clearly with examples
        3. Uses simple language appropriate for the age range
        4. Includes some interesting facts that children would find engaging
        5. Is about 3-4 paragraphs long (300-500 words)
        
        Format the content with proper paragraphs and make it visually readable.
      `
      }

      // Call Gemini API through server
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        cache: "no-store",
      })

      if (!response.ok) {
        // If server API fails, try direct API
        setUsingDirectApi(true)
        return await generateContentDirectly(title, subject, ageRange, isReturningUser, previousContent, visitCount)
      }

      const data = await response.json()

      // If no content is returned, use default content
      if (!data.content || data.content.trim() === "") {
        return getDefaultContent(title, subject, isReturningUser)
      }

      return data.content
    } catch (error) {
      console.error("Error generating content with Gemini:", error)
      return getDefaultContent(title, subject, isReturningUser)
    }
  }

  // Default content if API fails
  const getDefaultContent = (title: string, subject: string, isReturningUser: boolean) => {
    if (isReturningUser) {
      return `
        Welcome back to our lesson on ${title}!
        
        Last time, we covered the basics of ${title}. You learned about the fundamental concepts and how they apply to everyday situations.
        
        Today, we'll build on that knowledge and explore more advanced concepts. Let's dive deeper into ${title} and discover new examples and applications.
        
        Remember to take your time and enjoy the learning process. If you have any questions, feel free to use our chatbot for additional help!
      `
    } else {
      return `
        Welcome to our lesson on ${title}!
        
        ${title} is an important topic in ${subject} that will help you understand many other concepts. This lesson will introduce you to the key ideas and give you a solid foundation.
        
        We'll start with the basics and then explore some fun examples together. By the end of this lesson, you'll have a good understanding of ${title} and be ready to tackle more complex ideas.
        
        Let's begin our exploration of ${title} together. Remember, learning is an adventure!
      `
    }
  }

  // Generate questions with Gemini API
  const generateQuestionsWithGemini = async (
    title: string,
    subject: string,
    ageRange: string,
    level: string,
    count = 10,
  ): Promise<Question[]> => {
    try {
      // Try direct API first
      if (usingDirectApi) {
        return await generateQuestionsDirectly(title, subject, ageRange, level, count)
      }

      const prompt = `
      Create ${count} multiple-choice quiz questions about "${title}" for ${subject}.
      These questions are for children aged ${ageRange} with ${level} level knowledge.
      
      Each question must have:
      - A clear question text
      - Four answer choices
      - The index of the correct answer (0-3)
      - A brief explanation of why the answer is correct
      
      Return ONLY valid JSON formatted like this:
      [
        {
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "correctAnswer": 1,
          "explanation": "2 + 2 equals 4."
        }
      ]
    `

      // Call Gemini API through server
      const response = await fetch("/api/gemini/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        cache: "no-store",
      })

      if (!response.ok) {
        // If server API fails, try direct API
        setUsingDirectApi(true)
        return await generateQuestionsDirectly(title, subject, ageRange, level, count)
      }

      const data = await response.json()

      if (!data.questions || !Array.isArray(data.questions)) {
        console.error("Invalid questions format:", data)
        throw new Error("Invalid questions format in API response")
      }

      // Ensure questions are in the correct format
      const formattedQuestions = data.questions.map((q: any) => {
        // Make sure correctAnswer is a number
        let correctAnswerIndex =
          typeof q.correctAnswer === "number"
            ? q.correctAnswer
            : q.options.findIndex((opt: string) => opt === q.correctAnswer)

        // If still not found, default to 0
        if (correctAnswerIndex < 0) correctAnswerIndex = 0

        return {
          question: q.question,
          options: Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: correctAnswerIndex,
          explanation: q.explanation || "This is the correct answer.",
        }
      })

      return formattedQuestions
    } catch (error) {
      console.error("Error generating questions with Gemini:", error)

      // Return fallback questions
      return getDefaultQuestions(title, subject)
    }
  }

  // Default questions if API fails
  const getDefaultQuestions = (title: string, subject: string): Question[] => {
    return [
      {
        question: `What is the main purpose of studying ${title}?`,
        options: ["To pass tests", "To gain practical knowledge", "To memorize facts", "To impress others"],
        correctAnswer: 1,
        explanation:
          "The main purpose of studying any topic is to gain practical knowledge that can be applied in real-world situations.",
      },
      {
        question: `Which learning approach is most effective for ${title}?`,
        options: [
          "Memorization only",
          "Practice and application",
          "Watching videos only",
          "Reading without taking notes",
        ],
        correctAnswer: 1,
        explanation: "Practice and application help solidify knowledge and develop skills.",
      },
      {
        question: `How can you improve your understanding of difficult concepts in ${title}?`,
        options: [
          "Give up when it gets hard",
          "Only study what's easy",
          "Break it down into smaller parts",
          "Study for long hours without breaks",
        ],
        correctAnswer: 2,
        explanation: "Breaking down complex concepts into smaller, manageable parts makes them easier to understand.",
      },
      {
        question: `What is the benefit of taking quizzes while learning about ${title}?`,
        options: ["It wastes time", "It helps reinforce knowledge", "It's only for grades", "It makes learning boring"],
        correctAnswer: 1,
        explanation: "Quizzes help reinforce knowledge through active recall, which strengthens memory.",
      },
      {
        question: `Why is ${title} an important topic in ${subject}?`,
        options: [
          "It isn't important",
          "It's a fundamental concept",
          "It's only for advanced students",
          "It's only in the curriculum because it's traditional",
        ],
        correctAnswer: 1,
        explanation: `${title} is a fundamental concept in ${subject} that builds the foundation for more advanced topics.`,
      },
      {
        question: `What should you do if you don't understand something about ${title}?`,
        options: ["Skip it and move on", "Ask for help", "Pretend you understand", "Give up on the subject"],
        correctAnswer: 1,
        explanation: "Asking for help is an important part of the learning process.",
      },
      {
        question: `How often should you review what you've learned about ${title}?`,
        options: ["Never", "Only before tests", "Regularly, using spaced repetition", "Once a year"],
        correctAnswer: 2,
        explanation: "Regular review using spaced repetition helps move information into long-term memory.",
      },
      {
        question: `What is the value of making mistakes while learning about ${title}?`,
        options: [
          "There is no value",
          "They show what you need to work on",
          "They prove you're not smart",
          "They waste time",
        ],
        correctAnswer: 1,
        explanation: "Mistakes are valuable feedback that show what areas need more attention.",
      },
      {
        question: `How can you apply what you learn about ${title} in real life?`,
        options: ["You can't", "By looking for practical applications", "By memorizing facts", "By taking more tests"],
        correctAnswer: 1,
        explanation: "Looking for practical applications helps make learning relevant and useful.",
      },
      {
        question: `What is the best mindset for learning about ${title}?`,
        options: [
          "Fixed mindset - abilities are fixed",
          "Growth mindset - abilities can develop",
          "Competitive mindset",
          "Perfectionist mindset",
        ],
        correctAnswer: 1,
        explanation: "A growth mindset recognizes that abilities can be developed through dedication and hard work.",
      },
    ]
  }

  // Generate educational content and questions
  useEffect(() => {
    if (!mounted) return

    const generateContent = async () => {
      setLoading(true)
      setError(null)

      try {
        const topicData = topicsData[params.subject as keyof typeof topicsData][params.topic as any]

        // Get previous learning history
        const history = await getPreviousLearningHistory()
        setPreviousContent(history)

        // Generate educational content based on previous history
        let content = ""

        if (history && history.visitCount && history.visitCount > 1) {
          // User has studied this before, generate content that builds on previous knowledge
          const previousSummary = history.content.substring(0, 300) + "..."

          content = await generateContentWithGemini(
            topicData.title,
            topicData.subject,
            topicData.ageRange,
            true,
            previousSummary,
            history.visitCount,
          )
        } else {
          // First time studying this topic
          content = await generateContentWithGemini(topicData.title, topicData.subject, topicData.ageRange, false)
        }

        // If content is empty, use default content
        if (!content || content.trim() === "") {
          content = getDefaultContent(
            topicData.title,
            topicData.subject,
            history && history.visitCount && history.visitCount > 1,
          )
        }

        setEducationalContent(content)

        // Store the content in learning history with 0 progress initially
        await storeLearningHistory(content, 0, topicData.level.toLowerCase())

        // Generate quiz questions
        let generatedQuestions = await generateQuestionsWithGemini(
          topicData.title,
          topicData.subject,
          topicData.ageRange,
          topicData.level,
          10, // Generate 10 questions
        )

        // If no questions were generated, use default questions
        if (!generatedQuestions || generatedQuestions.length === 0) {
          generatedQuestions = getDefaultQuestions(topicData.title, topicData.subject)
        }

        // Ensure we have exactly 10 questions
        if (generatedQuestions.length > 10) {
          generatedQuestions = generatedQuestions.slice(0, 10)
        } else if (generatedQuestions.length < 10) {
          // Fill with default questions if needed
          const defaultQuestions = getDefaultQuestions(topicData.title, topicData.subject)
          generatedQuestions = [...generatedQuestions, ...defaultQuestions.slice(0, 10 - generatedQuestions.length)]
        }

        // Add unique IDs to questions
        const questionsWithIds = generatedQuestions.map((q, index) => ({
          ...q,
          id: `${params.subject}-${params.topic}-${Date.now()}-${index}`,
        }))

        setQuestions(questionsWithIds)

        // Determine appropriate time limit based on difficulty and number of questions
        let recommendedTime = 0
        if (topicData.level === "Beginner") {
          recommendedTime = 300 // 5 minutes for beginners
        } else if (topicData.level === "Intermediate") {
          recommendedTime = 240 // 4 minutes for intermediate
        } else {
          recommendedTime = 180 // 3 minutes for advanced
        }

        setTimeLimit(recommendedTime)
        setTimeRemaining(recommendedTime)
      } catch (err) {
        console.error("Error generating content:", err)
        setError("Failed to generate content. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    generateContent()
  }, [mounted, params.subject, params.topic, user])

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timerActive && timeRemaining === 0) {
      // Time's up
      setTimerActive(false)
    }
  }, [timerActive, timeRemaining])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const startQuiz = () => {
    setReadingComplete(true)
    setTimerActive(true)
    setQuizStartTime(Date.now())

    // Log activity when starting quiz
    if (user && activityStartTime > 0) {
      const timeSpent = Math.floor((Date.now() - activityStartTime) / 1000) // Convert to seconds
      logPageActivity("reading", timeSpent)
    }
  }

  // Update the handleQuizComplete function to store quiz results properly
  const handleQuizComplete = (score: number, total: number) => {
    setTimerActive(false)
    setQuizCompleted(true)
    setQuizScore(score)

    // Calculate time spent on quiz
    const quizTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000)
    setTimeSpent(quizTimeSpent)

    // Calculate progress percentage
    const progressPercentage = Math.round((score / total) * 100)

    console.log("Quiz completed:", {
      subject: params.subject,
      topic: params.topic,
      score,
      total,
      progressPercentage,
      quizTimeSpent,
    })

    // Update learning history with progress
    storeLearningHistory(
      educationalContent,
      progressPercentage,
      topicsData[params.subject as keyof typeof topicsData]?.[params.topic as any]?.level.toLowerCase() || "beginner",
    )

    // Log quiz completion with score and time
    if (user) {
      logActivity(user.id, {
        type: "quiz",
        subject: params.subject,
        topic: params.topic,
        difficulty:
          topicsData[params.subject as keyof typeof topicsData]?.[params.topic as any]?.level.toLowerCase() ||
          "beginner",
        score: score,
        totalQuestions: total,
        timeSpent: quizTimeSpent,
      })
        .then(() => {
          console.log("Quiz activity logged successfully")
        })
        .catch((error) => {
          console.error("Error logging quiz activity:", error)
        })
    }
  }

  const topicData = topicsData[params.subject as keyof typeof topicsData]?.[params.topic as any]

  if (!mounted) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <span className="ml-3 text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <span className="ml-3 text-muted-foreground">Generating educational content...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <Button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href={`/subjects/${params.subject}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronRight className="mr-1 h-4 w-4 rotate-180" />
          Back to {topicData?.subject}
        </Link>

        <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
          <div className="absolute inset-0 pattern-dots opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${topicData?.subjectColor} text-white`}>
                {topicData?.level}
              </div>
              <div className="text-xs text-muted-foreground">Ages {topicData?.ageRange}</div>
              {visitCount > 1 && (
                <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500">
                  Visit #{visitCount}
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{topicData?.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">{topicData?.description}</p>
          </div>
        </div>

        {!readingComplete ? (
          <div className="p-6 rounded-xl bg-secondary/30 border border-secondary">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Educational Content</h2>

              {previousContent && visitCount > 1 && (
                <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium text-primary">Welcome Back!</h3>
                      <p className="text-sm text-muted-foreground">
                        You've studied this topic {visitCount} times before. This lesson builds on your previous
                        knowledge.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="prose prose-sm dark:prose-invert max-w-none">
                {educationalContent.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={startQuiz} className={`${topicData?.subjectColor} text-white`}>
                I've Read This - Start Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {!quizCompleted ? (
              <>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Timed Quiz: {questions.length} questions
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div className={`text-sm font-medium ${timeRemaining < 30 ? "text-red-500" : ""}`}>
                      Time Remaining: {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>

                <Progress value={(timeRemaining / timeLimit) * 100} className="h-1.5 bg-secondary" />

                {timerActive ? (
                  <QuizEngine
                    questions={questions}
                    subjectColor={topicData?.subjectColor || "bg-primary"}
                    subject={params.subject}
                    topic={params.topic}
                    timeLimit={timeLimit}
                    difficulty={topicData?.level.toLowerCase()}
                    onComplete={handleQuizComplete}
                  />
                ) : timeRemaining === 0 ? (
                  <div className="p-8 rounded-xl bg-secondary/30 border border-secondary text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Time's Up!</h2>
                    <p className="text-muted-foreground mb-6">
                      You've run out of time for this quiz. Would you like to try again?
                    </p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="p-8 rounded-xl bg-secondary/30 border border-secondary">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
                <p className="text-xl font-medium mb-1">
                  Your Score: <span className="text-primary">{quizScore}</span> out of {questions.length}
                </p>
                <p className="text-muted-foreground mb-6">Time spent: {formatTime(activeTime)}</p>

                <div className="w-full max-w-xs mx-auto mb-6">
                  <div className="relative h-4 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 bottom-0 ${topicData?.subjectColor}`}
                      style={{ width: `${(quizScore / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>0</span>
                    <span>{questions.length}</span>
                  </div>
                </div>

                {/* Performance analysis */}
                <div className="mb-6 p-4 rounded-lg bg-secondary/50">
                  <h4 className="font-medium mb-2">Performance Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Correct Answers</p>
                        <p className="text-lg font-bold">{quizScore}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Incorrect Answers</p>
                        <p className="text-lg font-bold">{questions.length - quizScore}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time Spent</p>
                        <p className="text-lg font-bold">{formatTime(activeTime)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Award className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Accuracy</p>
                        <p className="text-lg font-bold">{Math.round((quizScore / questions.length) * 100)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentQuestionIndex(0)
                      setSelectedOption(null)
                      setIsAnswerChecked(false)
                      setScore(0)
                      setQuizCompleted(false)
                      setShowExplanation(false)
                      setStartTime(Date.now())
                      setActiveTime(0)
                      lastActivityTime.current = Date.now()

                      // Restart activity tracking
                      if (activityTimerRef.current) {
                        clearInterval(activityTimerRef.current)
                      }
                      activityTimerRef.current = setInterval(() => {
                        const now = Date.now()
                        const idleTime = now - lastActivityTime.current
                        if (idleTime < 60000) {
                          setActiveTime((prev) => prev + 1)
                        }
                      }, 1000)
                    }}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    className={`${topicData?.subjectColor} text-white`}
                    onClick={() => (window.location.href = "/subjects")}
                  >
                    Back to Subjects
                  </Button>
                  <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
                    View Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}