"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { TVAGlitchText } from "./tva-glitch-text"

interface TVANotificationProps {
  message: string
  onClose: () => void
}

export function TVANotification({ message, onClose }: TVANotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const [displayMessage, setDisplayMessage] = useState("")
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 100)

    // Typewriter effect
    const typewriterInterval = setInterval(() => {
      if (messageIndex < message.length) {
        setDisplayMessage(message.slice(0, messageIndex + 1))
        setMessageIndex((prev) => prev + 1)
      } else {
        clearInterval(typewriterInterval)
      }
    }, 50)

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 300)
      }
    }, 2000)

    // Auto close after 5 seconds
    const closeTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 500) // Wait for exit animation
    }, 5000)

    return () => {
      clearInterval(typewriterInterval)
      clearInterval(glitchInterval)
      clearTimeout(closeTimer)
    }
  }, [message, messageIndex, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 500) // Wait for exit animation
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-500 mt-4 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
      }`}
    >
      <div
        className={`relative bg-tva-brown border border-tva-gold rounded-md p-4 shadow-lg shadow-black/30 max-w-sm tva-hover-glow ${
          isGlitching ? "animate-glitch" : ""
        }`}
      >
        <div className="absolute inset-0 tva-logo-bg opacity-5"></div>
        <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>

        {/* Miss Minutes-inspired character */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-tva-gold flex items-center justify-center flex-shrink-0 miss-minutes-icon">
            <div className="w-8 h-8 rounded-full bg-dark-gray flex items-center justify-center">
              <span className="font-mono text-tva-gold text-xs">TVA</span>
            </div>
          </div>

          <div className="flex-1">
            <TVAGlitchText text="TIMELINE ALERT" className="text-sm font-mono font-bold text-tva-gold mb-1" />
            <p className="text-sm text-light-gray font-mono typewriter">
              {displayMessage}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          <button onClick={handleClose} className="text-light-gray hover:text-tva-gold tva-glitch-button">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
