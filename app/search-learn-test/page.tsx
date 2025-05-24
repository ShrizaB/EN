"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Rocket, PawPrint, Brain, Cpu, Waves, TreePine, Search, BookOpen, TrendingUp } from "lucide-react"
import { TopicContentViewer } from "@/components/search-learn-test/topic-content-viewer"
import { TopicQuizTest } from "@/components/search-learn-test/topic-quiz-test"
import { useRouter } from "next/navigation"

// Batcave SFX
const rainSfx = "/sounds/raina.mp3"
const thunderSfx = "/sounds/thundera.mp3"

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

// Enhanced Bat-Signal Loader with more dramatic animations
function BatSignalLoader() {
  return (
    <div className="flex flex-col h-full w-full select-none">
      <div className="relative w-full max-w-md mx-auto">
        {/* Animated background for loader */}
        <div className="absolute inset-0 -z-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-xl"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, rgba(255,224,66,0.15) 0%, rgba(0,0,0,0) 70%)`,
                animation: `pulse ${3 + Math.random() * 2}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Main bat signal */}
        <svg width="240" height="240" viewBox="0 0 240 240" className="block mx-auto">
          {/* Outer glow rings */}
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="none"
            stroke="#ffe066"
            strokeWidth="0.5"
            opacity="0.2"
            className="animate-ping-slow"
          />
          <circle
            cx="120"
            cy="120"
            r="90"
            fill="none"
            stroke="#ffe066"
            strokeWidth="0.8"
            opacity="0.15"
            className="animate-ping-slower"
          />
          <circle
            cx="120"
            cy="120"
            r="70"
            fill="none"
            stroke="#ffe066"
            strokeWidth="1"
            opacity="0.1"
            className="animate-ping-slowest"
          />

          {/* Light cone */}
          <path
            d="M40,240 L120,40 L200,240 Z"
            fill="url(#beamGradient)"
            opacity="0.15"
            className="animate-pulse-slow"
          />

          {/* Ground reflection */}
          <ellipse cx="120" cy="200" rx="80" ry="15" fill="url(#groundGlow)" className="animate-pulse-slow" />

          {/* Main beam circle */}
          <circle
            cx="120"
            cy="120"
            r="60"
            fill="url(#innerBeam)"
            stroke="#ffe066"
            strokeWidth="1"
            opacity="0.2"
            className="animate-pulse"
          />

          {/* Batman symbol with enhanced glow */}
          <g className="animate-float-slow">
            <path
              d="M80 120 Q120 70 160 120 Q145 110 120 100 Q95 110 80 120 Z"
              fill="#000000"
              stroke="#ffe066"
              strokeWidth="2"
              filter="url(#superGlow)"
            />
            <path
              d="M100 110 Q120 90 140 110 Q130 105 120 102 Q110 105 100 110 Z"
              fill="#000000"
              stroke="#ffe066"
              strokeWidth="1"
            />
          </g>

          {/* Lightning effects around the signal */}
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="120"
              y1="120"
              x2={120 + 100 * Math.cos((i * Math.PI) / 4)}
              y2={120 + 100 * Math.sin((i * Math.PI) / 4)}
              stroke="#ffe066"
              strokeWidth="1"
              opacity="0"
              className="animate-lightning-flash"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}

          <defs>
            <radialGradient id="groundGlow" cx="50%" cy="30%">
              <stop offset="0%" stopColor="#ffe066" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffe066" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffe066" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ffe066" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffe066" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="innerBeam" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#ffe066" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#ffe066" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <filter id="superGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Animated sparks around the bat signal */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-spark"
            style={{
              left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 12)}%`,
              top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 12)}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="mt-8 text-yellow-300 font-mono text-xl tracking-widest animate-pulse uppercase text-center">
        Accessing Batcomputer
      </div>
      <div className="w-80 h-[3px] bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent mt-4 animate-pulse-slow rounded-full mx-auto" />
      
        {/* Binary code rain effect */}
      <div className="mt-6 text-yellow-400/60 font-mono text-xs opacity-60 animate-pulse text-center">
        01000010 01000001 01010100 01001101 01000001 01001110
      </div>

      {/* Security clearance text */}
      <div className="mt-6 font-mono text-sm text-yellow-400/80 text-center">
        <div className="flex items-center justify-center">
          <span className="inline-block w-3 h-3 bg-yellow-400/80 rounded-full mr-2 animate-pulse"></span>
          <span>SECURITY CLEARANCE: LEVEL ALPHA</span>
        </div>
        <div className="mt-2">ENCRYPTION PROTOCOL: WAYNE ENTERPRISES</div>
        <div className="mt-2 animate-pulse">ESTABLISHING SECURE CONNECTION...</div>
      </div>
    </div>
  )
}

// Gotham City skyline with more detail
function GothamSkyline() {
  return (
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
        {[...Array(80)].map((_, i) => (
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
  )
}

// Bat-Computer Terminal Interface
function BatComputerTerminal({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden border-2 border-yellow-500/20 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
      style={{
        background: "linear-gradient(to bottom, #0c0e14, #0a0c10)",
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.8)",
        zIndex: 1,
      }}
    >
      {/* Terminal header */}
      <div className="mt-10 bg-transparent border-b border-yellow-500/20 py-2 px-4 flex items-center justify-between relative">
        {/* Left: Dots */}
        <div className="flex items-center space-x-2 z-10">
          <div className="w-3 h-3 rounded-full bg-red-500/100"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/100"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/100"></div>
        </div>
        {/* Center: Version text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500/80 font-mono text-xs tracking-wider uppercase text-center pointer-events-none">
          WAYNE ENTERPRISES BATCOMPUTER v7.03
        </div>
        {/* Right: Security badge */}
        <div className="text-yellow-500/80 bg-yellow-400/10 px-3 py-1 border border-yellow-500/20 font-mono text-xs uppercase ml-4 z-10">
          security granted
        </div>
      </div>

      {/* Scan line effect */}

      <div
        className="fixed right-0 top-1/4 -translate-y-1/2 -z-10 bg-cover bg-center h-80 w-80 opacity-30"
        style={{
          backgroundImage: "url('https://i.postimg.cc/4NGd5nHR/ba17139b1a5984779c024bff38b57222.png')"
        }}
      />

      <div
        className="fixed left-0 top-1/2 -translate-y-1/2 -z-10 bg-cover bg-center h-80 w-80 opacity-30"
        style={{
          backgroundImage: "url('https://i.postimg.cc/fTLHpmLQ/6a0c67e2ae144a1ea2129eb599ea0ebe.png')"
        }}
      />
      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.7)",
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-0 h-full overflow-auto p-4">{children}</div>
    </div>
  )
}

// Component to inject global styles
const GlobalStyles = () => {
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
        33% { transform: translateY(-8px) scale(1.02) rotate(0.5deg); }
        66% { transform: translateY(-4px) scale(1.01) rotate(-0.3deg); }
      }
      @keyframes float-slow {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(1deg); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      @keyframes flicker {
        0%, 100% { opacity: 0.8; }
        25% { opacity: 1; }
        50% { opacity: 0.6; }
        75% { opacity: 0.9; }
      }
      @keyframes flicker-slow {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.9; }
      }
      @keyframes ping-slow {
        0% { transform: scale(1); opacity: 1; }
        75%, 100% { transform: scale(1.5); opacity: 0; }
      }
      @keyframes ping-slower {
        0% { transform: scale(1); opacity: 1; }
        75%, 100% { transform: scale(2); opacity: 0; }
      }
      @keyframes ping-slowest {
        0% { transform: scale(1); opacity: 1; }
        75%, 100% { transform: scale(2.5); opacity: 0; }
      }
      @keyframes spark {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
      }
      @keyframes batFly {
        0% { transform: translateX(-100px) translateY(0) scale(0.8); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateX(100vw) translateY(-20px) scale(1.2); opacity: 0; }
      }
      @keyframes lightning {
        0%, 100% { opacity: 0; transform: scaleY(0); }
        5%, 10% { opacity: 1; transform: scaleY(1); }
        15%, 25% { opacity: 0; transform: scaleY(0); }
        30%, 35% { opacity: 0.8; transform: scaleY(0.8); }
      }
      @keyframes lightning-flash {
        0%, 100% { opacity: 0; }
        5%, 10% { opacity: 0.8; }
        15% { opacity: 0; }
      }
      @keyframes matrixRain {
        0% { transform: translateY(-100vh); opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      @keyframes glow-pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(255,224,102,0.2), 0 0 40px rgba(255,224,102,0.1); }
        50% { box-shadow: 0 0 30px rgba(255,224,102,0.3), 0 0 60px rgba(255,224,102,0.2); }
      }
      @keyframes batSymbolFlash {
        0%, 100% { opacity: 0; }
        5%, 10% { opacity: 0.3; }
        15% { opacity: 0; }
        85% { opacity: 0; }
        90%, 95% { opacity: 0.2; }
      }
      @keyframes batSymbolMove {
        0% { transform: translateX(-20px) translateY(-10px) scale(0.9); }
        25% { transform: translateX(10px) translateY(5px) scale(1.1); }
        50% { transform: translateX(20px) translateY(-5px) scale(0.95); }
        75% { transform: translateX(-5px) translateY(10px) scale(1.05); }
        100% { transform: translateX(-20px) translateY(-10px) scale(0.9); }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      .animate-float-slow {
        animation: float-slow 8s ease-in-out infinite;
      }
      .animate-pulse-slow {
        animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      .animate-flicker {
        animation: flicker 2s ease-in-out infinite;
      }
      .animate-flicker-slow {
        animation: flicker-slow 4s ease-in-out infinite;
      }
      .animate-ping-slow {
        animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      .animate-ping-slower {
        animation: ping-slower 4s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      .animate-ping-slowest {
        animation: ping-slowest 5s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
      .animate-spark {
        animation: spark 2s ease-in-out infinite;
      }
      .animate-bat-fly {
        animation: batFly 15s linear infinite;
      }
      .animate-lightning {
        animation: lightning 3s ease-in-out infinite;
      }
      .animate-lightning-flash {
        animation: lightning-flash 3s ease-in-out infinite;
      }
      .animate-matrix-rain {
        animation: matrixRain 3s linear infinite;
      }
      .animate-glow-pulse {
        animation: glow-pulse 2s ease-in-out infinite;
      }
      .animate-bat-symbol-flash {
        animation: batSymbolFlash 20s ease-in-out infinite;
      }
      .animate-bat-symbol-move {
        animation: batSymbolMove 30s ease-in-out infinite;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(15px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .fade-in {
        animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      @keyframes modalFadeIn {
        from { opacity: 0; transform: translateY(30px) scale(0.9); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .modal-enter {
        animation: modalFadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      @keyframes shimmer {
        0% { background-position: -500px 0; }
        100% { background-position: 500px 0; }
      }
      .animate-noise {
        animation: noiseMove 20s linear infinite;
      }
      @keyframes noiseMove {
        0% { background-position: 0 0, 0 0; }
        100% { background-position: 150px 150px, 300px 300px; }
      }
      .shimmer {
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,224,102,0.05) 50%, rgba(255,255,255,0) 100%);
        background-size: 500px 100%;
        animation: shimmer 4s linear infinite;
      }
      .card-hover-effect {
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .card-hover-effect:hover {
        box-shadow: 0 20px 60px 0 rgba(0,0,0,0.4), 0 4px 16px 0 rgba(255,224,102,0.15);
        transform: translateY(-8px) scale(1.03) rotateX(2deg);
      }
      .mono-text {
        color: #f3f4f6;
        letter-spacing: 0.02em;
      }
      .glow-effect {
        position: relative;
      }
      .glow-effect::after {
        content: '';
        position: absolute;
        left: -2px;
        top: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: inherit;
        background: linear-gradient(45deg, #ffe066, #ffe066, #ffe066);
        background-size: 300% 300%;
        animation: gradientShift 3s ease infinite;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: -1;
      }
      .glow-effect:hover::after {
        opacity: 0.3;
      }
      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      .batman-cursor {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-0.26884658269448636 0 1174.157693165389 586.47' width='48' height='48'><filter id='glow'><feDropShadow dx='0' dy='0' stdDeviation='4' flood-color='%23FFD700'/></filter><path d='M1171.23 417.13a86.09 86.09 0 0 0-4.77-25.22C1051.72 67.43 876.4 0 876.4 0c.75 25.56-7.82 41.61-16.27 51.15a45 45 0 0 1-24.68 14l-157 32.36V40l-25.63 28.19a13 13 0 0 1-10.33 4.21l-55.68-3.28-55.68 3.28a12.94 12.94 0 0 1-10.33-4.21L495.13 40v57.5l-157-32.36a45 45 0 0 1-24.67-14c-8.46-9.53-17-25.58-16.25-51.14 0 0-175.31 67.43-290 391.91a85.76 85.76 0 0 0-4.77 25.22L0 478a33.47 33.47 0 0 0 5.36 19.51l3 4.55s24.93-48.46 157.18-72.45a21.93 21.93 0 0 1 18 4.87l30 25.38 21.32-32.44a18.46 18.46 0 0 1 10.62-7.71c20-5.38 78.85-18.7 106.68 2l234.65 164.76 234.66-164.81c27.83-20.65 86.67-7.33 106.68-2a18.49 18.49 0 0 1 10.62 7.71l21.31 32.44 30-25.38a21.92 21.92 0 0 1 18-4.87c132.26 24 157.18 72.45 157.18 72.45l3-4.55a33.47 33.47 0 0 0 5.36-19.51z' fill='none' stroke='%23FFD700' stroke-width='20' filter='url(%23glow)'/></svg>") 24 24, auto;
      }
      
      .batman-cursor-hover {
        cursor: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1174 586' width='48' height='48'%3e%3cfilter id='glow'%3e%3cfeDropShadow dx='0' dy='0' stdDeviation='3' flood-color='%23FFD700'/%3e%3c/filter%3e%3cpath d='M1150 390c-70-190-220-330-270-350 0 20-6 40-20 50l-130 30V50l-20 25-40-3-40 3-20-25v70l-130-30c-14-10-20-30-20-50-50 20-200 160-270 350l-25 60c40-30 100-50 140-40l35 30 20-30c20-10 70-20 100 0l180 130 180-130c30-20 80-10 100 0l20 30 35-30c40-10 100 10 140 40z' fill='none' stroke='%23FFD700' stroke-width='18' filter='url(%23glow)'/%3e%3c/svg%3e") 24 24, auto;
      }

      .bg-noise {
        background-image: radial-gradient(#ffe066 1px, transparent 1px), radial-gradient(#ffe066 1px, transparent 1px);
        background-size: 20px 20px;
        background-position: 0 0, 10px 10px;
        opacity: 0.05;
      }

@keyframes typing-and-deleting {
  0% {
    width: 0;
  }
  20% {
    width: 100%;
  }
  70% {
    width: 100%;
  }
  90% {
    width: 0;
  }
  100% {
    width: 0;
  }
}

@keyframes blink {
  0%, 100% {
    border-color: transparent;
  }
  50% {
    border-color: yellow;
  }
}

.batcomputer-heading {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #ffcc00;
  width: 0;
  animation: typing-and-deleting 9s steps(30, end) infinite,
  blink 0.7s step-end infinite;
  color: #ffcc00;
  font-family: monospace; 
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.25rem;
  letter-spacing: 0.05em;
}

.batcomputer-heading::after {
  content: '';
}

/* Loop every 13s (3s typing + 10s delay) */
@keyframes typingLoop {
  0% {
    width: 0;
  }
  23.08% {
    width: 100%;
  }
  100% {
    width: 100%;
  }
}
    `
    document.head.appendChild(styleElement)
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])
  return null
}

// How It Works Modal with Batman theme
function HowItWorksModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div
        className="bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-yellow-500/20 rounded-xl p-8 max-w-lg w-full shadow-2xl modal-enter relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 0 64px 8px rgba(255,224,102,0.15), 0 16px 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Background Batman logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <svg width="300" height="150" viewBox="0 0 60 30" className="animate-bat-symbol-move">
            <path
              d="M30 5 L25 10 L15 8 L20 15 L5 20 L20 25 L15 28 L25 26 L30 30 L35 26 L45 28 L40 25 L55 20 L40 15 L45 8 L35 10 Z"
              fill="#ffe066"
            />
          </svg>
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/10 animate-pulse-slow" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500/30 flex items-center justify-center mr-3 shadow-lg animate-pulse-slow">
              <svg width="24" height="12" viewBox="0 0 60 30" className="text-yellow-500">
                <path
                  d="M30 5 L25 10 L15 8 L20 15 L5 20 L20 25 L15 28 L25 26 L30 30 L35 26 L45 28 L40 25 L55 20 L40 15 L45 8 L35 10 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-yellow-500 font-mono tracking-wide uppercase">
              Batcomputer Protocol
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-500 transition-all duration-200 transform hover:scale-110 hover:rotate-90 p-2 rounded-full hover:bg-yellow-500/10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-6 relative z-10">
          {[
            {
              icon: <Search className="w-6 h-6 text-yellow-400 drop-shadow-lg" strokeWidth={2.2} />,
              title: "RECONNAISSANCE",
              text: "Enter any topic to initiate the Batcomputer's knowledge search protocol",
              color: "yellow",
            },
            {
              icon: <BookOpen className="w-6 h-6 text-yellow-400 drop-shadow-lg" strokeWidth={2.2} />,
              title: "ANALYSIS",
              text: "Review AI-generated intelligence reports on your selected topic",
              color: "yellow",
            },
            {
              icon: <Brain className="w-6 h-6 text-yellow-400 drop-shadow-lg" strokeWidth={2.2} />,
              title: "TRAINING",
              text: "Test your knowledge with the Batcomputer's tactical assessment",
              color: "yellow",
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-yellow-400 drop-shadow-lg" strokeWidth={2.2} />,
              title: "MASTERY",
              text: "Track progress and achieve complete mission success",
              color: "yellow",
            },
          ].map((step, i) => (
            <div key={i} className="flex items-start group">
              <div
                className={`flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500/30 flex items-center justify-center text-lg mr-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
              >
                {step.icon}
              </div>
              <div className="pt-1">
                <div className="text-sm text-yellow-500 font-mono mb-1 tracking-wider">{step.title}</div>
                <p className="text-gray-300 font-mono leading-relaxed text-sm">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-black hover:bg-black batman-cursor-hover text-yellow-500 font-mono font-bold transition-all duration-300 py-3 rounded-lg shadow-lg border-2 border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-yellow-500/20 transform hover:scale-105 uppercase tracking-wider"
        >
          Initiate Mission
        </Button>
      </div>
    </div>
  )
}

export default function SearchLearnTestPage() {
  // Audio refs for Batcave ambience
  const rainRef = React.useRef<HTMLAudioElement>(null)
  const thunderRef = React.useRef<HTMLAudioElement>(null)
  useEffect(() => {
    if (rainRef.current) rainRef.current.volume = 0.2
    if (thunderRef.current) thunderRef.current.volume = 0.15

    let thunderTimeout: NodeJS.Timeout | null = null
    const thunderAudio = thunderRef.current
    if (thunderAudio) {
      const handleEnded = () => {
        thunderTimeout = setTimeout(
          () => {
            thunderAudio.currentTime = 0
            thunderAudio.play()
          },
          8000 + Math.random() * 10000,
        ) // Random delay between thunder sounds
      }
      thunderAudio.addEventListener("ended", handleEnded)
      if (thunderAudio.ended) handleEnded()
      return () => {
        thunderAudio.removeEventListener("ended", handleEnded)
        if (thunderTimeout) clearTimeout(thunderTimeout)
      }
    }
  }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeStep, setActiveStep] = useState<"search" | "learn" | "test">("search")
  const [topicContent, setTopicContent] = useState("")
  const [topicQuestions, setTopicQuestions] = useState([])
  const [currentTopic, setCurrentTopic] = useState("")
  const [currentSubject, setCurrentSubject] = useState("")
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setCurrentTopic(searchQuery)

    try {
      const subjectResponse = await fetch("/api/search-learn-test/analyze-subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchQuery }),
      })
      if (!subjectResponse.ok) throw new Error("Failed to analyze subject")
      const subjectData = await subjectResponse.json()
      const subject = subjectData.subject
      setCurrentSubject(subject)

      const contentResponse = await fetch("/api/search-learn-test/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchQuery, subject }),
      })
      if (!contentResponse.ok) throw new Error("Failed to generate content")
      const contentData = await contentResponse.json()
      setTopicContent(contentData.content)

      const questionsResponse = await fetch("/api/search-learn-test/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: searchQuery, subject }),
      })
      if (!questionsResponse.ok) throw new Error("Failed to generate questions")
      const questionsData = await questionsResponse.json()
      setTopicQuestions(questionsData.questions)

      setActiveStep("learn")
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const startTest = () => setActiveStep("test")

  const resetSearch = () => {
    setSearchQuery("")
    setTopicContent("")
    setTopicQuestions([])
    setCurrentSubject("")
    setActiveStep("search")
  }

  interface Topic {
    name: string
    icon: React.ReactNode
    color: string
  }

  const popularTopics: Topic[] = [
    { name: "Dinosaurs", icon: <Sparkles className="h-4 w-4" />, color: "yellow" },
    { name: "Solar System", icon: <Rocket className="h-4 w-4" />, color: "yellow" },
    { name: "Animals", icon: <PawPrint className="h-4 w-4" />, color: "yellow" },
    { name: "Human Body", icon: <Brain className="h-4 w-4" />, color: "yellow" },
    { name: "Robots & AI", icon: <Cpu className="h-4 w-4" />, color: "yellow" },
    { name: "Oceans", icon: <Waves className="h-4 w-4" />, color: "yellow" },
    { name: "Plants & Trees", icon: <TreePine className="h-4 w-4" />, color: "yellow" },
  ]

  return (
    <>
      <GlobalStyles />
      <React.Fragment>
        <audio ref={rainRef} src={rainSfx} autoPlay loop style={{ display: "none" }} />
        <audio ref={thunderRef} src={thunderSfx} autoPlay style={{ display: "none" }} />
      </React.Fragment>
      <main className="min-h-screen bg-black text-gray-100 relative overflow-hidden font-mono flex justify-center items-center batman-cursor">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-b from-gray-900/80 via-black to-gray-900/80 overflow-hidden">
          {/* Animated storm clouds */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-800/30 to-transparent animate-pulse-slow" />

          {/* Lightning effects */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-gradient-to-b from-white via-yellow-300 to-transparent animate-lightning"
              style={{
                height: "200px",
                left: `${20 + i * 30}%`,
                top: "0",
                animationDelay: `${i * 2 + 5}s`,
                animationDuration: `${4 + i}s`,
                opacity: 0.5,
              }}
            />
          ))}

          {/* Batman logos flashing in background */}
          {[...Array(15)].map((_, i) => (
            <BatmanLogo
              key={i}
              className="text-yellow-500/10 animate-bat-symbol-flash"
              style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
                transform: `scale(${0.8 + Math.random() * 2.5}) rotate(${Math.random() * 40 - 20}deg)`,
                animationDelay: `${i * 1.5}s`,
                opacity: 0.1,
              }}
            />
          ))}

          {/* Flying Batman silhouettes */}
          {[...Array(5)].map((_, i) => (
            <BatmanLogo
              key={`flying-${i}`}
              className="text-gray-800/40 animate-bat-fly"
              style={{
                top: `${10 + i * 15}%`,
                animationDelay: `${i * 4}s`,
                animationDuration: `${12 + i * 2}s`,
              }}
            />
          ))}

          {/* Matrix-style digital rain */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-500/10 font-mono text-xs animate-matrix-rain"
              style={{
                left: `${i * 8}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {Array.from({ length: 20 }, (_, j) => (
                <div key={j} className="mb-1">
                  {Math.random() > 0.5 ? "1" : "0"}
                </div>
              ))}
            </div>
          ))}

          {/* Gotham City skyline */}
          <GothamSkyline />
        </div>

        {/* Main content container */}
        <div className="relative z-10 w-full max-w-5xl mx-auto h-[90vh] px-4">
          {/* Batcomputer frame */}
          <div
            className="relative w-full h-full rounded-xl overflow-hidden animate-glow-pulse"
            style={{
              boxShadow: "0 0 0 2px rgba(255,224,102,0.1), 0 0 30px rgba(0,0,0,0.8), 0 0 100px rgba(0,0,0,0.4)",
            }}
          >
            {/* Screen noise effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none z-20 bg-noise" />

            {/* Main content area */}
            <BatComputerTerminal>
              {isLoading ? (
                <BatSignalLoader />
              ) : activeStep === "search" ? (
                <div className="h-full w-full p-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-5">
                      <img src="/images/batman-tdk.svg" alt="batman-logo-tdk" className="w-12 h-12" />
                      <h2 className="batcomputer-heading text-xl font-bold text-yellow-500 font-mono tracking-wide uppercase">
                        Batcomputer Learning System
                      </h2>
                    </div>
                    <div className="text-xs text-yellow-500/70 font-mono flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                      ONLINE
                    </div>
                  </div>

                  {/* Enhanced search form */}
                  <form onSubmit={handleSearch} className="mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-yellow-500/10 rounded-lg blur-md"></div>
                      <div className="relative bg-gradient-to-r from-gray-900 to-black border-2 border-yellow-500/30 rounded-lg px-5 py-4 flex items-center gap-3 shadow-lg focus-within:border-yellow-500/60 transition-all duration-300">
                        <Input
                          type="text"
                          placeholder="Enter your learning quest..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent border-none text-yellow-100 placeholder:text-yellow-500/50 font-mono text-lg w-full focus:outline-none focus:ring-transparent focus:border-transparent tracking-wide batman-cursor-hover"
                          style={{
                            letterSpacing: "0.05em",
                            outline: "none",
                            boxShadow: "none",
                            borderColor: "transparent",
                          }}
                          disabled={isLoading}
                          aria-label="Search topics"
                        />
                        <Button
                          type="submit"
                          className="px-6 py-2 rounded-lg bg-black hover:bg-black batman-cursor-hover text-yellow-500 font-mono border-2 border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 shadow-lg transform hover:scale-105 uppercase tracking-wider font-bold"
                          disabled={isLoading}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                  </form>

                  {/* Popular topics section */}
                  <div className="mb-8">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-yellow-500/20"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <h3 className="px-6 py-2 text-sm font-mono tracking-widest bg-gradient-to-r from-gray-900 to-black text-yellow-500 uppercase border border-yellow-500/30 rounded-full shadow-lg">
                          Popular Learning Topics
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                      {popularTopics.map((topic, index) => (
                        <Button
                          key={topic.name}
                          variant="outline"
                          onClick={() => setSearchQuery(topic.name)}
                          className="group relative flex items-center gap-2 px-3 py-3 rounded-lg bg-gradient-to-br from-gray-900 to-black hover:from-yellow-900/20 hover:to-yellow-900/10 border border-yellow-500/20 hover:border-yellow-500/40 text-gray-300 hover:text-yellow-500 font-mono transition-all duration-300 hover:shadow-lg transform hover:scale-105 overflow-hidden batman-cursor-hover"
                          style={{
                            transitionDelay: `${index * 50}ms`,
                            animation: "fadeIn 0.5s ease-out forwards",
                            animationDelay: `${0.2 + index * 0.05}s`,
                          }}
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <div className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 text-yellow-500/70 group-hover:text-yellow-500">
                              {topic.icon}
                            </div>
                            <span className="text-sm tracking-wide">{topic.name}</span>
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* How it works button */}
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowHowItWorksModal(true)}
                      className="text-gray-300 hover:text-yellow-500 bg-transparent hover:bg-yellow-900/20 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group px-8 py-2 rounded-full font-mono tracking-wide shadow-lg transform hover:scale-105 batman-cursor-hover"
                    >
                      <span className="mr-2">How It Works</span>
                      <svg
                        className="w-4 h-4 inline-block transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              ) : activeStep === "learn" ? (
                <TopicContentViewer
                  topic={currentTopic}
                  content={topicContent}
                  subject={currentSubject}
                  onStartTest={startTest}
                  onBack={resetSearch}
                />
              ) : (
                <TopicQuizTest
                  topic={currentTopic}
                  questions={topicQuestions}
                  subject={currentSubject}
                  onFinish={() => router.push("/dashboard")}
                  onBack={() => setActiveStep("learn")}
                />
              )}
            </BatComputerTerminal>
          </div>
        </div>

        {/* How It Works Modal */}
        {showHowItWorksModal && <HowItWorksModal onClose={() => setShowHowItWorksModal(false)} />}
      </main>
    </>
  )
}
