"use client"

import type React from "react"

import { useEffect, useState, useCallback, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  Clock,
  Code,
  FlaskRoundIcon as Flask,
  Trophy,
  Award,
  Music,
  Palette,
  Globe,
  Brain,
  Film,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserData, type UserProgress, type UserStats } from "@/lib/user-service"
import { getAllLearningHistory, type LearningHistory } from "@/lib/learning-history-service"
import { getDashboardChartData, forceDashboardRefresh } from "@/lib/dashboard-service"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EduPlayNavbar } from "@/components/eduplay-navbar"

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

// Subject colors mapping
const subjectColors: Record<string, string> = {
  math: "#4F46E5",
  science: "#10B981",
  reading: "#EC4899",
  coding: "#F59E0B",
  art: "#C026D3",
  music: "#F59E0B",
  geography: "#06B6D4",
  logic: "#8B5CF6",
  movies: "#8B5CF6",
  c_programming: "#3B82F6",
  python: "#10B981",
  java: "#F97316",
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

// Recommended topics based on user progress
const recommendedTopics = [
  {
    id: "addition",
    title: "Addition",
    subject: "Mathematics",
    subjectSlug: "math",
    level: "Beginner",
    ageRange: "5-7",
    questionsCount: 15,
  },
  {
    id: "phonics",
    title: "Phonics",
    subject: "Reading",
    subjectSlug: "reading",
    level: "Beginner",
    ageRange: "4-6",
    questionsCount: 15,
  },
  {
    id: "plants",
    title: "Plants & Growth",
    subject: "Science",
    subjectSlug: "science",
    level: "Beginner",
    ageRange: "5-8",
    questionsCount: 12,
  },
]

// Format time display
const formatTime = (seconds: number) => {
  if (!seconds || seconds <= 0) return "0h 0m"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

// Login prompt component
function LoginPrompt() {
  return (

    <div className="container py-12 md:py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Sign in to view your dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Track your progress, view your achievements, and continue your learning journey.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sign-in?tab=signup">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Skeleton loading component for stats cards
function StatCardSkeleton() {
  return (
    
    <div className="rounded-xl bg-secondary/30 border border-secondary p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10"></div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted-foreground/20 rounded"></div>
          <div className="h-3 w-16 bg-muted-foreground/10 rounded"></div>
        </div>
      </div>
      <div className="h-8 w-16 bg-muted-foreground/20 rounded mb-1"></div>
      <div className="h-3 w-32 bg-muted-foreground/10 rounded"></div>
    </div>
  )
}

// Skeleton loading component for pie chart
function PieChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-40 bg-muted-foreground/20 rounded mb-2"></div>
        <div className="h-4 w-60 bg-muted-foreground/10 rounded"></div>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-8 border-muted-foreground/10 animate-pulse"></div>
      </CardContent>
    </Card>
  )
}

// Skeleton loading component for activity cards
function ActivityCardSkeleton() {
  return (
    <div className="rounded-lg bg-secondary/50 border border-secondary p-4 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-muted-foreground/20 rounded"></div>
          <div className="h-4 w-24 bg-muted-foreground/10 rounded"></div>
        </div>
        <div className="h-8 w-20 bg-primary/30 rounded"></div>
      </div>
      <div className="h-1.5 w-full bg-muted-foreground/10 rounded mb-2"></div>
      <div className="flex justify-between">
        <div className="h-3 w-16 bg-muted-foreground/10 rounded"></div>
        <div className="h-3 w-20 bg-muted-foreground/10 rounded"></div>
      </div>
    </div>
  )
}

// Skeleton loading component for achievement cards
function AchievementCardSkeleton() {
  return (
    <div className="rounded-lg bg-secondary/50 border border-secondary p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted-foreground/10"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 w-28 bg-muted-foreground/20 rounded"></div>
          <div className="h-3 w-36 bg-muted-foreground/10 rounded"></div>
        </div>
      </div>
    </div>
  )
}

// Dashboard content component that loads data
function DashboardContent() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<{
    userData: { progress: UserProgress; stats: UserStats } | null
    learningHistory: LearningHistory[]
    isLoaded: boolean
  }>({
    userData: null,
    learningHistory: [],
    isLoaded: false,
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)

  // Simple refresh function that increments the refresh key
  const refreshData = useCallback(() => {
    console.log("🔄 Manual refresh triggered")
    setRefreshKey((prev) => prev + 1)
    forceDashboardRefresh()
  }, [])

  // Listen for learning history update events
  useEffect(() => {
    const handleLearningHistoryUpdated = () => {
      console.log("Learning history update detected, refreshing data...")
      refreshData()
    }

    const handleForceRefresh = () => {
      console.log("Force refresh event detected, refreshing data...")
      refreshData()
    }

    window.addEventListener("learning-history-updated", handleLearningHistoryUpdated)
    window.addEventListener("force-dashboard-refresh", handleForceRefresh)

    return () => {
      window.removeEventListener("learning-history-updated", handleLearningHistoryUpdated)
      window.removeEventListener("force-dashboard-refresh", handleForceRefresh)
    }
  }, [refreshData])

  // Fetch chart data separately
  useEffect(() => {
    let isMounted = true

    const fetchChartData = async () => {
      if (!user) return

      try {
        console.log("Fetching chart data...")
        const data = await getDashboardChartData(user.id)

        if (isMounted) {
          console.log("Setting chart data:", data)
          setChartData(data)
        }
      } catch (error) {
        console.error("Error fetching chart data:", error)
      }
    }

    if (user) {
      fetchChartData()
    }

    return () => {
      isMounted = false
    }
  }, [user, refreshKey])

  // Fetch learning history and user data
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (!user) return

      try {
        // Fetch both in parallel with cache-busting
        const timestamp = Date.now()
        const [history, userData] = await Promise.all([
          getAllLearningHistory(`t=${timestamp}`),
          getUserData(`${user.id}?t=${timestamp}`),
        ])

        console.log("Learning history fetched:", history?.length || 0, "items")
        console.log("User data fetched:", userData)

        if (isMounted) {
          setDashboardData({
            userData: {
              progress: userData?.progress || {},
              stats: userData?.stats || {},
            },
            learningHistory: history || [],
            isLoaded: true,
          })
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        if (isMounted) {
          // Even on error, mark as loaded to show empty state
          setDashboardData((prev) => ({ ...prev, isLoaded: true }))
        }
      }
    }

    if (user) {
      fetchData()
    } else {
      setDashboardData((prev) => ({ ...prev, isLoaded: true }))
    }

    return () => {
      isMounted = false
    }
  }, [user, refreshKey])

  // Process learning history to count unique activities by subject
  const activityCountBySubject: Record<string, number> = {}
  const uniqueTopics = new Set<string>()

  // Debug the learning history data
  console.log("Processing learning history for activities:", dashboardData.learningHistory)

  // First, normalize subject names to match our keys
  const normalizedHistory = dashboardData.learningHistory.map((item) => {
    if (!item || !item.subject) return item

    // Convert subject to lowercase and remove spaces
    let normalizedSubject = item.subject.toLowerCase().replace(/\s+/g, "")

    // Handle common variations
    if (normalizedSubject.includes("math")) normalizedSubject = "math"
    if (normalizedSubject.includes("science")) normalizedSubject = "science"
    if (normalizedSubject.includes("read")) normalizedSubject = "reading"
    if (normalizedSubject.includes("code") || normalizedSubject.includes("program")) normalizedSubject = "coding"

    return {
      ...item,
      normalizedSubject,
    }
  })

  // Now count activities by normalized subject
  normalizedHistory.forEach((item) => {
    if (!item || !item.subject || !item.topic) return

    const subject = item.normalizedSubject || item.subject.toLowerCase()
    const key = `${subject}-${item.topic}`

    // Only count each unique topic once
    if (!uniqueTopics.has(key)) {
      uniqueTopics.add(key)
      activityCountBySubject[subject] = (activityCountBySubject[subject] || 0) + 1
      console.log(`Added activity for subject: ${subject}, count now: ${activityCountBySubject[subject]}`)
    }
  })

  // Calculate total activities
  const totalActivities = Object.values(activityCountBySubject).reduce((sum, count) => sum + count, 0)

  // Get user's recent activities based on learning history
  const recentActivities = dashboardData.learningHistory
    .filter((item) => item && item.subject && item.topic) // Filter out invalid entries
    .slice(0, 3) // Take the 3 most recent activities
    .map((item) => {
      const subjectKey = item.subject.toLowerCase().replace(/\s+/g, "") as keyof typeof subjectNames
      let displaySubject = item.subject
      let subjectSlug = item.subject.toLowerCase().replace(/\s+/g, "")
      let color = "#8B5CF6" // Default color

      // Try to match with our known subjects
      Object.entries(subjectNames).forEach(([key, value]) => {
        if (subjectSlug.includes(key.toLowerCase())) {
          displaySubject = value
          subjectSlug = key
          color = subjectColors[key as keyof typeof subjectColors] || "#8B5CF6"
        }
      })

      return {
        id: item.topic || "intro",
        title: item.topic || `${displaySubject} Basics`,
        subject: displaySubject,
        subjectSlug: subjectSlug,
        subjectColor: color,
        lastPlayed: "Recently",
        progress: item.progress || 0,
      }
    })

  // If no activities from learning history, fall back to the original method
  const fallbackActivities = Object.entries(dashboardData.userData?.progress || {})
    .filter(([_, value]) => value > 0) // Only show subjects with progress
    .map(([key, value]) => {
      const subjectKey = key as keyof typeof subjectNames
      return {
        id:
          key === "math"
            ? "counting"
            : key === "reading"
              ? "alphabet"
              : key === "science"
                ? "animals"
                : key === "coding"
                  ? "basics"
                  : "intro",
        title:
          key === "math"
            ? "Counting & Numbers"
            : key === "reading"
              ? "Alphabet Recognition"
              : key === "science"
                ? "Animals & Habitats"
                : key === "coding"
                  ? "Coding Basics"
                  : `${subjectNames[subjectKey] || key} Basics`,
        subject: subjectNames[subjectKey] || key,
        subjectSlug: key,
        subjectColor: subjectColors[subjectKey] || "#8B5CF6",
        lastPlayed: "Recently",
        progress: value, // This is the actual progress percentage (0-100)
      }
    })
    .slice(0, 3) // Show top 3 activities

  // Use learning history activities if available, otherwise fall back
  const displayActivities = recentActivities.length > 0 ? recentActivities : fallbackActivities

  // If no activities, show empty state
  const hasActivities = displayActivities.length > 0

  // Calculate achievements based on user stats and learning history
  const achievements = [
    {
      title: "Math Explorer",
      description: "Started learning mathematics",
      icon: Calculator,
      color: "text-math",
      bgColor: "bg-math/10",
      earned: Object.keys(activityCountBySubject).some((key) => key.includes("math")),
    },
    {
      title: "Reading Beginner",
      description: "Started reading activities",
      icon: BookOpen,
      color: "text-reading",
      bgColor: "bg-reading/10",
      earned: Object.keys(activityCountBySubject).some((key) => key.includes("read")),
    },
    {
      title: "Science Curious",
      description: "Explored science topics",
      icon: Flask,
      color: "text-science",
      bgColor: "bg-science/10",
      earned: Object.keys(activityCountBySubject).some((key) => key.includes("science")),
    },
    {
      title: "Coding Enthusiast",
      description: "Started coding journey",
      icon: Code,
      color: "text-coding",
      bgColor: "bg-coding/10",
      earned: Object.keys(activityCountBySubject).some((key) => key.includes("cod") || key.includes("program")),
    },
  ]

  // Calculate total achievements earned
  const achievementsEarned = achievements.filter((a) => a.earned).length

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="group relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 transition-all duration-300 hover:bg-secondary/50">
          <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Total Learning Time</h3>
                <p className="text-muted-foreground text-sm">All time</p>
              </div>
            </div>

            <div className="text-3xl font-bold">{formatTime(dashboardData.userData?.stats?.totalTimeSpent || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Time spent on completed activities</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 transition-all duration-300 hover:bg-secondary/50">
          <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Activities Completed</h3>
                <p className="text-muted-foreground text-sm">All time</p>
              </div>
            </div>
            <div className="text-3xl font-bold">{totalActivities || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Complete more activities to learn!</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 transition-all duration-300 hover:bg-secondary/50">
          <div className="absolute -inset-px bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Achievements</h3>
                <p className="text-muted-foreground text-sm">Total earned</p>
              </div>
            </div>
            <div className="text-3xl font-bold">{achievementsEarned}</div>
            <p className="text-xs text-muted-foreground mt-1">Earn more by exploring subjects!</p>
          </div>
        </div>
      </div>

      {/* Subject Progress Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Subject Distribution</CardTitle>
            <CardDescription>Your learning activities across all subjects</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => {
                      // @ts-ignore - entry has our custom properties
                      const entry = props.payload
                      return [`${value}% (${entry?.count || 0} activities)`, name]
                    }}
                    contentStyle={{
                      backgroundColor: "rgba(23, 23, 23, 0.8)",
                      borderRadius: "8px",
                      border: "none",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No activities completed yet</p>
                <p className="text-sm">Complete activities to see your distribution</p>
                <Button variant="outline" size="sm" onClick={refreshData} className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Activities</h2>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/history">
                    View All
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {hasActivities ? (
                  displayActivities.map((activity) => (
                    <div
                      key={`${activity.subjectSlug}-${activity.id}`}
                      className="group relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                                {activity.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{activity.subject}</p>
                            </div>
                            <Button asChild size="sm" variant="ghost" className="bg-primary text-white">
                              <Link href={`/subjects/${activity.subjectSlug}/topics/${activity.id}`}>Continue</Link>
                            </Button>
                          </div>
                          <div className="mt-2">
                            <Progress
                              value={activity.progress}
                              className="h-1.5"
                              style={
                                {
                                  "--progress-background": activity.subjectColor,
                                } as React.CSSProperties
                              }
                            />
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-muted-foreground">{activity.progress}% complete</span>
                              <span className="text-xs text-muted-foreground">
                                {Math.max(1, Math.round((100 - activity.progress) / 10))} questions left
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 bg-secondary/20 rounded-lg">
                    <p className="text-muted-foreground mb-2">No activities yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start exploring subjects to track your progress
                    </p>
                    <Button asChild size="sm">
                      <Link href="/subjects">
                        Start Learning
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div>
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 h-full">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Achievements</h2>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/achievements">
                    View All
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${achievement.bgColor} flex items-center justify-center ${achievement.earned ? "" : "opacity-50"}`}
                      >
                        <achievement.icon
                          className={`h-5 w-5 ${achievement.color} ${achievement.earned ? "" : "opacity-50"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate ${achievement.earned ? "" : "text-muted-foreground"}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                      </div>
                      {achievement.earned && <Award className="h-5 w-5 text-yellow-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recommended For You</h2>
                <Button variant="ghost" size="sm" asChild className="text-sm">
                  <Link href="/subjects">
                    View All Subjects
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedTopics.map((topic) => (
                  <Link key={topic.id} href={`/subjects/${topic.subjectSlug}/topics/${topic.id}`} className="group">
                    <div className="relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 h-full transition-all duration-300">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
                            {topic.level}
                          </span>
                          <span className="text-xs text-muted-foreground">Ages {topic.ageRange}</span>
                        </div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">{topic.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{topic.subject}</p>
                        <div className="mt-auto text-xs text-muted-foreground">{topic.questionsCount} questions</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/test-your-level">
                <Brain className="h-4 w-4 text-primary" />
                Test Your Knowledge Level
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// Dashboard skeleton component
function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <PieChartSkeleton />
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-6 w-40 bg-muted-foreground/20 rounded"></div>
              <div className="h-8 w-20 bg-muted-foreground/10 rounded"></div>
            </div>
            <div className="space-y-4">
              <ActivityCardSkeleton />
              <ActivityCardSkeleton />
              <ActivityCardSkeleton />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div>
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="h-6 w-32 bg-muted-foreground/20 rounded"></div>
              <div className="h-8 w-20 bg-muted-foreground/10 rounded"></div>
            </div>
            <div className="space-y-4">
              <AchievementCardSkeleton />
              <AchievementCardSkeleton />
              <AchievementCardSkeleton />
              <AchievementCardSkeleton />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-6 w-48 bg-muted-foreground/20 rounded"></div>
              <div className="h-8 w-32 bg-muted-foreground/10 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg bg-secondary/50 border border-secondary p-4 h-24 animate-pulse"></div>
              <div className="rounded-lg bg-secondary/50 border border-secondary p-4 h-24 animate-pulse"></div>
              <div className="rounded-lg bg-secondary/50 border border-secondary p-4 h-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function DashboardPage() {
  const { user, loading, refreshUser } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

  // Simple refresh function that increments the refresh key
  const refreshData = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  // Refresh user session on page load
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  // If not logged in, show login prompt
  if (!loading && !user) {
    return <LoginPrompt />
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="relative mb-12 pb-12 border-b">
        <div className="absolute inset-0 pattern-dots opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {user?.name ? `${user.name}'s Dashboard` : "Dashboard"}
            </h1>
            <p className="text-xl text-muted-foreground">Track your progress and continue your learning journey</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={refreshData}
              className="h-10 w-10"
              title="Refresh dashboard data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/subjects">
                Explore Subjects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent key={refreshKey} />
      </Suspense>
    </div>
  )
}
