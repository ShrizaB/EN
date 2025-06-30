'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gamepad2, Trophy, Star, Clock, Brain, Palette, Zap, Crown, Waves } from "lucide-react"
import './aquaman-theme.css'
import { useEffect, useState } from 'react'
import React from 'react';

export default function GamesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsLoaded(true), 200);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const games = [
    {
      id: "math-asteroid-blaster",
      title: "Math Challenge",
      description: "Master numerical depths with oceanic calculations and underwater number adventures.",
      category: "Mathematics",
      skills: ["Addition", "Subtraction"],
      color: "dark-math",
      textColor: "text-purple-400",
      bgColor: "bg-purple-500/10",
      icon: Zap,
    },
    {
      id: "word-scramble-challenge",
      title: "Word Tides",
      description: "Navigate through linguistic currents and decode word mysteries from the deep.",
      category: "Language",
      skills: ["Spelling", "Vocabulary"],
      color: "dark-reading",
      textColor: "text-pink-400",
      bgColor: "bg-pink-500/10",
      icon: Crown,
    },
    {
      id: "memory-match",
      title: "Memory Currents",
      description: "Test your mental powers by matching patterns that flow like ocean waves.",
      category: "Memory",
      skills: ["Pattern Recognition", "Memory"],
      color: "dark-memory",
      textColor: "text-green-400",
      bgColor: "bg-green-500/10",
      icon: Brain,
    },
    {
      id: "art-studio",
      title: "Creative Depths",
      description: "Create stunning artwork inspired by the beauty of underwater realms.",
      category: "Art & Creativity",
      skills: ["Drawing", "Design"],
      color: "dark-art",
      textColor: "text-orange-400",
      bgColor: "bg-orange-500/10",
      icon: Palette,
    },
  ]

  return (
    <>
      {/* Global cursor hiding */}
      <style>{`
        body, body *, html, html * {
          cursor: none !important;
        }
      `}</style>
      
      {/* Custom Trident Cursor - Outside of main container */}
      <CustomCursor />

      {/* Enhanced Loading Screen */}
      {isLoading && (
        <div className="atlantis-loading">
          <div className="water-ripples">
            <div className="ripple"></div>
            <div className="ripple"></div>
            <div className="ripple"></div>
          </div>
          <div className="loading-trident">
            <div className="trident-icon">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="tridentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#00CED1" />
                    <stop offset="100%" stopColor="#FFD700" />
                  </linearGradient>
                </defs>
                <path d="M50 10 L40 25 L30 20 L25 35 L45 30 L50 40 L55 30 L75 35 L70 20 L60 25 Z M50 40 L50 90 M35 60 L50 55 L65 60 M30 75 L50 70 L70 75"
                  stroke="url(#tridentGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="50" cy="20" r="8" fill="url(#tridentGradient)" opacity="0.7" />
              </svg>
            </div>
            <div className="loading-title font-atlantis">OCEANIC GAMES</div>
            <div className="loading-subtitle font-trident">DIVE INTO LEARNING</div>
          </div>
        </div>
      )}

      <div className="atlantis-abyss relative overflow-hidden">

        {/* Deep Ocean Currents */}
        <div className="ocean-current current-1"></div>
        <div className="ocean-current current-2"></div>
        <div className="ocean-current current-3"></div>

        {/* Golden Wave Streams */}
        <div className="golden-wave-stream wave-stream-1"></div>
        <div className="golden-wave-stream wave-stream-2"></div>
        <div className="golden-wave-stream wave-stream-3"></div>
        <div className="golden-wave-stream wave-stream-4"></div>

        {/* Floating Kelp Forest */}
        <div className="floating-kelp kelp-1"></div>
        <div className="floating-kelp kelp-2"></div>
        <div className="floating-kelp kelp-3"></div>
        <div className="floating-kelp kelp-4"></div>
        <div className="floating-kelp kelp-5"></div>
        <div className="floating-kelp kelp-6"></div>

        {/* Shimmering Oceanic Particles */}
        <div className="oceanic-particles">
          <div className="shimmer-particle"></div>
          <div className="shimmer-particle"></div>
          <div className="shimmer-particle"></div>
          <div className="shimmer-particle"></div>
          <div className="shimmer-particle"></div>
          <div className="shimmer-particle"></div>
          <div className="shimmer-particle"></div>
          <div className="shimmer-particle"></div>
          <div className="shimmer-particle"></div>
          <div className="shimmer-particle"></div>
        </div>

        {/* Atlantis Bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="atlantis-bubble"></div>
          <div className="atlantis-bubble"></div>
          <div className="atlantis-bubble"></div>
          <div className="atlantis-bubble"></div>
          <div className="atlantis-bubble"></div>
        </div>

        {/* Ocean Debris */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="ocean-debris"></div>
          <div className="ocean-debris"></div>
          <div className="ocean-debris"></div>
          <div className="ocean-debris"></div>
          <div className="ocean-debris"></div>
        </div>

        <div className={`container py-20 md:py-32 relative z-10 transition-all duration-1500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          {/* Header */}
          <div className="relative mb-24 text-center">
            <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
              <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-900/30 via-cyan-900/20 to-yellow-900/30 border border-yellow-400/40 text-sm font-medium uppercase tracking-widest text-yellow-300 shadow-lg backdrop-blur-sm">
                <Crown className="h-4 w-4 mr-3 text-yellow-400" />
                <span>Oceanic Gaming Hub</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-b from-yellow-200 via-white to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
                GAMES
                <span className="block text-3xl md:text-4xl font-normal text-yellow-200/90 mt-4 drop-shadow-md">
                  Dive Into Interactive Learning
                </span>
              </h1>

              <p className="text-xl text-cyan-100/80 max-w-4xl leading-relaxed drop-shadow-sm">
                Explore the depths of knowledge with our immersive educational games.
                Navigate through <span className="text-yellow-300/90">challenging puzzles</span> and adventures that will enhance your skills
                in an <span className="text-yellow-300/90">ocean of learning possibilities</span>.
              </p>
            </div>
          </div>

          {/* Game Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {games.map((game, index) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className="trident-card">
                  {/* Atlantean Power Background */}
                  <div className={`absolute inset-0 ${game.color} opacity-20 group-hover:opacity-40 transition-opacity duration-700`}></div>

                  {/* Card Content Structure */}
                  <div className="card-content">
                    <div className="card-header">
                      {/* Icon and Category */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-lg ${game.bgColor} flex items-center justify-center border border-yellow-500/30 shadow-lg shadow-yellow-500/10`}>
                          <game.icon className={`w-6 h-6 ${game.textColor}`} />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-900/20 via-cyan-900/15 to-yellow-900/20 border border-yellow-500/40 text-xs font-medium text-yellow-300">
                          {game.category}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                        {game.title}
                      </h3>
                    </div>

                    <div className="card-body">
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {game.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {game.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-slate-800/60 text-slate-300 text-xs rounded border border-slate-600/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="flex items-center justify-end">
                        <div className="flex items-center text-sm font-medium text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span>Play Game</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Dashboard CTA - Ocean Lord */}
          <div className="mt-24 ocean-lord-cta rounded-2xl p-16 backdrop-blur-sm shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <Trophy className="h-7 w-7 text-yellow-400 drop-shadow-lg" />
                  <span className="text-yellow-300 text-lg uppercase tracking-widest font-bold drop-shadow-sm">
                    Chart Your Ocean Journey
                  </span>
                </div>

                <h3 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-200 via-cyan-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                  Navigate Your Progress
                </h3>

                <p className="text-cyan-100/90 text-xl leading-relaxed max-w-3xl drop-shadow-sm">
                  Track your voyage through the learning depths, discover your achievements,
                  and watch your skills flow like powerful ocean currents across all game categories.
                </p>
              </div>

              <div className="relative group">
                <Button
                  asChild
                  size="lg"
                  className="trident-button relative text-white rounded-xl px-10 py-6 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <Link href="/eduplay/dashboard" className="flex items-center gap-4">
                    <Crown className="h-6 w-6" />
                    <span>Explore Dashboard</span>
                    <ArrowRight className="h-6 w-6" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Custom Trident Cursor Component
function CustomCursor() {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  
  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 32,
        height: 32,
        transform: 'translate(-50%, -50%)', // Perfect centering
        pointerEvents: 'none',
        zIndex: 999999,
        userSelect: 'none',
        backgroundImage: 'url(/images/trident-cursor.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />
  );
}