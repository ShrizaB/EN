"use client"

import type React from "react"
import Link from "next/link"
import "./reasoning.css"
import { useEffect, useState } from "react"

// Enhanced CyberGridBackground with hacker animations
const CyberGridBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className="cyber-bg"
      style={{
        "--mouse-x": `${mousePosition.x}px`,
        "--mouse-y": `${mousePosition.y}px`,
        "--scroll-y": `${scrollPosition}px`,
      } as React.CSSProperties}
    >
      <div className="cyber-grid"></div>
      <div className="cyber-glow"></div>
      <div className="cyber-scanlines"></div>
      <div className="cyber-particles"></div>
      <div className="cyber-circuit"></div>
      <div className="cyber-matrix"></div>
      <div className="cyber-corner-lines"></div>
      <div className="hacker-matrix"></div>
    </div>
  )
}

const CyberCard = ({
  href,
  title,
  description,
  accentColor,
}: {
  href: string
  title: string
  description: string
  accentColor: string
}) => {
  return (
    <Link href={href} className="cyber-card">
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-hover-effect" style={{ backgroundColor: accentColor }}></div>
      </div>
      <div className="card-binary-rain"></div>
    </Link>
  )
}

const reasoningTopics = [
  { id: "clock", name: "Clock", desc: "Master time and clock problems with easy tricks." },
  { id: "blood-relation", name: "Blood Relation", desc: "Solve complex family tree puzzles." },
  { id: "coding-decoding", name: "Coding Decoding", desc: "Learn patterns in coding problems." },
  { id: "math-operations", name: "Math Operations", desc: "Essential math operations for reasoning." },
  { id: "calendar", name: "Calendar", desc: "Solve calendar and date problems." },
  { id: "jumbling", name: "Jumbling", desc: "Master word and letter arrangements." },
  { id: "analogy", name: "Analogy", desc: "Find relationships between pairs of words." },
  { id: "odd-one-out", name: "Odd One Out", desc: "Identify the different element in a group." },
  { id: "direction-sense", name: "Direction Sense", desc: "Solve direction and distance problems." },
  { id: "number-series", name: "Number Series", desc: "Find patterns in number sequences." },
  { id: "alphabet-series", name: "Alphabet Series", desc: "Master alphabetical order problems." },
  { id: "ranking-test", name: "Ranking Test", desc: "Solve ranking and ordering problems." },
  { id: "puzzle-test", name: "Puzzle Test", desc: "Logical puzzles and brain teasers." },
  { id: "assumptions", name: "Assumptions", desc: "Identify implicit assumptions in statements." },
  { id: "conclusion", name: "Conclusion", desc: "Draw logical conclusions from statements." },
  { id: "arguments", name: "Arguments", desc: "Analyze and evaluate arguments." },
  { id: "course-of-action", name: "Course of Action", desc: "Determine the best course of action." },
  { id: "cause-and-effect", name: "Cause and Effect", desc: "Identify cause-effect relationships." },
  { id: "syllogism", name: "Syllogism", desc: "Master logical reasoning with syllogisms." },
  { id: "matrix", name: "Matrix", desc: "Solve matrix-based reasoning problems." },
  { id: "cube-and-cuboid", name: "Cube and Cuboid", desc: "3D visualization and problems." },
  { id: "dice", name: "Dice", desc: "Solve dice-based reasoning problems." },
  { id: "decision-making", name: "Decision Making", desc: "Make optimal decisions based on data." },
  { id: "non-verbal", name: "Non Verbal", desc: "Visual and spatial reasoning problems." },
]

export default function ReasoningTopicsPage() {
  return (
    <div className="aptitude-test-page">
      <CyberGridBackground />
      <main className="main-content">
        <div className="container">
          <div className="header-section">
            <h1 className="main-title glitch-text" data-text="Reasoning Topics">
              <span className="text-[60px]">Reasoning Topics</span>
            </h1>
            <p className="main-description">
              Develop your logical reasoning skills with these essential topics for competitive exams. Each topic includes
              strategies, examples, and a mock test.
            </p>
          </div>

          <div className="cyber-card-grid">
            {reasoningTopics.map((topic, idx) => (
              <CyberCard
                key={topic.id}
                href={`/eduguide/aptitude-test/reasoning/${topic.id}`}
                title={topic.name}
                description={topic.desc}
                accentColor="#00ff88"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}