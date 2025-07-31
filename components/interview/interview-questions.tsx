"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'] })

interface Question {
  id: string
  question: string
  type?: string // technical or behavioral
}

interface InterviewQuestionsProps {
  questions: Question[]
  onComplete: (answers: Record<string, string>, analysis: any) => void
}

export default function InterviewQuestions({ questions, onComplete }: InterviewQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const allQuestions = questions;
  const totalQuestions = allQuestions.length;
  const currentQuestion = allQuestions[currentQuestionIndex];
  if (!allQuestions || allQuestions.length === 0 || !currentQuestion) {
    return (
      <div className="text-center py-10 text-yellow-400">
        <h2 className={`${orbitron.className} text-3xl font-bold mb-4 text-yellow-400 tracking-wider`}>
          NO_QUESTIONS_AVAILABLE
        </h2>
        <p className="text-yellow-400/80 tracking-wide">
          SYSTEM ERROR: NO INTERVIEW PROTOCOLS COULD BE GENERATED. RETRY CONNECTION OR CONTACT SUPPORT.
        </p>
      </div>
    );
  }

  const isTechnical = currentQuestion?.type === 'technical'

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value,
    })
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter((q) => !answers[q.id] || answers[q.id].trim() === "")

    if (unansweredQuestions.length > 0) {
      toast({
        title: "Incomplete Answers",
        description: `Please answer all questions before submitting. ${unansweredQuestions.length} questions remaining.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Format answers for API
      const formattedAnswers = questions.map((q) => ({
        id: q.id,
        question: q.question,
        answer: answers[q.id] || "",
        isTechnical: q.type === 'technical',
      }))

      // Call API to analyze answers
      const response = await fetch("/api/interview/analyze-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: formattedAnswers }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze answers")
      }

      const analysis = await response.json()

      setIsSubmitting(false)
      onComplete(answers, analysis)
    } catch (error) {
      setIsSubmitting(false)
      toast({
        title: "Error",
        description: "Failed to submit answers. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    }
  }

  return (
    <div className="space-y-8 text-yellow-400">
      {/* Header Section */}
      <div className="text-center relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 blur-xl animate-pulse"></div>
        <h2 className={`${orbitron.className} text-3xl font-bold mb-4 text-yellow-400 tracking-wider relative z-10`}>
          QUESTION_PROTOCOL_{String(currentQuestionIndex + 1).padStart(2, '0')}
        </h2>
        <p className="text-yellow-400/80 tracking-wide mb-3 relative z-10">
          EXECUTE RESPONSE SEQUENCE FOR NEURAL ANALYSIS
        </p>
        <div className={`${orbitron.className} text-sm text-yellow-400 font-bold tracking-wider relative z-10`}>
          <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
          PROGRESS: {currentQuestionIndex + 1}/{totalQuestions}
          <span className="ml-2 inline-flex space-x-1">
            {[1, 2, 3].map((i) => (
              <span key={i} className="inline-block w-1 h-1 bg-yellow-400/70 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}></span>
            ))}
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <Card className="border-2 border-yellow-400 rounded-none bg-black/50 relative overflow-hidden">
        {/* Animated border effects */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent">
          <div className="absolute top-0 left-0 w-20 h-full bg-yellow-400 animate-[scan_3s_ease-in-out_infinite] shadow-lg shadow-yellow-400/50"></div>
        </div>
        
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400/70"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400/70"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400/70"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400/70"></div>

        <div className="p-8 space-y-6 relative z-10">
          <div>
            <h3 className={`${orbitron.className} font-bold mb-4 tracking-wider text-sm`}>
              {isTechnical ? (
                <span className="text-yellow-400">
                  <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                  TECHNICAL_PROTOCOL
                </span>
              ) : (
                <span className="text-green-400">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  BEHAVIORAL_PROTOCOL
                </span>
              )}
            </h3>
            
            {/* Question Display */}
            <div className="border border-yellow-400/50 rounded-none p-6 bg-black/30 mb-6 relative">
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-yellow-400/50"></div>
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-yellow-400/50"></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-yellow-400/50"></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-yellow-400/50"></div>
              
              <p className={`${orbitron.className} text-lg font-medium text-yellow-400 tracking-wide leading-relaxed`}>
                {currentQuestion.question}
              </p>
            </div>
            
            {/* Answer Input */}
            <div className="relative">
              <Textarea
                placeholder="INITIALIZE RESPONSE PROTOCOL..."
                className="h-64 border-2 border-yellow-400 rounded-none bg-black text-yellow-400 placeholder:text-yellow-400/50 focus:border-yellow-400 focus:ring-0 focus:outline-none resize-none font-sans"
                value={answers[currentQuestion.id] || ""}
                onChange={handleAnswerChange}
              />
              
              {/* Input decorations */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-yellow-400/70"></div>
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-yellow-400/70"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={goToPreviousQuestion} 
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className={`${orbitron.className} border-2 border-yellow-400 rounded-none bg-black text-yellow-400 font-bold tracking-wider px-6 py-3 hover:bg-yellow-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          &lt; PREV_QUESTION
        </Button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button
            onClick={goToNextQuestion}
            disabled={!answers[currentQuestion.id] || answers[currentQuestion.id].trim() === "" || isSubmitting}
            className={`${orbitron.className} bg-yellow-400 text-black font-bold tracking-wider border-2 border-yellow-400 rounded-none px-6 py-3 hover:bg-yellow-400/90 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            NEXT_QUESTION &gt;
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={`${orbitron.className} bg-yellow-400 text-black font-bold tracking-wider border-2 border-yellow-400 rounded-none px-8 py-3 hover:bg-yellow-400/90 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? "PROCESSING..." : "EXECUTE_ANALYSIS"}
          </Button>
        )}
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2 p-4 border border-yellow-400/50 rounded-none bg-black/30 relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-yellow-400"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-yellow-400"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-yellow-400"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-yellow-400"></div>
          
          {questions.map((q, index) => (
            <button
              key={q.id}
              className={`w-4 h-4 rounded-none border-2 transition-all duration-300 ${
                index === currentQuestionIndex
                  ? "bg-yellow-400 border-yellow-400 shadow-[0_0_10px_#facc15]"
                  : answers[q.id] && answers[q.id].trim() !== ""
                    ? "bg-green-400 border-green-400 shadow-[0_0_5px_#4ade80]"
                    : "bg-transparent border-yellow-400/50 hover:border-yellow-400"
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </div>

      {/* Global styles for scan animation and focus overrides */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(400%); }
          100% { transform: translateX(-100%); }
        }
        
        /* Remove default focus outline */
        textarea:focus, textarea:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        /* Override autofill styles */
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:hover {
          -webkit-text-fill-color: #facc15 !important;
          background-color: #000000 !important;
          box-shadow: 0 0 0px 1000px #000000 inset !important;
        }
      `}</style>
    </div>
  )
}
