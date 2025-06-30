"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import CodeEditor from "./code-editor"
import QuestionDisplay from "./question-display"
import ResultsDisplay from "./results-display"
import { Skeleton } from "@/components/ui/skeleton"

type SubmissionStatus = "idle" | "checking" | "running" | "analyzing" | "complete"
type QuestionResult = {
  questionId: number
  code: string
  output: string
  passed: boolean
  feedback: string
  executionTime?: number
  memoryUsed?: string
}

interface ProgrammingQuestion {
  id: number
  title: string
  description: string
  constraints?: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
  hints?: string[]
  difficulty: "easy" | "medium" | "hard"
  language: string
  starterCode?: string
  solution?: string
}

// Supported languages for the dropdown
const supportedLanguages = [
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "Java", value: "java" },
  { label: "C++", value: "c++" },
  { label: "C", value: "c" },
]

export default function AICodeChallenge() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [status, setStatus] = useState<SubmissionStatus>("idle")
  const [results, setResults] = useState<QuestionResult[]>([])
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [overallFeedback, setOverallFeedback] = useState("")
  const [questions, setQuestions] = useState<ProgrammingQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [challengeStarted, setChallengeStarted] = useState(false)
  const [customInput, setCustomInput] = useState("")
  // New: difficulty selection for each question
  const [selectedDifficulties, setSelectedDifficulties] = useState<('easy'|'medium'|'hard')[]>(["easy","medium","hard"])

  // Fetch questions on component mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true)
        const response = await fetch("/api/eduguide/ai-code/generate-questions")
        if (!response.ok) {
          throw new Error("Failed to fetch questions")
        }
        const data = await response.json()
        // Only keep questions for supported languages
        setQuestions(data.filter((q: ProgrammingQuestion) => supportedLanguages.some(lang => lang.value === q.language)))
      } catch (err) {
        setError("Failed to load programming questions. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [])

  // Update code and language when question changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      setCode(getDefaultStarterCode(selectedLanguage));
      setOutput("");
      setStatus("idle");
      if (!challengeStarted) {
        setSelectedLanguage(questions[currentQuestionIndex].language || supportedLanguages[0].value);
      }
    }
  }, [currentQuestionIndex, questions]);

  // Update code when language changes (after challenge started)
  useEffect(() => {
    if (challengeStarted && questions.length > 0 && currentQuestionIndex < questions.length) {
      setCode(getDefaultStarterCode(selectedLanguage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  // Helper to get default starter code for a language
  function getDefaultStarterCode(lang: string): string {
    switch (lang) {
      case "python":
        return `def solution():\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    solution()`
      case "javascript":
        return `function solution() {\n  // Write your code here\n}\n\nsolution();`
      case "java":
        return `public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`
      case "c++":
        return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}`
      case "c":
        return `#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}`
      default:
        return ""
    }
  }

  // Helper to format input for the selected language
  function formatInputForLanguage(input: string, language: string): string {
    if (language === "c" || language === "c++" || language === "java") {
      // Assume input is comma or space separated, convert to lines
      return input.split(/,|\s+/).map(s => s.trim()).filter(Boolean).join('\n');
    }
    // For Python and JavaScript, use as is
    return input;
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  const handleCheckCode = async () => {
    if (!questions.length || loading) return

    setStatus("checking")
    setOutput("Running your code against all test cases...")

    try {
      const currentQuestion = questions[currentQuestionIndex]
      // Run code against all test cases (reuse /evaluate endpoint)
      const response = await fetch("/api/eduguide/ai-code/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          testCases: currentQuestion.testCases.map(tc => ({
            ...tc,
            input: formatInputForLanguage(tc.input, selectedLanguage),
          })),
        }),
      })

      const data = await response.json()

      if (data.error) {
        setOutput(`Error: ${data.error}`)
      } else if (data.passed) {
        setOutput("✅ Success! All test cases passed.")
      } else {
        // Show which test cases failed
        const failedCases = data.results.filter((r: any) => !r.passed)
        let msg = `❌ Some test cases failed.\n\n`
        failedCases.forEach((r: any, i: number) => {
          msg += `Test Case ${i + 1}:\nInput: ${r.input}\nExpected: ${r.expectedOutput}\nActual: ${r.actualOutput}\nError: ${r.error || "None"}\n\n`
        })
        setOutput(msg)
      }
    } catch (error) {
      setOutput(`Error executing code: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setStatus("idle")
    }
  }

  const handleSubmitCode = async () => {
    if (!questions.length || loading) return

    setStatus("running")
    setOutput("Evaluating your solution...")

    try {
      const currentQuestion = questions[currentQuestionIndex]

      // First execute the code against all test cases
      const executeResponse = await fetch("/api/eduguide/ai-code/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          testCases: currentQuestion.testCases.map(tc => ({
            ...tc,
            input: formatInputForLanguage(tc.input, selectedLanguage),
          })),
        }),
      })

      const executeData = await executeResponse.json()

      setStatus("analyzing")
      setOutput("AI is analyzing your code and generating the best solution...")

      // Get AI feedback and best solution for the code
      const feedbackResponse = await fetch("/api/eduguide/ai-code/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          question: currentQuestion,
          executionResults: executeData,
          language: selectedLanguage,
        }),
      })

      const feedbackData = await feedbackResponse.json()

      // Get the best correct code (solution) from Gemini
      let aiSolution = currentQuestion.solution;
      try {
        const solutionRes = await fetch("/api/eduguide/ai-code/generate-questions?difficulty=" + currentQuestion.difficulty + "&language=" + selectedLanguage);
        const solutionQ = await solutionRes.json();
        if (solutionQ && solutionQ.solution) aiSolution = solutionQ.solution;
      } catch {}

      // Save the results for this question
      const questionResult: QuestionResult = {
        questionId: currentQuestion.id,
        code,
        output: executeData.output || "",
        passed: executeData.passed || false,
        feedback: feedbackData.feedback || "No feedback available",
        executionTime: executeData.executionTime,
        memoryUsed: executeData.memoryUsed,
      }
      setResults(prev => {
        const updated = [...prev]
        updated[currentQuestionIndex] = questionResult
        return updated
      })
      // Update the question's solution with the AI-generated one
      setQuestions(prev => {
        const updated = [...prev]
        updated[currentQuestionIndex] = { ...updated[currentQuestionIndex], solution: aiSolution }
        return updated
      })
      setStatus("complete")
      setOutput("")
      // If last question, show final results
      if (currentQuestionIndex === questions.length - 1) {
        setShowFinalResults(true)
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    } catch (error) {
      setOutput(`Error executing code: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setStatus("idle")
    }
  }

  const handleReset = () => {
    setCurrentQuestionIndex(0)
    setResults([])
    setShowFinalResults(false)
    setOverallFeedback("")
    if (questions.length > 0) {
      setCode(getDefaultStarterCode(selectedLanguage))
    }
    setOutput("")
    setStatus("idle")
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Error Loading Questions</h3>
        <p className="text-red-700 dark:text-red-300">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
        >
          Try Again
        </Button>
      </div>
    )
  }

  // No questions loaded
  if (!questions.length) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">No Questions Available</h3>
        <p className="text-yellow-700 dark:text-yellow-300">
          We couldn't load any programming questions at this time. Please try again later.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300"
        >
          Refresh
        </Button>
      </div>
    )
  }

  if (showFinalResults) {
    return (
      <ResultsDisplay results={results} questions={questions} overallFeedback={overallFeedback} onReset={handleReset} />
    )
  }

  if (!challengeStarted) {
    // Show language and difficulty selection form
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
        <h2 className="text-2xl font-bold">Choose your programming language</h2>
        <select
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-lg"
        >
          {supportedLanguages.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
        <h2 className="text-xl font-semibold mt-4">Choose difficulty for each question</h2>
        <form className="flex flex-col gap-2 w-full max-w-xs">
          {[0,1,2].map(i => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-6">{i+1}.</span>
              <select
                value={selectedDifficulties[i]}
                onChange={e => {
                  const newDiffs = [...selectedDifficulties]
                  newDiffs[i] = e.target.value as 'easy'|'medium'|'hard'
                  setSelectedDifficulties(newDiffs)
                }}
                className="flex-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          ))}
        </form>
        <Button
          onClick={async () => {
            // Fetch 3 unique questions for the selected language and each selected difficulty
            setLoading(true);
            try {
              const fetchedQuestions = await Promise.all(
                selectedDifficulties.map(async (diff, i) => {
                  // Add a random param to avoid caching and encourage unique questions
                  const res = await fetch(`/api/eduguide/ai-code/generate-questions?difficulty=${diff}&language=${selectedLanguage}&rnd=${Math.random()}`);
                  const q = await res.json();
                  // Ensure id is unique per question
                  return { ...q, id: i + 1, difficulty: diff, language: selectedLanguage };
                })
              );
              setQuestions(fetchedQuestions);
              setCode(getDefaultStarterCode(selectedLanguage));
              setChallengeStarted(true);
            } finally {
              setLoading(false);
            }
          }}
          disabled={!selectedLanguage}
          className="text-lg px-6 py-2 mt-4"
        >
          Start Challenge
        </Button>
      </div>
    )
  }

  // When challenge started, only show questions/examples for selected language
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium">
            Question {currentQuestionIndex + 1}/{questions.length}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              currentQuestion.difficulty === "easy"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : currentQuestion.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
          </span>
        </div>
        <Progress value={(currentQuestionIndex / (questions.length - 1)) * 100} className="w-1/3" />
      </div>

      {/* Only show question/examples for selected language */}
      <QuestionDisplay question={currentQuestion} />

      <Card className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-medium">Language:</span>
          <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm">{selectedLanguage}</span>
        </div>
        {/* Always show only the starter structure for the selected language */}
        <CodeEditor code={code} language={selectedLanguage} onChange={handleCodeChange} />
        <div className="mt-4">
          <label className="block font-medium mb-1" htmlFor="custom-input">Custom Input for Check Output:</label>
          <textarea
            id="custom-input"
            className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900"
            rows={2}
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="Enter input for your code here..."
          />
        </div>
        {output && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h3 className="text-sm font-medium mb-2">Output:</h3>
            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
          </div>
        )}
        <div className="flex justify-between mt-4">
          <Button onClick={handleCheckCode} variant="outline" disabled={status !== "idle" || !code.trim()}>
            Check Output
          </Button>
          <Button onClick={handleSubmitCode} disabled={status !== "idle" || !code.trim()}>
            {status === "running" || status === "analyzing" ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {status === "running" ? "Running..." : "Analyzing..."}
              </>
            ) : (
              "Submit Solution"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
