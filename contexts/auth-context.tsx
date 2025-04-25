"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  age?: number
  createdAt?: string
  stats?: {
    totalQuizzesTaken: number
    totalQuestionsAnswered: number
    correctAnswers: number
    gamesPlayed: number
    totalTimeSpent: number
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  setError: (error: string | null) => void
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, age?: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (name: string, age?: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "eduplay_user_data"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY)
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        console.error("Failed to load user from storage:", err)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Simple login function that works immediately
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      // For demo purposes, we'll just check if the email contains "@"
      if (!email.includes("@")) {
        throw new Error("Invalid email format")
      }

      if (password.length < 4) {
        throw new Error("Password must be at least 4 characters")
      }

      // Create a mock user
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        createdAt: new Date().toISOString(),
        stats: {
          totalQuizzesTaken: Math.floor(Math.random() * 10),
          totalQuestionsAnswered: Math.floor(Math.random() * 50),
          correctAnswers: Math.floor(Math.random() * 40),
          gamesPlayed: Math.floor(Math.random() * 5),
          totalTimeSpent: Math.floor(Math.random() * 120),
        },
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      setUser(newUser)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Simple signup function that works immediately
  const signup = async (name: string, email: string, password: string, age?: string) => {
    try {
      setLoading(true)
      setError(null)

      // Basic validation
      if (!name || !email || !password) {
        throw new Error("All fields are required")
      }

      if (!email.includes("@")) {
        throw new Error("Invalid email format")
      }

      if (password.length < 4) {
        throw new Error("Password must be at least 4 characters")
      }

      // Create a new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        age: age ? Number.parseInt(age) : undefined,
        createdAt: new Date().toISOString(),
        stats: {
          totalQuizzesTaken: 0,
          totalQuestionsAnswered: 0,
          correctAnswers: 0,
          gamesPlayed: 0,
          totalTimeSpent: 0,
        },
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      setUser(newUser)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Simple logout function
  const logout = async () => {
    try {
      setLoading(true)
      localStorage.removeItem(STORAGE_KEY)
      setUser(null)
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Update profile function
  const updateProfile = async (name: string, age?: number) => {
    try {
      setLoading(true)
      setError(null)

      if (!user) {
        throw new Error("No user logged in")
      }

      const updatedUser = {
        ...user,
        name,
        age,
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
      setUser(updatedUser)

      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}