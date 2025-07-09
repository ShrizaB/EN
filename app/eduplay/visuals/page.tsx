"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { FlaskConical, Atom, Microscope, ArrowRight } from "lucide-react"
import './thanos-theme.css'
import React from "react"

export default function VisualsPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stoneImages = [
    {
    src: "https://i.postimg.cc/3RdbvjxC/Space-Stone-VFX-Photoroom.png",
    shadowColor: "drop-shadow-[40px_40px_40px_#3462eb]",
    },
    {
    src: "https://i.postimg.cc/m2wNTzbb/Mind-Stone-VFX-Photoroom.png",
    shadowColor: "drop-shadow-[40px_40px_40px_#ebc934]",
    },
    {
    src: "https://i.postimg.cc/vBg3BQ00/Reality-Stone-VFX-Photoroom.png",
    shadowColor: "drop-shadow-[40px_40px_40px_#eb3434]",
    },
    {
    src: "https://i.postimg.cc/htDsm8Cz/Power-Stone-VFX-Photoroom.png",
    shadowColor: "drop-shadow-[40px_40px_40px_#a426de]",
    },
    {
    src: "https://i.postimg.cc/8cTJY4fL/Time-Stone-VFX-Photoroom.png",
    shadowColor: "drop-shadow-[40px_40px_40px_#26de69]",
    },
    {
    src: "https://i.postimg.cc/BnR8341S/Soul-Stone-VFX-Photoroom.png",
    shadowColor: "drop-shadow-[40px_40px_40px_#de7c26]",
    },
  ]

  const subjects = [
    {
      id: "chemistry",
      title: "Chemistry",
      description: "Command the primal forces of molecular creation",
      icon: FlaskConical,
      color: "text-purple-400",
      bgColor: "bg-[#0D0D0D]/95",
      borderColor: "border-purple-950",
      hoverColor: "group-hover:text-purple-300",
      shadowColor: "shadow-purple-950/70",
      gradient: "from-purple-800 to-indigo-950",
      orbColor: "bg-green-700", // Time Stone
      topics: ["Atomic Synthesis", "Molecular Dominion", "Reaction Forge"],
    },
    {
      id: "physics",
      title: "Physics",
      description: "Master the cosmic laws that govern existence",
      icon: Atom,
      color: "text-indigo-400",
      bgColor: "bg-[#0D0D0D]/95",
      borderColor: "border-indigo-950",
      hoverColor: "group-hover:text-indigo-300",
      shadowColor: "shadow-indigo-950/70",
      gradient: "from-indigo-800 to-blue-950",
      orbColor: "bg-red-800", // Reality Stone
      topics: ["Gravitational Command", "Quantum Flux", "Energy Maelstrom"],
    },
    {
      id: "biology",
      title: "Biology",
      description: "Unveil the secrets of life across the multiverse",
      icon: Microscope,
      color: "text-yellow-400",
      bgColor: "bg-[#0D0D0D]/95",
      borderColor: "border-yellow-950",
      hoverColor: "group-hover:text-yellow-300",
      shadowColor: "shadow-yellow-950/70",
      gradient: "from-yellow-800 to-amber-950",
      orbColor: "bg-blue-700", // Space Stone
      topics: ["Cellular Sanctum", "Genetic Matrix", "Vital Continuum"],
    },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden thanos-container">

      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/FzxFJQRL/favpng-b05dfc090ede9a7954958e8e7c606d90.png"
              alt="Ultron 1"
              className="opacity-80 w-[300px] fixed top-16 left-10 h-auto drop-shadow-[0_0_40px_#8815fa30] scale-x-[-1]"
            />
          </div>
        </div>
      </div>

      {/* Hide default cursor and render a custom cursor image that follows the mouse */}
      <style>{`
        html, body, #__next, .thanos-container, * {
          cursor: none !important;
        }
      `}</style>
      {/* Custom cursor image */}
      <CustomCursor />

      <div className="infinity-orbit-container">
        {stoneImages.map((stone, index) => (
          <div key={index} className={`stone stone-${index + 1}`}>
            <div className={`stone-wrapper ${stone.shadowColor}`}>
              <img src={stone.src} alt={`Stone ${index + 1}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Cosmic Background */}
      <div className="cosmic-bg" />

      {/* Animated Particles */}
      <div className="fixed inset-0 overflow-hidden opacity-30">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-400 opacity-30"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-6">
            <h1 className="thanos-title">Infinity Visuals</h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-4 font-mono tracking-wide">
            Seize the power of the cosmos to unravel the universe's deepest truths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {subjects.map((subject) => {
            const stoneColor = {
              chemistry: 'bg-purple-600',
              physics: 'bg-red-600',
              biology: 'bg-green-600'
            }[subject.id] || 'bg-blue-600'

            return (
              <div
                key={subject.id}
                onMouseEnter={() => setHoveredCard(subject.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative"
              >
                <Link href={`/eduplay/visuals/${subject.id}`}>
                  <Card className="thanos-card h-full transition-all duration-500">
                    <div className="p-8 h-full flex flex-col">
                      <div className="flex items-center mb-6">
                        <div className={`stone-orb ${stoneColor}`} style={{
                          animation: `float ${6 + Math.random() * 3}s ease-in-out infinite`,
                          boxShadow: `0 0 15px ${stoneColor}, 0 0 30px ${stoneColor}`,
                        }}>
                          <subject.icon className="h-6 w-6 text-white z-10" />
                        </div>
                        <h2 className={`text-2xl font-bold text-thanos-one text-white bg-clip-text text-transparent`}>
                          {subject.title}
                        </h2>
                      </div>

                      <p className="text-gray-300 mb-6 flex-grow">{subject.description}</p>

                      <div className="space-y-4">
                        <h3 className="text-sm uppercase tracking-wider text-gray-400">Domains of Power:</h3>
                        <ul className="space-y-3">
                          {subject.topics.map((topic, index) => (
                            <li key={index} className="flex items-start">
                              <span
                                className={`w-2 h-2 rounded-full mt-2 mr-3 ${stoneColor} shadow-[0_0_8px]`}
                                style={{
                                  boxShadow: `0 0 8px ${stoneColor}`,
                                  animation: hoveredCard === subject.id ? 'pulse 2s infinite' : 'none'
                                }}
                              />
                              <span className="text-gray-300">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <button className="thanos-button px-6 py-3 w-full">
                          <div className="button-content">
                            <span>Explore {subject.title}</span>
                            <ArrowRight className="arrow-icon h-4 w-4 ml-2" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Custom cursor component
function CustomCursor() {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const lastPos = React.useRef({ x: 0, y: 0 });
  React.useEffect(() => {
    // Lower sensitivity: only update if mouse moved > 8px
    const move = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - lastPos.current.x);
      const dy = Math.abs(e.clientY - lastPos.current.y);
      if (dx > 9 || dy > 9) {
        setPos({ x: e.clientX, y: e.clientY });
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div 
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%) scaleX(-1) rotate(30deg)',
        width: '42px',
        height: '42px',
      }}
    >
      <img
        src="https://i.postimg.cc/661zZ4kY/Screenshot-2025-07-02-193914-Photoroom.png"
        alt="Thanos Cursor"
        className="w-full h-full object-contain md:visible invisible"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))',
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
        draggable={false}
      />
    </div>
  );
}