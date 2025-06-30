"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

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
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">No Questions Available</h2>
        <p className="text-gray-600 dark:text-gray-400">Sorry, no interview questions could be generated. Please try again or contact support.</p>
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Interview Questions</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Answer the following questions to the best of your ability
        </p>
        <p className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">
              {isTechnical ? (
                <span className="text-blue-600">Technical Question:</span>
              ) : (
                <span className="text-green-600">Behavioral Question:</span>
              )}
            </h3>
            <p className="text-lg font-medium mb-4">{currentQuestion.question}</p>
            <Textarea
              placeholder="Type your answer here..."
              className="h-64"
              value={answers[currentQuestion.id] || ""}
              onChange={handleAnswerChange}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0 || isSubmitting}>
          Previous
        </Button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button
            onClick={goToNextQuestion}
            disabled={!answers[currentQuestion.id] || answers[currentQuestion.id].trim() === "" || isSubmitting}
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit All Answers"}
          </Button>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <div className="flex space-x-1">
          {questions.map((q, index) => (
            <button
              key={q.id}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestionIndex
                  ? "bg-blue-600"
                  : answers[q.id] && answers[q.id].trim() !== ""
                    ? "bg-green-500"
                    : "bg-gray-300"
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
