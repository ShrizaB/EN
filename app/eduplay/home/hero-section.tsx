"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  ChevronRight,
  Calculator,
  BookOpen,
  Code,
  FlaskConical,
} from "lucide-react"

export function HeroSection() {
  const [confetti, setConfetti] = useState<{ x: number; y: number; size: number; color: string; rotation: number }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate confetti when page loads
  useEffect(() => {
    if (containerRef.current) {
      const colors = [
        "#FF5252", // Red
        "#FF9800", // Orange
        "#FFEB3B", // Yellow
        "#4CAF50", // Green
        "#2196F3", // Blue
        "#9C27B0", // Purple
        "#E91E63", // Pink
      ]

      const newConfetti = Array.from({ length: 100 }).map(() => ({
        x: Math.random() * 100,
        y: -10 - Math.random() * 10,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      }))

      setConfetti(newConfetti)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-[700px] max-h-[750px] relative overflow-hidden py-20 md:py-32 bg-gradient-to-tl from-[#00000075] via-[#05001f] to-black"
    >
      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex justify-center items-center h-[1200px]">
        <img
          src="https://i.postimg.cc/j5HnZm0L/erasebg-transformed.png"
          alt="background"
          className="opacity-50 w-[1100px] h-auto mb-80"
        />
      </div>

      {/* Confetti animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((conf, i) => (
          <div
            key={i}
            className="absolute rounded-sm animate-confetti"
            style={{
              left: `${conf.x}%`,
              top: `${conf.y}%`,
              width: `${conf.size}px`,
              height: `${conf.size}px`,
              backgroundColor: conf.color,
              transform: `rotate(${conf.rotation}deg)`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center rounded-full bg-[#EE4B2B25] px-4 py-2 text-sm font-medium text-brightRed mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Interactive Learning Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Learning Made <span className="text-[#EE4B2B]">Fun</span> and{" "}
              <span className="text-[#EE4B2B]">Interactive</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore subjects, play educational games, and track your progress with our interactive learning
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/subjects">
                <Button size="lg" className="w-full sm:w-auto bg-[#c32f2f] hover:bg-[#ee2b2b] group hover:scale-105 transition-transform">
                  Start Learning
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/quiz">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto group border-primary/20 hover:border-primary/40 hover:scale-105 transition-transform"
                >
                  Take a Quiz
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative animate-slide-up animation-delay-100">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-75"></div>
            <div className="grid grid-cols-2 gap-4 p-1 relative">
              {[
                { icon: Calculator, color: "text-primary", title: "Mathematics", desc: "Numbers, shapes, and patterns" },
                { icon: FlaskConical, color: "text-green-500", title: "Science", desc: "Explore the natural world" },
                { icon: BookOpen, color: "text-orange-500", title: "Reading", desc: "Words, stories, and language" },
                { icon: Code, color: "text-indigo-500", title: "Coding", desc: "Logic and problem-solving" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-transparent p-6 rounded-xl shadow-lg border-2 border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <item.icon className={`h-8 w-8 ${item.color} mb-3`} />
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}