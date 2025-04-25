"use client"

import { useState, useEffect } from "react"
import { Link } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { SubjectProgress } from "@/components/dashboard/subject-progress"
import { LearningHistoryChart } from "@/components/dashboard/learning-history-chart"
import { useAuth } from "@/contexts/auth-context"
import { getUserLearningHistory, type LearningHistory } from "@/lib/learning-history-service"
import { getUserActivities, type UserActivity } from "@/lib/user-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [learningHistory, setLearningHistory] = useState<LearningHistory[]>([])
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setIsLoadingHistory(true)
          // Fetch learning history and activities in parallel
          const [history, activityData] = await Promise.all([getUserLearningHistory(), getUserActivities()])
          setLearningHistory(history)
          setActivities(activityData)
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setIsLoadingHistory(false)
        }
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  // Calculate total learning time
  const totalLearningTime = learningHistory.reduce((total, item) => total + (item.timeSpent || 0), 0)

  // Get unique subjects
  const uniqueSubjects = new Set(learningHistory.map((item) => item.subject)).size

  // Calculate average score
  const scoredActivities = learningHistory.filter((item) => item.score !== undefined)
  const totalScore = scoredActivities.reduce((total, item) => total + (item.score || 0), 0)
  const averageScore = scoredActivities.length > 0 ? Math.round(totalScore / scoredActivities.length) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-6xl">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/search-learn-test">
              Learn Something New
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">Learning History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Learning Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingHistory ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    `${Math.round(totalLearningTime / 60)} minutes`
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isLoadingHistory ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    `+${activities.filter((item) => new Date(item.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} activities this week`
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects Explored</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingHistory ? <Skeleton className="h-8 w-16" /> : uniqueSubjects}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isLoadingHistory ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    `${Math.round((uniqueSubjects / 9) * 100)}% of available subjects`
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Topics Learned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingHistory ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    new Set(learningHistory.map((item) => item.topic)).size
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isLoadingHistory ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    `${learningHistory.filter((item) => item.progress >= 80).length} completed topics`
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoadingHistory ? <Skeleton className="h-8 w-16" /> : `${averageScore}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isLoadingHistory ? <Skeleton className="h-4 w-32 mt-1" /> : `From ${scoredActivities.length} tests`}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview learningHistory={learningHistory} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Learning Distribution</CardTitle>
                <CardDescription>Subject breakdown of your learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Skeleton className="h-[300px] w-[300px] rounded-full" />
                  </div>
                ) : (
                  <LearningHistoryChart data={learningHistory} />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
                <CardDescription>Your progress across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectProgress />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your recent learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivities activities={activities.slice(0, 3)} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Learning Trends</CardTitle>
                <CardDescription>Your learning activity over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview learningHistory={learningHistory} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>Breakdown by subject</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Skeleton className="h-[300px] w-[300px] rounded-full" />
                  </div>
                ) : (
                  <LearningHistoryChart data={learningHistory} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning History</CardTitle>
              <CardDescription>Your complete learning history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : learningHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't started learning yet.</p>
                  <Button asChild>
                    <Link href="/search-learn-test">Start Learning</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {learningHistory
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{item.topic}</h4>
                            <p className="text-sm text-muted-foreground">Subject: {item.subject}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">
                              {new Date(item.timestamp).toLocaleDateString()} at{" "}
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </p>
                            {item.progress !== undefined && (
                              <p className="text-sm font-medium">Progress: {item.progress}%</p>
                            )}
                            {item.score !== undefined && <p className="text-sm font-medium">Score: {item.score}%</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}