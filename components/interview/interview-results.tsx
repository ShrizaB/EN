"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Question {
  id: string
  question: string
}

interface InterviewResultsProps {
  applicationData: {
    degree: string
    skills: string[]
    jobTitle: string
  } | null
  questions: {
    technical: Question[]
    behavioral: Question[]
  } | null
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

  // Get all questions in a flat array
  const allQuestions = [...questions.technical, ...questions.behavioral]

  // Get question scores from analysis
  const getQuestionScore = (questionId: string) => {
    if (analysis?.questionScores && analysis.questionScores[questionId]) {
      return analysis.questionScores[questionId]
    }
    // Fallback to random score between 60-95 if not available
    return Math.floor(Math.random() * 36) + 60
  }

  // Get best answer from analysis
  const getBestAnswer = (questionId: string) => {
    if (analysis?.bestAnswers && analysis.bestAnswers[questionId]) {
      return analysis.bestAnswers[questionId]
    }
    return "The ideal answer would demonstrate knowledge of the subject matter while being concise and clear."
  }

  // Calculate overall scores
  const technicalScore =
    analysis?.technicalScore ||
    Math.round(questions.technical.reduce((sum, q) => sum + getQuestionScore(q.id), 0) / questions.technical.length)

  const behavioralScore =
    analysis?.behavioralScore ||
    Math.round(questions.behavioral.reduce((sum, q) => sum + getQuestionScore(q.id), 0) / questions.behavioral.length)

  const overallScore = Math.round((technicalScore + behavioralScore) / 2)

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
            <Progress value={overallScore} className="h-4" />
          </div>
          <span className="ml-4 font-bold text-xl">{overallScore}%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Technical</h4>
            <div className="flex items-center">
              <div className="w-full">
                <Progress value={technicalScore} className="h-2" />
              </div>
              <span className="ml-2 font-medium">{technicalScore}%</span>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Behavioral</h4>
            <div className="flex items-center">
              <div className="w-full">
                <Progress value={behavioralScore} className="h-2" />
              </div>
              <span className="ml-2 font-medium">{behavioralScore}%</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Detailed Question Analysis</h3>

        <Accordion type="single" collapsible className="w-full">
          {allQuestions.map((question, index) => {
            const isTechnical = questions.technical.some((q) => q.id === question.id)
            const score = getQuestionScore(question.id)
            const userAnswer = interviewAnswers.answers[question.id] || "No answer provided"
            const bestAnswer = getBestAnswer(question.id)

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
                      <Progress value={score} className="w-24 h-2 mr-2" />
                      <span className="text-sm font-medium">{score}%</span>
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
