"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, ChevronRight, Award, AlertCircle, RefreshCw, Clock } from "lucide-react"
import confetti from "canvas-confetti"
import { useAuth } from "@/contexts/auth-context"
import { logActivity, updateUserProgress } from "@/lib/user-service"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface QuizEngineProps {
  questions: Question[]
  subjectColor: string
  subject?: string
  topic?: string
  difficulty?: string
  timeLimit?: number
  onComplete?: (score: number, totalQuestions: number) => void
}

export function QuizEngine({
  questions,
  subjectColor,
  subject,
  topic,
  difficulty,
  timeLimit,
  onComplete,
}: QuizEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [activeTime, setActiveTime] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const { user, refreshUser } = useAuth()

  // Use a ref to track active time
  const lastActivityTime = useRef<number>(Date.now())
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentQuestion =
    questions.length > 0 && currentQuestionIndex < questions.length
      ? questions[currentQuestionIndex]
      : {
          question: "Loading question...",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
          explanation: "",
        }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Update the useEffect for the timer to use the timeLimit prop if provided
  useEffect(() => {
    setStartTime(Date.now())
    lastActivityTime.current = Date.now()

    // Start tracking active time
    activityTimerRef.current = setInterval(() => {
      // Only count time if there was activity in the last 60 seconds
      const now = Date.now()
      const idleTime = now - lastActivityTime.current

      // If user has been active recently (less than 60 seconds of idle time)
      if (idleTime < 60000) {
        setActiveTime((prev) => prev + 1) // Increment by 1 second
      }
    }, 1000)

    // If timeLimit is provided, set up a timer to end the quiz when time is up
    if (timeLimit) {
      const timer = setTimeout(() => {
        completeQuiz()
      }, timeLimit * 1000)

      return () => {
        if (activityTimerRef.current) {
          clearInterval(activityTimerRef.current)
        }
        clearTimeout(timer)
      }
    }

    return () => {
      if (activityTimerRef.current) {
        clearInterval(activityTimerRef.current)
      }
    }
  }, [timeLimit])

  // Track user activity
  const recordActivity = () => {
    lastActivityTime.current = Date.now()
  }

  // Record activity on user interactions
  useEffect(() => {
    const handleActivity = () => recordActivity()

    window.addEventListener("mousedown", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("touchstart", handleActivity)

    return () => {
      window.removeEventListener("mousedown", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("touchstart", handleActivity)
    }
  }, [])

  const handleOptionSelect = (index: number) => {
    if (!isAnswerChecked) {
      setSelectedOption(index)
      recordActivity()
    }
  }

  const checkAnswer = () => {
    if (selectedOption === null) return

    recordActivity()
    setIsAnswerChecked(true)

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1)

      // Trigger confetti for correct answer
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    setShowExplanation(true)
  }

  const nextQuestion = () => {
    recordActivity()

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setIsAnswerChecked(false)
      setShowExplanation(false)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = async () => {
    // Stop the activity timer
    if (activityTimerRef.current) {
      clearInterval(activityTimerRef.current)
    }

    // Calculate final score
    const finalScore = score
    const scorePercentage = Math.round((finalScore / questions.length) * 100)

    // Use the tracked active time
    const quizTimeSpent = activeTime
    setTimeSpent(quizTimeSpent)

    // Set quiz as completed
    setQuizCompleted(true)

    // Log activity to MongoDB if user is logged in
    if (user && subject) {
      console.log("Logging quiz completion:", {
        type: "quiz",
        subject,
        topic,
        difficulty: difficulty || "standard",
        score: finalScore,
        totalQuestions: questions.length,
        timeSpent: quizTimeSpent,
      })

      try {
        // First, log the activity
        await logActivity(user.id, {
          type: "quiz",
          subject,
          topic,
          difficulty: difficulty || "standard",
          score: scorePercentage, // Make sure we're using scorePercentage here, not finalScore
          totalQuestions: questions.length,
          timeSpent: quizTimeSpent,
        })

        console.log("Activity logged successfully")

        // Then, update the subject progress
        // We'll use the score percentage as the progress value
        // If the user already has progress in this subject, we'll use the higher value
        await updateUserProgress(subject.toLowerCase(), scorePercentage)
        console.log(`Subject progress updated: ${subject} - ${scorePercentage}%`)

        // Refresh user data to update the UI
        refreshUser()
      } catch (error) {
        console.error("Error logging activity or updating progress:", error)
      }
    }

    if (onComplete) {
      onComplete(finalScore, questions.length)
    }

    // Trigger confetti for quiz completion
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#4F46E5", "#10B981", "#EC4899"],
    })
  }

  const isCorrect = selectedOption === currentQuestion.correctAnswer

  // Determine button state
  const buttonText = isAnswerChecked
    ? currentQuestionIndex < questions.length - 1
      ? "Next Question"
      : "Complete Quiz"
    : "Check Answer"

  const buttonAction = isAnswerChecked ? nextQuestion : checkAnswer
  const buttonDisabled = selectedOption === null

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // If there are no questions, show a loading state
  if (questions.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 rounded-xl bg-secondary/30 border border-secondary text-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading quiz questions...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!quizCompleted ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-sm font-medium">
              Score: {score}/{currentQuestionIndex + (isAnswerChecked ? 1 : 0)}
            </div>
          </div>

          <Progress value={progress} color={subjectColor} className="h-1.5" />

          <div className="p-6 rounded-xl bg-secondary/30 border border-secondary">
            <h3 className="text-xl font-bold mb-6">{currentQuestion.question}</h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`answer-option p-4 rounded-lg cursor-pointer relative z-10 ${
                    selectedOption === index ? "selected border-2 border-primary/50" : "border border-secondary"
                  } ${isAnswerChecked && index === currentQuestion.correctAnswer ? "correct bg-green-500/10" : ""} ${
                    isAnswerChecked && selectedOption === index && selectedOption !== currentQuestion.correctAnswer
                      ? "incorrect bg-red-500/10"
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
                      selectedOption !== currentQuestion.correctAnswer && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>

            {showExplanation && currentQuestion.explanation && (
              <div
                className={`mt-6 p-4 rounded-lg ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                      {isCorrect ? "Correct!" : "Incorrect!"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={buttonAction} disabled={buttonDisabled} className={`${subjectColor} text-white`}>
              {buttonText}
              {isAnswerChecked && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-secondary/30 border border-secondary">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
          <p className="text-xl font-medium mb-1">
            Your Score: <span className="text-primary">{score}</span> out of {questions.length}
          </p>
          <p className="text-muted-foreground mb-6">Time spent: {formatTime(timeSpent)}</p>

          <div className="w-full max-w-xs mx-auto mb-6">
            <div className="relative h-4 rounded-full bg-secondary overflow-hidden">
              <div
                className={`absolute left-0 top-0 bottom-0 ${subjectColor}`}
                style={{ width: `${(score / questions.length) * 100}%` }}
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
                  <p className="text-lg font-bold">{score}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Incorrect Answers</p>
                  <p className="text-lg font-bold">{questions.length - score}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Time Spent</p>
                  <p className="text-lg font-bold">{formatTime(timeSpent)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Award className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Accuracy</p>
                  <p className="text-lg font-bold">{Math.round((score / questions.length) * 100)}%</p>
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
            <Button className={`${subjectColor} text-white`} onClick={() => (window.location.href = "/subjects")}>
              Back to Subjects
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
              View Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}