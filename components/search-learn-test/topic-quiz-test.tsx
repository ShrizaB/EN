"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { logActivity, updateUserProgress } from "@/lib/user-service"
import { updateLearningHistory } from "@/lib/learning-history-service"
import confetti from "canvas-confetti"
import { Card } from "@/components/ui/card"

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
    <div className={`transition-all duration-300 ${isFullScreen ? "fixed inset-0 z-50 bg-background" : "relative"}`}>
      <div
        className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 border border-border rounded-xl shadow-lg overflow-hidden ${isFullScreen ? "h-screen" : ""}`}
      >
        <div className="p-4 border-b border-border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
          {!testCompleted ? (
            <>
              {!isFullScreen && (
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Content
                </Button>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Clock className={`h-4 w-4 mr-1 ${timeRemaining < 300 ? "text-red-500" : "text-amber-500"}`} />
                  <span className={`font-medium ${timeRemaining < 300 ? "text-red-500" : ""}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{answeredCount}</span>
                  <span className="text-muted-foreground">/{questions.length} answered</span>
                </div>
                <Button variant="ghost" size="sm" onClick={toggleFullScreen} className="gap-1">
                  {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full flex justify-between items-center">
              <h3 className="font-medium">Test Results: {topic}</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={toggleFullScreen} className="gap-1">
                  {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
                <Button
                  size="sm"
                  onClick={onFinish}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Finish
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className={`flex flex-col md:flex-row ${isFullScreen ? "h-[calc(100vh-64px)]" : "h-[70vh]"}`}>
          {/* Question navigation sidebar */}
          <div className="w-full md:w-72 p-4 border-b md:border-b-0 md:border-r border-border bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Question Navigator</h3>
              <Progress value={progress} className="h-3 mb-2 bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </Progress>
              <p className="text-sm text-muted-foreground">
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
                    className={`p-0 h-9 w-9 font-medium ${
                      isCorrect
                        ? "bg-green-500/20 border-green-500 text-green-700 hover:bg-green-500/30 hover:text-green-800"
                        : isIncorrect
                          ? "bg-red-500/20 border-red-500 text-red-700 hover:bg-red-500/30 hover:text-red-800"
                          : isAnswered
                            ? "bg-blue-500/20 border-blue-500 text-blue-700 hover:bg-blue-500/30 hover:text-blue-800"
                            : ""
                    } ${isCurrent ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    onClick={() => navigateToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                )
              })}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-sm bg-blue-500/20 border border-blue-500"></div>
                <span>Answered</span>
              </div>
              {testCompleted && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-sm bg-green-500/20 border border-green-500"></div>
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-sm bg-red-500/20 border border-red-500"></div>
                    <span>Incorrect</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-sm bg-primary border border-primary"></div>
                <span>Current</span>
              </div>
            </div>

            {!testCompleted ? (
              <Button
                onClick={submitTest}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Submit Test
              </Button>
            ) : (
              <Card className="mt-6 p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border-none shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <h4 className="font-medium">Test Results</h4>
                </div>
                <div className="text-3xl font-bold mb-2 text-center">
                  {correctAnswers}/{questions.length}
                </div>
                <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${
                      scorePercentage >= 80 ? "bg-green-500" : scorePercentage >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {scorePercentage}%
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  {scorePercentage >= 80 ? "Excellent work!" : scorePercentage >= 60 ? "Good job!" : "Keep practicing!"}
                </p>
              </Card>
            )}
          </div>

          {/* Question content */}
          <div className="flex-1 p-6 overflow-y-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Question {currentQuestionIndex + 1}</h3>
                {testCompleted && userAnswers[currentQuestionIndex] !== null && (
                  <div
                    className={`flex items-center ${
                      userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-1" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 mr-1" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <p className="text-lg font-medium bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm border border-border">
                {currentQuestion.question}
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
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    } ${
                      isCorrect ? "border-green-500 bg-green-500/10" : isIncorrect ? "border-red-500 bg-red-500/10" : ""
                    } ${!testCompleted && !isSelected ? "hover:shadow-md transform hover:-translate-y-0.5" : ""}`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        } ${isCorrect ? "bg-green-500 text-white" : isIncorrect ? "bg-red-500 text-white" : ""}`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {testCompleted && currentQuestion.explanation && (
              <div
                className={`p-4 rounded-lg border ${
                  userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                    ? "border-green-500 bg-green-500/5"
                    : "border-orange-500 bg-orange-500/5"
                }`}
              >
                <h4 className="font-medium mb-2">Explanation</h4>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => navigateToQuestion(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => navigateToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}