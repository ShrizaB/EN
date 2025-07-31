"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'] })

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
    return (
      <div className="text-center py-10 text-yellow-400">
        <h2 className={`${orbitron.className} text-3xl font-bold mb-4 text-yellow-400 tracking-wider`}>
          NO_DATA_AVAILABLE
        </h2>
        <p className="text-yellow-400/80 tracking-wide">
          SYSTEM ERROR: ANALYSIS DATA NOT FOUND. RETRY INTERVIEW PROTOCOL.
        </p>
      </div>
    )
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
    <div className="space-y-8 text-yellow-400">
      {/* Header Section */}
      <div className="text-center relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 blur-xl animate-pulse"></div>
        <h2 className={`${orbitron.className} text-3xl font-bold mb-4 text-yellow-400 tracking-wider relative z-10`}>
          ANALYSIS_COMPLETE
        </h2>
        <p className="text-yellow-400/80 tracking-wide mb-3 relative z-10">
          NEURAL ANALYSIS RESULTS GENERATED FROM INTERVIEW PROTOCOL
        </p>
        <div className={`${orbitron.className} text-sm text-yellow-400 font-bold tracking-wider relative z-10`}>
          <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
          STATUS: PROCESSING_COMPLETE
          <span className="ml-2 inline-flex space-x-1">
            {[1, 2, 3].map((i) => (
              <span key={i} className="inline-block w-1 h-1 bg-yellow-400/70 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}></span>
            ))}
          </span>
        </div>
      </div>

      {/* Overall Performance Card */}
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

        <div className="p-8 relative z-10">
          <h3 className={`${orbitron.className} text-xl font-bold mb-6 text-yellow-400 tracking-wider`}>
            OVERALL_PERFORMANCE_METRICS
          </h3>
          <div className="flex items-center mb-6">
            <div className="w-full relative">
              <Progress value={(overallScore / 10) * 100} className="h-6 bg-black border-2 border-yellow-400/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-400/10 rounded-none"></div>
            </div>
            <span className={`${orbitron.className} ml-6 font-bold text-2xl text-yellow-400 whitespace-nowrap`}>{overallScore}/10</span>
          </div>
        </div>
      </Card>

      {/* Detailed Analysis Card */}
      <Card className="border-2 border-yellow-400 rounded-none bg-black/50 relative overflow-hidden">
        {/* Animated border effects */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent">
          <div className="absolute top-0 left-0 w-20 h-full bg-yellow-400 animate-[scan_3s_ease-in-out_infinite_1s] shadow-lg shadow-yellow-400/50"></div>
        </div>
        
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400/70"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400/70"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400/70"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400/70"></div>

        <div className="p-8 relative z-10">
          <h3 className={`${orbitron.className} text-xl font-bold mb-6 text-yellow-400 tracking-wider`}>
            DETAILED_QUESTION_ANALYSIS
          </h3>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {allQuestions.map((question, index) => {
              const isTechnical = question.type === "technical"
              const score = getQuestionScore(question, index)
              const userAnswer = interviewAnswers.answers[question.id] || "No answer provided"
              const bestAnswer = getBestAnswer(question, index)
              return (
                <AccordionItem key={question.id} value={question.id} className="border-2 border-yellow-400/50 rounded-none bg-black/30">
                  <AccordionTrigger className="hover:no-underline px-6 py-4">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="text-left">
                        <span className={`${orbitron.className} text-sm font-bold tracking-wider ${isTechnical ? "text-yellow-400" : "text-green-400"}`}>
                          {isTechnical ? "TECHNICAL_Q" : "BEHAVIORAL_Q"}{String(index + 1).padStart(2, '0')}:
                        </span>
                        <div className={`${orbitron.className} font-medium text-yellow-400 mt-1 tracking-wide`}>
                          {question.question}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Progress value={(score / 10) * 100} className="w-24 h-3 mr-4 bg-black border border-yellow-400/50" />
                        <span className={`${orbitron.className} text-sm font-bold text-yellow-400 whitespace-nowrap`}>{score}/10</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-6 pt-2">
                      <div>
                        <h4 className={`${orbitron.className} font-bold text-yellow-400 tracking-wider mb-3`}>
                          YOUR_RESPONSE:
                        </h4>
                        <div className="border border-yellow-400/50 rounded-none p-4 bg-black/50 relative">
                          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-yellow-400/50"></div>
                          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-yellow-400/50"></div>
                          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-yellow-400/50"></div>
                          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-yellow-400/50"></div>
                          <p className="text-yellow-400/90 font-sans leading-relaxed">
                            {userAnswer}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className={`${orbitron.className} font-bold text-green-400 tracking-wider mb-3`}>
                          OPTIMAL_RESPONSE:
                        </h4>
                        <div className="border border-green-400/50 rounded-none p-4 bg-green-900/10 relative">
                          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-green-400/50"></div>
                          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-green-400/50"></div>
                          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-green-400/50"></div>
                          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-green-400/50"></div>
                          <p className="text-green-400/90 font-sans leading-relaxed">
                            {bestAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </Card>

      {/* Improvement Suggestions Card */}
      <Card className="border-2 border-yellow-400 rounded-none bg-black/50 relative overflow-hidden">
        {/* Animated border effects */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent">
          <div className="absolute top-0 left-0 w-20 h-full bg-yellow-400 animate-[scan_3s_ease-in-out_infinite_2s] shadow-lg shadow-yellow-400/50"></div>
        </div>
        
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400/70"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400/70"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400/70"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400/70"></div>

        <div className="p-8 relative z-10">
          <h3 className={`${orbitron.className} text-xl font-bold mb-6 text-yellow-400 tracking-wider`}>
            IMPROVEMENT_PROTOCOLS
          </h3>
          <div className="space-y-6">
            <div className="border border-cyan-400/50 rounded-none p-6 bg-cyan-900/10 relative">
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400/50"></div>
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-400/50"></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-400/50"></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-400/50"></div>
              
              <h4 className={`${orbitron.className} font-bold text-cyan-400 tracking-wider mb-3`}>
                TECHNICAL_SKILLS_ENHANCEMENT
              </h4>
              <p className="text-cyan-400/90 font-sans leading-relaxed">
                {analysis?.technicalImprovements ||
                  "Focus on deepening your understanding of core technical concepts related to your role. Consider working on practical projects to strengthen your skills and be prepared to explain your problem-solving approach clearly."}
              </p>
            </div>
            
            <div className="border border-purple-400/50 rounded-none p-6 bg-purple-900/10 relative">
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-purple-400/50"></div>
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-purple-400/50"></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-purple-400/50"></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-purple-400/50"></div>
              
              <h4 className={`${orbitron.className} font-bold text-purple-400 tracking-wider mb-3`}>
                BEHAVIORAL_SKILLS_OPTIMIZATION
              </h4>
              <p className="text-purple-400/90 font-sans leading-relaxed">
                {analysis?.behavioralImprovements ||
                  "When answering behavioral questions, use the STAR method (Situation, Task, Action, Result) to structure your responses. Provide specific examples from your experience and quantify your achievements where possible."}
              </p>
            </div>
            
            <div className="border border-orange-400/50 rounded-none p-6 bg-orange-900/10 relative">
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-orange-400/50"></div>
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-orange-400/50"></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-orange-400/50"></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-orange-400/50"></div>
              
              <h4 className={`${orbitron.className} font-bold text-orange-400 tracking-wider mb-3`}>
                OVERALL_STRATEGY_ADVICE
              </h4>
              <p className="text-orange-400/90 font-sans leading-relaxed">
                {analysis?.overallAdvice ||
                  "Practice articulating your thoughts clearly and concisely. Research the company and role thoroughly before interviews. Prepare questions to ask the interviewer that demonstrate your interest and knowledge of the company."}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Global styles for scan animation */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(400%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
