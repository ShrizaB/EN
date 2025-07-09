"use client"

import { useState, useEffect } from "react"
import JobApplicationForm from "./job-application-form"
import InterviewQuestions from "./interview-questions"
import InterviewResults from "./interview-results"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'] })

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
  const [scanLinePosition, setScanLinePosition] = useState(0)

  // Scan line animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLinePosition(prev => (prev >= 100 ? 0 : prev + 0.5))
    }, 20)
    return () => clearInterval(interval)
  }, [])

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
    <div className="min-h-screen text-yellow-400 p-4 overflow-hidden relative">
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-400" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-400" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-400" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-400" />
      
      {/* Main content */}
      <div className="relative z-2 max-w-5xl mx-auto">
        <Card className="border-2 border-yellow-400 rounded-none p-6 relative">
          
          <h1 className={`${orbitron.className} text-3xl font-bold text-center mb-8 text-yellow-400 tracking-wider`}>
            SYSTEM_INTERVIEW_PROTOCOL
          </h1>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-sm flex items-center justify-center border-2 border-yellow-400 ${
                    stage === "application" ? "bg-yellow-400 text-black" : "text-yellow-400"
                  } transition-all duration-300 ${orbitron.className} font-bold`}
                >
                  1
                </div>
                <div className="h-1 w-16 bg-yellow-400 mx-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-yellow-400 animate-pulse" style={{ animationDuration: '1s' }} />
                </div>
                <div
                  className={`w-10 h-10 rounded-sm flex items-center justify-center border-2 border-yellow-400 ${
                    stage === "interview" ? "bg-yellow-400 text-black" : "bg-black text-yellow-400"
                  } transition-all duration-300 ${orbitron.className} font-bold`}
                >
                  2
                </div>
                <div className="h-1 w-16 bg-yellow-400 mx-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-yellow-400 animate-pulse" style={{ animationDuration: '1s', animationDelay: '0.3s' }} />
                </div>
                <div
                  className={`w-10 h-10 rounded-sm flex items-center justify-center border-2 border-yellow-400 ${
                    stage === "results" ? "bg-yellow-400 text-black" : "bg-black text-yellow-400"
                  } transition-all duration-300 ${orbitron.className} font-bold`}
                >
                  3
                </div>
              </div>
              <div className={`text-md font-bold animate-pulse text-yellow-400 ${orbitron.className} tracking-wider`}>
                {stage === "application" && "INITIALIZE_APPLICATION"}
                {stage === "interview" && "QUESTION_PHASE"}
                {stage === "results" && "ANALYSIS_COMPLETE"}
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
                <Button 
                  onClick={resetProcess}
                  className={`${orbitron.className} bg-yellow-400 text-black font-bold tracking-wider border-2 border-yellow-400 rounded-none px-8 py-4`}
                >
                  RESTART_PROTOCOL
                </Button>
              </div>
            </>
          )}
        </Card>
        
        {/* Status bar */}
        <div className={`${orbitron.className} text-xs text-yellow-400 mt-4 flex justify-between tracking-wider`}>
          <span>SYSTEM_STATUS: {stage.toUpperCase()}</span>
          <span className="animate-pulse">CONNECTION: SECURE</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        .animate-flicker {
          animation: flicker 3s linear infinite;
        }
        
        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
            opacity: 0.99;
          }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  )
}