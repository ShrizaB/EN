"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Clock,
  Code,
  FlaskRoundIcon as Flask,
  Music,
  Palette,
  Globe,
  Brain,
  Film,
  Filter,
  Calendar,
  ChevronRight,
  Lock,
  LogIn,
  UserPlus,
  BarChart3,
  Zap,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserActivities, type UserActivity } from "@/lib/user-service"
import { getAllLearningHistory, type LearningHistory } from "@/lib/learning-history-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import './history.css'

// Subject icons mapping
const subjectIcons: Record<string, React.ReactNode> = {
  math: <Calculator className="h-5 w-5 text-math" />,
  science: <Flask className="h-5 w-5 text-science" />,
  reading: <BookOpen className="h-5 w-5 text-reading" />,
  coding: <Code className="h-5 w-5 text-coding" />,
  art: <Palette className="h-5 w-5 text-art" />,
  music: <Music className="h-5 w-5 text-music" />,
  geography: <Globe className="h-5 w-5 text-geography" />,
  logic: <Brain className="h-5 w-5 text-logic" />,
  movies: <Film className="h-5 w-5 text-primary" />,
  c_programming: <Code className="h-5 w-5 text-coding" />,
  python: <Code className="h-5 w-5 text-coding" />,
  java: <Code className="h-5 w-5 text-coding" />,
}

// Subject colors mapping with TVA theme
const subjectColors: Record<string, string> = {
  math: "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
  science: "bg-gradient-to-br from-green-500 to-emerald-700 text-white",
  reading: "bg-gradient-to-br from-amber-500 to-amber-700 text-white",
  coding: "bg-gradient-to-br from-purple-500 to-indigo-700 text-white",
  art: "bg-gradient-to-br from-pink-500 to-rose-700 text-white",
  music: "bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white",
  geography: "bg-gradient-to-br from-emerald-500 to-teal-700 text-white",
  logic: "bg-gradient-to-br from-cyan-500 to-blue-700 text-white",
  movies: "bg-gradient-to-br from-red-500 to-orange-700 text-white",
  c_programming: "bg-gradient-to-br from-blue-600 to-blue-800 text-white",
  python: "bg-gradient-to-br from-yellow-500 to-amber-700 text-white",
  java: "bg-gradient-to-br from-orange-500 to-red-700 text-white",
}

// Subject names mapping
const subjectNames: Record<string, string> = {
  math: "Mathematics",
  science: "Science",
  reading: "Reading",
  coding: "Coding",
  art: "Art",
  music: "Music",
  geography: "Geography",
  logic: "Logic",
  movies: "Movies",
  c_programming: "C Programming",
  python: "Python",
  java: "Java",
}

// Topic names mapping (simplified version - in a real app, this would be more comprehensive)
const topicNames: Record<string, Record<string, string>> = {
  math: {
    counting: "Counting & Numbers",
    addition: "Addition",
    subtraction: "Subtraction",
    multiplication: "Multiplication",
    division: "Division",
  },
  science: {
    animals: "Animals & Habitats",
    plants: "Plants & Growth",
    weather: "Weather & Seasons",
    solar_system: "Solar System",
  },
  reading: {
    alphabet: "Alphabet Recognition",
    phonics: "Phonics",
    sight_words: "Sight Words",
    comprehension: "Reading Comprehension",
  },
  coding: {
    basics: "Coding Basics",
    sequences: "Sequences",
    loops: "Loops",
    conditionals: "Conditionals",
  },
}

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [learningHistory, setLearningHistory] = useState<LearningHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [filter, setFilter] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timer)
    }
  }, [isVisible])

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          console.log("Fetching user activities and learning history...")
          setIsLoading(true)

          // Fetch both activities and learning history in parallel
          const [activitiesData, historyData] = await Promise.all([getUserActivities(), getAllLearningHistory()])

          console.log("Fetched activities:", activitiesData.length)
          console.log("Fetched learning history:", historyData.length)

          // Log the raw data to debug
          console.log("Raw learning history data:", historyData)

          // After fetching the data
          console.log("Raw activities data:", activitiesData)
          activitiesData.forEach((activity) => {
            if (activity.type === "quiz") {
              console.log(
                `Quiz activity - Subject: ${activity.subject}, Topic: ${activity.topic}, Score: ${activity.score}`,
              )
            }
          })

          setActivities(activitiesData)
          setLearningHistory(historyData)
        } catch (error) {
          console.error("Error fetching history data:", error)
        } finally {
          setIsLoading(false)
        }
      } else if (!loading) {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user, loading])

  // If not logged in, show login prompt
  if (!loading && !user) {
    return (
      <div className="min-h-screen w-full tva-container bg-tva-brown-dark flex items-center justify-center p-4">
        <div className="tva-card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-loki-green/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-loki-green" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-loki-green">ACCESS DENIED</h1>
          <p className="text-tva-brown-light mb-8">
            Temporal credentials not detected. Sign in to access your learning history across all timelines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-loki-green hover:bg-loki-green/90 text-tva-brown-dark font-bold">
              <Link href="/sign-in" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-loki-green/30 text-loki-green hover:bg-loki-green/10">
              <Link href="/sign-in?tab=signup" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-tva-brown-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-loki-green/30 border-t-loki-green animate-spin mx-auto"></div>
          <p className="mt-4 text-tva-brown-light font-mono">ACCESSING TEMPORAL RECORDS...</p>
        </div>
      </div>
    )
  }

  // Format date for display in TVA style
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(date).toUpperCase()
  }

  // Format time duration in TVA style
  const formatTime = (seconds: number) => {
    if (!seconds) return "0M"

    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}H ${minutes % 60}M`
    }
    return `${minutes}M ${seconds % 60}S`
  }

  // Get topic name
  const getTopicName = (subject: string, topic: string) => {
    if (topicNames[subject] && topicNames[subject][topic]) {
      return topicNames[subject][topic]
    }
    // Convert snake_case to Title Case
    return topic
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Filter learning history based on active tab and filter
  const filteredHistory = learningHistory
    .filter((item) => {
      if (activeTab === "all") return true
      if (activeTab === "topics") return !item.topic.includes("quiz")
      if (activeTab === "quizzes") return item.topic.includes("quiz")
      return true
    })
    .filter((item) => {
      if (!filter) return true
      return item.subject === filter
    })
    .sort((a, b) => {
      // Use visitDate if available, otherwise fall back to lastAccessed or other dates
      const dateA = new Date(a.visitDate || a.lastAccessed || a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.visitDate || b.lastAccessed || b.updatedAt || b.createdAt || 0).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

  // Filter activities based on active tab and filter
  const filteredActivities = activities
    .filter((item) => {
      if (activeTab === "all") return true
      if (activeTab === "topics") return item.type === "topic" || item.type === "reading"
      if (activeTab === "quizzes") return item.type === "quiz"
      return true
    })
    .filter((item) => {
      if (!filter) return true
      return item.subject === filter
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

  // Get unique subjects from history
  const subjects = [
    ...new Set([...learningHistory.map((item) => item.subject), ...activities.map((item) => item.subject || "")]),
  ]
    .filter(Boolean)
    .sort()

  // Check if there's any history data
  const hasHistoryData = learningHistory.length > 0 || activities.length > 0

  // TVA theme colors for difficulty levels
  const difficultyColors = {
    beginner: 'bg-loki-green/20 text-loki-green border-loki-green/30',
    intermediate: 'bg-tva-orange/20 text-tva-orange border-tva-orange/30',
    advanced: 'bg-tva-red/20 text-tva-red border-tva-red/30',
    expert: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }

  return (
    <div className="mt-16 min-h-screen w-full bg-tva-brown-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-tva-brown/50 to-tva-brown-dark/80"></div>

      <div className="relative z-10 container py-8 px-4 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-loki-green to-tva-orange"></div>
          <h1 className="text-4xl font-bold mb-2 text-loki-green font-mono tracking-tight glitch-text" data-text="TEMPORAL_RECORDS">
            TEMPORAL_RECORDS
          </h1>
          <p className="text-tva-brown-light font-mono flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-loki-green animate-pulse"></span>
            ACCESSING LEARNING HISTORY ACROSS ALL TIMELINES...
          </p>
          <p className="text-tva-brown-light/80 font-mono text-sm mt-2">
            TEMPORAL ANALYSIS OF YOUR LEARNING JOURNEY ACROSS ALL DIMENSIONS
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Button asChild variant="outline" className="border-loki-green/30 text-loki-green hover:bg-loki-green/10 flex items-center gap-2 group">
            <Link href="/dashboard" className="font-mono text-sm">
              <ChevronRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              RETURN TO DASHBOARD
            </Link>
          </Button>

          <div className="flex items-center gap-2 text-tva-brown-light/70 text-sm font-mono">
            <span className="hidden sm:inline">SORT BY:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder("newest")}
              className={`font-mono text-xs h-8 px-3 ${sortOrder === "newest"
                ? "bg-loki-green/10 text-loki-green border border-loki-green/30"
                : "text-tva-brown-light hover:bg-tva-brown/50"
                }`}
            >
              NEWEST
            </Button>
            <span className="text-tva-brown-light/30">|</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder("oldest")}
              className={`font-mono text-xs h-8 px-3 ${sortOrder === "oldest"
                ? "bg-loki-green/10 text-loki-green border border-loki-green/30"
                : "text-tva-brown-light hover:bg-tva-brown/50"
                }`}
            >
              OLDEST
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList className="bg-tva-brown border border-tva-brown-light/20 rounded-lg p-1 w-full sm:w-auto">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-loki-green/10 data-[state=active]:text-loki-green data-[state=active]:border-loki-green/30 px-4 py-2 rounded-md border border-transparent text-sm font-mono"
                >
                  ALL ACTIVITIES
                </TabsTrigger>
                <TabsTrigger
                  value="topics"
                  className="data-[state=active]:bg-loki-green/10 data-[state=active]:text-loki-green data-[state=active]:border-loki-green/30 px-4 py-2 rounded-md border border-transparent text-sm font-mono"
                >
                  TOPICS STUDIED
                </TabsTrigger>
                <TabsTrigger
                  value="quizzes"
                  className="data-[state=active]:bg-loki-green/10 data-[state=active]:text-loki-green data-[state=active]:border-loki-green/30 px-4 py-2 rounded-md border border-transparent text-sm font-mono"
                >
                  QUIZ RESULTS
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    className="w-full sm:w-auto pl-3 pr-8 py-2 rounded-md border border-tva-brown-light/20 bg-tva-brown-dark/50 text-tva-brown-light text-sm font-mono focus:ring-2 focus:ring-loki-green/30 focus:outline-none appearance-none"
                    value={filter || ""}
                    onChange={(e) => setFilter(e.target.value || null)}
                  >
                    <option value="" className="bg-tva-brown-dark text-tva-brown-light">
                      ALL SUBJECTS
                    </option>
                    {subjects.map((subject) => (
                      <option
                        key={subject}
                        value={subject}
                        className="bg-[#211712] text-tva-brown-light"
                      >
                        {subjectNames[subject as keyof typeof subjectNames] || subject.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-tva-brown-light/70 pointer-events-none" />
                </div>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              {hasHistoryData ? (
                <div className="space-y-6">
                  {/* Combined view of learning history and activities */}
                  {[...filteredHistory, ...filteredActivities]
                    .sort((a, b) => {
                      const dateA = new Date(
                        "timestamp" in a
                          ? a.timestamp
                          : (a as LearningHistory).visitDate ||
                          (a as LearningHistory).lastAccessed ||
                          (a as LearningHistory).updatedAt ||
                          (a as LearningHistory).createdAt ||
                          0,
                      ).getTime()

                      const dateB = new Date(
                        "timestamp" in b
                          ? b.timestamp
                          : (b as LearningHistory).visitDate ||
                          (b as LearningHistory).lastAccessed ||
                          (b as LearningHistory).updatedAt ||
                          (b as LearningHistory).createdAt ||
                          0,
                      ).getTime()

                      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
                    })
                    .map((item, index) => {
                      // Determine if this is an activity or learning history item
                      const isActivity = "timestamp" in item

                      // Get common properties
                      const subject = item.subject || ""
                      const topic = "topic" in item ? item.topic : (item as UserActivity).topic || ""
                      const date = new Date(
                        isActivity
                          ? (item as UserActivity).timestamp
                          : (item as LearningHistory).visitDate ||
                          (item as LearningHistory).lastAccessed ||
                          (item as LearningHistory).updatedAt ||
                          (item as LearningHistory).createdAt ||
                          0,
                      )

                      // Get activity-specific properties
                      const activityItem = isActivity ? (item as UserActivity) : null
                      const activityType = activityItem?.type || ""
                      const score = activityItem?.score
                      const timeSpent = activityItem?.timeSpent || 0

                      // Get learning history-specific properties
                      const historyItem = !isActivity ? (item as LearningHistory) : null
                      const progress = historyItem?.progress || 0
                      const visitCount = historyItem?.visitCount || 1
                      const difficulty = historyItem?.difficulty || "beginner"

                      // Determine icon and color based on subject
                      const icon = subjectIcons[subject as keyof typeof subjectIcons] || <BookOpen className="h-5 w-5" />
                      const color = subjectColors[subject as keyof typeof subjectColors] || "bg-primary"

                      // Format topic name
                      const topicName = getTopicName(subject, topic)

                      // Generate a unique key for each item
                      const itemKey = isActivity
                        ? `activity-${(item as UserActivity).id}-${index}`
                        : `history-${(item as LearningHistory).visitId || (item as LearningHistory)._id || index}`

                      return (
                        <div
                          key={itemKey}
                          className="group relative overflow-hidden rounded-lg bg-secondary/30 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full ${color} flex items-center justify-center flex-shrink-0`}
                            >
                              {icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <h3 className="font-medium text-lg">
                                    {subjectNames[subject as keyof typeof subjectNames] || subject}
                                    {topic && ` - ${topicName}`}
                                  </h3>

                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {formatDate(date)}
                                    </div>

                                    {isActivity && activityType && (
                                      <div className="px-2 py-0.5 rounded-full bg-secondary text-xs">
                                        {activityType.charAt(0).toUpperCase() + activityType.slice(1)}
                                      </div>
                                    )}

                                    {!isActivity && difficulty && (
                                      <div className="px-2 py-0.5 rounded-full bg-secondary text-xs">
                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                      </div>
                                    )}

                                    {timeSpent > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatTime(timeSpent)}
                                      </div>
                                    )}

                                    {!isActivity && visitCount > 0 && (
                                      <div className="flex items-center gap-1">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        Visit #{visitCount}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Action button */}
                                <Button asChild size="sm" variant="outline">
                                  <Link href={`/subjects/${subject}/topics/${topic.replace("quiz_", "")}`}>
                                    {isActivity && activityType === "quiz" ? "Retake Quiz" : "Continue Learning"}
                                  </Link>
                                </Button>
                              </div>

                              {/* Progress or score indicator */}
                              <div className="mt-4">
                                {isActivity && score !== undefined && (
                                  <div>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm">Quiz Score</span>
                                      <span className="text-sm font-medium">{score}%</span>
                                    </div>
                                    <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
                                      <div
                                        className={`absolute left-0 top-0 bottom-0 ${score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                                        style={{ width: `${score}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}

                                {!isActivity && progress !== undefined && (
                                  <div>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm">Progress</span>
                                      <span className="text-sm font-medium">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" color={color} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center p-12 bg-secondary/20 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Learning History Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring subjects and taking quizzes to build your learning history.
                  </p>
                  <Button asChild>
                    <Link href="/subjects">
                      Start Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="topics" className="mt-0">
              {filteredHistory.filter((item) => !item.topic.includes("quiz")).length > 0 ? (
                <div className="space-y-6">
                  {filteredHistory
                    .filter((item) => !item.topic.includes("quiz"))
                    .map((item, index) => {
                      const subject = item.subject || ""
                      const topic = item.topic || ""
                      const progress = item.progress || 0
                      const visitCount = item.visitCount || 1
                      const difficulty = item.difficulty || "beginner"
                      const date = new Date(item.visitDate || item.lastAccessed || item.updatedAt || item.createdAt || 0)
                      const visitId = item.visitId || item._id || `history-${index}`

                      // Determine icon and color based on subject
                      const icon = subjectIcons[subject as keyof typeof subjectIcons] || <BookOpen className="h-5 w-5" />
                      const color = subjectColors[subject as keyof typeof subjectColors] || "bg-primary"

                      // Format topic name
                      const topicName = getTopicName(subject, topic)

                      return (
                        <div
                          key={`topic-${visitId}`}
                          className="group relative overflow-hidden rounded-lg bg-secondary/30 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full ${color} flex items-center justify-center flex-shrink-0`}
                            >
                              {icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <h3 className="font-medium text-lg">
                                    {subjectNames[subject as keyof typeof subjectNames] || subject}
                                    {topic && ` - ${topicName}`}
                                  </h3>

                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {formatDate(date)}
                                    </div>

                                    {difficulty && (
                                      <div className="px-2 py-0.5 rounded-full bg-secondary text-xs">
                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                      </div>
                                    )}

                                    {visitCount > 0 && (
                                      <div className="flex items-center gap-1">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        Visit #{visitCount}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <Button asChild size="sm" variant="outline">
                                  <Link href={`/subjects/${subject}/topics/${topic}`}>Continue Learning</Link>
                                </Button>
                              </div>

                              <div className="mt-4">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Progress</span>
                                  <span className="text-sm font-medium">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" color={color} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center p-12 bg-secondary/20 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Topics Studied Yet</h3>
                  <p className="text-muted-foreground mb-6">Start exploring subjects to build your learning history.</p>
                  <Button asChild>
                    <Link href="/subjects">
                      Explore Subjects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="quizzes" className="mt-0">
              {filteredActivities.filter((item) => item.type === "quiz").length > 0 ? (
                <div className="space-y-6">
                  {filteredActivities
                    .filter((item) => item.type === "quiz")
                    .map((item, index) => {
                      const subject = item.subject || ""
                      const topic = item.topic || ""
                      const score = item.score || 0
                      const timeSpent = item.timeSpent || 0
                      const date = new Date(item.timestamp)

                      // Determine icon and color based on subject
                      const icon = subjectIcons[subject as keyof typeof subjectIcons] || <BookOpen className="h-5 w-5" />
                      const color = subjectColors[subject as keyof typeof subjectColors] || "bg-primary"

                      // Format topic name
                      const topicName = getTopicName(subject, topic.replace("quiz_", ""))

                      return (
                        <div
                          key={`quiz-${item.id || index}`}
                          className="group relative overflow-hidden rounded-lg bg-secondary/30 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full ${color} flex items-center justify-center flex-shrink-0`}
                            >
                              {icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <h3 className="font-medium text-lg">
                                    {subjectNames[subject as keyof typeof subjectNames] || subject}
                                    {topic && ` - ${topicName} Quiz`}
                                  </h3>

                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {formatDate(date)}
                                    </div>
                                    <div className="px-2 py-0.5 rounded-full bg-secondary text-xs">Quiz</div>
                                    {timeSpent > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatTime(timeSpent)}
                                      </div>
                                    )}
                                  </div>

                                  {/* Action button */}
                                  <Button asChild size="sm" variant="outline">
                                    <Link href={`/subjects/${subject}/topics/${topic.replace("quiz_", "")}`}>
                                      Retake Quiz
                                    </Link>
                                  </Button>
                                </div>

                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">Quiz Score</span>
                                    <span className="text-sm font-medium">{score}%</span>
                                  </div>
                                  <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
                                    <div
                                      className={`absolute left-0 top-0 bottom-0 ${score >= 70 ? "bg-green-500" : score >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                                      style={{ width: `${score}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center p-12 bg-secondary/20 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Quiz Results Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Take quizzes to test your knowledge and track your progress.
                  </p>
                  <Button asChild>
                    <Link href="/subjects">
                      Explore Subjects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

