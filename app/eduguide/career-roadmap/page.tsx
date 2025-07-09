"use client"

import { CareerRoadmapForm } from "@/components/career/career-roadmap-form"
import "./career-roadmap.css"

export default function CareerRoadmapPage() {
  return (
    <main className="relative min-h-screen text-gray-200 overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <div className="cyber-bg"></div>
        <div className="cyber-grid"></div>
        <div className="fractured-glass"></div>
        <div className="absolute inset-0 border border-cyan-900/20 rounded-xl pointer-events-none animate-border-glow" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-grow container max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-['Orbitron'] font-extrabold tracking-wider animate-title-glow text-cyan-400/90">
              Career Roadmap
            </h1>
            <p className="mt-6 text-lg md:text-xl text-cyan-100/60 max-w-3xl mx-auto animate-fade-in">
              Discover your ideal career path with personalized guidance and insights tailored to your preferences.
            </p>
          </div>

          <div className="glass-container p-6 md:p-8 rounded-sm border border-cyan-900/30 shadow-xl animate-fade-in-up mb-16">
            <CareerRoadmapForm />
          </div>
        </div>
      </div>
    </main>
  )
}