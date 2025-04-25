"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Calendar, Filter, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { generateMockTest, type MockTestQuestion } from "@/lib/mock-test-generator"
import { MockTest } from "@/components/aptitude/mock-test"

// Mock test categories
const mockTestCategories = [
  { id: "national", name: "National" },
  { id: "international", name: "International" },
  { id: "sports", name: "Sports" },
  { id: "business", name: "Business & Economy" },
  { id: "science", name: "Science & Technology" },
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
    <main className="flex-1 py-12">
      <div className="container">
        <div className="mb-8">
          <Link
            href="/eduguide/aptitude-test"
            className="text-sm text-muted-foreground hover:text-primary flex items-center mb-2"
          >
            <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
            Back to Aptitude Test
          </Link>
          <h1 className="text-4xl font-bold mb-4">Current Affairs Mock Tests</h1>
          <p className="text-xl text-muted-foreground">
            Stay updated with current affairs and test your knowledge with our competitive exam-style mock tests.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filter Tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory("all")}
                    >
                      All Categories
                    </Button>
                    {mockTestCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Month
                  </h3>
                  <select
                    className="w-full p-2 rounded-md border border-border bg-background"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((month) => (
                      <option key={month.id} value={month.id}>
                        {month.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((category) => {
                const monthName = months.find((m) => m.id === selectedMonth)?.name || selectedMonth

                return (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{monthName} Mock Test</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Questions:</span>
                          <span>20</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Time Limit:</span>
                          <span>20 minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Difficulty:</span>
                          <span>Medium</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full gap-2" onClick={() => handleStartTest(monthName, category.name)}>
                        <PenTool className="h-4 w-4" />
                        Start Test
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
  )
}