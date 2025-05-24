"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface TVATimeDoorProps {
  title: string
  subject: string
  progress: number
  href: string
  delay?: number
}

export function TVATimeDoor({ title, subject, progress, href, delay = 0 }: TVATimeDoorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const doorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  // Add realistic door opening animation
  const handleMouseEnter = () => {
    setIsHovered(true)
    setTimeout(() => {
      setIsOpen(true)
    }, 100)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsOpen(false)
  }

  return (
    <div
      ref={doorRef}
      className={`relative overflow-hidden rounded-md bg-tva-brown border border-tva-gold hover:border-tva-gold p-4 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${isHovered ? "shadow-md shadow-loki-green/30" : ""} tva-hover-glow`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Door opening animation */}
      <div
        className={`absolute inset-0 bg-dark-gray transition-all duration-700 ${isOpen ? "opacity-0" : "opacity-100"}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-tva-gold/10 flex items-center justify-center border border-tva-gold/30">
            <span className="font-mono text-tva-gold text-xs">TVA</span>
          </div>
        </div>
        <div className="absolute inset-0 border-2 border-tva-gold/30 rounded-md"></div>
        <div
          className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-loki-green via-tva-gold to-loki-green transition-all duration-700 ${
            isOpen ? "h-full" : "h-0"
          }`}
        ></div>
        <div
          className={`absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-loki-green via-tva-gold to-loki-green transition-all duration-700 ${
            isOpen ? "h-full" : "h-0"
          }`}
        ></div>

        {/* Horizontal lines that appear when opening */}
        <div
          className={`absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-loki-green via-tva-gold to-loki-green transition-all duration-700 ${
            isOpen ? "w-full" : "w-0"
          }`}
        ></div>
        <div
          className={`absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-loki-green via-tva-gold to-loki-green transition-all duration-700 ${
            isOpen ? "w-full" : "w-0"
          }`}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="absolute inset-0 crt-overlay opacity-5"></div>
        <div className="absolute inset-0 tva-logo-bg opacity-5"></div>
        <div className="absolute inset-0 timeline-spiral-bg opacity-10"></div>
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`font-mono font-medium truncate text-tva-gold ${isHovered ? "animate-glitch-text" : ""}`}
                >
                  {title}
                </h3>
                <p className="text-sm text-light-gray font-mono">{subject}</p>
              </div>
              <Button
                asChild
                size="sm"
                className="bg-dark-gray hover:bg-tva-brown text-light-gray border border-tva-gold/50 hover:border-loki-green hover:text-loki-green transition-colors tva-hover-glow tva-glitch-button"
              >
                <Link href={href}>CONTINUE</Link>
              </Button>
            </div>
            <div className="mt-2">
              <div className="relative">
                <Progress
                  value={progress}
                  className="h-2 bg-dark-gray border border-tva-gold/30 snake-progress"
                  color="bg-gradient-to-r from-tva-gold to-loki-green"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-light-gray font-mono">{progress}% complete</span>
                <span className="text-xs text-light-gray font-mono">
                  {Math.max(1, Math.round((100 - progress) / 10))} questions left
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced glitch effect */}
      <div className={`absolute inset-0 bg-loki-green/5 opacity-0 ${isHovered ? "animate-glitch-opacity" : ""}`}></div>
    </div>
  )
}
