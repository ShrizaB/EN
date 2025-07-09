"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Zap,
  Shield,
  Target,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"

// Mock interfaces and data for demonstration
interface MockTestQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface MockTestProps {
  topic: string
  subject: string
  questions: MockTestQuestion[]
  onFinish: () => void
  onBack: () => void
}

// Sample questions for demo
const sampleQuestions: MockTestQuestion[] = [
  {
    id: 1,
    question: "What is the time complexity of binary search algorithm?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation:
      "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
  },
  {
    id: 2,
    question: "Which data structure uses LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    explanation: "Stack follows LIFO principle where the last element added is the first one to be removed.",
  },
  {
    id: 3,
    question: "What is the maximum number of nodes in a binary tree of height h?",
    options: ["2^h", "2^h - 1", "2^(h+1) - 1", "2^(h-1)"],
    correctAnswer: 2,
    explanation: "A complete binary tree of height h has 2^(h+1) - 1 nodes maximum.",
  },
]

// Matrix Rain Component
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?"
    const fontSize = 14
    const columns = canvas.width / fontSize

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    function draw() {
      if (!ctx || !canvas) return

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#00a86b"
      ctx.font = fontSize + "px monospace"

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)
    return () => clearInterval(interval)
  }, [])

  return <canvas ref={canvasRef} className="matrix-canvas" />
}

// Floating Particles Component
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 0, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(0, 255, 0, ${0.1 * (1 - distance / 100)})`
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

function MockTest({ topic, subject, questions, onFinish, onBack }: MockTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [isReviewing, setIsReviewing] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(20 * 60) // 20 minutes in seconds
  const [testCompleted, setTestCompleted] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (testCompleted) return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          submitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testCompleted])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (optionIndex: number) => {
    if (testCompleted) return
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = optionIndex
    setUserAnswers(newAnswers)
  }

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const submitTest = async () => {
    setTestCompleted(true)
    setIsReviewing(true)
  }

  // Calculate progress
  const answeredCount = userAnswers.filter((answer) => answer !== null).length
  const progress = (answeredCount / questions.length) * 100

  // Get current question
  const currentQuestion = questions[currentQuestionIndex] || {
    id: 0,
    question: "Loading...",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  }

  // Calculate score if test is completed
  const correctAnswers = testCompleted
    ? userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length
    : 0
  const scorePercentage = testCompleted ? Math.round((correctAnswers / questions.length) * 100) : 0

  return (
    <div className="cyber-test-container mt-16">
      {/* Animated Background */}
      <div className="cyber-bg">
        <MatrixRain />
        <FloatingParticles />
        <div className="cyber-grid"></div>
        <div className="cyber-glow"></div>
        <div className="cyber-scanlines"></div>
        <div className="circuit-overlay"></div>
      </div>

      <div className={`cyber-main-wrapper ${isFullScreen ? "fullscreen" : ""}`}>
        <div className="cyber-test-panel">
          {/* Header */}
          <div className="cyber-header">
            <div className="header-content">
              {!testCompleted ? (
                <>
                  {!isFullScreen && (
                    <Button variant="ghost" size="sm" onClick={onBack} className="cyber-back-btn">
                      <ArrowLeft className="h-4 w-4" />
                      <span>BACK</span>
                    </Button>
                  )}
                  <div className="header-stats">
                    <div className="timer-display">
                      <Clock className={`timer-icon ${timeRemaining < 300 ? "critical" : ""}`} />
                      <span className={`timer-text ${timeRemaining < 300 ? "critical" : ""}`}>
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                    <div className="progress-display">
                      <Target className="progress-icon" />
                      <span className="progress-text">
                        <span className="answered-count">{answeredCount}</span>
                        <span className="total-count">/{questions.length}</span>
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={toggleFullScreen} className="cyber-fullscreen-btn">
                      {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      <span>{isFullScreen ? "" : ""}</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="results-header">
                  <div className="results-title">
                    <Shield className="results-icon" />
                    <span>TEST RESULTS: {topic.toUpperCase()}</span>
                  </div>
                  <div className="results-actions">
                    <Button variant="ghost" size="sm" onClick={toggleFullScreen} className="cyber-fullscreen-btn">
                      {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      <span>{isFullScreen ? "" : ""}</span>
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={onFinish} 
                      className="cyber-finish-btn"
                      style={{
                        background: 'transparent',
                        border: '1px solid #00a86b',
                        color: '#00ff88',
                        textShadow: '0 0 8px rgba(0, 230, 85, 0.5)'
                      }}
                    >
                      COMPLETE
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="cyber-content-wrapper">
            {/* Sidebar */}
            <div className="cyber-sidebar">
              <div className="sidebar-content">
                <div className="navigator-section">
                  <h3 className="navigator-title">
                    <Target className="navigator-icon" />
                    QUESTION NAVIGATOR
                  </h3>
                  <div className="progress-bar-wrapper">
                    <div className="cyber-progress-container">
                      <div 
                        className="cyber-progress-fill" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {answeredCount} OF {questions.length} COMPLETED
                    </div>
                  </div>
                </div>

                <div className="question-grid">
                  {questions.map((_, index) => {
                    const isAnswered = userAnswers[index] !== null
                    const isCorrect = testCompleted && userAnswers[index] === questions[index].correctAnswer
                    const isIncorrect = testCompleted && isAnswered && isCorrect !== null
                    const isCurrent = currentQuestionIndex === index

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={`question-nav-btn ${isCorrect ? "correct" : isIncorrect ? "incorrect" : isAnswered ? "answered" : "unanswered"
                          } ${isCurrent ? "current" : ""}`}
                        onClick={() => navigateToQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    )
                  })}
                </div>

                <div className="legend">
                  <div className="legend-item">
                    <div className="legend-indicator answered"></div>
                    <span>ANSWERED</span>
                  </div>
                  {testCompleted && (
                    <>
                      <div className="legend-item">
                        <div className="legend-indicator correct"></div>
                        <span>CORRECT</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-indicator incorrect"></div>
                        <span>INCORRECT</span>
                      </div>
                    </>
                  )}
                  <div className="legend-item">
                    <div className="legend-indicator current"></div>
                    <span>CURRENT</span>
                  </div>
                </div>

                {!testCompleted ? (
                  <Button 
                    onClick={submitTest} 
                    className="cyber-submit-btn"
                    style={{
                      background: 'transparent',
                      border: '1px solid #00a86b',
                      color: '#00ff88',
                      textShadow: '0 0 8px rgba(0, 230, 85, 0.5)'
                    }}
                  >
                    SUBMIT TEST
                  </Button>
                ) : (
                  <Card className="results-card flex flex-col items-center text-center">
                    <div className="results-header-card">
                      <Trophy className="trophy-icon" />
                      <h4>FINAL SCORE</h4>
                    </div>
                    <div className="score-display">
                      {correctAnswers}/{questions.length}
                    </div>
                    <div className="score-bar">
                      <div
                        className={`score-fill ${scorePercentage >= 80 ? "excellent" : scorePercentage >= 60 ? "good" : "needs-improvement"
                          }`}
                        style={{ width: `${scorePercentage}%` }}
                      ></div>
                      <div className="score-percentage">{scorePercentage}%</div>
                    </div>
                    <p className="score-message">
                      {scorePercentage >= 80
                        ? "EXCELLENT WORK!"
                        : scorePercentage >= 60
                          ? "GOOD JOB!"
                          : "KEEP PRACTICING!"}
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="cyber-main-content">
              <div className="question-section">
                <div className="question-header">
                  <h3 className="question-title">QUESTION {currentQuestionIndex + 1}</h3>
                  {testCompleted && userAnswers[currentQuestionIndex] !== null && (
                    <div
                      className={`answer-status ${userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? "correct" : "incorrect"
                        }`}
                    >
                      {userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? (
                        <>
                          <CheckCircle className="status-icon" />
                          <span>CORRECT</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="status-icon" />
                          <span>INCORRECT</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="question-text">{currentQuestion.question}</div>

                <div className="options-container">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = userAnswers[currentQuestionIndex] === index
                    const isCorrect = testCompleted && index === currentQuestion.correctAnswer
                    const isIncorrect = testCompleted && isSelected && !isCorrect

                    return (
                      <div
                        key={index}
                        className={`option-card ${isSelected ? "selected" : ""} ${isCorrect ? "correct" : isIncorrect ? "incorrect" : ""
                          }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <div
                          className={`option-indicator ${isSelected ? "selected" : ""} ${isCorrect ? "correct" : isIncorrect ? "incorrect" : ""
                            }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="option-text">{option}</span>
                      </div>
                    )
                  })}
                </div>

                {testCompleted && currentQuestion.explanation && (
                  <div
                    className={`explanation-card ${userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? "correct" : "incorrect"
                      }`}
                  >
                    <h4 className="explanation-title">EXPLANATION</h4>
                    <p className="explanation-text">{currentQuestion.explanation}</p>
                  </div>
                )}

                <div className="navigation-controls">
                  <Button
                    variant="outline"
                    onClick={() => navigateToQuestion(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="nav-btn prev"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>PREVIOUS</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigateToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="nav-btn next"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cyber-test-container {
          position: relative;
          min-height: 100vh;
          background: #000;
          color: #00a86b;
          font-family: 'Courier New', monospace;
          overflow: hidden;
        }

        .cyber-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
          background: radial-gradient(ellipse at center, rgba(0, 255, 0, 0.03) 0%, transparent 70%);
        }

        .matrix-canvas, .particle-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.1;
        }

        .cyber-grid {
          position: absolute;
          width: 120%;
          height: 120%;
          background-image: 
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-drift 30s linear infinite;
          transform: translate(-10%, -10%);
        }

        @keyframes grid-drift {
          0% { transform: translate(-10%, -10%); }
          100% { transform: translate(-60px, -60px); }
        }

        .cyber-glow {
          position: absolute;
          width: 1000px;
          height: 1000px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 255, 0, 0.05) 0%, transparent 70%);
          filter: blur(100px);
          animation: glow-pulse 4s ease-in-out infinite alternate;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes glow-pulse {
          0% { opacity: 0.3; }
          100% { opacity: 0.7; }
        }

        .cyber-scanlines {
          position: absolute;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0, 255, 0, 0.03),
            rgba(0, 255, 0, 0.03) 1px,
            transparent 1px,
            transparent 4px
          );
          animation: scanline-move 10s linear infinite;
        }

        @keyframes scanline-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(8px); }
        }

        .circuit-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 255, 0, 0.1) 0%, transparent 50%);
          opacity: 0.3;
          animation: circuit-pulse 8s infinite alternate;
        }

        @keyframes circuit-pulse {
          0% { opacity: 0.2; }
          100% { opacity: 0.4; }
        }

        .cyber-main-wrapper {
          position: relative;
          z-index: 1;
          padding: 20px;
          min-height: 100vh;
        }

        .cyber-main-wrapper.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 50;
          padding: 0;
        }

        .cyber-test-panel {
          background: rgba(0, 130, 77, 0.5);
          border: 2px solid #00b344;
          border-radius: 0;
          box-shadow: 
            0 0 20px rgba(26, 143, 143, 0.3),
            inset 0 0 20px rgba(26, 143, 143, 0.1);
          backdrop-filter: blur(10px);
          height: calc(100vh - 40px);
          position: relative;
          overflow: hidden;
        }

        .cyber-test-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00b344, transparent);
          animation: border-glow 3s infinite linear;
        }

        @keyframes border-glow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .cyber-header {
          background: rgba(0, 0, 0, 0.95);
          border-bottom: 1px solid #00824d;
          padding: 15px 20px;
          position: relative;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cyber-back-btn {
          background: transparent !important;
          border: 1px solid #00824d !important;
          color: #00824d !important;
          font-family: 'Courier New', monospace !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          padding: 8px 16px !important;
          transition: all 0.3s ease !important;
        }

        .cyber-back-btn:hover {
          background: rgba(0, 130, 77, 0.1) !important;
          box-shadow: 0 0 10px rgba(0, 130, 77, 0.5) !important;
          transform: translateX(-2px) !important;
        }

        .header-stats {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .timer-display, .progress-display {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.6);
          padding: 8px 12px;
          border: 1px solid #00824d;
          border-radius: 0;
        }

        .timer-icon, .progress-icon {
          width: 16px;
          height: 16px;
          color: #00824d;
        }

        .timer-icon.critical, .timer-text.critical {
          color: #ff4444 !important;
          animation: critical-blink 1s infinite;
        }

        @keyframes critical-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.5; }
        }

        .timer-text, .progress-text {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          color: #00a86b;
          font-size: 14px;
        }

        .answered-count {
          color: #00a86b;
          font-weight: bold;
        }

        .total-count {
          color: #888;
        }

        .cyber-fullscreen-btn {
          background: transparent !important;
          border: 1px solid #00824d !important;
          color: #00824d !important;
          font-family: 'Courier New', monospace !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          padding: 8px 12px !important;
          transition: all 0.3s ease !important;
        }

        .cyber-fullscreen-btn:hover {
          background: rgba(0, 130, 77, 0.1) !important;
          box-shadow: 0 0 10px rgba(0, 130, 77, 0.5) !important;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .results-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          color: #00a86b;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .results-icon {
          width: 20px;
          height: 20px;
          color: #00824d;
        }

        .results-actions {
          display: flex;
          gap: 10px;
        }

        .cyber-finish-btn {
          background: linear-gradient(45deg, #00824d, #005824) !important;
          border: none !important;
          color: #000 !important;
          font-family: 'Courier New', monospace !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          padding: 8px 16px !important;
          transition: all 0.3s ease !important;
        }

        .cyber-finish-btn:hover {
          box-shadow: 0 0 15px rgba(0, 130, 77, 0.5) !important;
          transform: translateY(-2px) !important;
        }

        .cyber-content-wrapper {
          display: flex;
          height: calc(100% - 70px);
        }

        .cyber-sidebar {
          width: 300px;
          background: rgba(0, 0, 0, 0.8);
          border-right: 1px solid #00824d;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .sidebar-content {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .navigator-section {
          margin-bottom: 20px;
        }

        .navigator-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          color: #00824d;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 12px;
          margin-bottom: 15px;
        }

        .navigator-icon {
          width: 16px;
          height: 16px;
        }

        .progress-bar-wrapper {
          margin-bottom: 15px;
        }

        .progress-bar-wrapper {
          width: 100%;
          margin: 10px 0;
        }

        .cyber-progress-container {
          width: 100%;
          height: 8px;
          background: rgba(10, 25, 20, 0.5);
          border: 1px solid #00a86b;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .cyber-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00a86b, #00824d);
          box-shadow: 0 0 8px rgba(0, 230, 85, 0.6);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .progress-text {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 5px;
        }

        .results-card {
          border: 1px solid var(--accent-secondary);
          border-radius: 8px;
          padding: 1.25rem;
          background: rgba(10, 20, 15, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          width: 90%;
          max-width: 400px;
          margin: 0.5rem auto 1rem;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .question-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-bottom: 20px;
        }

        .question-nav-btn {
          background: rgba(0, 0, 0, 0.6) !important;
          border: 1px solid #444 !important;
          color: #888 !important;
          font-family: 'Courier New', monospace !important;
          font-weight: bold !important;
          width: 40px !important;
          height: 40px !important;
          padding: 0 !important;
          transition: all 0.3s ease !important;
        }

        .question-nav-btn.answered {
          background: rgba(0, 130, 77, 0.2) !important;
          border-color: #00824d !important;
          color: #00824d !important;
        }

        .question-nav-btn.correct {
          background: rgba(0, 130, 77, 0.3) !important;
          border-color: #00824d !important;
          color: #00824d !important;
        }

        .question-nav-btn.incorrect {
          background: rgba(255, 68, 68, 0.3) !important;
          border-color: #ff4444 !important;
          color: #ff4444 !important;
        }

        .question-nav-btn.current {
          background: #00824d !important;
          color: #000 !important;
          box-shadow: 0 0 15px rgba(0, 130, 77, 0.5) !important;
          animation: current-pulse 2s infinite;
        }

        @keyframes current-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .question-nav-btn:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 0 10px rgba(0, 230, 85, 0.5) !important;
        }

        .legend {
          margin-bottom: 20px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .legend-indicator {
          width: 16px;
          height: 16px;
          border: 1px solid;
        }

        .legend-indicator.answered {
          background: rgba(0, 168, 107, 0.2);
          border-color: #00b344;
        }

        .legend-indicator.correct {
          background: rgba(0, 168, 107, 0.3);
          border-color: #00b344;
        }

        .legend-indicator.incorrect {
          background: rgba(255, 68, 68, 0.3);
          border-color: #ff4444;
        }

        .cyber-finish-btn {
          background: transparent !important;
          border: 1px solid #00a86b !important;
          color: #00ff88 !important;
          font-family: 'Courier New', monospace !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          padding: 8px 16px !important;
          transition: all 0.3s ease !important;
          text-shadow: 0 0 8px rgba(0, 230, 85, 0.5) !important;
          border-radius: 4px !important;
          /* Force override any purple colors */
          --background: transparent !important;
          --border: #00a86b !important;
          --color: #00ff88 !important;
          --shadow: 0 0 8px rgba(0, 230, 85, 0.5) !important;
        }

        .cyber-finish-btn:hover {
          background: rgba(0, 168, 107, 0.15) !important;
          box-shadow: 0 0 15px rgba(0, 230, 85, 0.3) !important;
          transform: translateY(-1px) !important;
        }
        
        .cyber-submit-btn {
          background: transparent !important;
          border: 1px solid #00a86b !important;
          color: #00ff88 !important;
          font-family: 'Courier New', monospace !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          padding: 10px 20px !important;
          transition: all 0.3s ease !important;
          width: 100%;
          margin-top: 15px;
          text-shadow: 0 0 8px rgba(0, 230, 85, 0.5) !important;
          border-radius: 4px !important;
          /* Force override any purple colors */
          --background: transparent !important;
          --border: #00a86b !important;
          --color: #00ff88 !important;
          --shadow: 0 0 8px rgba(0, 230, 85, 0.5) !important;
        }

        .cyber-submit-btn:hover {
          background: rgba(0, 168, 107, 0.15) !important;
          box-shadow: 0 0 15px rgba(0, 230, 85, 0.3) !important;
          transform: translateY(-1px) !important;
        }

        .cyber-main-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: rgba(0, 10, 0, 0.8);
        }

        .question-container {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          position: relative;
          height: calc(100vh - 100px);
        }

        .question-section {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .question-title {
          font-family: 'Courier New', monospace;
          font-size: 20px;
          font-weight: bold;
          color: #00a86b;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }

        .answer-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 14px;
        }

        .answer-status.correct {
          color: #00a86b;
        }

        .answer-status.incorrect {
          color: #ff4444;
        }

        .status-icon {
          width: 18px;
          height: 18px;
        }

        .question-text {
          background: rgba(0, 15, 0, 0.3);
          border: 1px solid #00a86b;
          border-left: 4px solid #00a86b;
          padding: 20px;
          margin-bottom: 25px;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          line-height: 1.6;
          color: #00ff88;
          box-shadow: 0 0 15px rgba(0, 168, 107, 0.2);
        }

        .options-container {
          margin-bottom: 25px;
        }

        .option-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(0, 15, 0, 0.2);
          border: 1px solid #333;
          padding: 15px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Courier New', monospace;
        }

        .option-card .question-option {
          background: rgba(15, 25, 20, 0.6);
          border: 1px solid #1a3a2f;
          color: #e0e0e0;
          padding: 10px 12px;
          margin: 6px 0;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .option-card:hover {
          border-color: #00b344;
          background: rgba(0, 40, 0, 0.8);
          transform: translateX(5px);
        }

        .option-card.selected, .option-card.correct {
          border-color: #00a86b;
          background: rgba(0, 40, 0, 0.4);
          box-shadow: 0 0 15px rgba(0, 168, 107, 0.3);
        }

        .option-card.correct {
          border-color: #00b344;
          background: rgba(0, 130, 77, 0.2);
        }

        .option-card.incorrect {
          border-color: #ff4444;
          background: rgba(255, 68, 68, 0.1);
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
        }

        .option-indicator {
          width: 32px;
          height: 32px;
          border: 1px solid #444;
          background: rgba(0, 50, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          color: #888;
          transition: all 0.3s ease;
        }

        .option-indicator.selected {
          background: #00a86b;
          color: #000;
          border-color: #00b344;
        }

        .option-indicator.correct {
          background: #00a86b;
          color: #000;
          border-color: #00b344;
        }

        .option-indicator.incorrect {
          background: #ff4444;
          color: #fff;
          border-color: #ff4444;
        }

        .option-text {
          color: #00a86b;
          font-size: 14px;
          line-height: 1.5;
        }

        .explanation-card {
          background: rgba(0, 40, 0, 0.6);
          border-left: 4px solid;
          padding: 20px;
          margin-bottom: 25px;
        }

        .explanation-card.correct {
          border-left-color: #00b344;
          background: rgba(0, 168, 107, 0.1);
        }

        .explanation-card.incorrect {
          border-left-color: #ff8800;
          background: rgba(255, 136, 0, 0.05);
        }

        .explanation-title {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          color: #00a86b;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 14px;
          margin: 0 0 10px 0;
        }

        .explanation-text {
          font-family: 'Courier New', monospace;
          color: #ccc;
          line-height: 1.6;
          margin: 0;
        }

        .navigation-controls {
          display: flex;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 20px;
        }

        .nav-btn {
          background: rgba(0, 40, 0, 0.6) !important;
          border: 1px solid #00b344 !important;
          color: #00b344 !important;
          font-family: 'Courier New', monospace !important;
          font-weight: bold !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          padding: 12px 20px !important;
          transition: all 0.3s ease !important;
        }

        .nav-btn:hover:not(:disabled) {
          background: rgba(0, 255, 0, 0.1) !important;
          box-shadow: 0 0 15px rgba(0, 230, 85, 0.5) !important;
          transform: translateY(-2px) !important;
        }

        .nav-btn:disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }

        .nav-btn.prev:hover:not(:disabled) {
          transform: translateX(-3px) translateY(-2px) !important;
        }

        .nav-btn.next:hover:not(:disabled) {
          transform: translateX(3px) translateY(-2px) !important;
        }

        .trophy-icon{
          color: #ffd700;
          font-size: 4rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 15px #ffd700);
          animation: float-trophy 3s ease-in-out infinite;
        }

        @keyframes float-trophy {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .results-card {
          border: 1px solid var(--accent-secondary);
          border-radius: 8px;
          padding: 1rem 1.25rem;
          background: rgba(10, 20, 15, 0.9);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          width: 90%;
          margin: 0.5rem auto 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .results-header-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 0.5rem;
          padding-top: 2rem;
        }
        
        .results-header-card h4 {
          font-family: var(--font-orbitron), sans-serif;
          font-size: 0.9rem;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0.1rem 0 0.3rem 0;
          text-shadow: 0 0 8px var(--accent-secondary);
        }

        .score-display {
          font-family: var(--font-orbitron), sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
          margin: 0.25rem 0;
          text-shadow: 0 0 10px var(--accent-primary);
        }

        .score-bar {
          width: 100%;
          height: 20px;
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--accent-secondary);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.6);
          margin: 0.75rem 0 0.5rem;
        }

        .score-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          position: relative;
        }

        .score-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, 
            rgba(255,255,255,0.1) 0%, 
            rgba(255,255,255,0.3) 50%, 
            rgba(255,255,255,0.1) 100%);
          animation: shine 2s infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .score-fill.excellent {
          background: linear-gradient(90deg, #00cc77, #00ff99);
          box-shadow: 0 0 10px 2px rgba(0, 255, 136, 0.5);
        }
        .score-fill.good {
          background: linear-gradient(90deg, #00a8e8, #00d4ff);
          box-shadow: 0 0 10px 2px rgba(0, 191, 255, 0.5);
        }
        .score-fill.needs-improvement {
          background: linear-gradient(90deg, #ff7b00, #ff9e00);
          box-shadow: 0 0 10px 2px rgba(255, 140, 0, 0.5);
        }

        .score-percentage {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-orbitron), sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: #050805;
          text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
          letter-spacing: 0.5px;
        }
        
        .score-message {
          font-family: var(--font-poppins), sans-serif;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0.5rem 0 0 0;
          text-align: center;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .cyber-sidebar {
            width: 250px;
          }
        }

        @media (max-width: 768px) {
          .cyber-content-wrapper {
            flex-direction: column;
          }
          
          .cyber-sidebar {
            width: 100%;
            height: auto;
            max-height: 300px;
          }
          
          .question-grid {
            grid-template-columns: repeat(8, 1fr);
          }
          
          .header-stats {
            flex-direction: column;
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .cyber-main-wrapper {
            padding: 10px;
          }
          
          .cyber-test-panel {
            height: calc(100vh - 20px);
          }
          
          .question-grid {
            grid-template-columns: repeat(6, 1fr);
          }
          
          .question-nav-btn {
            width: 35px !important;
            height: 35px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default MockTest;