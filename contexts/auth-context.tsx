"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, age?: number) => Promise<void>
  signup: (name: string, email: string, password: string, age: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  setError: (error: string | null) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()

      if (data.user) {
        console.log("Session found:", data.user)
        setUser(data.user)
        return true
      } else {
        console.log("No session found")
        setUser(null)
        return false
      }
    } catch (error) {
      console.error("Failed to fetch session:", error)
      return false
    }
  }

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      await refreshUser()
      setLoading(false)
    }

    checkUserLoggedIn()
  }, [])

  const login = async (email: string, password: string, age?: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, age }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to login")
      }

      console.log("Login successful:", data.user)
      setUser(data.user)

      // Force a refresh to ensure the session is loaded
      await refreshUser()

      // Use window.location for a full page refresh to ensure session is recognized
      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message)
      setUser(null)
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, age: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          age: Number.parseInt(age),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      console.log("Signup successful, logging in...")
      // Auto login after signup
      await login(email, password)
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message)
      setLoading(false)
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setUser(null)
      // Use window.location for a full page refresh
      window.location.href = "/"
    } catch (error: any) {
      setError(error.message)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        error,
        setError,
        refreshUser,
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
