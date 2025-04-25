"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clipboard, ChevronDown, ChevronUp, Check } from "lucide-react"

interface ImportantQuestionsListProps {
  questions: string[]
  answers?: string[]
}

export function ImportantQuestionsList({ questions, answers = [] }: ImportantQuestionsListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Generate default answers if none provided
  const ensuredAnswers =
    answers.length === questions.length ? answers : questions.map((q, i) => answers[i] || generateDefaultAnswer(q))

  const handleToggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="space-y-4">
      {questions.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No questions generated yet</p>
      ) : (
        questions.map((question, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="p-4 flex items-start gap-3">
              <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-0.5">
                <span className="font-semibold text-primary">{index + 1}</span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium text-lg">{question}</h3>

                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(question, index)}
                      title="Copy question"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleExpand(index)}
                      title={expandedIndex === index ? "Hide answer" : "Show answer"}
                    >
                      {expandedIndex === index ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedIndex === index && (
                  <div className="mt-3 pt-3 border-t text-muted-foreground">
                    <h4 className="font-medium text-foreground mb-1">Answer:</h4>
                    <p>{ensuredAnswers[index]}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

// Helper function to generate a default answer if none is provided
function generateDefaultAnswer(question: string): string {
  // Remove question marks and convert to statement
  const baseAnswer = question.replace(/\?/g, "").trim()

  // Create a simple answer based on the question
  if (question.toLowerCase().startsWith("what is") || question.toLowerCase().startsWith("what are")) {
    return `${baseAnswer} is an important concept in this material. The document provides details about this topic that you should review carefully.`
  } else if (question.toLowerCase().startsWith("how")) {
    return `The process or method for ${baseAnswer} is outlined in the material. Review the specific steps or methodology described.`
  } else if (question.toLowerCase().startsWith("why")) {
    return `The reason for ${baseAnswer} is explained in the content. Understanding this rationale is key to mastering the subject.`
  } else if (question.toLowerCase().includes("example")) {
    return `The material provides examples of ${baseAnswer}. Study these examples to better understand the practical applications.`
  } else if (question.toLowerCase().includes("difference") || question.toLowerCase().includes("compare")) {
    return `The distinction between these concepts is highlighted in the material. Pay attention to the key differences and similarities.`
  } else {
    return `This is an important question based on the material. Review the content carefully to find the detailed answer.`
  }
}