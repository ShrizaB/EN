"use client"

import { useState, useEffect, useRef } from "react"

interface TVAGlitchTextProps {
  text: string
  className?: string
  glitchInterval?: number
  glitchIntensity?: "low" | "medium" | "high"
}

export function TVAGlitchText({
  text,
  className = "",
  glitchInterval = 5000,
  glitchIntensity = "medium",
}: TVAGlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [displayText, setDisplayText] = useState(text)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Initial glitch on mount
    setTimeout(() => {
      glitchEffect()
    }, 500)

    // Random glitch effect
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        glitchEffect()
      }
    }, glitchInterval)

    return () => clearInterval(interval)
  }, [text, glitchInterval])

  const glitchEffect = () => {
    setIsGlitching(true)

    // Generate glitched text
    const glitchText = text
      .split("")
      .map((char) => {
        // Adjust probability based on intensity
        const glitchProbability = glitchIntensity === "low" ? 0.2 : glitchIntensity === "high" ? 0.5 : 0.3

        if (Math.random() > 1 - glitchProbability) {
          // Replace with random character
          const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\`~"
          return glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }
        return char
      })
      .join("")

    setDisplayText(glitchText)

    // Apply CSS glitch effect to the text element
    if (textRef.current) {
      textRef.current.style.textShadow = `
        ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(163, 190, 140, 0.7),
        ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(202, 138, 4, 0.7)
      `

      // Apply more intense effects for high intensity
      if (glitchIntensity === "high") {
        textRef.current.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`
        textRef.current.style.letterSpacing = `${Math.random() * 2 - 1}px`
      }
    }

    // Reset after short delay - adjust duration based on intensity
    const resetDelay = glitchIntensity === "low" ? 100 : glitchIntensity === "high" ? 250 : 150

    setTimeout(() => {
      setDisplayText(text)
      setIsGlitching(false)

      if (textRef.current) {
        textRef.current.style.textShadow = ""
        textRef.current.style.transform = ""
        textRef.current.style.letterSpacing = ""
      }
    }, resetDelay)
  }

  return (
    <span
      ref={textRef}
      className={`relative inline-block ${className} ${isGlitching ? "text-variant-green" : ""} transition-all duration-100`}
    >
      {displayText}
      {isGlitching && (
        <>
          <span className="absolute inset-0 bg-variant-green/10 animate-pulse"></span>
          <span className="absolute inset-0 crt-scanlines opacity-30"></span>
        </>
      )}
    </span>
  )
}
