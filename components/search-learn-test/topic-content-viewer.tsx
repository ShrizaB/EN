"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Timer, Brain, Maximize, Minimize, Volume2, VolumeX, AlertCircle, Shield } from 'lucide-react'
import { updateLearningHistory } from "@/lib/learning-history-service"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import confetti from "canvas-confetti"
import './topic-content-quiz.css'

// Batman logo component for background animations
function BatmanLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="60" height="30" viewBox="0 0 60 30" className={`absolute ${className}`} style={style}>
      <path
        d="M30 5 L25 10 L15 8 L20 15 L5 20 L20 25 L15 28 L25 26 L30 30 L35 26 L45 28 L40 25 L55 20 L40 15 L45 8 L35 10 Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Lightning effect component
function Lightning({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`absolute w-1 bg-gradient-to-b from-white via-yellow-300 to-transparent animate-lightning ${className}`}
      style={{
        height: "200px",
        ...style,
      }}
    />
  )
}

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
          <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-yellow-500 font-mono tracking-wider uppercase">
            {paragraph}
          </h3>
        )
      }

      // Regular paragraph
      return (
        <p key={index} className="mb-4 text-lg leading-relaxed font-mono text-gray-300">
          {paragraph}
        </p>
      )
    })
  }

  return (
    <div className={`transition-all duration-300 ${isFullScreen ? "fixed inset-0 z-50 bg-black" : "relative"}`}>
      {/* Batman logos flashing in background */}
      {[...Array(12)].map((_, i) => (
        <BatmanLogo
          key={i}
          className="text-yellow-500/10 animate-bat-symbol-flash pointer-events-none"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 90}%`,
            transform: `scale(${0.8 + Math.random() * 2.5}) rotate(${Math.random() * 40 - 20}deg)`,
            animationDelay: `${i * 1.5}s`,
            opacity: 0.1,
            zIndex: 0,
          }}
        />
      ))}

      {/* Lightning effects */}
      {[...Array(3)].map((_, i) => (
        <Lightning
          key={i}
          className="pointer-events-none"
          style={{
            left: `${20 + i * 30}%`,
            top: "0",
            animationDelay: `${i * 2 + 5}s`,
            animationDuration: `${4 + i}s`,
            opacity: 0.5,
            zIndex: 0,
          }}
        />
      ))}

      {/* Gotham City skyline */}
      <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden opacity-15 pointer-events-none">
        <svg width="100%" height="192" viewBox="0 0 1920 192" className="absolute bottom-0">
          <defs>
            <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="wayneTowerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Wayne Tower (tallest in center) */}
          <rect x="900" y="0" width="120" height="192" fill="url(#wayneTowerGrad)" />
          <rect x="930" y="0" width="60" height="30" fill="url(#wayneTowerGrad)" />
          <polygon points="930,0 990,0 960,30" fill="#1e293b" />

          {/* Building silhouettes - left side */}
          <rect x="0" y="100" width="80" height="92" fill="url(#buildingGrad)" />
          <rect x="80" y="80" width="60" height="112" fill="url(#buildingGrad)" />
          <rect x="140" y="110" width="40" height="82" fill="url(#buildingGrad)" />
          <rect x="180" y="70" width="70" height="122" fill="url(#buildingGrad)" />
          <rect x="250" y="90" width="50" height="102" fill="url(#buildingGrad)" />
          <rect x="300" y="60" width="80" height="132" fill="url(#buildingGrad)" />
          <rect x="380" y="85" width="55" height="107" fill="url(#buildingGrad)" />
          <rect x="435" y="105" width="45" height="87" fill="url(#buildingGrad)" />
          <rect x="480" y="75" width="75" height="117" fill="url(#buildingGrad)" />
          <rect x="555" y="95" width="65" height="97" fill="url(#buildingGrad)" />
          <rect x="620" y="65" width="70" height="127" fill="url(#buildingGrad)" />
          <rect x="690" y="100" width="50" height="92" fill="url(#buildingGrad)" />
          <rect x="740" y="80" width="65" height="112" fill="url(#buildingGrad)" />
          <rect x="805" y="110" width="45" height="82" fill="url(#buildingGrad)" />
          <rect x="850" y="50" width="50" height="142" fill="url(#buildingGrad)" />

          {/* Building silhouettes - right side */}
          <rect x="1020" y="90" width="60" height="102" fill="url(#buildingGrad)" />
          <rect x="1080" y="60" width="90" height="132" fill="url(#buildingGrad)" />
          <rect x="1170" y="85" width="65" height="107" fill="url(#buildingGrad)" />
          <rect x="1235" y="105" width="55" height="87" fill="url(#buildingGrad)" />
          <rect x="1290" y="75" width="85" height="117" fill="url(#buildingGrad)" />
          <rect x="1375" y="95" width="75" height="97" fill="url(#buildingGrad)" />
          <rect x="1450" y="65" width="80" height="127" fill="url(#buildingGrad)" />
          <rect x="1530" y="100" width="60" height="92" fill="url(#buildingGrad)" />
          <rect x="1590" y="80" width="75" height="112" fill="url(#buildingGrad)" />
          <rect x="1665" y="110" width="55" height="82" fill="url(#buildingGrad)" />
          <rect x="1720" y="70" width="90" height="122" fill="url(#buildingGrad)" />
          <rect x="1810" y="90" width="70" height="102" fill="url(#buildingGrad)" />
          <rect x="1880" y="60" width="40" height="132" fill="url(#buildingGrad)" />

          {/* Windows with flickering lights */}
          {[...Array(40)].map((_, i) => (
            <rect
              key={i}
              x={20 + (i % 24) * 80 + Math.random() * 40}
              y={70 + Math.floor(i / 24) * 20 + Math.random() * 15}
              width="3"
              height="4"
              fill="#ffe066"
              opacity={Math.random() > 0.7 ? "0.6" : "0.2"}
              className="animate-flicker"
              style={{
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </svg>
      </div>

      <div
        className={`border border-yellow-500/20 rounded-xl shadow-lg overflow-hidden ${isFullScreen ? "h-screen" : ""} bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/20 shadow-[0_0_30px_rgba(0,0,0,0.8)]`}
        style={{
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.8)",
        }}
      >
        <div className="p-4 border-b border-yellow-500/20 flex items-center justify-between sticky top-0 z-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm">
          {!isFullScreen && (
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 batman-cursor-hover text-yellow-500/80">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm">
              <Timer className={`h-4 w-4 mr-1 ${timeRemaining < 300 ? "text-red-500" : "text-amber-500"}`} />
              <span className={`font-medium ${timeRemaining < 300 ? "text-red-500" : "text-yellow-500/80"} font-mono`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="flex items-center text-sm text-yellow-500/60 font-mono">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>Learning: {topic}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleReadAloud}
              className={`gap-1 ${isSpeaking ? "text-green-500" : "text-yellow-500/80"} batman-cursor-hover font-mono`}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {isSpeaking ? "Stop Reading" : "Read Aloud"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullScreen}
              className="gap-1 batman-cursor-hover text-yellow-500/80 font-mono"
            >
              {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
        </div>

        <div className={`flex flex-col md:flex-row ${isFullScreen ? "h-[calc(100vh-64px)]" : "h-[70vh]"}`}>
          <div
            ref={contentRef}
            id="content-container"
            className="flex-1 p-6 md:p-8 overflow-y-auto bg-black/80 backdrop-blur-sm text-gray-300 relative"
          >
            {/* Scan line effect */}
            <div
              className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(255,224,102,0.03) 50%, transparent)",
                backgroundSize: "100% 8px",
                animation: "scanline 8s linear infinite",
                opacity: 0.3,
              }}
            ></div>

            {/* Vignette effect */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                boxShadow: "inset 0 0 100px rgba(0,0,0,0.7)",
                background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
              }}
            ></div>

            {/* Noise texture */}
            <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none z-0"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6 text-yellow-500 font-mono tracking-wide uppercase">
                {topic}
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">{formatContent(content)}</div>
              <div className="h-20"></div> {/* Spacer at the bottom */}
            </div>
          </div>

          <div className="w-full md:w-72 p-4 border-t md:border-t-0 md:border-l border-yellow-500/20 backdrop-blur-sm">
            <div className="sticky top-4">
              <h3 className="font-medium mb-3 text-yellow-500/80 font-mono tracking-wider uppercase">Your Progress</h3>
              <div className="relative h-3 mb-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
                <div className="absolute inset-0 bg-noise opacity-10"></div>
              </div>
              <p className="text-sm text-yellow-500/60 mb-6 font-mono">{readingProgress}% complete</p>

              <div className="space-y-4">
                <Card className="p-3 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 shadow-md animate-glow-pulse">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="h-5 w-5 text-amber-500" />
                    <h4 className="font-medium text-yellow-500/80 font-mono tracking-wider">Time Remaining</h4>
                  </div>
                  <div className="text-2xl font-bold text-center mb-2 text-yellow-500 font-mono">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-xs text-yellow-500/60 mt-2 text-center font-mono">
                    The test will start automatically when time runs out
                  </p>
                </Card>

                <Card className="p-3 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 shadow-md animate-glow-pulse">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-medium text-yellow-500/80 font-mono tracking-wider">Ready for the test?</h4>
                  </div>
                  <p className="text-sm text-yellow-500/60 mb-3 font-mono">
                    Take a 20-question test to check your understanding of this topic.
                  </p>
                  <Button
                    onClick={handleStartTest}
                    className="w-full bg-black hover:bg-black text-yellow-500 border-2 border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-yellow-500/20 transform hover:scale-105 batman-cursor-hover font-mono uppercase tracking-wider"
                  >
                    {isReady ? "Start Test Now" : "I'm Ready"}
                  </Button>
                  {!isReady && (
                    <p className="text-xs text-yellow-500/60 mt-2 text-center font-mono">
                      Continue reading to unlock the test
                    </p>
                  )}
                </Card>

                <Card className="p-3 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 shadow-md animate-glow-pulse">
                  <h4 className="font-medium mb-2 text-yellow-500/80 font-mono tracking-wider">Reading Tips</h4>
                  <ul className="text-sm text-yellow-500/60 space-y-2 font-mono">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Take notes as you read</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Use the read aloud feature</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Try fullscreen mode</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/20 shadow-[0_0_30px_rgba(255,224,102,0.2)]">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <h3 className="text-xl font-bold text-yellow-500 font-mono tracking-wider">Are you sure?</h3>
            </div>
            <p className="mb-6 text-gray-300 font-mono">
              You've only read {readingProgress}% of the content. It's recommended to read more before taking the test.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowWarning(false)}
                className="batman-cursor-hover border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 font-mono"
              >
                Continue Reading
              </Button>
              <Button
                onClick={() => {
                  setShowWarning(false)
                  onStartTest()
                }}
                className="batman-cursor-hover bg-black hover:bg-black text-yellow-500 border-2 border-yellow-500/30 hover:border-yellow-500/50 font-mono"
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
