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
  
  interface LearningHistoryItem {
    userId: string
    subject: string
    topic: string
    content: string
    progress: number
    level: string
    score?: number
    timeSpent?: number
    timestamp: Date
  }
  
  // Mock data for learning history
  const mockLearningHistory = [
    {
      id: "1",
      userId: "user1",
      subject: "math",
      topic: "Algebra Basics",
      content: "Introduction to algebra",
      progress: 85,
      level: "intermediate",
      score: 90,
      timeSpent: 1200,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "2",
      userId: "user1",
      subject: "science",
      topic: "The Solar System",
      content: "Planets and stars",
      progress: 75,
      level: "beginner",
      score: 80,
      timeSpent: 900,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: "3",
      userId: "user1",
      subject: "coding",
      topic: "Introduction to Python",
      content: "Basic Python syntax",
      progress: 60,
      level: "beginner",
      score: 70,
      timeSpent: 1500,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: "4",
      userId: "user1",
      subject: "math",
      topic: "Geometry",
      content: "Shapes and angles",
      progress: 90,
      level: "intermediate",
      score: 95,
      timeSpent: 1800,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
    {
      id: "5",
      userId: "user1",
      subject: "reading",
      topic: "Shakespeare",
      content: "Romeo and Juliet",
      progress: 70,
      level: "advanced",
      score: 85,
      timeSpent: 2100,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    },
  ]
  
  // Get learning history for a specific topic
  export async function getTopicLearningHistory(subject: string, topic: string): Promise<LearningHistory | null> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
  
      const history = mockLearningHistory.find((item) => item.subject === subject && item.topic === topic)
  
      return history || null
    } catch (error) {
      console.error("Error fetching learning history:", error)
      return null
    }
  }
  
  export async function updateLearningHistory(
    subject: string,
    topic: string,
    content: string,
    progress: number,
    level = "beginner",
    score?: number,
    timeSpent?: number,
  ) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
  
      const newId = (mockLearningHistory.length + 1).toString()
  
      const historyItem = {
        id: newId,
        userId: "user1", // Simulated user ID
        subject,
        topic,
        content,
        progress,
        level,
        score,
        timeSpent,
        timestamp: new Date(),
      }
  
      // In a real app, this would be saved to a database
      mockLearningHistory.push(historyItem as any)
  
      console.log("Learning history updated with ID: ", newId)
      return newId
    } catch (error) {
      console.error("Error updating learning history:", error)
      throw error
    }
  }
  
  // Get all learning history for a user
  export async function getAllLearningHistory(cacheParam?: string): Promise<LearningHistory[]> {
    try {
      console.log("Fetching all learning history...")
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
  
      return mockLearningHistory as LearningHistory[]
    } catch (error) {
      console.error("Error fetching all learning history:", error)
      return []
    }
  }
  
  export async function getUserLearningHistory() {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
  
      return mockLearningHistory
    } catch (error) {
      console.error("Error getting learning history:", error)
      throw error
    }
  }
  
  // Force refresh learning history data on dashboard
  export function triggerDashboardRefresh(): void {
    if (typeof window !== "undefined") {
      console.log("Triggering dashboard refresh event")
  
      // Use a small timeout to ensure the event fires after the current execution context
      setTimeout(() => {
        // Dispatch a custom event that the dashboard listens for
        window.dispatchEvent(new CustomEvent("learning-history-updated"))
  
        // Force reload of dashboard data
        try {
          // Try to find and click the refresh button on the dashboard
          const refreshButton = document.querySelector('[title="Refresh dashboard data"]') as HTMLButtonElement
          if (refreshButton) {
            console.log("Found refresh button, clicking it")
            refreshButton.click()
          }
        } catch (e) {
          console.error("Error trying to auto-refresh dashboard:", e)
        }
      }, 500)
    }
  }