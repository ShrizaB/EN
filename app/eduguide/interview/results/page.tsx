"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, AlertCircle, FileText, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Question {
  id: number
  text: string
  type: "technical" | "analytical"
}

interface Answer {
  questionId: number
  text: string
  feedback: string
  score: number // 0-10
}

interface ResumeAnalysis {
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

interface InterviewResults {
  overallScore: number // 0-100
  technicalScore: number // 0-100
  analyticalScore: number // 0-100
  answers: Answer[]
  resumeAnalysis: ResumeAnalysis
  overallFeedback: string
}

export default function InterviewResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<InterviewResults | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load results and questions from session storage
    const storedResults = sessionStorage.getItem("interviewResults")
    const storedQuestions = sessionStorage.getItem("interviewQuestions")

    if (!storedResults || !storedQuestions) {
      router.push("/eduguide/interview")
      return
    }

    try {
      setResults(JSON.parse(storedResults))
      setQuestions(JSON.parse(storedQuestions))
      setIsLoading(false)
    } catch (err) {
      console.error(err)
      setError("Failed to load interview results. Please try again.")
      setIsLoading(false)
    }
  }, [router])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Loading your interview results...</p>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || "Failed to load interview results"}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/eduguide/interview">Return to Interview Page</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <main className="flex-1 py-12">
      <div className="container max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Interview Results</CardTitle>
            <CardDescription>Review your performance and get personalized feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3 mb-6">
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <span className={getScoreColor(results.overallScore)}>{results.overallScore}%</span>
                  {getScoreIcon(results.overallScore)}
                </div>
                <p className="text-sm text-center text-muted-foreground">Overall Score</p>
              </div>

              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <span className={getScoreColor(results.technicalScore)}>{results.technicalScore}%</span>
                  {getScoreIcon(results.technicalScore)}
                </div>
                <p className="text-sm text-center text-muted-foreground">Technical Score</p>
              </div>

              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <span className={getScoreColor(results.analyticalScore)}>{results.analyticalScore}%</span>
                  {getScoreIcon(results.analyticalScore)}
                </div>
                <p className="text-sm text-center text-muted-foreground">Analytical Score</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg mb-6">
              <h3 className="font-medium mb-2">Overall Feedback</h3>
              <p className="text-sm">{results.overallFeedback}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="answers">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="answers">Question Analysis</TabsTrigger>
            <TabsTrigger value="resume">Resume Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="answers" className="space-y-6">
            {results.answers.map((answer) => {
              const question = questions.find((q) => q.id === answer.questionId)
              return (
                <Card key={answer.questionId}>
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium text-blue-600">
                        {question?.type === "technical" ? "Technical Question" : "Analytical Question"}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={getScoreColor(answer.score * 10)}>{answer.score}/10</span>
                        {getScoreIcon(answer.score * 10)}
                      </div>
                    </div>
                    <CardTitle className="text-base">{question?.text}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Your Answer:</h4>
                      <p className="text-sm p-3 bg-gray-50 dark:bg-gray-900 rounded-md">{answer.text}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Feedback:</h4>
                      <p className="text-sm">{answer.feedback}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="resume">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Analysis
                </CardTitle>
                <CardDescription>Review feedback on your resume and suggestions for improvement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2 text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Strengths
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {results.resumeAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="text-sm">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Areas for Improvement
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {results.resumeAnalysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm">
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-blue-600 flex items-center gap-2">
                    <ArrowRight className="h-5 w-5" />
                    Suggestions
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {results.resumeAnalysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <Link href="/eduguide/interview">Return to Interview Page</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}