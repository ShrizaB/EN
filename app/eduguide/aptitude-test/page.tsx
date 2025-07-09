"use client"

import Link from "next/link"
import { Calculator, Brain, Newspaper } from "lucide-react"
import { useEffect, useState } from "react"
import './aptitude-test.css'

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

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="cyber-bg" style={{
      '--mouse-x': `${mousePosition.x}px`,
      '--mouse-y': `${mousePosition.y}px`,
      '--scroll-y': `${scrollPosition}px`
    } as React.CSSProperties}>
      <div className="cyber-grid"></div>
      <div className="cyber-glow"></div>
      <div className="cyber-scanlines"></div>
      <div className="cyber-particles"></div>
      <div className="cyber-circuit"></div>
      <div className="cyber-matrix"></div>
      <div className="cyber-corner-lines"></div>
    </div>
  )
}

const CyberCard = ({ href, icon: Icon, title, description, stats, accentColor }: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  stats: string
  accentColor: string
}) => {
  return (
    <Link href={href} className="cyber-card-wrapper">
      <div className="cyber-card" style={{ '--accent-color': accentColor } as React.CSSProperties}>
        <div className="card-border"></div>
        <div className="card-content">
          <div className="card-icon">
            <Icon className="icon" />
            <div className="icon-hover-glow"></div>
          </div>
          <h3 className="glitch-text" data-text={title}>
            <span>{title}</span>
          </h3>
          <p>{description}</p>
          <div className="card-footer">
            <span>{stats}</span>
          </div>
        </div>
        <div className="card-hover-effect"></div>
        <div className="card-corner card-corner-tl"></div>
        <div className="card-corner card-corner-tr"></div>
        <div className="card-corner card-corner-bl"></div>
        <div className="card-corner card-corner-br"></div>
      </div>
    </Link>
  )
}

const FeatureItem = ({ index, title, description }: { index: number, title: string, description: string }) => {
  return (
    <div className="cyber-feature">
      <div className="feature-index">{index}</div>
      <div className="feature-content">
        <h4 className="glitch-text font-mono" data-text={title}>
          <span>{title}</span>
        </h4>
        <p className="font-sans">{description}</p>
      </div>
      <div className="feature-line"></div>
      <div className="feature-corner feature-corner-tl"></div>
      <div className="feature-corner feature-corner-tr"></div>
    </div>
  )
}

export default function AptitudeTestPage() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    document.documentElement.classList.add('cyber-theme')
    return () => document.documentElement.classList.remove('cyber-theme')
  }, [])

  return (
    <div className="aptitude-test-page">
      <CyberGridBackground />
      
      <main className="cyber-container">
        <div className={`cyber-header ${loaded ? 'loaded' : ''}`}>
          <h1 className="cyber-title glitch-text" data-text="Aptitude Test Preparation">
            <span>Aptitude Test Preparation</span>
          </h1>
          <p className="cyber-subtitle">
            Master aptitude concepts with interactive lessons and practice with mock tests designed like competitive exams.
          </p>
        </div>

        <div className={`cyber-cards ${loaded ? 'loaded' : ''}`}>
          <CyberCard
            href="/eduguide/aptitude-test/maths"
            icon={Calculator}
            title="Mathematics"
            description="Master mathematical concepts essential for competitive exams including time and distance, percentage, profit and loss, and more."
            stats="18 topics · Includes formulas and examples"
            accentColor="#00cc66"
          />
          
          <CyberCard
            href="/eduguide/aptitude-test/reasoning"
            icon={Brain}
            title="Reasoning"
            description="Develop logical reasoning skills with topics like clock problems, blood relations, coding-decoding, and more."
            stats="21 topics · Includes strategies and examples"
            accentColor="#00aa44"
          />
          
          <CyberCard
            href="/eduguide/aptitude-test/current-affairs"
            icon={Newspaper}
            title="Current Affairs"
            description="Test your knowledge of recent events and developments with our regularly updated current affairs mock tests."
            stats="Direct mock tests · Updated regularly"
            accentColor="#00ff88"
          />
        </div>

        <div className={`cyber-features ${loaded ? 'loaded' : ''}`}>
          <h2 className="cyber-section-title glitch-text" data-text="Why Prepare with EduGuide?">
            <span>Why Prepare with EduGuide?</span>
          </h2>
          <div className="features-grid">
            <FeatureItem
              index={1}
              title="Comprehensive Content"
              description="Detailed explanations, formulas, and examples for each topic"
            />
            <FeatureItem
              index={2}
              title="Video Tutorials"
              description="Curated YouTube videos to help you understand concepts better"
            />
            <FeatureItem
              index={3}
              title="Exam-like Mock Tests"
              description="Practice with 20-question tests designed like competitive exams"
            />
            <FeatureItem
              index={4}
              title="Performance Tracking"
              description="Monitor your progress and identify areas for improvement"
            />
          </div>
        </div>

        <div className={`cyber-cta ${loaded ? 'loaded' : ''}`}>
          <Link href="/eduguide/aptitude-test/start" className="cyber-button">
            <span>Start Learning Now</span>
            <div className="button-border"></div>
            <div className="button-glow"></div>
          </Link>
        </div>
      </main>
    </div>
  )
}