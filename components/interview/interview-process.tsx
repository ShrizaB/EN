"use client"

import { useState } from "react"
import JobApplicationForm from "./job-application-form"
import InterviewQuestions from "./interview-questions"
import InterviewResults from "./interview-results"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Question = {
  id: string
  question: string
  type?: string // 'technical' | 'behavioral'
}

type InterviewStage = "application" | "interview" | "results"

export default function InterviewProcess() {
  const [stage, setStage] = useState<InterviewStage>("application")
  const [applicationData, setApplicationData] = useState<{
    degree: string
    skills: string[]
    jobTitle: string
    interviewType: "technical" | "behavioral" | "both"
  } | null>(null)
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [interviewAnswers, setInterviewAnswers] = useState<{
    answers: Record<string, string>
    analysis: any
  } | null>(null)

  const handleApplicationComplete = async (data: { degree: string; skills: string[]; jobTitle: string; interviewType: "technical" | "behavioral" | "both" }) => {
    setApplicationData(data)
    try {
      // Generate questions based on application data
      const response = await fetch("/api/gemini/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          degree: data.degree,
          skills: data.skills,
          jobTitle: data.jobTitle,
          interviewType: data.interviewType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate questions")
      }

      const generatedQuestions = await response.json()
      // Robustly handle both array and object with questions property
      let questionsArray: Question[] = []
      if (Array.isArray(generatedQuestions)) {
        questionsArray = generatedQuestions
      } else if (Array.isArray(generatedQuestions.questions)) {
        questionsArray = generatedQuestions.questions
      }
      // Fallback to default questions if array is empty or malformed
      if (!questionsArray || questionsArray.length === 0) {
        questionsArray = Array(10)
          .fill(0)
          .map((_, i) => ({
            id: `default-${i}`,
            question: `Default question ${i + 1}`,
            type: i < 5 ? "technical" : "behavioral",
          }))
      }
      setQuestions(questionsArray)
      setStage("interview")
    } catch (error) {
      console.error("Error generating questions:", error)
      // Fallback to default questions if API fails
      setQuestions(
        Array(10)
          .fill(0)
          .map((_, i) => ({
            id: `default-${i}`,
            question: `Default question ${i + 1}`,
            type: i < 5 ? "technical" : "behavioral",
          }))
      )
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
