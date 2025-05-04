// Dashboard service to ensure pie chart data is available

import { getAllLearningHistory } from "./learning-history-service"
import { getUserData } from "./user-service"

// Store the latest dashboard data in memory
let cachedChartData: any[] = []
let lastFetchTime = 0

// Force refresh the dashboard data
export async function forceDashboardRefresh(): Promise<void> {
  try {
    console.log("🔄 FORCE REFRESHING DASHBOARD DATA")

    // Clear the cache
    cachedChartData = []

    // If we're in the browser, dispatch events to refresh the UI
    if (typeof window !== "undefined") {
      // Dispatch multiple events to ensure the dashboard updates
      window.dispatchEvent(new CustomEvent("learning-history-updated"))
      window.dispatchEvent(new CustomEvent("force-dashboard-refresh"))

      // Try to find and click the refresh button
      setTimeout(() => {
        try {
          const refreshButtons = document.querySelectorAll('button[title="Refresh dashboard data"]')
          if (refreshButtons.length > 0) {
            console.log("Found dashboard refresh button, clicking it")
            ;(refreshButtons[0] as HTMLElement).click()
          }
        } catch (error) {
          console.error("Error trying to click refresh button:", error)
        }
      }, 300)

      // If we're on the dashboard page, reload it
      if (window.location.pathname.includes("/dashboard")) {
        console.log("On dashboard page, forcing reload")
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }
  } catch (error) {
    console.error("Error forcing dashboard refresh:", error)
  }
}

// Get chart data for the dashboard
export async function getDashboardChartData(userId: string): Promise<any[]> {
  try {
    // If we have cached data that's less than 5 seconds old, use it
    const now = Date.now()
    if (cachedChartData.length > 0 && now - lastFetchTime < 5000) {
      console.log("Using cached chart data:", cachedChartData.length, "items")
      return cachedChartData
    }

    console.log("🔍 Fetching fresh dashboard chart data for user:", userId)

    // Add timestamp to prevent caching
    const timestamp = Date.now()

    // Fetch learning history with cache busting
    const history = await getAllLearningHistory(`nocache=${timestamp}`)
    console.log("📊 Learning history fetched:", history?.length || 0, "items")

    // Debug the learning history data
    if (history && history.length > 0) {
      console.log(
        "📋 First few history items:",
        history.slice(0, 3).map((item) => ({
          subject: item.subject,
          topic: item.topic,
          progress: item.progress,
        })),
      )
    } else {
      console.log("⚠️ No learning history found")
    }

    // Process learning history to count activities by subject
    const activityCountBySubject: Record<string, number> = {}
    const uniqueTopics = new Set<string>()

    // Process each history item
    history.forEach((item) => {
      if (!item || !item.subject || !item.topic) {
        console.log("⚠️ Skipping invalid history item:", item)
        return
      }

      // Normalize the subject name
      let subject = item.subject.toLowerCase().trim()

      // Handle common variations
      if (subject.includes("math")) subject = "math"
      if (subject.includes("science")) subject = "science"
      if (subject.includes("read")) subject = "reading"
      if (subject.includes("cod") || subject.includes("program")) subject = "coding"

      const key = `${subject}-${item.topic}`
      console.log(`Processing activity: ${subject} - ${item.topic}`)

      // Only count each unique topic once
      if (!uniqueTopics.has(key)) {
        uniqueTopics.add(key)
        activityCountBySubject[subject] = (activityCountBySubject[subject] || 0) + 1
        console.log(`Added activity for subject: ${subject}, count now: ${activityCountBySubject[subject]}`)
      }
    })

    // If we have no activities from history, try to get them from user progress
    if (Object.keys(activityCountBySubject).length === 0) {
      console.log("⚠️ No activities found in history, trying user progress")

      // Fetch user data
      const userData = await getUserData(userId)

      if (userData && userData.progress) {
        Object.entries(userData.progress).forEach(([subject, progress]) => {
          if (progress > 0) {
            const normalizedSubject = subject.toLowerCase().trim()
            activityCountBySubject[normalizedSubject] = 1
            console.log(`Added activity from progress for subject: ${normalizedSubject}`)
          }
        })
      }
    }

    // Calculate total activities
    const totalActivities = Object.values(activityCountBySubject).reduce((sum, count) => sum + count, 0)
    console.log("Total activities:", totalActivities)

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

    // Prepare data for pie chart
    const chartData = Object.entries(activityCountBySubject)
      .filter(([_, count]) => count > 0) // Only include subjects with activities
      .map(([key, count]) => {
        // Calculate percentage of total activities
        const percentage = totalActivities > 0 ? Math.round((count / totalActivities) * 100) : 0

        // Find the display name for this subject
        let displayName = key
        Object.entries(subjectNames).forEach(([nameKey, value]) => {
          if (key.includes(nameKey.toLowerCase())) {
            displayName = value
          }
        })

        // Find the color for this subject
        let color = "#8B5CF6" // Default color
        Object.entries(subjectColors).forEach(([colorKey, value]) => {
          if (key.includes(colorKey.toLowerCase())) {
            color = value
          }
        })

        return {
          name: displayName,
          value: percentage,
          count: count,
          color: color,
        }
      })

    console.log("📊 Chart data prepared:", chartData)

    // Cache the chart data
    cachedChartData = chartData
    lastFetchTime = now

    return chartData
  } catch (error) {
    console.error("Error getting dashboard chart data:", error)
    return []
  }
}

// Call this after completing any activity
export function notifyActivityCompletion(subject: string, topic: string): void {
  console.log(`🎯 Activity completed: ${subject} - ${topic}`)

  // Clear the cache to force a refresh
  cachedChartData = []

  // Force a dashboard refresh
  forceDashboardRefresh()
}
