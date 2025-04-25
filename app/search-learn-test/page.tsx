"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Brain, Sparkles, Rocket, Lightbulb } from "lucide-react"
import { TopicContentViewer } from "@/components/search-learn-test/topic-content-viewer"
import { TopicQuizTest } from "@/components/search-learn-test/topic-quiz-test"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

export default function SearchLearnTestPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeStep, setActiveStep] = useState<"search" | "learn" | "test">("search")
  const [topicContent, setTopicContent] = useState("")
  const [topicQuestions, setTopicQuestions] = useState([])
  const [currentTopic, setCurrentTopic] = useState("")
  const [currentSubject, setCurrentSubject] = useState("")
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setCurrentTopic(searchQuery)

    try {
      // First, analyze the topic to determine which subject it belongs to
      const subjectResponse = await fetch("/api/search-learn-test/analyze-subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchQuery }),
      })

      if (!subjectResponse.ok) throw new Error("Failed to analyze subject")
      const subjectData = await subjectResponse.json()
      const subject = subjectData.subject

      console.log(`Topic "${searchQuery}" analyzed as subject: ${subject}`)
      setCurrentSubject(subject)

      // Generate content about the topic
      const contentResponse = await fetch("/api/search-learn-test/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: searchQuery,
          subject: subject,
        }),
      })

      if (!contentResponse.ok) throw new Error("Failed to generate content")
      const contentData = await contentResponse.json()
      setTopicContent(contentData.content)

      // Generate questions about the topic
      const questionsResponse = await fetch("/api/search-learn-test/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: searchQuery,
          subject: subject,
        }),
      })

      if (!questionsResponse.ok) throw new Error("Failed to generate questions")
      const questionsData = await questionsResponse.json()
      setTopicQuestions(questionsData.questions)

      // Move to the learn step
      setActiveStep("learn")
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const startTest = () => {
    setActiveStep("test")
  }

  const resetSearch = () => {
    setSearchQuery("")
    setTopicContent("")
    setTopicQuestions([])
    setCurrentSubject("")
    setActiveStep("search")
  }

  // Popular topics for kids
  const popularTopics = [
    { name: "Dinosaurs", icon: <Sparkles className="h-4 w-4 text-purple-500" /> },
    { name: "Solar System", icon: <Rocket className="h-4 w-4 text-blue-500" /> },
    { name: "Animals", icon: <Lightbulb className="h-4 w-4 text-amber-500" /> },
    { name: "Human Body", icon: <Brain className="h-4 w-4 text-red-500" /> },
    { name: "Weather", icon: <BookOpen className="h-4 w-4 text-green-500" /> },
    { name: "Ancient Egypt", icon: <Sparkles className="h-4 w-4 text-orange-500" /> },
  ]

  return (
    <main className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Search, Learn, Test
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter any topic you want to learn about. Our AI will create fun educational content and a 20-question test
            to help you master the subject!
          </p>
        </div>

        {activeStep === "search" && (
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 border-none rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-center">What would you like to learn today?</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter a topic (e.g., Dinosaurs, Space, Animals, Weather)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg rounded-full border-2 border-primary/20 focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-lg rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Creating your learning adventure...</span>
                    <div className="h-5 w-5 rounded-full border-2 border-current border-r-transparent animate-spin"></div>
                  </>
                ) : (
                  "Start Learning Adventure"
                )}
              </Button>
            </form>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 text-center">Popular Topics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {popularTopics.map((topic) => (
                  <Button
                    key={topic.name}
                    variant="outline"
                    onClick={() => setSearchQuery(topic.name)}
                    className="text-md h-12 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                  >
                    {topic.icon}
                    <span className="ml-2">{topic.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">How it works:</h3>
              <ol className="space-y-2 ml-6 list-decimal">
                <li>Enter any topic you're curious about</li>
                <li>Read the kid-friendly content (15 minutes)</li>
                <li>Take a fun 20-question quiz to test your knowledge</li>
                <li>See your score and track your progress!</li>
              </ol>
            </div>
          </Card>
        )}

        {activeStep === "learn" && (
          <TopicContentViewer
            topic={currentTopic}
            content={topicContent}
            subject={currentSubject}
            onStartTest={startTest}
            onBack={resetSearch}
          />
        )}

        {activeStep === "test" && (
          <TopicQuizTest
            topic={currentTopic}
            questions={topicQuestions}
            subject={currentSubject}
            onFinish={() => router.push("/dashboard")}
            onBack={() => setActiveStep("learn")}
          />
        )}
      </div>
    </main>
  )
}