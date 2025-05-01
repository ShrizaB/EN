"use client"

import { useState } from "react"
import JobApplicationForm from "./job-application-form"
import InterviewQuestions from "./interview-questions"
import InterviewResults from "./interview-results"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type InterviewStage = "application" | "interview" | "results"

export default function InterviewProcess() {
  const [stage, setStage] = useState<InterviewStage>("application")
  const [applicationData, setApplicationData] = useState<{
    degree: string
    skills: string[]
    jobTitle: string
  } | null>(null)
  const [questions, setQuestions] = useState<{
    technical: { id: string; question: string }[]
    behavioral: { id: string; question: string }[]
  } | null>(null)
  const [interviewAnswers, setInterviewAnswers] = useState<{
    answers: Record<string, string>
    analysis: any
  } | null>(null)

  const handleApplicationComplete = async (data: { degree: string; skills: string[]; jobTitle: string }) => {
    setApplicationData(data)

    try {
      // Generate questions based on application data
      const response = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          degree: data.degree,
          skills: data.skills,
          jobTitle: data.jobTitle,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate questions")
      }

      const generatedQuestions = await response.json()
      setQuestions(generatedQuestions)
      setStage("interview")
    } catch (error) {
      console.error("Error generating questions:", error)
      // Fallback to default questions if API fails
      setQuestions({
        technical: Array(10)
          .fill(0)
          .map((_, i) => ({
            id: `tech-${i}`,
            question: `Default technical question ${i + 1}`,
          })),
        behavioral: Array(10)
          .fill(0)
          .map((_, i) => ({
            id: `behav-${i}`,
            question: `Default behavioral question ${i + 1}`,
          })),
      })
      setStage("interview")
    }
  }

  const handleInterviewComplete = (answers: Record<string, string>, analysis: any) => {
    setInterviewAnswers({ answers, analysis })
    setStage("results")
  }

  const resetProcess = () => {
    setStage("application")
    setApplicationData(null)
    setQuestions(null)
    setInterviewAnswers(null)
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stage === "application" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
              }`}
            >
              1
            </div>
            <div className="h-1 w-16 bg-gray-200 mx-2"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stage === "interview" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
              }`}
            >
              2
            </div>
            <div className="h-1 w-16 bg-gray-200 mx-2"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stage === "results" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
              }`}
            >
              3
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {stage === "application" && "Job Application"}
            {stage === "interview" && "Interview Questions"}
            {stage === "results" && "Results & Feedback"}
          </div>
        </div>
      </div>

      {stage === "application" && <JobApplicationForm onComplete={handleApplicationComplete} />}
      {stage === "interview" && questions && (
        <InterviewQuestions questions={questions} onComplete={handleInterviewComplete} />
      )}
      {stage === "results" && (
        <>
          <InterviewResults
            applicationData={applicationData}
            questions={questions}
            interviewAnswers={interviewAnswers}
          />
          <div className="mt-8 text-center">
            <Button onClick={resetProcess}>Start New Interview</Button>
          </div>
        </>
      )}
    </Card>
  )
}
