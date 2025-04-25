"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Timer, Brain, Maximize, Minimize, Volume2, VolumeX, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { updateLearningHistory } from "@/lib/learning-history-service"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import confetti from "canvas-confetti"

interface TopicContentViewerProps {
  topic: string
  content: string
  subject?: string
  onStartTest: () => void
  onBack: () => void
}

export function TopicContentViewer({
  topic,
  content,
  subject = "general",
  onStartTest,
  onBack,
}: TopicContentViewerProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(15 * 60) // 15 minutes in seconds
  const [isReading, setIsReading] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const [hasLoggedInitialView, setHasLoggedInitialView] = useState(false)

  // Speech synthesis
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechSynthesis = typeof window !== "undefined" ? window.speechSynthesis : null
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Calculate estimated reading time (average reading speed: 200 words per minute)
  useEffect(() => {
    const wordCount = content.split(/\s+/).length
    const estimatedMinutes = Math.ceil(wordCount / 200)
    setReadingTime(estimatedMinutes)
  }, [content])

  // Track reading progress based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const contentElement = contentRef.current
      if (contentElement) {
        const scrollPosition = contentElement.scrollTop
        const scrollHeight = contentElement.scrollHeight - contentElement.clientHeight
        const progress = Math.min(Math.round((scrollPosition / scrollHeight) * 100), 100)
        setReadingProgress(progress)

        // Consider content as read when progress is over 80%
        if (progress > 80 && !isReady) {
          setIsReady(true)

          // Trigger confetti for completion
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          })
        }
      }
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll)
      return () => contentElement.removeEventListener("scroll", handleScroll)
    }
  }, [isReady])

  // Log initial view only once when the component mounts
  useEffect(() => {
    if (topic && content && user && !hasLoggedInitialView) {
      console.log(`Logging initial view for topic: ${topic}, subject: ${subject}`)

      // Log this learning activity to the user's history with initial progress
      updateLearningHistory(
        subject,
        topic,
        content.substring(0, 500) + "...", // Store a preview of the content
        0, // Initial progress
        "beginner",
      )

      setHasLoggedInitialView(true)
    }
  }, [topic, content, user, subject, hasLoggedInitialView])

  // Save learning progress when user has read the content
  useEffect(() => {
    if (isReady && user && hasLoggedInitialView) {
      console.log(`Updating progress for topic: ${topic}, subject: ${subject}, progress: ${readingProgress}%`)

      // Update the learning history with the current progress
      updateLearningHistory(
        subject,
        topic,
        content.substring(0, 500) + "...", // Store a preview of the content
        readingProgress,
        "intermediate",
      )
    }
  }, [isReady, user, topic, content, readingProgress, subject, hasLoggedInitialView])

  // Timer countdown
  useEffect(() => {
    if (!isReading) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleStartTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isReading])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)

    // If entering fullscreen, start the reading timer
    if (!isFullScreen && !isReading) {
      setIsReading(true)
    }
  }

  // Handle start test
  const handleStartTest = () => {
    // Stop speech if it's playing
    if (isSpeaking && speechSynthesis && speechUtteranceRef.current) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }

    // If user hasn't read at least 50% of the content, show warning
    if (readingProgress < 50 && !showWarning) {
      setShowWarning(true)
      return
    }

    onStartTest()
  }

  // Toggle read aloud
  const toggleReadAloud = () => {
    if (!speechSynthesis) return

    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    // Get visible content
    const contentElement = contentRef.current
    if (!contentElement) return

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(content)
    utterance.rate = 0.9 // Slightly slower for better comprehension
    utterance.pitch = 1.0

    // Get available voices and try to find a good one
    const voices = speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Google") || voice.name.includes("Female") || voice.name.includes("Samantha"),
    )

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    // Handle end of speech
    utterance.onend = () => {
      setIsSpeaking(false)
    }

    // Store reference to utterance
    speechUtteranceRef.current = utterance

    // Start speaking
    speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  // Format content with proper paragraphs and headings
  const formatContent = (text: string) => {
    // Split by double newlines to get paragraphs
    const paragraphs = text.split(/\n\n+/)

    return paragraphs.map((paragraph, index) => {
      // Check if paragraph looks like a heading (short and ends with a colon or is all caps)
      if ((paragraph.length < 50 && paragraph.endsWith(":")) || paragraph.toUpperCase() === paragraph) {
        return (
          <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-primary-600">
            {paragraph}
          </h3>
        )
      }

      // Regular paragraph
      return (
        <p key={index} className="mb-4 text-lg leading-relaxed">
          {paragraph}
        </p>
      )
    })
  }

  return (
    <div className={`transition-all duration-300 ${isFullScreen ? "fixed inset-0 z-50 bg-background" : "relative"}`}>
      <div
        className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950 border border-border rounded-xl shadow-lg overflow-hidden ${isFullScreen ? "h-screen" : ""}`}
      >
        <div className="p-4 border-b border-border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
          {!isFullScreen && (
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm">
              <Timer className={`h-4 w-4 mr-1 ${timeRemaining < 300 ? "text-red-500" : "text-amber-500"}`} />
              <span className={`font-medium ${timeRemaining < 300 ? "text-red-500" : ""}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>Learning: {topic}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleReadAloud}
              className={`gap-1 ${isSpeaking ? "text-green-500" : ""}`}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {isSpeaking ? "Stop Reading" : "Read Aloud"}
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullScreen} className="gap-1">
              {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
        </div>

        <div className={`flex flex-col md:flex-row ${isFullScreen ? "h-[calc(100vh-64px)]" : "h-[70vh]"}`}>
          <div
            ref={contentRef}
            id="content-container"
            className="flex-1 p-6 md:p-8 overflow-y-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
          >
            <h2 className="text-3xl font-bold mb-6 text-primary">{topic}</h2>
            <div className="prose prose-lg max-w-none dark:prose-invert">{formatContent(content)}</div>
            <div className="h-20"></div> {/* Spacer at the bottom */}
          </div>

          <div className="w-full md:w-72 p-4 border-t md:border-t-0 md:border-l border-border bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
            <div className="sticky top-4">
              <h3 className="font-medium mb-3">Your Progress</h3>
              <Progress value={readingProgress} className="h-3 mb-2 bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </Progress>
              <p className="text-sm text-muted-foreground mb-6">{readingProgress}% complete</p>

              <div className="space-y-4">
                <Card className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border-none shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="h-5 w-5 text-amber-500" />
                    <h4 className="font-medium">Time Remaining</h4>
                  </div>
                  <div className="text-2xl font-bold text-center mb-2">{formatTime(timeRemaining)}</div>
                  <p className="text-xs text-muted-foreground text-center">
                    The test will start automatically when time runs out
                  </p>
                </Card>

                <Card className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border-none shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Ready for the test?</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Take a 20-question test to check your understanding of this topic.
                  </p>
                  <Button
                    onClick={handleStartTest}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isReady ? "Start Test Now" : "I'm Ready"}
                  </Button>
                  {!isReady && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Continue reading to unlock the test
                    </p>
                  )}
                </Card>

                <Card className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border-none shadow-md">
                  <h4 className="font-medium mb-2">Reading Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Take notes as you read</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Use the read aloud feature</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Try fullscreen mode</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Review before taking the test</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <h3 className="text-xl font-bold">Are you sure?</h3>
            </div>
            <p className="mb-6">
              You've only read {readingProgress}% of the content. It's recommended to read more before taking the test.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowWarning(false)}>
                Continue Reading
              </Button>
              <Button
                onClick={() => {
                  setShowWarning(false)
                  onStartTest()
                }}
              >
                Take Test Anyway
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}