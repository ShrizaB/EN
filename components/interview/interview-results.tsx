"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Question {
  id: string
  question: string
  type?: string // technical or behavioral
}

interface InterviewResultsProps {
  applicationData: {
    degree: string
    skills: string[]
    jobTitle: string
    interviewType?: string
  } | null
  questions: Question[] | null
  interviewAnswers: {
    answers: Record<string, string>
    analysis: any
  } | null
}

export default function InterviewResults({ applicationData, questions, interviewAnswers }: InterviewResultsProps) {
  if (!applicationData || !questions || !interviewAnswers) {
    return <div>No data available</div>
  }

  const { analysis } = interviewAnswers
  // If the new API returns an array of results, use that
  const isArrayResults = Array.isArray(analysis?.questions)
  // Use the flat array of questions
  const allQuestions = questions
  // Get question scores and best answers from the new API
  const getQuestionScore = (question: any, idx: number) => {
    if (isArrayResults && analysis.questions[idx]) {
      return analysis.questions[idx].score
    }
    if (analysis?.questionScores && analysis.questionScores[question.id]) {
      return analysis.questionScores[question.id]
    }
    return 0
  }
  const getBestAnswer = (question: any, idx: number) => {
    if (isArrayResults && analysis.questions[idx]) {
      return analysis.questions[idx].bestAnswer
    }
    if (analysis?.bestAnswers && analysis.bestAnswers[question.id]) {
      return analysis.bestAnswers[question.id]
    }
    return "The ideal answer would demonstrate knowledge of the subject matter while being concise and clear."
  }
  // Calculate overall score out of 10
  const totalScore = allQuestions.reduce((sum, q, idx) => sum + getQuestionScore(q, idx), 0)
  const overallScore = Math.round((totalScore / allQuestions.length) * 10) / 10

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Interview Results</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Here's your personalized feedback based on your interview answers
        </p>
      </div>
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Overall Performance</h3>
        <div className="flex items-center mb-6">
          <div className="w-full">
            <Progress value={(overallScore / 10) * 100} className="h-4" />
          </div>
          <span className="ml-4 font-bold text-xl">{overallScore} / 10</span>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Detailed Question Analysis</h3>
        <Accordion type="single" collapsible className="w-full">
          {allQuestions.map((question, index) => {
            const isTechnical = question.type === "technical"
            const score = getQuestionScore(question, index)
            const userAnswer = interviewAnswers.answers[question.id] || "No answer provided"
            const bestAnswer = getBestAnswer(question, index)
            return (
              <AccordionItem key={question.id} value={question.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <span className={`text-sm font-medium ${isTechnical ? "text-blue-600" : "text-green-600"}`}>
                        {isTechnical ? "Technical" : "Behavioral"} Q{index + 1}:
                      </span>
                      <div className="font-medium">{question.question}</div>
                    </div>
                    <div className="flex items-center">
                      <Progress value={(score / 10) * 100} className="w-24 h-2 mr-2" />
                      <span className="text-sm font-medium">{score} / 10</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-medium text-gray-700">Your Answer:</h4>
                      <p className="mt-1 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        {userAnswer}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Ideal Answer:</h4>
                      <p className="mt-1 text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                        {bestAnswer}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Improvement Suggestions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Technical Skills</h4>
            <p className="text-gray-600 dark:text-gray-400">
              {analysis?.technicalImprovements ||
                "Focus on deepening your understanding of core technical concepts related to your role. Consider working on practical projects to strengthen your skills and be prepared to explain your problem-solving approach clearly."}
            </p>
          </div>
          <div>
            <h4 className="font-medium">Behavioral Skills</h4>
            <p className="text-gray-600 dark:text-gray-400">
              {analysis?.behavioralImprovements ||
                "When answering behavioral questions, use the STAR method (Situation, Task, Action, Result) to structure your responses. Provide specific examples from your experience and quantify your achievements where possible."}
            </p>
          </div>
          <div>
            <h4 className="font-medium">Overall Advice</h4>
            <p className="text-gray-600 dark:text-gray-400">
              {analysis?.overallAdvice ||
                "Practice articulating your thoughts clearly and concisely. Research the company and role thoroughly before interviews. Prepare questions to ask the interviewer that demonstrate your interest and knowledge of the company."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
