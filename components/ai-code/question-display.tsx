"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

interface QuestionDisplayProps {
  question: ProgrammingQuestion
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-2">{question.title}</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="hints">Hints</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4 prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: question.description }} />

            {question.constraints && (
              <>
                <h3 className="text-lg font-medium mt-4">Constraints:</h3>
                <div dangerouslySetInnerHTML={{ __html: question.constraints }} />
              </>
            )}
          </TabsContent>

          <TabsContent value="examples" className="mt-4 space-y-4">
            {question.examples.map((example: { input: string; output: string; explanation?: string }, index: number) => (
              <div key={index} className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Example {index + 1}:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Input:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">{example.input}</pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Output:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">{example.output}</pre>
                  </div>
                </div>
                {example.explanation && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Explanation:</p>
                    <p className="text-sm">{example.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="hints" className="mt-4">
            {question.hints && question.hints.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {question.hints.map((hint: string, index: number) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            ) : (
              <p>No hints available for this question.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
