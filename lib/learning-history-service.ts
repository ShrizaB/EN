// Learning history service functions

export interface LearningHistory {
  id?: string
  _id?: string
  userId?: string
  subject: string
  topic: string
  content: string
  lastAccessed?: Date
  visitCount?: number
  progress?: number // 0-100
  difficulty?: string
  createdAt?: Date
  updatedAt?: Date
  visitId?: string // Unique identifier for each visit
  visitDate?: Date // Date of this specific visit
}

// Get learning history for a specific topic
export async function getTopicLearningHistory(subject: string, topic: string): Promise<LearningHistory | null> {
  try {
    const timestamp = Date.now()
    const response = await fetch(`/api/user/learning-history?subject=${subject}&topic=${topic}&t=${timestamp}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch learning history")
    }

    const data = await response.json()
    return data.history
  } catch (error) {
    console.error("Error fetching learning history:", error)
    return null
  }
}

// Update learning history for a topic
export async function updateLearningHistory(
  subject: string,
  topic: string,
  content: string,
  progress: number,
  difficulty: string,
): Promise<boolean> {
  try {
    console.log("Updating learning history:", { subject, topic, progress, difficulty })

    // Generate a unique visitId for this update
    const visitId = `${subject}-${topic}-${Date.now()}`

    const response = await fetch("/api/user/learning-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      body: JSON.stringify({
        subject,
        topic,
        content,
        progress,
        difficulty,
        visitId,
        visitDate: new Date().toISOString(),
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to update learning history:", response.status, response.statusText)
      throw new Error("Failed to update learning history")
    }

    const data = await response.json()
    console.log("Learning history update response:", data)

    // Trigger dashboard refresh
    triggerDashboardRefresh()

    return true
  } catch (error) {
    console.error("Error updating learning history:", error)
    return false
  }
}

// Get all learning history for a user
export async function getAllLearningHistory(cacheParam?: string): Promise<LearningHistory[]> {
  try {
    console.log("Fetching all learning history...")
    // Add timestamp to prevent caching
    const timestamp = Date.now()
    const queryParam = cacheParam || `t=${timestamp}`
    const response = await fetch(`/api/user/learning-history?${queryParam}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      console.error("Failed to fetch learning history:", response.status, response.statusText)
      throw new Error("Failed to fetch learning history")
    }

    const data = await response.json()
    console.log("Learning history fetched:", data.history?.length || 0, "items")
    return data.history || []
  } catch (error) {
    console.error("Error fetching all learning history:", error)
    return []
  }
}

// Force refresh learning history data on dashboard
export function triggerDashboardRefresh(): void {
  if (typeof window !== "undefined") {
    console.log("Triggering dashboard refresh event")

    // Use multiple methods to ensure the dashboard updates

    // 1. Dispatch a custom event immediately
    window.dispatchEvent(new CustomEvent("learning-history-updated"))

    // 2. Try to find and click any refresh button on the dashboard
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
    }, 500)

    // 3. Dispatch another event after a delay to ensure it's caught
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("learning-history-updated"))

      // 4. If on the dashboard page, try to force a refresh
      if (window.location.pathname.includes("/dashboard")) {
        console.log("On dashboard page, forcing additional refresh")
        window.dispatchEvent(new CustomEvent("force-dashboard-refresh"))
      }
    }, 1500)
  }
}
