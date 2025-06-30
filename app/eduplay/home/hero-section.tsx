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
      className="min-h-[700px] max-h-[750px] relative overflow-hidden py-20 md:py-32 bg-[#02010e] hero-glow-section"
      style={{ 
        borderBottomLeftRadius: 0, 
        borderBottomRightRadius: 0, 
        overflow: 'hidden',
        scrollbarWidth: 'none',  /* Firefox */
        msOverflowStyle: 'none',  /* IE and Edge */
      }}
    >
      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex justify-center items-center h-[1200px]">
        <img
          src="https://i.postimg.cc/j5HnZm0L/erasebg-transformed.png"
          alt="background"
          className="opacity-30 w-[1100px] h-auto mb-80"
        />
      </div>

      {/* Soft animated gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none z-20 hero-animated-gradient"></div>

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

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in relative hero-main-text-area">
            <div className="absolute -left-4 top-0 bottom-0 w-2 bg-gradient-to-b from-[#ee4b2b] via-[#ff9800] to-[#ee4b2b] rounded-full opacity-60 blur-sm hidden md:block"></div>
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl shadow-lg -z-10 hero-main-blur hidden md:block"></div>
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
                  className="w-full sm:w-auto group border-[1.5px] border-[#e6c17836] hover:border-[#dbb66b] hover:scale-105 transition-transform bg-transparent hover:bg-transparent text-[#e6c178] hover:text-[#dbb66b]"
                >
                  Take a Quiz
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative animate-slide-up animation-delay-100 hidden md:block">
            <div className="grid grid-cols-2 gap-4 p-1 relative">
              {[
                { icon: Calculator, color: "text-[#2196F3]", title: "Mathematics", desc: "Numbers, shapes, and patterns" },
                { icon: FlaskConical, color: "text-[#4CAF50]", title: "Science", desc: "Explore the natural world" },
                { icon: BookOpen, color: "text-[#FF9800]", title: "Reading", desc: "Words, stories, and language" },
                { icon: Code, color: "text-[#9C27B0]", title: "Coding", desc: "Logic and problem-solving" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-transparent p-6 rounded-xl border-[1.5px] border-[#e6c17836] hover:border-[#dbb66b] transition-all hover:-translate-y-1"
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
      <style jsx global>{`
        .hero-glow-section {
          box-shadow: 0 0 80px 0 #ee4b2b44, 0 0 0 8px #05001f22;
          border-radius: 2.5rem;
          position: relative;
          /* Hide scrollbar for Chrome, Safari and Opera */
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .hero-animated-gradient {
          background: linear-gradient(120deg, rgba(255,82,82,0.08) 0%, rgba(255,152,0,0.08) 40%, rgba(76,175,80,0.08) 70%, rgba(33,150,243,0.08) 100%);
          animation: heroGradientMove 8s ease-in-out infinite alternate;
          border-radius: 2.5rem;
        }
        @keyframes heroGradientMove {
          0% { filter: blur(0px); opacity: 0.7; }
          50% { filter: blur(8px); opacity: 1; }
          100% { filter: blur(0px); opacity: 0.7; }
        }
        .hero-main-text-area {
          padding: 2.5rem 2rem 2.5rem 2.5rem;
          border-radius: 2rem;
          overflow: hidden;
        }
        .hero-main-blur {
          filter: blur(0.5px);
        }
        @media (max-width: 600px) {
          .opacity-50.w-\[1100px\].h-auto.mb-80 {
            margin-top: -140px !important;
            opacity: 0.8 !important;
          }
          .min-h-\[700px\] {
            min-height: 480px !important;
          }
          .max-h-\[750px\] {
            max-height: 600px !important;
          }
          .container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          h1 {
            font-size: 2rem !important;
            line-height: 2.5rem !important;
          }
          .hero-main-text-area {
            padding: 1.2rem 0.5rem 1.2rem 0.5rem;
            border-radius: 1.2rem;
          }
        }
      `}</style>
    </div>
  )
}