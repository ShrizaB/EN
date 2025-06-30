"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, XCircle } from "lucide-react"

interface ProgrammingQuestion {
  id: number;
  title: string;
  description: string;
  constraints?: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  hints?: string[];
  difficulty: "easy" | "medium" | "hard";
  language: string;
  starterCode?: string;
  solution?: string;
}

interface ResultsDisplayProps {
  results: Array<{
    questionId: number
    code: string
    output: string
    passed: boolean
    feedback: string
    executionTime?: number
    memoryUsed?: string
  }>
  questions: ProgrammingQuestion[]
  overallFeedback: string
  onReset: () => void
}

export default function ResultsDisplay({ results, questions, overallFeedback, onReset }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState("summary")

  const totalPassed = results.filter((r) => r.passed).length
  const score = Math.round((totalPassed / questions.length) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gray-50 dark:bg-gray-800">
          <CardTitle className="text-center">Your Results</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="text-6xl font-bold mb-2">{score}%</div>
            <p className="text-lg">
              You solved {totalPassed} out of {questions.length} problems correctly
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Detailed Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Overall Assessment</h3>
                <div dangerouslySetInnerHTML={{ __html: overallFeedback }} />

                <h3 className="mt-6">Question Summary</h3>
                <div className="grid gap-4">
                  {results.map((result, index) => {
                    const question = questions.find((q) => q.id === result.questionId)
                    return (
                      <div key={index} className="flex items-center gap-3">
                        {result.passed ? (
                          <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                        ) : (
                          <XCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">{question?.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {result.passed ? "Passed all test cases" : "Failed some test cases"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                {results.map((result, index) => {
                  const question = questions.find((q) => q.id === result.questionId)
                  return (
                    <AccordionItem key={index} value={`question-${index}`}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          {result.passed ? (
                            <CheckCircle className="text-green-500 h-5 w-5" />
                          ) : (
                            <XCircle className="text-red-500 h-5 w-5" />
                          )}
                          <span>
                            Question {index + 1}: {question?.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Your Code:</h4>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                              {result.code}
                            </pre>
                          </div>

                          {result.output && (
                            <div>
                              <h4 className="font-medium mb-2">Output:</h4>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                                {result.output}
                              </pre>
                            </div>
                          )}

                          <div>
                            <h4 className="font-medium mb-2">AI Feedback:</h4>
                            <div className="prose dark:prose-invert max-w-none">
                              <div dangerouslySetInnerHTML={{ __html: result.feedback }} />
                            </div>
                          </div>

                          {question?.solution && (
                            <div>
                              <h4 className="font-medium mb-2">Sample Solution:</h4>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                                {question.solution}
                              </pre>
                            </div>
                          )}

                          {(result.executionTime !== undefined || result.memoryUsed) && (
                            <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                              {result.executionTime !== undefined && (
                                <div>Execution time: {result.executionTime}ms</div>
                              )}
                              {result.memoryUsed && <div>Memory used: {result.memoryUsed}</div>}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-center">
            <Button onClick={onReset}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
