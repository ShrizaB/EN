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
          <div className="hacker-skeleton h-8 w-40" />
          <div className="hacker-skeleton h-4 w-1/3" />
        </div>
        <div className="hacker-skeleton h-40 w-full" />
        <div className="hacker-skeleton h-80 w-full" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="hacker-card p-6 border-red-500/30 bg-red-950/20">
        <h3 className="text-lg font-medium cyber-text mb-2">[ERROR] System Malfunction</h3>
        <p className="text-red-300 terminal-text">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="hacker-button mt-4 px-4 py-2 rounded"
        >
          [RETRY_CONNECTION]
        </button>
      </div>
    )
  }

  // No questions loaded
  if (!questions.length) {
    return (
      <div className="hacker-card p-6 border-yellow-500/30 bg-yellow-950/20">
        <h3 className="text-lg font-medium cyber-text mb-2">[WARNING] No Data Available</h3>
        <p className="text-yellow-300 terminal-text">
          Programming challenge database is currently offline. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="hacker-button mt-4 px-4 py-2 rounded"
        >
          [REFRESH_DATABASE]
        </button>
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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
        <div className="hacker-card p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-bold cyber-text text-center mb-2">[SYSTEM_CONFIG]</h2>
          <p className="terminal-text text-center mb-8 text-purple-300">Initialize your programming environment</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium cyber-text mb-3">Select Programming Language:</label>
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="hacker-input w-full px-4 py-3 text-lg"
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.value} value={lang.value} className="bg-gray-900">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold cyber-text mb-4">Configure Challenge Difficulty:</h3>
              <div className="space-y-3">
                {[0,1,2].map(i => (
                  <div key={i} className="flex items-center gap-4 hacker-card p-4">
                    <span className="cyber-text font-bold w-16">Level {i+1}:</span>
                    <select
                      value={selectedDifficulties[i]}
                      onChange={e => {
                        const newDiffs = [...selectedDifficulties]
                        newDiffs[i] = e.target.value as 'easy'|'medium'|'hard'
                        setSelectedDifficulties(newDiffs)
                      }}
                      className="hacker-input flex-1 px-3 py-2"
                    >
                      <option value="easy" className="bg-gray-900">Easy - Fundamentals</option>
                      <option value="medium" className="bg-gray-900">Medium - Intermediate</option>
                      <option value="hard" className="bg-gray-900">Hard - Advanced</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button
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
            disabled={!selectedLanguage || loading}
            className="hacker-button w-full text-lg px-6 py-4 mt-8 rounded font-bold"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                [INITIALIZING_SYSTEM...]
              </>
            ) : (
              '[START_CHALLENGE] ▶'
            )}
          </button>
        </div>
      </div>
    )
  }

  // When challenge started, only show questions/examples for selected language
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="hacker-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold cyber-text">
              [CHALLENGE_{currentQuestionIndex + 1}/{questions.length}]
            </span>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                currentQuestion.difficulty === "easy"
                  ? "difficulty-easy"
                  : currentQuestion.difficulty === "medium"
                    ? "difficulty-medium"
                    : "difficulty-hard"
              }`}
            >
              {currentQuestion.difficulty.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 mx-6">
            <div className="hacker-progress h-3 rounded-full overflow-hidden">
              <div 
                className="hacker-progress-fill h-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="text-sm terminal-text text-purple-300">
          System Status: {status === "idle" ? "Ready" : status === "checking" ? "Validating..." : status === "running" ? "Processing..." : "Analyzing..."}
        </div>
      </div>

      {/* Question Display */}
      <div className="hacker-card p-6">
        <QuestionDisplay question={currentQuestion} />
      </div>

      {/* Code Editor Section */}
      <div className="hacker-card p-6">
        <div className="mb-4 flex items-center gap-4">
          <span className="font-medium cyber-text">[LANG]:</span>
          <span className="hacker-card px-3 py-1 text-sm terminal-text">
            {selectedLanguage.toUpperCase()}
          </span>
        </div>
        
        <div className="hacker-terminal p-4 rounded-lg mb-4">
          <CodeEditor code={code} language={selectedLanguage} onChange={handleCodeChange} />
        </div>
        
        <div className="mb-4">
          <label className="block font-medium cyber-text mb-3" htmlFor="custom-input">
            [DEBUG_INPUT]:
          </label>
          <textarea
            id="custom-input"
            className="hacker-input w-full px-3 py-2 text-sm"
            rows={3}
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="Enter test input for debugging..."
          />
        </div>
        
        {output && (
          <div className="hacker-code-output p-4 rounded-md mb-4">
            <h3 className="text-sm font-medium cyber-text mb-2">[OUTPUT]:</h3>
            <pre className="whitespace-pre-wrap text-sm terminal-text">{output}</pre>
          </div>
        )}
        
        <div className="flex justify-between gap-4">
          <button 
            onClick={handleCheckCode} 
            className="hacker-button px-6 py-3 rounded font-medium flex-1"
            disabled={status !== "idle" || !code.trim()}
          >
            [TEST_CODE]
          </button>
          <button 
            onClick={handleSubmitCode} 
            className="hacker-button px-6 py-3 rounded font-medium flex-1"
            disabled={status !== "idle" || !code.trim()}
          >
            {status === "running" || status === "analyzing" ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {status === "running" ? "[EXECUTING...]" : "[AI_ANALYZING...]"}
              </>
            ) : (
              "[SUBMIT_SOLUTION] →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
