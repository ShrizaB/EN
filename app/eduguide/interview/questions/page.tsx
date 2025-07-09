"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: number
  text: string
  type: "technical" | "analytical"
}

export default function InterviewQuestionsPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load questions from session storage
    const storedQuestions = sessionStorage.getItem("interviewQuestions")

    if (!storedQuestions) {
      router.push("/eduguide/interview/upload")
      return
    }

    try {
      const parsedQuestions = JSON.parse(storedQuestions)
      setQuestions(parsedQuestions)

      // Initialize answers object
      const initialAnswers: Record<number, string> = {}
      parsedQuestions.forEach((q: Question) => {
        initialAnswers[q.id] = ""
      })
      setAnswers(initialAnswers)

      setIsLoading(false)
    } catch (err) {
      console.error(err)
      setError("Failed to load interview questions. Please try again.")
      setIsLoading(false)
    }
  }, [router])

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    // Check if all questions have been answered
    const unansweredQuestions = Object.entries(answers).filter(([_, answer]) => !answer.trim())

    if (unansweredQuestions.length > 0) {
      setError(
        `Please answer all questions before submitting. You have ${unansweredQuestions.length} unanswered questions.`,
      )
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Get resume analysis from session storage
      const resumeAnalysis = sessionStorage.getItem("resumeAnalysis")

      if (!resumeAnalysis) {
        throw new Error("Resume analysis not found")
      }

      // Submit answers for evaluation
      const response = await fetch("/api/interview/evaluate-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          questions,
          resumeAnalysis: JSON.parse(resumeAnalysis),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to evaluate answers")
      }

      const data = await response.json()

      // Store evaluation results in session storage
      sessionStorage.setItem("interviewResults", JSON.stringify(data))

      // Navigate to results page
      router.push("/eduguide/interview/results")
    } catch (err) {
      console.error(err)
      setError("An error occurred while evaluating your answers. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Loading interview questions...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <main className="flex-1 py-12">
      <div className="container max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-sm font-medium text-blue-600">
                {currentQuestion?.type === "technical" ? "Technical Question" : "Analytical Question"}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <CardTitle className="mt-4">{currentQuestion?.text}</CardTitle>
            <CardDescription>Provide a detailed answer as you would in a real interview</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Textarea
              placeholder="Type your answer here..."
              className="min-h-[200px] p-4"
              value={answers[currentQuestion?.id] || ""}
              onChange={(e) => handleAnswerChange(currentQuestion?.id, e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  "Submit Interview"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}