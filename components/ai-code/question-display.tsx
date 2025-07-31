"use client"

import { useState } from "react"
import { Clipboard, Lightbulb, Search, Lock } from "lucide-react"

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
    <div className="space-y-6">
      <div className="border-b border-purple-500/20 pb-4">
        <h2 className="text-2xl font-bold cyber-text">[CHALLENGE] {question.title}</h2>
        <div className="text-sm terminal-text text-purple-300 mt-2">
          Target: {question.language.toUpperCase()} | Difficulty: {question.difficulty.toUpperCase()}
        </div>
      </div>

      {/* Custom tab navigation */}
      <div className="flex gap-2">
        {[
          { id: "description", label: "[DESC]", icon: <Clipboard className="inline-block w-4 h-4" /> },
          { id: "examples", label: "[EXAMPLES]", icon: <Lightbulb className="inline-block w-4 h-4" /> },
          { id: "hints", label: "[HINTS]", icon: <Search className="inline-block w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded transition-all duration-300 font-medium text-sm ${
              activeTab === tab.id
                ? "hacker-button cyber-text"
                : "hacker-card border-purple-500/30 text-purple-300 hover:border-purple-500/50 hover:text-purple-200"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content with slide animation */}
      <div className="min-h-[300px]">
        {activeTab === "description" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="hacker-card p-6">
              <h3 className="cyber-text text-lg mb-4">[PROBLEM_STATEMENT]:</h3>
              <div 
                className="terminal-text text-gray-200 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: question.description }} 
              />

              {question.constraints && (
                <div className="mt-6 pt-4 border-t border-purple-500/20">
                  <h4 className="cyber-text text-md mb-3">[CONSTRAINTS]:</h4>
                  <div 
                    className="terminal-text text-gray-300 text-sm"
                    dangerouslySetInnerHTML={{ __html: question.constraints }} 
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "examples" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
            {question.examples.map((example, index) => (
              <div key={index} className="hacker-card p-6 group hover:border-purple-500/40 transition-all duration-300">
                <h3 className="cyber-text text-lg mb-4">[EXAMPLE_{index + 1}]:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="cyber-text text-sm mb-2">[INPUT]:</p>
                    <div className="hacker-terminal p-3 rounded">
                      <pre className="terminal-text text-green-400 text-sm">{example.input}</pre>
                    </div>
                  </div>
                  <div>
                    <p className="cyber-text text-sm mb-2">[OUTPUT]:</p>
                    <div className="hacker-terminal p-3 rounded">
                      <pre className="terminal-text text-green-400 text-sm">{example.output}</pre>
                    </div>
                  </div>
                </div>
                
                {example.explanation && (
                  <div className="mt-4 pt-4 border-t border-purple-500/20">
                    <p className="cyber-text text-sm mb-2">[EXPLANATION]:</p>
                    <p className="terminal-text text-gray-300 text-sm leading-relaxed">{example.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "hints" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="hacker-card p-6">
              <h3 className="cyber-text text-lg mb-4">[HINT_DATABASE]:</h3>
              {question.hints && question.hints.length > 0 ? (
                <div className="space-y-3">
                  {question.hints.map((hint, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded border border-purple-500/20 bg-black/30 hover:border-purple-500/40 transition-all duration-300 group"
                    >
                      <span className="cyber-text text-purple-400 font-bold text-sm mt-0.5">
                        {( <span className="inline-block mr-1"><Lock className="inline-block w-4 h-4" /></span> )} {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="terminal-text text-gray-200 text-sm flex-1 group-hover:text-gray-100 transition-colors">
                        {hint}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-3"><Lock className="inline-block w-8 h-8 text-purple-400" /></div>
                  <p className="terminal-text text-gray-400">No hints available in the database.</p>
                  <p className="terminal-text text-purple-300 text-sm mt-2">[CHALLENGE_MODE_ACTIVE]</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
