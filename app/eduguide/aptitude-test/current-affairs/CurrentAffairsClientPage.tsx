"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Calendar, Filter, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { generateMockTest, type MockTestQuestion } from "@/lib/mock-test-generator"
import MockTest from "@/components/aptitude/mock-test"
import "./current-affairs.css"

// Mock test categories
const mockTestCategories = [
  { id: "national", name: "National" },
  { id: "international", name: "International" },
  { id: "sports", name: "Sports" },
  { id: "business", name: "Business & Economy" },
  { id: "science", name: "Science & Tech" },
  { id: "environment", name: "Environment" },
]

// Mock test months
const months = [
  { id: "april-2023", name: "April 2023" },
  { id: "may-2023", name: "May 2023" },
  { id: "june-2023", name: "June 2023" },
  { id: "july-2023", name: "July 2023" },
  { id: "august-2023", name: "August 2023" },
  { id: "september-2023", name: "September 2023" },
  { id: "october-2023", name: "October 2023" },
  { id: "november-2023", name: "November 2023" },
  { id: "december-2023", name: "December 2023" },
  { id: "january-2024", name: "January 2024" },
  { id: "february-2024", name: "February 2024" },
  { id: "march-2024", name: "March 2024" },
  { id: "april-2024", name: "April 2024" },
]

export default function CurrentAffairsClientPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("april-2024")
  const [showTest, setShowTest] = useState<boolean>(false)
  const [currentTest, setCurrentTest] = useState<{ title: string; category: string }>({ title: "", category: "" })
  const [questions, setQuestions] = useState<MockTestQuestion[]>([])
  const [questionsLoading, setQuestionsLoading] = useState<boolean>(false)

  const handleStartTest = async (title: string, category: string) => {
    setQuestionsLoading(true)
    setCurrentTest({ title, category })
    try {
      const generatedQuestions = await generateMockTest(
        `${title} Current Affairs in ${category}`,
        "Current Affairs",
        20,
      )
      setQuestions(generatedQuestions)
      setShowTest(true)
    } catch (error) {
      console.error("Error generating questions:", error)
    } finally {
      setQuestionsLoading(false)
    }
  }

  const handleFinishTest = () => {
    setShowTest(false)
  }

  const handleBackFromTest = () => {
    setShowTest(false)
  }

  if (showTest) {
    return (
      <MockTest
        topic={`${currentTest.title} - ${currentTest.category}`}
        subject="Current Affairs"
        questions={questions}
        onFinish={handleFinishTest}
        onBack={handleBackFromTest}
      />
    )
  }

  // Filter tests based on selected category
  const filteredTests =
    selectedCategory === "all" ? mockTestCategories : mockTestCategories.filter((cat) => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Matrix Background Animation */}
      <div className="matrix-bg"></div>

      {/* Circuit Board Background */}
      <div className="circuit-bg"></div>

      {/* Cyber Grid Overlay */}
      <div className="cyber-grid"></div>

      <main className="relative z-10 flex-1 py-12 mt-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4 text-green-400 glitch-text font-mono tracking-wider">
              CURRENT_AFFAIRS
            </h1>
            <h2 className="text-2xl font-bold mb-6 text-green-300 glitch-text-secondary font-mono">MOCK_TESTS</h2>
            <p className="text-lg text-green-200/80 font-mono leading-relaxed max-w-3xl">
              {">"} STAY_UPDATED_WITH_CURRENT_AFFAIRS_AND_TEST_YOUR_KNOWLEDGE
              <br />
              {">"} COMPETITIVE_EXAM_STYLE_MOCK_TESTS_AVAILABLE
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-6">
              <Card className="bg-gray-900/50 border-green-400/30 backdrop-blur-sm cyber-card">
                <CardHeader className="border-b border-green-400/20">
                  <CardTitle className="text-lg text-green-400 font-mono tracking-wide">FILTER_TESTS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center text-green-300 font-mono">
                      <Filter className="h-4 w-4 mr-2 text-green-400" />
                      CATEGORIES
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        size="sm"
                        className={`w-full justify-start font-mono text-xs tracking-wider transition-all duration-300 cyber-button ${
                          selectedCategory === "all"
                            ? "bg-green-400/20 text-green-400 border-green-400 hover:bg-green-400/30"
                            : "bg-gray-800/50 text-green-300 border-green-400/30 hover:bg-green-400/10 hover:border-green-400"
                        }`}
                        onClick={() => setSelectedCategory("all")}
                      >
                        ALL_CATEGORIES
                      </Button>
                      {mockTestCategories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          className={`w-full justify-start font-mono text-xs tracking-wider transition-all duration-300 cyber-button ${
                            selectedCategory === category.id
                              ? "bg-green-400/20 text-green-400 border-green-400 hover:bg-green-400/30"
                              : "bg-gray-800/50 text-green-300 border-green-400/30 hover:bg-green-400/10 hover:border-green-400"
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          {category.name.toUpperCase().replace(/\s+/g, "_")}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center text-green-300 font-mono">
                      <Calendar className="h-4 w-4 mr-2 text-green-400" />
                      MONTH
                    </h3>
                    <select
                      className="w-full p-3 rounded-none bg-gray-800/50 border border-green-400/30 text-green-300 font-mono text-sm focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400/50 transition-all duration-300 cyber-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {months.map((month) => (
                        <option key={month.id} value={month.id} className="bg-gray-900 text-green-300">
                          {month.name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTests.map((category, index) => {
                  const monthName = months.find((m) => m.id === selectedMonth)?.name || selectedMonth
                  return (
                    <Card
                      key={category.id}
                      className="bg-gray-900/40 border-green-400/30 backdrop-blur-sm cyber-card hover:border-green-400 transition-all duration-500 hover:shadow-lg hover:shadow-green-400/20 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="bg-gradient-to-br from-green-400/10 to-green-600/5 border-b border-green-400/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <CardTitle className="text-green-400 font-mono tracking-wide relative z-10">
                          {category.name.toUpperCase().replace(/\s+/g, "_")}
                        </CardTitle>
                        <CardDescription className="text-green-300/80 font-mono text-sm relative z-10">
                          {monthName.toUpperCase()}_MOCK_TEST
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm font-mono">
                            <span className="text-green-300">QUESTIONS:</span>
                            <span className="text-green-400 font-bold">20</span>
                          </div>
                          <div className="flex justify-between text-sm font-mono">
                            <span className="text-green-300">TIME_LIMIT:</span>
                            <span className="text-green-400 font-bold">20_MIN</span>
                          </div>
                          <div className="flex justify-between text-sm font-mono">
                            <span className="text-green-300">DIFFICULTY:</span>
                            <span className="text-yellow-400 font-bold">MEDIUM</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          className="w-full gap-2 font-mono text-sm tracking-wider cyber-button-primary"
                          onClick={() => handleStartTest(monthName, category.name)}
                          disabled={questionsLoading}
                        >
                          <PenTool className="h-4 w-4" />
                          {questionsLoading ? "LOADING..." : "START_TEST"}
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
