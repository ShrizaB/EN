"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Clock, Award, Calendar, BarChart, BookOpenCheck, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { getAllLearningHistory } from "@/lib/learning-history-service"
import { getUserActivities } from "@/lib/user-service"

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
  python: "Python",
  java: "Java",
  c_programming: "C Programming",
}

// Subject colors mapping
const subjectColors: Record<string, string> = {
  math: "bg-math",
  science: "bg-science",
  reading: "bg-reading",
  coding: "bg-coding",
  art: "bg-art",
  music: "bg-music",
  geography: "bg-geography",
  logic: "bg-logic",
  movies: "bg-primary",
  python: "bg-coding",
  java: "bg-coding",
  c_programming: "bg-coding",
}

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const [learningHistory, setLearningHistory] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"topics" | "quizzes" | "all">("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [filteredSubject, setFilteredSubject] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          console.log("Fetching learning history and activities for user:", user.id)
          setIsLoading(true)

          // Fetch learning history
          const history = await getAllLearningHistory()
          console.log("Learning history fetched:", history.length, "items")
          setLearningHistory(history)

          // Fetch activities
          const userActivities = await getUserActivities()
          console.log("User activities fetched:", userActivities.length, "items")
          setActivities(userActivities)
        } catch (error) {
          console.error("Error fetching data:", error)
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  // Format time
  const formatTime = (seconds: number) => {
    if (!seconds) return "0m"
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  // Format exact time
  const formatExactTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  // Get all unique subjects from history and activities
  const getUniqueSubjects = () => {
    const subjects = new Set<string>()

    learningHistory.forEach((item) => {
      if (item.subject) subjects.add(item.subject)
    })

    activities.forEach((activity) => {
      if (activity.subject) subjects.add(activity.subject)
    })

    return Array.from(subjects)
  }

  // Filter and sort history items
  const getFilteredHistory = () => {
    let filtered = [...learningHistory]

    // Apply subject filter if selected
    if (filteredSubject) {
      filtered = filtered.filter((item) => item.subject === filteredSubject)
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.lastAccessed).getTime()
      const dateB = new Date(b.lastAccessed).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    return filtered
  }

  // Filter and sort activities
  const getFilteredActivities = () => {
    let filtered = [...activities].filter((activity) => activity.type === "quiz")

    // Apply subject filter if selected
    if (filteredSubject) {
      filtered = filtered.filter((item) => item.subject === filteredSubject)
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    return filtered
  }

  // Get all activities in chronological order
  const getAllActivitiesChronological = () => {
    // Combine learning history and quiz activities
    const historyItems = getFilteredHistory().map((item) => ({
      ...item,
      activityType: "topic",
      date: new Date(item.lastAccessed),
    }))

    const quizItems = getFilteredActivities().map((item) => ({
      ...item,
      activityType: "quiz",
      date: new Date(item.timestamp),
    }))

    const combined = [...historyItems, ...quizItems]

    // Sort by date
    combined.sort((a, b) => {
      return sortOrder === "newest" ? b.date.getTime() - a.date.getTime() : a.date.getTime() - b.date.getTime()
    })

    return combined
  }

  // If not logged in, show login prompt
  if (!loading && !user) {
    return (
      <div className="container py-12 md:py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Sign in to view your learning history</h1>
          <p className="text-muted-foreground mb-8">
            Track your progress, view your achievements, and continue your learning journey.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  const uniqueSubjects = getUniqueSubjects()
  const filteredHistory = getFilteredHistory()
  const filteredQuizzes = getFilteredActivities()
  const allActivitiesChronological = getAllActivitiesChronological()

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Learning History</h1>
        <p className="text-xl text-muted-foreground mb-8">Track your progress and continue your learning journey</p>

        {learningHistory.length > 0 || activities.filter((a) => a.type === "quiz").length > 0 ? (
          <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("all")}
                >
                  All Activities
                </Button>
                <Button
                  variant={activeTab === "topics" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("topics")}
                >
                  Topics Studied
                </Button>
                <Button
                  variant={activeTab === "quizzes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("quizzes")}
                >
                  Quiz Results
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  className="px-3 py-1 rounded-md border bg-background text-sm"
                  value={filteredSubject || ""}
                  onChange={(e) => setFilteredSubject(e.target.value || null)}
                >
                  <option value="">All Subjects</option>
                  {uniqueSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subjectNames[subject] || subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                >
                  {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                </Button>
              </div>
            </div>

            {/* All Activities (Chronological) */}
            {activeTab === "all" && (
              <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
                <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-6">All Learning Activities</h2>

                  {allActivitiesChronological.length > 0 ? (
                    <div className="space-y-4">
                      {allActivitiesChronological.map((item, index) => (
                        <div
                          key={`${item.activityType}-${index}`}
                          className="group relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                              {item.activityType === "topic" ? (
                                <BookOpenCheck className="h-5 w-5 text-primary" />
                              ) : (
                                <Brain className="h-5 w-5 text-purple-500" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                                      {item.activityType === "topic"
                                        ? item.topic.charAt(0).toUpperCase() + item.topic.slice(1).replace(/_/g, " ")
                                        : item.topic
                                          ? item.topic.charAt(0).toUpperCase() + item.topic.slice(1).replace(/_/g, " ")
                                          : "Quiz"}
                                    </h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
                                      {item.activityType === "topic" ? "Topic Studied" : "Quiz Completed"}
                                    </span>
                                  </div>

                                  <p className="text-sm text-muted-foreground">
                                    {subjectNames[item.subject] ||
                                      item.subject.charAt(0).toUpperCase() + item.subject.slice(1)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{formatDate(item.date.toString())}</span>
                                  <span>•</span>
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{formatExactTime(item.date.toString())}</span>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                {item.activityType === "topic" && (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <BookOpen className="h-3 w-3 text-blue-500" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Visit Count</p>
                                        <p className="text-sm font-medium">{item.visitCount || 1}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <BarChart className="h-3 w-3 text-green-500" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Progress</p>
                                        <p className="text-sm font-medium">{item.progress || 0}%</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                                        <Brain className="h-3 w-3 text-purple-500" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Difficulty</p>
                                        <p className="text-sm font-medium capitalize">
                                          {item.difficulty || "beginner"}
                                        </p>
                                      </div>
                                    </div>
                                  </>
                                )}

                                {item.activityType === "quiz" && (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                        <Award className="h-3 w-3 text-yellow-500" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Score</p>
                                        <p className="text-sm font-medium">
                                          {item.score}/{item.totalQuestions}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Clock className="h-3 w-3 text-blue-500" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Time Spent</p>
                                        <p className="text-sm font-medium">{formatTime(item.timeSpent)}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                                        <Brain className="h-3 w-3 text-purple-500" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Difficulty</p>
                                        <p className="text-sm font-medium capitalize">
                                          {item.difficulty || "standard"}
                                        </p>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>

                              {item.activityType === "topic" && (
                                <div className="mt-3">
                                  <Progress
                                    value={item.progress || 0}
                                    color={subjectColors[item.subject] || "bg-primary"}
                                    className="h-1.5"
                                  />
                                  <div className="flex justify-end mt-2">
                                    <Button
                                      asChild
                                      size="sm"
                                      variant="ghost"
                                      className={`${subjectColors[item.subject] || "bg-primary"} text-white`}
                                    >
                                      <Link href={`/subjects/${item.subject}/topics/${item.topic}`}>Continue</Link>
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-secondary/20 rounded-lg">
                      <p className="text-muted-foreground mb-2">No activities found</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {filteredSubject
                          ? `Try selecting a different subject or removing filters`
                          : `Start exploring subjects to build your learning history`}
                      </p>
                      <Button asChild size="sm">
                        <Link href="/subjects">Start Learning</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Topics Studied */}
            {activeTab === "topics" && (
              <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
                <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-6">Topics Studied</h2>

                  {filteredHistory.length > 0 ? (
                    <div className="space-y-4">
                      {filteredHistory.map((item) => (
                        <div
                          key={item._id}
                          className="group relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary hover:border-primary/50 p-4 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div>
                                  <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                                    {item.topic.charAt(0).toUpperCase() + item.topic.slice(1).replace(/_/g, " ")}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {subjectNames[item.subject] ||
                                      item.subject.charAt(0).toUpperCase() + item.subject.slice(1)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{formatDate(item.lastAccessed)}</span>
                                  <span>•</span>
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{formatExactTime(item.lastAccessed)}</span>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <BookOpen className="h-3 w-3 text-blue-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Visit Count</p>
                                    <p className="text-sm font-medium">{item.visitCount || 1}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <BarChart className="h-3 w-3 text-green-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Progress</p>
                                    <p className="text-sm font-medium">{item.progress || 0}%</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Brain className="h-3 w-3 text-purple-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Difficulty</p>
                                    <p className="text-sm font-medium capitalize">{item.difficulty || "beginner"}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3">
                                <Progress
                                  value={item.progress || 0}
                                  color={subjectColors[item.subject] || "bg-primary"}
                                  className="h-1.5"
                                />
                                <div className="flex justify-end mt-2">
                                  <Button
                                    asChild
                                    size="sm"
                                    variant="ghost"
                                    className={`${subjectColors[item.subject] || "bg-primary"} text-white`}
                                  >
                                    <Link href={`/subjects/${item.subject}/topics/${item.topic}`}>Continue</Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-secondary/20 rounded-lg">
                      <p className="text-muted-foreground mb-2">No topics studied yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {filteredSubject
                          ? `Try selecting a different subject or removing filters`
                          : `Start exploring subjects to build your learning history`}
                      </p>
                      <Button asChild size="sm">
                        <Link href="/subjects">Start Learning</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quiz Results */}
            {activeTab === "quizzes" && (
              <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-6">
                <div className="absolute inset-0 pattern-diagonal opacity-5"></div>
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-6">Quiz Results</h2>

                  {filteredQuizzes.length > 0 ? (
                    <div className="space-y-4">
                      {filteredQuizzes.map((activity, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-lg bg-secondary/50 border border-secondary p-4 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div>
                                  <h3 className="font-medium truncate">
                                    {activity.topic
                                      ? activity.topic.charAt(0).toUpperCase() +
                                        activity.topic.slice(1).replace(/_/g, " ")
                                      : "Quiz"}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {subjectNames[activity.subject] ||
                                      (activity.subject
                                        ? activity.subject.charAt(0).toUpperCase() + activity.subject.slice(1)
                                        : "General")}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{formatDate(activity.timestamp)}</span>
                                  <span>•</span>
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{formatExactTime(activity.timestamp)}</span>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                    <Award className="h-3 w-3 text-yellow-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Score</p>
                                    <p className="text-sm font-medium">
                                      {activity.score}/{activity.totalQuestions}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Clock className="h-3 w-3 text-blue-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Time Spent</p>
                                    <p className="text-sm font-medium">{formatTime(activity.timeSpent)}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Brain className="h-3 w-3 text-purple-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Difficulty</p>
                                    <p className="text-sm font-medium capitalize">
                                      {activity.difficulty || "standard"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3">
                                <div className="relative h-1.5 rounded-full bg-secondary overflow-hidden">
                                  <div
                                    className={`absolute left-0 top-0 bottom-0 ${subjectColors[activity.subject] || "bg-primary"}`}
                                    style={{ width: `${(activity.score / activity.totalQuestions) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {Math.round((activity.score / activity.totalQuestions) * 100)}% correct
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {activity.score} of {activity.totalQuestions} questions
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-secondary/20 rounded-lg">
                      <p className="text-muted-foreground mb-2">No quiz results yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {filteredSubject
                          ? `Try selecting a different subject or removing filters`
                          : `Complete quizzes to see your results here`}
                      </p>
                      <Button asChild size="sm">
                        <Link href="/subjects">Start Learning</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-12 bg-secondary/20 rounded-xl">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Learning History Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring subjects and completing activities to build your learning history.
            </p>
            <Button asChild>
              <Link href="/subjects">Start Learning</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}