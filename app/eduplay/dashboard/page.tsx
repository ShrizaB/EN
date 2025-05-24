"use client"

import type React from "react"
import { useEffect, useState, useCallback, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  Clock,
  Code,
  FlaskRoundIcon as Flask,
  Award,
  Music,
  Palette,
  Globe,
  Brain,
  Film,
  FileText,
  AlertCircle,
  Hourglass,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserData, type UserProgress, type UserStats } from "@/lib/user-service"
import { getAllLearningHistory, type LearningHistory } from "@/lib/learning-history-service"
import {
  getDashboardChartData,
  forceDashboardRefresh,
  getTotalLearningTime,
} from "@/lib/dashboard-service"
import { TVABadge } from "./comp/tva-badge"
import { TVATimeDoor } from "./comp/tva-time-door"
import { TVATimeline } from "./comp/tva-timeline"
import { TVANotification } from "./comp/tva-notification"
import { TVAGlitchText } from "./comp/tva-glitch-text"
import { TVAPortalLoader } from "./comp/tva-portal-loader"
import './dashboard.css'

// Subject icons mapping
const subjectIcons: Record<string, React.ReactNode> = {
  math: <Calculator className="h-5 w-5 text-loki-green" />,
  science: <Flask className="h-5 w-5 text-loki-green" />,
  reading: <BookOpen className="h-5 w-5 text-loki-green" />,
  coding: <Code className="h-5 w-5 text-loki-green" />,
  art: <Palette className="h-5 w-5 text-loki-green" />,
  music: <Music className="h-5 w-5 text-loki-green" />,
  geography: <Globe className="h-5 w-5 text-loki-green" />,
  logic: <Brain className="h-5 w-5 text-loki-green" />,
  movies: <Film className="h-5 w-5 text-loki-green" />,
  c_programming: <Code className="h-5 w-5 text-loki-green" />,
  python: <Code className="h-5 w-5 text-loki-green" />,
  java: <Code className="h-5 w-5 text-loki-green" />,
}

// Subject colors mapping
const subjectColors: Record<string, string> = {
  math: "#00FF88",
  science: "#D4A017",
  reading: "#E76F51",
  coding: "#00FF88",
  art: "#D4A017",
  music: "#E76F51",
  geography: "#00FF88",
  logic: "#D4A017",
  movies: "#E76F51",
  c_programming: "#00FF88",
  python: "#D4A017",
  java: "#E76F51",
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

// Audio for typewriter effect
const playTypewriterSound = () => {
  try {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    )
    audio.volume = 0.3
    audio.play().catch(() => { })
  } catch (error) {
    // Ignore audio errors
  }
}

// Random timeline deviation notifications
const timelineDeviations = [
  "Timeline Deviation Detected!",
  "Nexus Event Approaching!",
  "Variant Activity Monitored!",
  "Sacred Timeline Secured!",
  "Temporal Anomaly Resolved!",
  "Timeline Verification Complete!",
  "Variant Behavior Analyzed!",
  "Sacred Timeline Maintained!",
]

// Login prompt component
function LoginPrompt() {
  const [showPortal, setShowPortal] = useState(false)

  const handleLogin = () => {
    playTypewriterSound()
    setShowPortal(true)
    setTimeout(() => {
      window.location.href = "/sign-in"
    }, 2000)
  }

  return (
    <div className="container py-12 md:py-20 flex flex-col items-center justify-center min-h-[60vh] relative">
      {showPortal && <TVAPortalLoader />}
      <div className="text-center max-w-md relative z-10">
        <div className="mb-6">
          <TVAGlitchText text="UNAUTHORIZED VARIANT" className="text-3xl font-bold text-tva-orange mb-2" />
          <div className="h-1 w-32 bg-tva-gold mx-auto mb-4"></div>
        </div>
        <p className="font-mono text-light-gray mb-8 leading-relaxed">
          VARIANT DETECTED. AUTHORIZATION REQUIRED TO ACCESS SACRED TIMELINE DATA.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleLogin}
            className="bg-tva-brown hover:bg-dark-gray text-light-gray border border-tva-gold tva-hover-glow tva-glitch-button"
          >
            <span className="mr-2">AUTHENTICATE</span>
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            asChild
            className="border-tva-gold text-tva-gold hover:bg-tva-brown/20 tva-hover-glow tva-glitch-button"
          >
            <Link href="/sign-in?tab=signup">CREATE VARIANT PROFILE</Link>
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 tva-logo-bg opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tva-gold to-transparent"></div>
    </div>
  )
}

// Skeleton loading component for stats cards
function StatCardSkeleton() {
  return (
    <div className="rounded-md bg-dark-gray border border-tva-gold/30 p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-tva-gold/10"></div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-tva-gold/20 rounded"></div>
          <div className="h-3 w-16 bg-tva-gold/10 rounded"></div>
        </div>
      </div>
      <div className="h-8 w-16 bg-tva-gold/20 rounded mb-1"></div>
      <div className="h-3 w-32 bg-tva-gold/10 rounded"></div>
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
  const [refreshKey, setRefreshKey] = useState(0)
  const [totalLearningTime, setTotalLearningTime] = useState<string>(getTotalLearningTime())
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")

  // Default UserStats object to prevent type errors
  const defaultUserStats: UserStats = {
    totalQuizzesTaken: 0,
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
    totalTimeSpent: 0,
    gamesPlayed: 0,
    lastActive: new Date(),
  }

  // Simple refresh function that increments the refresh key
  const refreshData = useCallback(() => {
    playTypewriterSound()
    setRefreshKey((prev) => prev + 1)
    setShowNotification(true)
    const randomDeviation = timelineDeviations[Math.floor(Math.random() * timelineDeviations.length)]
    setNotificationMessage(randomDeviation)
    setTimeout(() => setShowNotification(false), 3000)
    forceDashboardRefresh()
  }, [])

  // Random timeline deviation notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomDeviation = timelineDeviations[Math.floor(Math.random() * timelineDeviations.length)]
        setNotificationMessage(randomDeviation)
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Listen for learning history update events
  useEffect(() => {
    const handleLearningHistoryUpdated = () => {
      refreshData()
    }

    const handleForceRefresh = () => {
      refreshData()
    }

    window.addEventListener("learning-history-updated", handleLearningHistoryUpdated)
    window.addEventListener("force-dashboard-refresh", handleForceRefresh)

    return () => {
      window.removeEventListener("learning-history-updated", handleLearningHistoryUpdated)
      window.removeEventListener("force-dashboard-refresh", handleForceRefresh)
    }
  }, [refreshData])

  // Listen for learning time updates
  useEffect(() => {
    const updateLearningTime = (event: any) => {
      if (event?.detail?.totalLearningTime) {
        setTotalLearningTime(event.detail.totalLearningTime)
      } else {
        setTotalLearningTime(getTotalLearningTime())
      }
    }
    window.addEventListener("learning-time-updated", updateLearningTime)
    setTotalLearningTime(getTotalLearningTime())
    return () => {
      window.removeEventListener("learning-time-updated", updateLearningTime)
    }
  }, [])

  // Fetch chart data separately
  useEffect(() => {
    let isMounted = true

    const fetchChartData = async () => {
      if (!user) return

      try {
        const data = await getDashboardChartData(user.id)
        if (isMounted) {
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
        const timestamp = Date.now()
        const [history, userData] = await Promise.all([
          getAllLearningHistory(`t=${timestamp}`),
          getUserData(`${user.id}?t=${timestamp}`),
        ])

        if (isMounted) {
          setDashboardData({
            userData: {
              progress: userData?.progress || {},
              stats: {
                ...defaultUserStats,
                ...userData?.stats,
              },
            },
            learningHistory: history || [],
            isLoaded: true,
          })
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        if (isMounted) {
          setDashboardData((prev) => ({
            ...prev,
            userData: {
              progress: {},
              stats: { ...defaultUserStats },
            },
            isLoaded: true,
          }))
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

  const normalizedHistory: Array<LearningHistory & { normalizedSubject?: string }> = dashboardData.learningHistory.map((item) => {
    if (!item || !item.subject) return item

    let normalizedSubject = item.subject.toLowerCase().replace(/\s+/g, "")

    if (normalizedSubject.includes("math")) normalizedSubject = "math"
    if (normalizedSubject.includes("science")) normalizedSubject = "science"
    if (normalizedSubject.includes("read")) normalizedSubject = "reading"
    if (normalizedSubject.includes("code") || normalizedSubject.includes("program")) normalizedSubject = "coding"

    return {
      ...item,
      normalizedSubject,
    }
  })

  normalizedHistory.forEach((item) => {
    if (!item || !item.subject || !item.topic) return

    const subject = item.normalizedSubject || item.subject.toLowerCase()
    const key = `${subject}-${item.topic}`

    if (!uniqueTopics.has(key)) {
      uniqueTopics.add(key)
      activityCountBySubject[subject] = (activityCountBySubject[subject] || 0) + 1
    }
  })

  const totalActivities = Object.values(activityCountBySubject).reduce((sum, count) => sum + count, 0)

  const recentActivities = dashboardData.learningHistory
    .filter((item) => item && item.subject && item.topic)
    .slice(0, 3)
    .map((item) => {
      const subjectKey = item.subject.toLowerCase().replace(/\s+/g, "") as keyof typeof subjectNames
      let displaySubject = item.subject
      let subjectSlug = item.subject.toLowerCase().replace(/\s+/g, "")
      let color = "#00FF88"

      Object.entries(subjectNames).forEach(([key, value]) => {
        if (subjectSlug.includes(key.toLowerCase())) {
          displaySubject = value
          subjectSlug = key
          color = subjectColors[key as keyof typeof subjectColors] || "#00FF88"
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

  const fallbackActivities = Object.entries(dashboardData.userData?.progress || {})
    .filter(([_, value]) => value > 0)
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
        subjectColor: subjectColors[subjectKey] || "#00FF88",
        lastPlayed: "Recently",
        progress: value,
      }
    })
    .slice(0, 3)

  const displayActivities = recentActivities.length > 0 ? recentActivities : fallbackActivities
  const hasActivities = displayActivities.length > 0

  const achievements = [
    {
      title: "Math Explorer",
      description: "Started learning mathematics",
      icon: Calculator,
      color: "text-loki-green",
      earned: Object.keys(activityCountBySubject).some((key) => key.includes("math")),
    },
    {
      title: "Reading Beginner",
      description: "Started reading activities",
      icon: BookOpen,
      color: "text-loki-green",
      earned: Object.keys(activityCountBySubject).some((key) => key.includes("read")),
    },
    {
      title: "Science Curious",
      description: "Explored science topics",
      icon: Flask,
      color: "text-loki-green",
      earned: Object.keys(activityCountBySubject).some((key) => key.includes("science")),
    },
    {
      title: "Coding Enthusiast",
      description: "Started coding journey",
      icon: Code,
      color: "text-loki-green",
      earned: Object.keys(activityCountBySubject).some((key) => key.includes("cod") || key.includes("program")),
    },
  ]

  const achievementsEarned = achievements.filter((a) => a.earned).length

  return (
    <>
      {showNotification && <TVANotification message={notificationMessage} onClose={() => setShowNotification(false)} />}

      {/* Enhanced Timeline Verification Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="timeline-verify-lines"></div>
        <div className="data-stream"></div>
        <div className="data-stream"></div>
        <div className="data-stream"></div>
        <div className="data-stream"></div>
        <div className="energy-pulse"></div>
        <div className="energy-pulse"></div>
        <div className="energy-pulse"></div>
      </div>

      {/* Horn Divider */}
      <div className="horn-divider mb-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="group relative overflow-hidden rounded-md bg-tva-brown border border-tva-gold hover:border-loki-green p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-md hover:shadow-loki-green/30 tva-hover-glow">
          <div className="absolute inset-0 crt-overlay opacity-5"></div>
          <div className="absolute inset-0 tva-logo-bg opacity-5"></div>
          <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-transparent border-2 border-loki-green/30 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-loki-green group-hover:bg-loki-green/10 group-hover:shadow-lg group-hover:shadow-loki-green/30 duration-500">
                <Hourglass className="h-6 w-6 text-loki-green" />
              </div>
              <div>
                <h3 className="font-mono font-medium text-tva-gold group-hover:text-loki-green group-hover:animate-glitch-text transition-colors">
                  TIMELINE EXPOSURE
                </h3>
                <p className="text-light-gray text-sm">All time</p>
              </div>
            </div>
            <div className="text-3xl font-mono font-bold text-light-gray group-hover:text-loki-green transition-colors duration-300">
              {totalLearningTime || formatTime((dashboardData.userData?.stats?.totalTimeSpent ?? defaultUserStats.totalTimeSpent))}
            </div>
            <p className="text-xs text-light-gray mt-2 font-mono">TIME SPENT ON SACRED TIMELINE</p>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-loki-green/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-loki-green/50 rounded-full animate-ping"></div>
        </div>

        <div className="group relative overflow-hidden rounded-md bg-tva-brown border border-tva-gold hover:border-loki-green p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-md hover:shadow-loki-green/30 tva-hover-glow">
          <div className="absolute inset-0 crt-overlay opacity-5"></div>
          <div className="absolute inset-0 tva-logo-bg opacity-5"></div>
          <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-transparent border-2 border-loki-green/30 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-loki-green group-hover:bg-loki-green/10 group-hover:shadow-lg group-hover:shadow-loki-green/30 duration-500">
                <FileText className="h-6 w-6 text-loki-green" />
              </div>
              <div>
                <h3 className="font-mono font-medium text-tva-gold group-hover:text-loki-green group-hover:animate-glitch-text transition-colors">
                  TIMELINE BRANCHES
                </h3>
                <p className="text-light-gray text-sm">All time</p>
              </div>
            </div>
            <div className="text-3xl font-mono font-bold text-light-gray group-hover:text-loki-green transition-colors duration-300">
              {totalActivities || 0}
            </div>
            <p className="text-xs text-light-gray mt-2 font-mono">COMPLETE MORE TO MAINTAIN TIMELINE</p>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-loki-green/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-loki-green/50 rounded-full animate-ping"></div>
        </div>

        <div className="group relative overflow-hidden rounded-md bg-tva-brown border border-tva-gold hover:border-loki-green p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-md hover:shadow-loki-green/30 tva-hover-glow">
          <div className="absolute inset-0 crt-overlay opacity-5"></div>
          <div className="absolute inset-0 tva-logo-bg opacity-5"></div>
          <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-transparent border-2 border-loki-green/30 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-loki-green group-hover:bg-loki-green/10 group-hover:shadow-lg group-hover:shadow-loki-green/30 duration-500">
                <Award className="h-6 w-6 text-loki-green" />
              </div>
              <div>
                <h3 className="font-mono font-medium text-tva-gold group-hover:text-loki-green group-hover:animate-glitch-text transition-colors">
                  VARIANT COMMENDATIONS
                </h3>
                <p className="text-light-gray text-sm">Total earned</p>
              </div>
            </div>
            <div className="text-3xl font-mono font-bold text-light-gray group-hover:text-loki-green transition-colors duration-300">
              {achievementsEarned}
            </div>
            <p className="text-xs text-light-gray mt-2 font-mono">EARN MORE BY EXPLORING SUBJECTS</p>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-loki-green/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-loki-green/50 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Horn Divider */}
      <div className="horn-divider mb-8"></div>

      {/* Subject Progress and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="relative overflow-hidden rounded-md bg-tva-brown border border-tva-gold hover:border-loki-green p-6 lg:col-span-1 shadow-lg hover:shadow-md hover:shadow-loki-green/30 transition-all duration-500 tva-hover-glow">
          <div className="absolute inset-0 pattern-diagonal opacity-10"></div>
          <div className="absolute inset-0 crt-overlay opacity-5"></div>
          <div className="absolute inset-0 tva-logo-bg opacity-5"></div>
          <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-3">
              <TVAGlitchText text="TIMELINE BRANCHES" className="text-xl font-mono font-bold text-tva-gold" />
              <div className="w-10 h-10 rounded-full bg-tva-gold/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-tva-gold" />
              </div>
            </div>
            <p className="text-sm text-light-gray mb-6 font-mono">SUBJECT DISTRIBUTION ANALYSIS</p>

            <div className="h-[300px] flex items-center justify-center">
              {chartData.length > 0 ? (
                <TVATimeline data={chartData} />
              ) : (
                <div className="text-center text-tva-gold font-mono">
                  <p>NO DATA AVAILABLE</p>
                  <p className="text-sm text-light-gray">COMPLETE SOME ACTIVITIES TO SEE YOUR PROGRESS</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="absolute inset-0 flex justify-center items-center h-[1200px]">
            <img
              src=""
              alt=""
              className="opacity-30 w-[100px] h-auto mb-80 transform scale-x-[-1]"
            />
          </div>
          <div className="relative overflow-hidden rounded-md bg-tva-brown border border-tva-gold hover:border-loki-green p-6 tva-hover-glow">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="absolute inset-0 crt-overlay opacity-5"></div>
            <div className="absolute inset-0 tva-logo-bg opacity-5"></div>
            <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <TVAGlitchText text="RECENT TIMELINE ACTIVITY" className="text-xl font-mono font-bold text-tva-gold" />
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-sm text-tva-gold hover:text-loki-green hover:bg-dark-gray tva-hover-glow tva-glitch-button"
                  onClick={playTypewriterSound}
                >
                  <Link href="/history">
                    VIEW ALL
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {hasActivities ? (
                  displayActivities.map((activity, index) => (
                    <TVATimeDoor
                      key={`${activity.subjectSlug}-${activity.id}`}
                      title={activity.title}
                      subject={activity.subject}
                      progress={activity.progress}
                      href={`/subjects/${activity.subjectSlug}/topics/${activity.id}`}
                      delay={index * 150}
                    />
                  ))
                ) : (
                  <div className="text-center p-8 bg-dark-gray rounded-md border border-tva-gold/30">
                    <AlertCircle className="h-8 w-8 text-tva-orange mx-auto mb-2" />
                    <p className="text-tva-gold mb-2 font-mono">NO TIMELINE ACTIVITY DETECTED</p>
                    <p className="text-sm text-light-gray mb-4 font-mono">
                      START EXPLORING SUBJECTS TO TRACK YOUR PROGRESS
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="bg-dark-gray hover:bg-tva-brown text-light-gray border border-tva-gold/50 tva-hover-glow tva-glitch-button"
                      onClick={playTypewriterSound}
                    >
                      <Link href="/subjects">
                        START LEARNING
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

      {/* Horn Divider */}
      <div className="horn-divider mb-8"></div>

      {/* Achievements and Recommended Topics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Enhanced Achievements Section */}
        <div>
          <TVAGlitchText text="VARIANT COMMENDATIONS" className="text-xl font-mono font-bold text-tva-gold mb-6" />
          <div className="grid grid-cols-1 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`achievement-card ${achievement.earned ? "earned" : ""} group relative overflow-hidden rounded-md p-6 transition-all duration-500`}
              >
                <div className="absolute inset-0 crt-overlay opacity-5"></div>
                <div className="absolute inset-0 tva-logo-bg opacity-5"></div>
                <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="achievement-icon w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110 duration-500">
                      <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                    </div>
                    <div>
                      <h3 className="font-mono font-medium text-tva-gold group-hover:text-loki-green group-hover:animate-glitch-text transition-colors">
                        {achievement.title}
                      </h3>
                      <p className="text-light-gray text-sm font-mono">{achievement.description}</p>
                      {achievement.earned && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-loki-green rounded-full animate-pulse"></div>
                          <span className="text-xs text-loki-green font-mono">EARNED</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended For You */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-md bg-tva-brown border border-tva-gold hover:border-loki-green p-6 tva-hover-glow">
            <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
            <div className="absolute inset-0 crt-overlay opacity-5"></div>
            <div className="absolute inset-0 tva-logo-bg opacity-5"></div>
            <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <TVAGlitchText
                  text="RECOMMENDED TIMELINE PATHS"
                  className="text-xl font-mono font-bold text-tva-gold"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-sm text-tva-gold hover:text-loki-green hover:bg-dark-gray tva-hover-glow tva-glitch-button"
                  onClick={playTypewriterSound}
                >
                  <Link href="/subjects">
                    VIEW ALL SUBJECTS
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedTopics.map((topic, index) => (
                  <Link key={topic.id} href={`/subjects/${topic.subjectSlug}/topics/${topic.id}`} className="group">
                    <div className="relative overflow-hidden rounded-md bg-dark-gray border border-tva-gold/30 hover:border-loki-green p-4 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-loki-green/30 tva-hover-glow">
                      <div className="absolute inset-0 crt-overlay opacity-5"></div>
                      <div className="absolute inset-0 tva-logo-bg opacity-5"></div>
                      <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>
                      <div className="flex flex-col h-full relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-loki-green/20 text-loki-green border border-loki-green/30">
                            {topic.level}
                          </span>
                          <span className="text-xs text-light-gray font-mono">Ages {topic.ageRange}</span>
                        </div>
                        <h3 className="font-mono font-medium text-tva-gold group-hover:text-loki-green group-hover:animate-glitch-text transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-light-gray mb-2 font-mono">{topic.subject}</p>
                        <div className="mt-auto text-xs text-light-gray font-mono">
                          {topic.questionsCount} questions
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-tva-gold text-tva-gold hover:bg-dark-gray hover:text-loki-green hover:border-loki-green tva-hover-glow tva-glitch-button"
              onClick={playTypewriterSound}
            >
              <Brain className="h-4 w-4" />
              TEST YOUR KNOWLEDGE LEVEL
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// Main Dashboard component
export default function Dashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-gray flex items-center justify-center">
        <TVAPortalLoader />
      </div>
    )
  }

  if (!user) {
    return <LoginPrompt />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-gray via-tva-brown to-dark-gray relative overflow-hidden pt-8">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-loki-green/40 rounded-full animate-float-slow shadow-lg shadow-loki-green/20"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-tva-gold/50 rounded-full animate-float-medium shadow-lg shadow-tva-gold/20"></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-loki-green/30 rounded-full animate-float-fast shadow-lg shadow-loki-green/20"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-tva-orange/40 rounded-full animate-float-slow shadow-lg shadow-tva-orange/20"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-loki-green/40 to-transparent animate-timeline-verify"></div>
        <div
          className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-tva-gold/30 to-transparent animate-timeline-verify"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-loki-green/20 to-transparent animate-timeline-verify"
          style={{ animationDelay: "4s" }}
        ></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-loki-green/30 to-transparent animate-data-stream"></div>
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-tva-gold/20 to-transparent animate-data-stream"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-loki-green/20 rounded-full animate-energy-pulse"></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-24 h-24 border border-tva-gold/15 rounded-full animate-energy-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <main className="container py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <TVAGlitchText
              text="SACRED TIMELINE DASHBOARD"
              className="text-2xl font-mono font-bold text-loki-green"
              glitchIntensity="high"
            />
            <p className="text-light-gray font-mono mt-1">MONITOR YOUR PROGRESS ACROSS THE SACRED TIMELINE</p>
          </div>
          <div className="flex-shrink-0">
            <TVABadge userId={user.id} userName={user.name} />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
            </div>
          }
        >
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  )
}