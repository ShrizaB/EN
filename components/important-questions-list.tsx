"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clipboard, ChevronDown, ChevronUp, Check, Sparkles } from "lucide-react"

interface ImportantQuestionsListProps {
  questions: string[]
  answers?: string[]
}

export function ImportantQuestionsList({ questions, answers = [] }: ImportantQuestionsListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

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
    <div className="space-y-2 max-w-full overflow-x-hidden px-2 sm:px-4">
      {questions.length === 0 ? (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-thor-storm/30 mb-2">
            <Sparkles className="h-4 w-4 text-thor-lightning" />
          </div>
          <p className="text-thor-light/80 text-sm sm:text-base">No questions forged yet</p>
          <p className="text-thor-light/50 text-xs sm:text-sm mt-0.5">Upload content to see questions appear here</p>
        </div>
      ) : (
        questions.map((question, index) => (
          <Card
            key={index}
            className="thor-question w-full min-h-0 overflow-hidden transition-all duration-150 ease-out hover:border-thor-accent/30 group"
            style={{
              background: expandedIndex === index
                ? 'linear-gradient(145deg, rgba(12, 19, 35, 0.95), rgba(18, 28, 52, 0.9))'
                : 'rgba(12, 19, 35, 0.8)'
            }}
          >
            <div className="p-2 flex flex-col sm:flex-row sm:items-start gap-2 relative">
              <div className="relative flex-shrink-0 mt-0.5">
                <div className="bg-thor-storm/30 rounded-full w-7 h-7 flex items-center justify-center border border-thor-secondary/20 relative">
                  <span className="font-bold text-thor-lightning text-xs leading-none">{index + 1}</span>
                </div>
                <div className="absolute -inset-1 bg-thor-lightning/15 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                  <h3 className="font-medium text-thor-light text-sm sm:text-base leading-tight group-hover:text-thor-lightning/90 transition-colors duration-150 line-clamp-none break-words whitespace-normal">
                    {question}
                  </h3>

                  <div className="flex gap-1 shrink-0 mt-1 sm:mt-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10 bg-thor-storm/20 hover:bg-thor-lightning/10 text-thor-lightning/90 hover:text-thor-lightning border border-thor-secondary/20 hover:border-thor-lightning/40 rounded-sm transition-all duration-100 group/button text-xs"
                      onClick={() => copyToClipboard(question, index)}
                      title="Copy question to clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-green-400 group-hover/button:scale-110 transition-transform" />
                      ) : (
                        <Clipboard className="h-4 w-4 group-hover/button:scale-110 transition-transform" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10 bg-thor-storm/20 hover:bg-thor-lightning/10 text-thor-lightning/90 hover:text-thor-lightning border border-thor-secondary/20 hover:border-thor-lightning/40 rounded-sm transition-all duration-100 group/button text-xs"
                      onClick={() => handleToggleExpand(index)}
                      title={expandedIndex === index ? "Hide answer" : "Reveal answer"}
                    >
                      {expandedIndex === index ? (
                        <ChevronUp className="h-4 w-4 group-hover/button:scale-110 transition-transform" />
                      ) : (
                        <ChevronDown className="h-4 w-4 group-hover/button:scale-110 transition-transform" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedIndex === index && (
                  <div className="mt-2 pt-2 border-t border-thor-storm/30 transition-all duration-150 ease-out">
                    <div className="relative overflow-hidden rounded bg-thor-storm/10 p-2">
                      <div className="absolute left-0 top-0 h-full w-0.5 bg-thor-lightning"></div>
                      <p className="text-thor-light/90 text-sm sm:text-base leading-relaxed break-words whitespace-normal">
                        {ensuredAnswers[index]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-thor-lightning/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Card>
        ))
      )}
    </div>
  )
}

// Logic not changed
function generateDefaultAnswer(question: string): string {
  const baseAnswer = question.replace(/\?/g, "").trim()

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
