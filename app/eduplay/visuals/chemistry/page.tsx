"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Atom, Zap, FlaskRoundIcon as Flask, ArrowRight } from "lucide-react"
import "./superman-theme.css"
import React from "react"

export default function ChemistryVisualsPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    // Initialize subtle background animations
    const stars = document.querySelectorAll<HTMLElement>('.star')
    stars.forEach(star => {
      const duration = Math.random() * 3 + 2
      star.style.animation = `twinkle ${duration}s infinite`
    })
  }, [])

  const topics = [
    {
      id: "atom-structure",
      title: "Atom Structure",
      description: "Explore the Bohr Model and atomic orbitals in a cosmic dance.",
      icon: Atom,
    },
    {
      id: "molecular-bonds",
      title: "Molecular Bonds",
      description: "Witness atomic bonds form with Superman-speed energy.",
      icon: Zap,
    },
    {
      id: "chemical-reactions",
      title: "Chemical Reactions",
      description: "Dive into 3D reaction simulations with Kryptonian flair.",
      icon: Flask,
    },
  ]

  // Add asteroid data
  const asteroids = [
    {
      id: 1,
      src: 'https://i.postimg.cc/pXPwk6kq/f2aa08ac-bfe1-4133-b008-9e364404e7a4-Photoroom.png',
      className: 'w-16 h-16 top-1/3 left-1/6',
      animation: 'float-1 8s ease-in-out infinite'
    },
    {
      id: 2,
      src: 'https://i.postimg.cc/pXPwk6kq/f2aa08ac-bfe1-4133-b008-9e364404e7a4-Photoroom.png',
      className: 'w-24 h-24 top-10 right-1/5',
      animation: 'float-2 10s ease-in-out infinite 2s'
    },
    {
      id: 3,
      src: 'https://i.postimg.cc/pXPwk6kq/f2aa08ac-bfe1-4133-b008-9e364404e7a4-Photoroom.png',
      className: 'w-20 h-20 bottom-1/4 right-1/4',
      animation: 'float-3 12s ease-in-out infinite 1s'
    },
    {
      id: 4,
      src: 'https://i.postimg.cc/pXPwk6kq/f2aa08ac-bfe1-4133-b008-9e364404e7a4-Photoroom.png',
      className: 'w-16 h-16 bottom-1/3 left-1/4',
      animation: 'float-1 9s ease-in-out infinite 0.5s'
    },
    {
      id: 5,
      src: 'https://i.postimg.cc/pXPwk6kq/f2aa08ac-bfe1-4133-b008-9e364404e7a4-Photoroom.png',
      className: 'w-16 h-16 bottom-1/2 right-1/4',
      animation: 'float-1 9s ease-in-out infinite 0.5s'
    },
    {
      id: 6,
      src: 'https://i.postimg.cc/pXPwk6kq/f2aa08ac-bfe1-4133-b008-9e364404e7a4-Photoroom.png',
      className: 'w-16 h-16 top-1/3 right-1/3',
      animation: 'float-1 9s ease-in-out infinite 0.5s'
    },
    {
      id: 7,
      src: 'https://i.postimg.cc/pXPwk6kq/f2aa08ac-bfe1-4133-b008-9e364404e7a4-Photoroom.png',
      className: 'w-16 h-16 bottom-1/4 left-1/2',
      animation: 'float-1 9s ease-in-out infinite 0.5s'
    },
  ];

  return (
    <div className="superman-dark-container relative overflow-hidden">
      {/* Floating Asteroids */}
      {asteroids.map((asteroid) => (
        <img
          key={asteroid.id}
          src={asteroid.src}
          alt="Asteroid"
          className={`asteroid ${asteroid.className}`}
          style={{
            animation: asteroid.animation,
          }}
        />
      ))}

      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/WpSMBjDJ/Superman-Flying-HD-PNG-Image-Transparent-photo-4-Free-Download-Photoroom.png"
              alt="Superman"
              className="opacity-90 w-[300px] fixed top-16 right-10 h-auto scale-x-[-1] drop-shadow-[0_0_40px_#001a4d] animate-glow"
            />
          </div>
        </div>
      </div>
      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/VL2xqkrP/pngimg-com-superman-logo-PNG8.png"
              alt="Superman"
              className="opacity-40 w-[300px] fixed top-16 left-10 h-auto scale-x-[-1] drop-shadow-[0_0_40px_#dc2626] animate-float"
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

      <div className="stars-background">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="star" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }} />
        ))}
      </div>
      <div className="superman-logo-overlay" />
      <div className="container px-4 py-16 mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-superman-yellow mb-4 tracking-tight animate-pulse-shadow font-krypton">
            Chemistry Visuals
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto font-krypton">
            Unleash the power of chemistry with Superman-inspired visualizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24">
          {topics.map((topic) => (
            <Link key={topic.id} href={`/eduplay/visuals/chemistry/${topic.id}`}>
              <Card
                onMouseEnter={() => setHoveredCard(topic.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`superman-card relative overflow-hidden transition-all duration-500 ${hoveredCard === topic.id ? "hovered" : ""
                  }`}
              >
                <div className="card-glow" />
                <div className="p-6 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="icon-wrapper animate-spin-slow">
                      <topic.icon className="h-8 w-8 text-superman-blue" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white font-krypton">
                      {topic.title}
                    </h2>
                  </div>
                  <p className="text-gray-300 text-sm">{topic.description}</p>
                  <div className="mt-6 flex items-center text-red-100 text-sm group">
                    Explore {topic.title}
                    <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
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
        transform: 'translate(-50%, -50%) scaleX(-1) rotate(15deg)',
        width: '32px',
        height: '32px',
      }}
    >
      <img
        src="https://i.postimg.cc/G3DPx9nd/Screenshot-2025-07-02-213834-Photoroom.png"
        alt="Superman Cursor"
        className="w-full h-full object-contain"
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