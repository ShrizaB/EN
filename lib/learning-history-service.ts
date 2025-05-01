// Learning history service functions

export interface LearningHistory {
  id: string
  userId: string
  subject: string
  topic: string
  content: string
  lastAccessed: Date
  visitCount: number
  progress: number // 0-100
  difficulty: string
  createdAt: Date
  updatedAt: Date
}

// Get learning history for a specific topic
export async function getTopicLearningHistory(subject: string, topic: string): Promise<LearningHistory | null> {
  try {
    const response = await fetch(`/api/user/learning-history?subject=${subject}&topic=${topic}`, {
      cache: "no-store",
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

    const response = await fetch("/api/user/learning-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        topic,
        content,
        progress,
        difficulty,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update learning history")
    }

    return true
  } catch (error) {
    console.error("Error updating learning history:", error)
    return false
  }
}

// Get all learning history for a user
export async function getAllLearningHistory(): Promise<LearningHistory[]> {
  try {
    console.log("Fetching all learning history...")
    const response = await fetch("/api/user/learning-history", {
      cache: "no-store",
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