"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, ChevronRight, Award, AlertCircle, RefreshCw, Clock } from "lucide-react"
import confetti from "canvas-confetti"
import { useAuth } from "@/contexts/auth-context"
import { logActivity, updateUserProgress } from "@/lib/user-service"
import Image from "next/image"

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
  const [sessionId] = useState(() => `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const { user, refreshUser } = useAuth()

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

  useEffect(() => {
    setStartTime(Date.now())
    lastActivityTime.current = Date.now()

    activityTimerRef.current = setInterval(() => {
      const now = Date.now()
      const idleTime = now - lastActivityTime.current
      if (idleTime < 60000) {
        setActiveTime((prev) => prev + 1)
      }
    }, 1000)

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

  const recordActivity = () => {
    lastActivityTime.current = Date.now()
  }

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
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#04a21c", "#f0e68c", "#00b7eb"],
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
    if (activityTimerRef.current) {
      clearInterval(activityTimerRef.current)
    }

    const finalScore = score
    const scorePercentage = Math.round((finalScore / questions.length) * 100)
    // Calculate total elapsed time from start to finish
    const totalElapsedTime = Math.floor((Date.now() - startTime) / 1000)
    // Use the larger of active time or elapsed time, but ensure we have a minimum
    const quizTimeSpent = Math.max(activeTime, totalElapsedTime, 1)
    setTimeSpent(quizTimeSpent)

    setQuizCompleted(true)

    if (user && subject) {
      try {
        await logActivity(user.id, {
          type: "quiz",
          subject,
          topic,
          difficulty: difficulty || "standard",
          score: scorePercentage,
          totalQuestions: questions.length,
          timeSpent: quizTimeSpent,
          sessionId: sessionId,
        })

        await updateUserProgress(subject.toLowerCase(), scorePercentage)
        refreshUser()
      } catch (error) {
        console.error("Error logging activity or updating progress:", error)
      }
    }

    if (onComplete) {
      onComplete(finalScore, questions.length)
    }

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#04a21c", "#f0e68c", "#00b7eb"],
    })
  }

  const isCorrect = selectedOption === currentQuestion.correctAnswer
  const buttonText = isAnswerChecked
    ? currentQuestionIndex < questions.length - 1
      ? "Next Question"
      : "Complete Quiz"
    : "Check Answer"
  const buttonAction = isAnswerChecked ? nextQuestion : checkAnswer
  const buttonDisabled = selectedOption === null

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }



  if (questions.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 rounded-xl bg-[#0a0a0a]/60 backdrop-blur-lg border border-[#2a2a2a]/40 text-center animate-pulse">
        <div className="w-10 h-10 rounded-sm border-2 border-[#04a21c] border-t-transparent animate-spin mx-auto mb-4" style={{ transform: 'skewX(-10deg)' }}></div>
        <p className="text-[#b0b0b0] text-sm font-medium">Loading quiz questions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-transparent p-4">

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0.8; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 4px rgba(4, 162, 28, 0.2); }
          50% { box-shadow: 0 0 12px rgba(4, 162, 28, 0.5); }
          100% { box-shadow: 0 0 4px rgba(4, 162, 28, 0.2); }
        }
        @keyframes spinSlow {
          from { transform: skewX(-10deg) rotate(0deg); }
          to { transform: skewX(-10deg) rotate(360deg); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-slide-in { animation: slideIn 0.5s ease-out; }
        .animate-scale-in { animation: scaleIn 0.4s ease-out; }
        .animate-glow-pulse { animation: glowPulse 2.5s infinite ease-in-out; }
        .animate-spin-slow { animation: spinSlow 6s linear infinite; }
        .hover-scale:hover { transform: scale(1.02) translateY(-2px); transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-glow:hover { box-shadow: 0 0 12px rgba(4, 162, 28, 0.4); }
        .rhombus { transform: skewX(-10deg); }
        .option-button { transition: all 0.2s ease; }
        .option-button:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); }

        @keyframes pulse-slow {
  0% { opacity: 0.3; transform: translateX(-30%); }
  100% { opacity: 0; transform: translateX(100%); }
}

.animate-pulse-slow {
  animation: pulse-slow 2.5s infinite;
}

.clip-right-triangle {
clip-path: polygon(0 0, 100% 50%, 0 100%);
        }
      `}
      </style>

      {!quizCompleted ? (
        <div className="w-full max-w-3xl mx-auto bg-[#0a0a0a]/60 backdrop-blur-lg rounded-xl border border-[#2a2a2a]/40 shadow-lg p-6 animate-scale-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 p-3 rounded-lg bg-[#1a1a1a]/50 border border-[#04a21c]/20 animate-fade-in">
            <div className="text-sm font-medium tracking-wide text-[#04a21c] drop-shadow-[0_1px_4px_#04a21c]">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-sm font-medium tracking-wide text-[#f0e68c] drop-shadow-[0_1px_4px_#f0e68c]">
              Score: {score}/{currentQuestionIndex + (isAnswerChecked ? 1 : 0)}
            </div>
            {timeLimit && (
              <div className="text-sm font-medium tracking-wide text-[#00b7eb] drop-shadow-[0_1px_4px_#00b7eb]">
                Time: {formatTime(Math.max(0, timeLimit - activeTime))}
              </div>
            )}
          </div>

          <div className="w-full h-3 mb-6 overflow-hidden relative">
            {/* Background track with subtle texture */}
            <div className="absolute inset-0 bg-[#0a0a0a] rounded-sm">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.02)_75%,transparent_75%)] bg-[length:6px_6px] opacity-20" />
            </div>

            {/* Progress indicator with sharp angled edges and multiple glows */}
            <div
              className="h-full relative transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              {/* Main progress body */}
              <div className="absolute inset-0 bg-[#66e584] skew-x-[-15deg] origin-left ml-[-8px] shadow-[0_0_15px_#04a21c,0_0_30px_#00b7eb33]" />

              {/* Edge highlight */}
              <div className="absolute right-0 top-0 h-full w-2 bg-white/50 clip-right-triangle" />

              {/* Inner pulse effect */}
              <div className="absolute inset-0 bg-[#0e8f2c] opacity-30 animate-pulse-slow" />
            </div>

            {/* Floating percentage text */}
            <div
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs font-mono font-bold text-white/80"
              style={{ left: `calc(${progress}% + 8px)` }}
            >
              {progress}%
            </div>
          </div>

          <div className="mb-6">
            <h3
              className="text-lg font-medium text-[#ffffff] tracking-wide drop-shadow-[0_1px_6px_#04a21c] animate-slide-in"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {currentQuestion.question}
            </h3>

            <div className="flex flex-col gap-3 my-6 bg-[#1a1a1a]/50 backdrop-blur-sm rounded-lg border border-[#2a2a2a]/40 shadow-lg p-5">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index
                const isCorrect = isAnswerChecked && index === currentQuestion.correctAnswer
                const isIncorrect = isAnswerChecked && isSelected && !isCorrect
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswerChecked}
                    className={[
                      'option-button grid grid-cols-[2.5rem_1fr_2.5rem] items-center w-full min-h-[3.5rem] py-3 px-4 rounded-md text-sm font-medium bg-[#0a0a0a]/70 backdrop-blur-sm border-[1.2px] shadow-md animate-slide-in',
                      isCorrect
                        ? 'border-[#04a21c] text-[#04a21c] ring-2 ring-[#04a21c]/70 ring-offset-2'
                        : isIncorrect
                          ? 'border-[#dc143c] text-[#dc143c] ring-2 ring-[#dc143c]/70 ring-offset-2'
                          : isSelected
                            ? 'border-[#04a21c] text-[#04a21c] ring-2 ring-[#04a21c]/70 ring-offset-2'
                            : '',
                      isAnswerChecked ? 'cursor-not-allowed' : 'cursor-pointer hover-scale hover-glow',
                    ].join(' ')}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span
                      className={[
                        'flex items-center justify-center w-10 h-10 rounded-[2px] rhombus font-medium text-base transition-all duration-200 border-[1.2px]',
                        isCorrect
                          ? 'bg-transparent text-[#04a21c] border-[#04a21c]'
                          : isIncorrect
                            ? 'bg-transparent text-[#dc143c] border-[#dc143c]'
                            : isSelected
                              ? 'bg-transparent text-[#04a21c] border-[#04a21c]'
                              : '',
                      ].join(' ')}
                    >
                      <span className="rhombus-fix">{String.fromCharCode(65 + index)}</span>
                    </span>
                    <span
                      className="text-left text-sm font-medium ml-3 mr-2 break-words transition-colors duration-200"
                      style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}
                    >
                      {option}
                    </span>
                    <span className="ml-1 flex items-center text-lg justify-end">
                      {isCorrect && <CheckCircle className="text-[#04a21c] drop-shadow-[0_0_6px_#04a21c] animate-scale-in" />}
                      {isIncorrect && <XCircle className="text-[#dc143c] drop-shadow-[0_0_6px_#dc143c] animate-scale-in" />}
                    </span>
                  </button>
                )
              })}
            </div>

            {showExplanation && currentQuestion.explanation && (
              <div
                className={`mt-6 p-5 rounded-lg border backdrop-blur-sm ${isCorrect
                  ? 'border-[#04a21c]/40 bg-[#0d1a0f]/50'
                  : 'border-[#dc143c]/40 bg-[#1a0d0d]/50'
                  } flex items-start gap-3 shadow-md animate-fade-in`}
              >
                <div>
                  {isCorrect ? (
                    <CheckCircle className="text-[#04a21c] w-6 h-6 drop-shadow-[0_0_6px_#04a21c] animate-scale-in" />
                  ) : (
                    <AlertCircle className="text-[#dc143c] w-6 h-6 drop-shadow-[0_0_6px_#dc143c] animate-scale-in" />
                  )}
                </div>
                <div>
                  <p
                    className={[
                      'text-sm font-medium uppercase mb-1',
                      isCorrect ? 'text-[#04a21c]' : 'text-[#dc143c]',
                    ].join(' ')}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {isCorrect ? 'Correct!' : 'Incorrect!'}
                  </p>
                  <p className="text-[#b0b0b0] text-sm font-light leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={buttonAction}
              disabled={buttonDisabled}
              className={`px-10 py-3 rounded-xl font-semibold text-base bg-gradient-to-r from-[#04a21c] via-[#00b7eb] to-[#f0e68c] text-[#0a0a0a] border border-[#04a21c]/60 shadow-[0_4px_24px_rgba(4,162,28,0.25)] transition-all duration-200 tracking-wide ring-2 ring-[#00b7eb]/30 ring-offset-2 ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-[0_6px_32px_rgba(0,183,235,0.25)]'}`}
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.03em' }}
            >
              {buttonText}
              {isAnswerChecked && <ChevronRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto bg-[#0a0a0a]/60 backdrop-blur-lg rounded-xl border border-[#2a2a2a]/40 shadow-lg p-6 animate-scale-in">
          <div className="flex justify-center mb-4">
            <Award className="text-[#f0e68c] w-12 h-12 drop-shadow-[0_0_8px_#f0e68c] animate-spin-slow rhombus" />
          </div>
          <h3
            className="text-xl font-medium text-[#ffffff] tracking-wide text-center drop-shadow-[0_1px_6px_#04a21c] animate-fade-in"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Quiz Completed!
          </h3>
          <p className="text-[#b0b0b0] text-sm font-light text-center mt-2 mb-6">
            Your Score: <span className="text-[#04a21c]">{score}</span> out of {questions.length}
          </p>
          <p className="text-[#b0b0b0] text-sm font-light text-center mb-6">
            Time spent: <span className="text-[#f0e68c]">{formatTime(timeSpent)}</span>
          </p>

          <div className="w-full h-3 bg-[#2a2a2a]/40 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#04a21c] to-[#00b7eb] transition-all duration-500 ease-in-out animate-glow-pulse"
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </div>

          <div className="mt-6 p-5 rounded-lg bg-[#1a1a1a]/50 backdrop-blur-sm border border-[#2a2a2a]/40 shadow-md animate-fade-in">
            <h4 className="text-base font-medium text-[#ffffff] tracking-wide mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Performance Analysis
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]/70 border border-[#04a21c]/30 hover-scale hover-glow animate-slide-in">
                <CheckCircle className="text-[#04a21c] w-6 h-6 drop-shadow-[0_0_6px_#04a21c] rhombus" />
                <div>
                  <p className="text-[#b0b0b0] text-xs font-light">Correct Answers</p>
                  <p className="text-[#04a21c] text-sm font-medium">{score}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]/70 border border-[#dc143c]/30 hover-scale hover-glow animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <XCircle className="text-[#dc143c] w-6 h-6 drop-shadow-[0_0_6px_#dc143c] rhombus" />
                <div>
                  <p className="text-[#b0b0b0] text-xs font-light">Incorrect Answers</p>
                  <p className="text-[#dc143c] text-sm font-medium">{questions.length - score}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]/70 border border-[#f0e68c]/30 hover-scale hover-glow animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <Clock className="text-[#f0e68c] w-6 h-6 drop-shadow-[0_0_6px_#f0e68c] rhombus" />
                <div>
                  <p className="text-[#b0b0b0] text-xs font-light">Time Spent</p>
                  <p className="text-[#f0e68c] text-sm font-medium">{formatTime(timeSpent)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a]/70 border border-[#00b7eb]/30 hover-scale hover-glow animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <Award className="text-[#00b7eb] w-6 h-6 drop-shadow-[0_0_6px_#00b7eb] rhombus" />
                <div>
                  <p className="text-[#b0b0b0] text-xs font-light">Accuracy</p>
                  <p className="text-[#00b7eb] text-sm font-medium">{Math.round((score / questions.length) * 100)}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
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
              className="px-6 py-2 rounded-lg font-medium text-sm bg-[#0a0a0a]/70 border-[#f0e68c]/40 text-[#f0e68c] shadow-[0_3px_12px_rgba(240,230,140,0.3)] hover-scale hover-glow transition-all duration-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <RefreshCw className="mr-1 h-4 w-4 animate-spin-slow rhombus" />
              Try Again
            </Button>
            <Button
              className="px-6 py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-[#04a21c] to-[#00b7eb] text-[#ffffff] shadow-[0_3px_12px_rgba(4,162,28,0.3)] hover-scale hover-glow transition-all duration-200"
              onClick={() => (window.location.href = "/subjects")}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Back to Subjects
            </Button>
            <Button
              variant="outline"
              className="px-6 py-2 rounded-lg font-medium text-sm bg-[#0a0a0a]/70 border-[#00b7eb]/40 text-[#00b7eb] shadow-[0_3px_12px_rgba(0,183,235,0.3)] hover-scale hover-glow transition-all duration-200"
              onClick={() => (window.location.href = "/dashboard")}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}