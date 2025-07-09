"use client"

import type React from "react"

import Link from "next/link"
import "./aptitude-maths.css"
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
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
          "--scroll-y": `${scrollPosition}px`,
        } as React.CSSProperties
      }
    >
      <div className="cyber-grid"></div>
      <div className="cyber-glow"></div>
      <div className="cyber-scanlines"></div>
      <div className="cyber-particles"></div>
      <div className="cyber-circuit"></div>
      <div className="cyber-matrix"></div>
      <div className="cyber-corner-lines"></div>
      <div className="hacker-matrix"></div>
      <div className="data-stream"></div>
      <div className="terminal-glow"></div>
      <div className="cyber-hexagons"></div>
      <div className="neural-network"></div>
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
    <Link href={href} className="cyber-card-wrapper">
      <div className="cyber-card" style={{ "--accent-color": accentColor } as React.CSSProperties}>
        <div className="card-border"></div>
        <div className="card-content">
          <h3 className="glitch-text" data-text={title}>
            <span>{title}</span>
          </h3>
          <p>{description}</p>
        </div>
        <div className="card-hover-effect"></div>
        <div className="card-corner card-corner-tl"></div>
        <div className="card-corner card-corner-tr"></div>
        <div className="card-corner card-corner-bl"></div>
        <div className="card-corner card-corner-br"></div>
        <div className="card-data-flow"></div>
        <div className="card-binary-rain"></div>
      </div>
    </Link>
  )
}

const mathsTopics = [
  { id: "time-and-distance", name: "Time and Distance", desc: "Speed, distance, time formulas and tricks." },
  { id: "percentage", name: "Percentage", desc: "Learn percentage calculations and shortcuts." },
  { id: "profit-and-loss", name: "Profit and Loss", desc: "Understand basic profit/loss concepts." },
  { id: "ratio-and-proportion", name: "Ratio and Proportion", desc: "Master ratios, proportions, and their uses." },
  { id: "square-roots", name: "Square Roots", desc: "Calculate and estimate square roots quickly." },
  { id: "squares", name: "Squares", desc: "Squares of numbers and patterns." },
  { id: "cube-and-cube-root", name: "Cube and Cube Root", desc: "Cubes and cube roots explained." },
  { id: "multiplication", name: "Multiplication", desc: "Multiplication tricks and tables." },
  { id: "addition", name: "Addition", desc: "Addition methods and mental math." },
  { id: "simplifications", name: "Simplifications", desc: "Simplifying complex expressions." },
  { id: "decimal-fractions", name: "Decimal Fractions", desc: "Decimals and fractions made easy." },
  { id: "surds-and-indices", name: "Surds and Indices", desc: "Roots, powers, and indices." },
  { id: "time-and-work", name: "Time and Work", desc: "Work/time problems and formulas." },
  { id: "pipe-and-cistern", name: "Pipe and Cistern", desc: "Problems on pipes and tanks." },
  { id: "simple-interest", name: "Simple Interest", desc: "Simple interest calculations." },
  { id: "compound-interest", name: "Compound Interest", desc: "Compound interest concepts." },
  { id: "data-interpretation", name: "Data Interpretation", desc: "Practice data and graph questions." },
  { id: "data-sufficiency", name: "Data Sufficiency", desc: "Test your data sufficiency skills." },
  { id: "mensuration", name: "Mensuration", desc: "Area, perimeter, and volume formulas." },
]

export default function MathsTopicsPage() {
  return (
    <div className="aptitude-test-page">
      <CyberGridBackground />
      <main className="main-content">
        <div className="container">
          <div className="header-section">
            <h1 className="main-title glitch-text" data-text="Mathematics Topics">
              <span className="text-[45px]">Mathematics Topics</span>
            </h1>
            <p className="main-description">
              Master these essential mathematics topics for competitive exams. Each topic includes formulas, examples,
              and a mock test.
            </p>
          </div>

          <div className="cyber-card-grid">
            {mathsTopics.map((topic, idx) => (
              <CyberCard
                key={topic.id}
                href={`/eduguide/aptitude-test/maths/${topic.id}`}
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
