"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Maximize, Minimize, ChevronLeft, ChevronRight, Trophy, Shield } from 'lucide-react'
import { useAuth } from "@/contexts/auth-context"
import { logActivity, updateUserProgress } from "@/lib/user-service"
import { updateLearningHistory } from "@/lib/learning-history-service"
import confetti from "canvas-confetti"
import { Card } from "@/components/ui/card"
import './topic-content-quiz.css'

// Batman logo component for background animations
function BatmanLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="60" height="30" viewBox="0 0 60 30" className={`absolute ${className}`} style={style}>
      <path
        d="M30 5 L25 10 L15 8 L20 15 L5 20 L20 25 L15 28 L25 26 L30 30 L35 26 L45 28 L40 25 L55 20 L40 15 L45 8 L35 10 Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Lightning effect component
function Lightning({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`absolute w-1 bg-gradient-to-b from-white via-yellow-300 to-transparent animate-lightning ${className}`}
      style={{
        height: "200px",
        ...style,
      }}
    />
  )
}

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface TopicQuizTestProps {
  topic: string
  questions: Question[]
  subject?: string
  onFinish: () => void
  onBack: () => void
}

export function TopicQuizTest({ topic, questions, subject = "general", onFinish, onBack }: TopicQuizTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [isReviewing, setIsReviewing] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds
  const [testCompleted, setTestCompleted] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const { user, refreshUser } = useAuth()

  // Timer countdown
  useEffect(() => {
    if (testCompleted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          submitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testCompleted])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (optionIndex: number) => {
    if (testCompleted) return

    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = optionIndex
    setUserAnswers(newAnswers)
  }

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const submitTest = async () => {
    setTestCompleted(true)
    setIsReviewing(true)

    // Trigger confetti for test completion
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffe066", "#ffffff", "#111111"],
    })

    // Calculate score
    const correctAnswers = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length
    const scorePercentage = Math.round((correctAnswers / questions.length) * 100)

    // Log activity if user is logged in
    if (user) {
      try {
        // Log the test completion activity
        await logActivity(user.id, {
          type: "test",
          subject: subject,
          topic,
          difficulty: "intermediate",
          score: scorePercentage,
          totalQuestions: questions.length,
          timeSpent: 30 * 60 - timeRemaining,
        })

        // Update user progress for this subject
        await updateUserProgress(subject, scorePercentage)

        // Update learning history with test completion
        await updateLearningHistory(
          subject,
          topic,
          `Completed test with score: ${scorePercentage}%`,
          scorePercentage,
          "intermediate",
        )

        refreshUser()
      } catch (error) {
        console.error("Error logging activity:", error)
      }
    }
  }

  // Calculate progress
  const answeredCount = userAnswers.filter((answer) => answer !== null).length
  const progress = (answeredCount / questions.length) * 100

  // Get current question
  const currentQuestion = questions[currentQuestionIndex] || {
    question: "Loading...",
    options: ["", "", "", ""],
    correctAnswer: 0,
  }

  // Calculate score if test is completed
  const correctAnswers = testCompleted
    ? userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length
    : 0
  const scorePercentage = testCompleted ? Math.round((correctAnswers / questions.length) * 100) : 0

  return (
    <div className={`transition-all duration-300 ${isFullScreen ? "fixed inset-0 z-50 bg-black" : "relative"}`}>
      {/* Batman logos flashing in background */}
      {[...Array(12)].map((_, i) => (
        <BatmanLogo
          key={i}
          className="text-yellow-500/10 animate-bat-symbol-flash pointer-events-none"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 90}%`,
            transform: `scale(${0.8 + Math.random() * 2.5}) rotate(${Math.random() * 40 - 20}deg)`,
            animationDelay: `${i * 1.5}s`,
            opacity: 0.1,
            zIndex: 0,
          }}
        />
      ))}

      {/* Lightning effects */}
      {[...Array(3)].map((_, i) => (
        <Lightning
          key={i}
          className="pointer-events-none"
          style={{
            left: `${20 + i * 30}%`,
            top: "0",
            animationDelay: `${i * 2 + 5}s`,
            animationDuration: `${4 + i}s`,
            opacity: 0.5,
            zIndex: 0,
          }}
        />
      ))}



      <div
        className={`overflow-hidden ${isFullScreen ? "h-screen" : ""} bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/20 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]`}
        style={{
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.8)",
          zIndex: 10,
        }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-yellow-500/20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm">
          {!testCompleted ? (
            <>
              {!isFullScreen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="gap-1 batman-cursor-hover text-yellow-500/80 font-mono"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Content
                </Button>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Clock className={`h-4 w-4 mr-1 ${timeRemaining < 300 ? "text-red-500" : "text-amber-500"}`} />
                  <span
                    className={`font-medium ${timeRemaining < 300 ? "text-red-500" : "text-yellow-500/80"} font-mono`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="text-sm font-mono text-yellow-500/80">
                  <span className="font-medium">{answeredCount}</span>
                  <span className="text-yellow-500/60">/{questions.length} answered</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullScreen}
                  className="gap-1 batman-cursor-hover text-yellow-500/80 font-mono"
                >
                  {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center justify-between">
              <h3 className="font-medium text-yellow-500/80 font-mono tracking-wider uppercase">
                Test Results: {topic}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullScreen}
                  className="gap-1 batman-cursor-hover text-yellow-500/80 font-mono"
                >
                  {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
                <Button
                  size="sm"
                  onClick={onFinish}
                  className="bg-black hover:bg-black text-yellow-500 border-2 border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-yellow-500/20 transform hover:scale-105 batman-cursor-hover font-mono uppercase tracking-wider"
                >
                  Finish
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className={`flex flex-col md:flex-row ${isFullScreen ? "h-[calc(100vh-64px)]" : "h-[70vh]"}`}>
          {/* Question navigation sidebar */}
          <div className="w-full md:w-72 p-4 border-b md:border-b-0 md:border-r border-yellow-500/20 bg-gradient-to-b from-gray-900 to-black backdrop-blur-sm">
            <div className="mb-4">
              <h3 className="font-medium mb-2 text-yellow-500/80 font-mono tracking-wider uppercase">
                Question Navigator
              </h3>
              <div className="relative h-3 mb-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
                <div className="absolute inset-0 bg-noise opacity-10"></div>
              </div>
              <p className="text-sm text-yellow-500/60 font-mono">
                {answeredCount} of {questions.length} questions answered
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((_, index) => {
                const isAnswered = userAnswers[index] !== null
                const isCorrect = testCompleted && userAnswers[index] === questions[index].correctAnswer
                const isIncorrect = testCompleted && isAnswered && !isCorrect
                const isCurrent = currentQuestionIndex === index

                return (
                  <Button
                    key={index}
                    variant={isCurrent ? "default" : "outline"}
                    size="sm"
                    className={`p-0 h-9 w-9 font-medium batman-cursor-hover ${
                      isCorrect
                        ? "bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30 hover:text-green-300"
                        : isIncorrect
                          ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30 hover:text-red-300"
                          : isAnswered
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-400 hover:bg-yellow-500/30 hover:text-yellow-300"
                            : "border-gray-700 text-gray-400"
                    } ${isCurrent ? "ring-2 ring-offset-2 ring-yellow-500" : ""} transition-all duration-300 hover:shadow-[0_0_10px_rgba(255,224,102,0.2)]`}
                    onClick={() => navigateToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                )
              })}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm font-mono text-yellow-500/60">
                <div className="w-4 h-4 rounded-sm bg-yellow-500/20 border border-yellow-500"></div>
                <span>Answered</span>
              </div>
              {testCompleted && (
                <>
                  <div className="flex items-center gap-2 text-sm font-mono text-yellow-500/60">
                    <div className="w-4 h-4 rounded-sm bg-green-500/20 border border-green-500"></div>
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-mono text-yellow-500/60">
                    <div className="w-4 h-4 rounded-sm bg-red-500/20 border border-red-500"></div>
                    <span>Incorrect</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2 text-sm font-mono text-yellow-500/60">
                <div className="w-4 h-4 rounded-sm bg-yellow-500 border border-yellow-500"></div>
                <span>Current</span>
              </div>
            </div>

            {!testCompleted ? (
              <Button
                onClick={submitTest}
                className="w-full mt-6 bg-black hover:bg-black text-yellow-500 border-2 border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-yellow-500/20 transform hover:scale-105 animate-glow-pulse batman-cursor-hover font-mono uppercase tracking-wider"
              >
                Submit Test
              </Button>
            ) : (
              <Card className="mt-6 p-4 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 shadow-md animate-glow-pulse">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <h4 className="font-medium text-yellow-500 font-mono tracking-wider uppercase">Test Results</h4>
                </div>
                <div className="text-3xl font-bold mb-2 text-center text-yellow-500 font-mono">
                  {correctAnswers}/{questions.length}
                </div>
                <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${
                      scorePercentage >= 80 ? "bg-green-500" : scorePercentage >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium font-mono">
                    {scorePercentage}%
                  </div>
                </div>
                <p className="text-sm text-center text-yellow-500/60 font-mono">
                  {scorePercentage >= 80 ? "Excellent work!" : scorePercentage >= 60 ? "Good job!" : "Keep practicing!"}
                </p>
              </Card>
            )}
          </div>

          {/* Question content */}
          <div className="flex-1 p-6 overflow-y-auto bg-black/80 backdrop-blur-sm text-gray-300 relative">
            {/* Scan line effect */}
            <div
              className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(255,224,102,0.03) 50%, transparent)",
                backgroundSize: "100% 8px",
                animation: "scanline 8s linear infinite",
                opacity: 0.3,
              }}
            ></div>

            {/* Vignette effect */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                boxShadow: "inset 0 0 100px rgba(0,0,0,0.7)",
                background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
              }}
            ></div>

            {/* Noise texture */}
            <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none z-0"></div>

            <div className="relative z-10">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-yellow-500 font-mono tracking-wider uppercase">
                    Question {currentQuestionIndex + 1}
                  </h3>
                  {testCompleted && userAnswers[currentQuestionIndex] !== null && (
                    <div
                      className={`flex items-center ${
                        userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-1" />
                          <span className="font-mono">Correct</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 mr-1" />
                          <span className="font-mono">Incorrect</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-lg font-medium bg-gray-900/70 p-4 rounded-lg shadow-sm border border-yellow-500/20 font-mono relative overflow-hidden">
                  {currentQuestion.question}
                  <div className="absolute inset-0 bg-noise opacity-5"></div>
                  <div className="absolute inset-0 shimmer"></div>
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = userAnswers[currentQuestionIndex] === index
                  const isCorrect = testCompleted && index === currentQuestion.correctAnswer
                  const isIncorrect = testCompleted && isSelected && !isCorrect

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:shadow-[0_0_10px_rgba(255,224,102,0.2)] relative overflow-hidden ${
                        isSelected ? "border-yellow-500 bg-yellow-500/10" : "border-gray-700 hover:border-yellow-500/50"
                      } ${
                        isCorrect
                          ? "border-green-500 bg-green-500/10 text-green-400"
                          : isIncorrect
                            ? "border-red-500 bg-red-500/10 text-red-400"
                            : ""
                      } ${!testCompleted && !isSelected ? "hover:shadow-md transform hover:-translate-y-0.5" : ""}`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-center relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            isSelected ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400"
                          } ${isCorrect ? "bg-green-500 text-black" : isIncorrect ? "bg-red-500 text-black" : ""}`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg font-mono">{option}</span>
                      </div>
                      <div className="absolute inset-0 bg-noise opacity-5"></div>
                      {(isSelected || isCorrect) && <div className="absolute inset-0 shimmer"></div>}
                    </div>
                  )
                })}
              </div>

              {testCompleted && currentQuestion.explanation && (
                <div
                  className={`p-4 rounded-lg border relative overflow-hidden ${
                    userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                      ? "border-green-500 bg-green-500/5"
                      : "border-orange-500 bg-orange-500/5"
                  }`}
                >
                  <h4 className="font-medium mb-2 text-yellow-500 font-mono tracking-wider">Explanation</h4>
                  <p className="font-mono">{currentQuestion.explanation}</p>
                  <div className="absolute inset-0 bg-noise opacity-5"></div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigateToQuestion(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-1 batman-cursor-hover border-yellow-500/30 text-yellow-500/80 hover:bg-yellow-500/10 font-mono"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigateToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-1 batman-cursor-hover border-yellow-500/30 text-yellow-500/80 hover:bg-yellow-500/10 font-mono"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
