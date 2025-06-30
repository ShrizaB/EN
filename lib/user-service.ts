// User service functions

export interface UserProgress {
  [subject: string]: number // Progress percentage for each subject
}

export interface UserStats {
  totalQuizzesTaken: number
  totalQuestionsAnswered: number
  correctAnswers: number
  totalTimeSpent: number // in seconds
  gamesPlayed: number
  lastActive: Date
}

export interface UserActivity {
  id: string
  type: string // 'quiz', 'game', 'video', etc.
  subject?: string
  topic?: string
  difficulty?: string
  score?: number
  totalQuestions?: number
  timeSpent: number // in seconds
  timestamp: Date
  sessionId?: string // Add session ID to prevent duplicates
}

export interface UserData {
  id: string
  name: string
  email: string
  age?: number
  progress: UserProgress
  stats: UserStats
  activities: UserActivity[]
  createdAt: Date
  updatedAt: Date
}

// Get user data
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    // Add a timestamp to prevent caching
    const timestamp = new Date().getTime()
    const response = await fetch(`/api/user/data?userId=${userId}&t=${timestamp}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user data")
    }

    const data = await response.json()
    return data.userData
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(name: string, age?: number): Promise<boolean> {
  try {
    const response = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        age,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update profile")
    }

    return true
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

// Update user progress
export async function updateUserProgress(subject: string, progress: number): Promise<boolean> {
  try {
    console.log(`Updating progress for ${subject}: ${progress}%`)

    const response = await fetch("/api/user/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject, progress }),
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to update progress:", response.status, response.statusText)
      throw new Error("Failed to update progress")
    }

    const data = await response.json()
    console.log("Progress update response:", data)
    return true
  } catch (error) {
    console.error("Error updating progress:", error)
    return false
  }
}

// Log user activity
export async function logActivity(userId: string, activity: Partial<UserActivity>): Promise<boolean> {
  try {
    console.log("Logging activity:", activity)

    // Ensure score is a number and properly formatted
    if (activity.score !== undefined) {
      // Make sure score is stored as a number
      activity.score = Number(activity.score)
    }

    const response = await fetch("/api/user/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        ...activity,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to log activity")
    }

    return true
  } catch (error) {
    console.error("Error logging activity:", error)
    return false
  }
}

// Get user activities
export async function getUserActivities(): Promise<UserActivity[]> {
  try {
    console.log("Fetching user activities...")
    const response = await fetch("/api/user/activity", {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      console.error("Failed to fetch activities:", response.status, response.statusText)
      throw new Error("Failed to fetch activities")
    }

    const data = await response.json()
    console.log("User activities fetched:", data.activities?.length || 0, "items")
    return data.activities || []
  } catch (error) {
    console.error("Error fetching activities:", error)
    return []
  }
}
