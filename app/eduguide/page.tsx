"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import './eduguide-home.css'

import { Button } from "@/components/ui/button"
import {
  BookOpen,
  MapPin,
  Users,
  ChevronRight,
  Brain,
  Rocket,
  BarChart4,
  Layers,
  Cpu,
  Code,
  Lock,
  Shield,
  Zap,
  LineChart,
  Briefcase,
  GraduationCap,
  Eye,
  Key,
  AlertTriangle,
  Network,

} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function EduGuidePage() {
  const [animationComplete, setAnimationComplete] = useState(false)
  const [terminalText, setTerminalText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headerRef = useRef(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Terminal text typing effect
  useEffect(() => {
    const text =
      "> INITIALIZING EDUGUIDE PROFESSIONAL SYSTEM...\n> LOADING CAREER MODULES...\n> LOADING APTITUDE TEST MODULES...\n> LOADING INTERVIEW SIMULATION...\n> ALL SYSTEMS OPERATIONAL. WELCOME."
    let currentIndex = 0
    let currentText = ""

    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex]
        setTerminalText(currentText)
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => {
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
    }
  }, [])

  // Matrix rain effect
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Matrix rain characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*()=+[]{};<>?/\\|"

    // Create drops
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height)
    }

    // Drawing function
    const draw = () => {
      // Add semi-transparent black rectangle on top of previous frame
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text color and font
      ctx.fillStyle = "#0f0"
      ctx.font = `${fontSize}px monospace`

      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        // Generate random character
        const char = chars[Math.floor(Math.random() * chars.length)]

        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        // Move drop down
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    // Animation loop
    const interval = setInterval(draw, 50)

    // Cleanup
    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Cyber grid effect
  useEffect(() => {
    if (!gridRef.current) return

    const createRandomSparks = () => {
      const gridCells = gridRef.current?.querySelectorAll("div") || []
      const randomCells = Array.from(gridCells)
        .sort(() => 0.5 - Math.random())
        .slice(0, 20)

      randomCells.forEach((cell) => {
        cell.classList.add("cyber-spark")
        setTimeout(
          () => {
            cell.classList.remove("cyber-spark")
          },
          500 + Math.random() * 1000,
        )
      })

      setTimeout(createRandomSparks, 1000 + Math.random() * 2000)
    }

    createRandomSparks()
  }, [animationComplete])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const services = [
    {
      title: "Aptitude Test",
      description: "Master aptitude topics and test your knowledge with competitive exam-style mock tests",
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-900/30",
      borderColor: "border-blue-500/20",
      gradientFrom: "from-blue-900/40",
      gradientTo: "to-purple-900/40",
      buttonGradientFrom: "from-blue-600",
      buttonGradientTo: "to-purple-600",
      buttonHoverFrom: "hover:from-blue-700",
      buttonHoverTo: "hover:to-purple-700",
      link: "/eduguide/aptitude-test",
      features: [
        "Mathematics topics with formulas",
        "Reasoning topics with examples",
        "Current affairs mock tests",
        "Competitive exam preparation",
      ],
      shadowColor: 'hover:shadow-[0_0_25px_5px_rgba(59,130,246,0.2)]',
    },
    {
      title: "Career Roadmap",
      description: "Explore career paths with step-by-step guidance to build skills, make smart choices, and reach your professional goals",
      icon: MapPin,
      color: "text-green-400",
      bgColor: "bg-green-900/30",
      borderColor: "border-green-500/20",
      gradientFrom: "from-green-900/40",
      gradientTo: "to-teal-900/40",
      buttonGradientFrom: "from-green-600",
      buttonGradientTo: "to-teal-600",
      buttonHoverFrom: "hover:from-green-700",
      buttonHoverTo: "hover:to-teal-700",
      link: "/eduguide/career-roadmap",
      features: [
        "Personalized career paths",
        "Industry-specific requirements",
        "Skill development resources",
        "Job market insights",
      ],
      shadowColor: 'hover:shadow-[0_0_25px_5px_rgba(74,222,128,0.2)]'
    },
    {
      title: "Give Interview",
      description: "Practice with mock interviews and get feedback to sharpen your interview skills and boost confidence.",
      icon: Users,
      color: "text-amber-400",
      bgColor: "bg-amber-900/30",
      borderColor: "border-amber-500/20",
      gradientFrom: "from-amber-900/40",
      gradientTo: "to-orange-900/40",
      buttonGradientFrom: "from-amber-600",
      buttonGradientTo: "to-orange-600",
      buttonHoverFrom: "hover:from-amber-700",
      buttonHoverTo: "hover:to-orange-700",
      link: "/interview",
      features: [
        "Technical interview questions",
        "Behavioral interview questions",
        "Personalized feedback",
        "Industry-specific preparation",
      ],
      shadowColor: 'hover:shadow-[0_0_25px_5px_rgba(251,191,36,0.2)]'
    },
  ]

  const features = [
    {
      title: "Skill Assessment",
      description: "Comprehensive aptitude tests to identify your strengths and areas for improvement.",
      icon: BarChart4,
      color: "text-green-500",
      bgColor: "bg-green-900/30",
    },
    {
      title: "Career Roadmaps",
      description: "Detailed career paths with step-by-step guidance to achieve your professional goals.",
      icon: Layers,
      color: "text-green-500",
      bgColor: "bg-green-900/30",
    },
    {
      title: "Interview Preparation",
      description: "Practice with simulated interviews and get personalized feedback to improve your skills.",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-900/30",
    },
  ]

  const generateRandomBinaryParticles = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      value: Math.random() > 0.5 ? "1" : "0",
      size: Math.random() * 10 + 8,
      x: Math.random() * 100,
      y: Math.random() * 100,
      animationDuration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }))
  }

  const binaryParticles = generateRandomBinaryParticles(50)

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Matrix rain background */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />

      {/* Cyber grid overlay */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(40,1fr)] opacity-10 pointer-events-none"
      >
        {Array.from({ length: 1600 }).map((_, i) => (
          <div
            key={i}
            className="border-[0.5px] border-green-500/20 transition-all duration-300"
            style={{
              opacity: Math.random() > 0.9 ? 0.5 : 0.1,
              backgroundColor: Math.random() > 0.97 ? "rgba(16, 185, 129, 0.2)" : "transparent",
            }}
          />
        ))}
      </div>

      {/* Binary particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {binaryParticles.map((particle) => (
          <div
            key={particle.id}
            className="binary-particle absolute font-mono text-green-500/30"
            style={{
              fontSize: `${particle.size}px`,
              top: `${particle.y}%`,
              left: `${particle.x}%`,
              animationDuration: `${particle.animationDuration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            {particle.value}
          </div>
        ))}
      </div>

      {/* Data streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`stream-${i}`}
            className="data-stream absolute h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"
            style={{
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-28 overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900">
          {/* Binary Rain Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={`binary-${i}`}
                className="absolute text-green-400/10 font-mono text-xs"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 100}px`,
                  animation: `binaryRain ${10 + Math.random() * 20}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed'
                }}
              >
                {Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join(' ')}
              </div>
            ))}
          </div>

          <div className="container px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Main Hero Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="relative inline-block mb-6">
                  <div className="absolute rounded-lg blur opacity-75 animate-pulse"></div>
                  <div className="relative px-4 py-2 bg-black rounded-[6px] leading-none flex items-center border border-green-400/20">
                    <span className="text-green-400 mr-2">
                      <Zap size={16} />
                    </span>
                    <span className="text-gray-300">Powered by EduNova</span>
                  </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-[linear-gradient(90deg,#86efac,#5eead4,#22d3ee)]">
                  EduGuide Professional
                </h1>

                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0">
                  Your AI-powered guide to career excellence. Master aptitude tests, explore career roadmaps, and ace interviews with our comprehensive platform.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-transparent hover:bg-green-500/20 border-green-400/20 border hover:scale-[1.02] rounded-[6px] hover:translate-y-[2px] duration-300 group"
                  >
                    <Link href="#services">
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 hover:scale-[1.02] hover:translate-y-[2px] group rounded-[6px]"
                  >
                    <Link href="/eduguide/career-roadmap">
                      <span className="flex items-center">
                        Explore Career Paths
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-all duration-300" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Interactive Terminal */}
              <div className="flex-1 max-w-2xl w-full">
                <div className="terminal-container bg-gray-900 rounded-xl overflow-hidden shadow-2xl shadow-green-500/10 ">
                  {/* Terminal Header */}
                  <div className="flex items-center px-4 py-3 bg-transparent rounded-t-xl">
                    <div className="flex space-x-2 mr-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-gray-400">terminal — zsh</div>
                  </div>

                  {/* Terminal Content */}
                  <div className="p-4 font-mono text-green-400 h-64 overflow-auto">
                    <TerminalTypingEffect />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden isolate bg-[#0e0e0e]">
          {/* Subtle animated gradient background */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-[#080808] animate-gradient-slow" />

          {/* Subtle grid/hex pattern */}
          <div className="absolute inset-0 z-0 opacity-5 bg-[url('/grid.svg')] bg-[length:120px_120px] bg-center pointer-events-none" />

          {/* Animated vertical lines */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 w-px h-full bg-white/5 animate-line-slide"
                style={{ left: `${(i + 1) * 8}%`, animationDelay: `${i * 0.8}s` }}
              />
            ))}
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-teal-400 to-cyan-400">
                Professional Services
              </h2>
              <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
                Tools to help you excel in aptitude tests, plan your career, and master interviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <div key={index} className="group relative transition-transform duration-300 hover:-translate-y-1.5">
                  <Card className="relative overflow-hidden border border-white/10 bg-[#080808] backdrop-blur-md rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:shadow-[0_6px_40px_rgba(34,197,94,0.2)]"> 
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg bg-transparent shadow-inner border ${service.borderColor}`}>
                          <service.icon className={`w-6 h-6  ${service.color}`} />
                        </div>
                        <CardTitle className={`text-xl font-bold ${service.color}`}>
                          {service.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-gray-400 text-sm">
                        {service.description}
                      </CardDescription>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${service.color.replace('text-', 'bg-')} animate-pulse`} />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="px-6 pb-6 pt-4">
                      <Button
                        asChild
                        className={`w-full transition-all duration-300 bg-transparent border border-green-400/20 hover:border-green-400/40 text-white hover:text-white/90 hover:scale-[1.02] hover:translate-y-[2px] hover:bg-transparent`}
                      >
                        <Link href={service.link}>
                          Get Started
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="py-24 bg-gray-950 border-t border-green-900/30 relative overflow-hidden isolate group/features">
          {/* Holographic Grid Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Quantum Dot Effect */}
            <div className="absolute inset-0">
              {[...Array(80)].map((_, i) => (
                <div
                  key={`quantum-${i}`}
                  className="absolute rounded-full bg-green-500/10"
                  style={{
                    width: `${Math.random() * 8 + 2}px`,
                    height: `${Math.random() * 8 + 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(16, 185, 129, 0.5)`,
                    animation: `pulse ${Math.random() * 6 + 4}s infinite alternate`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>

            {/* DNA Strand Animation */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" className="absolute inset-0">
                <path
                  d="M50,0 Q75,50 50,100 Q25,150 50,200 Q75,250 50,300 Q25,350 50,400"
                  stroke="url(#dnaGradient)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="5 3"
                  className="animate-dna-float"
                />
                <path
                  d="M70,0 Q45,50 70,100 Q95,150 70,200 Q45,250 70,300 Q95,350 70,400"
                  stroke="url(#dnaGradient)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="5 3"
                  className="animate-dna-float"
                  style={{ animationDelay: '0.5s' }}
                />
                <defs>
                  <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(16,185,129,0)" />
                    <stop offset="50%" stopColor="rgba(16,185,129,0.6)" />
                    <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Binary Matrix Rain */}
            <div className="absolute inset-0 opacity-5">
              {[...Array(30)].map((_, i) => (
                <div
                  key={`binary-${i}`}
                  className="absolute text-green-400/20 font-mono text-xs"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 100}px`,
                    animation: `matrixRain ${10 + Math.random() * 20}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed'
                  }}
                >
                  {Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join(' ')}
                </div>
              ))}
            </div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="relative inline-block">
                <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-[linear-gradient(90deg,#86efac,#5eead4,#22d3ee)] tracking-tight">
                  Advanced Career Tools
                </h2>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-0 group-hover/features:opacity-100 transition-opacity duration-500"></div>
                <p className="text-lg text-gray-400/90 max-w-2xl mx-auto mt-6 leading-relaxed">
                  Cutting-edge resources to give you the competitive edge in today's job market.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Code,
                  title: "Technical Skills",
                  description: "Master in-demand programming languages and frameworks",
                },
                { icon: Network, title: "Networking", description: "Build professional connections in your industry" },
                {
                  icon: Shield,
                  title: "Certifications",
                  description: "Prepare for industry-recognized certifications",
                },
                {
                  icon: LineChart,
                  title: "Market Trends",
                  description: "Stay updated with the latest industry trends",
                },
                {
                  icon: Briefcase,
                  title: "Resume Building",
                  description: "Create professional resumes that stand out",
                },
                {
                  icon: Lock,
                  title: "Cybersecurity",
                  description: "Learn essential security practices for your career",
                },
                {
                  icon: GraduationCap,
                  title: "Continuous Learning",
                  description: "Resources for lifelong professional development",
                },
                { icon: Brain, title: "AI Integration", description: "Learn how to leverage AI in your profession" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-b from-gray-900/80 to-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 transition-all duration-500 hover:border-green-400/40 hover:shadow-lg hover:shadow-green-500/10 group/card"
                >
                  {/* Card Hover Effect */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-green-900/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 border border-green-900/20 rounded-xl pointer-events-none"></div>
                  </div>

                  {/* Icon with Holographic Effect */}
                  <div className="relative w-12 h-12 rounded-lg bg-green-900/20 flex items-center justify-center mb-5 overflow-hidden">
                    <div className="absolute inset-0 bg-white/5"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/70 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                    <item.icon className="relative h-6 w-6 text-green-400 z-10 transition-transform duration-300 group-hover/card:scale-110" />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-green-300/90 group-hover/card:text-green-200 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400/90 leading-relaxed group-hover/card:text-gray-300 transition-colors duration-300">
                    {item.description}
                  </p>

                  {/* Animated Divider */}
                  <div className="mt-4 h-px w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/50 to-transparent group-hover/card:via-green-400 transition-all duration-500 w-0 group-hover/card:w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 relative overflow-hidden isolate bg-gradient-to-br from-gray-950/60 via-black to-black border-t border-b border-green-900/20">
          {/* Holographic Security Grid Background */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Animated Hexagonal Security Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" className="absolute inset-0">
                <pattern
                  id="hexagons"
                  width="80"
                  height="80"
                  patternUnits="userSpaceOnUse"
                  patternTransform="scale(1.5) rotate(0)"
                >
                  <path
                    d="M40 0L80 23.094L80 69.282L40 92.376L0 69.282L0 23.094z"
                    fill="none"
                    stroke="rgba(16,185,129,0.2)"
                    strokeWidth="1"
                    className="group-hover/security:stroke-green-400/30 transition-colors duration-1000"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#hexagons)" className="animate-hex-move" />
              </svg>
            </div>

            {/* Floating Security Particles */}
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute rounded-full bg-green-500/10"
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: `0 0 ${Math.random() * 8 + 4}px rgba(16, 185, 129, 0.3)`,
                    animation: `security-pulse ${Math.random() * 8 + 4}s infinite alternate`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>

            {/* Scanning Laser Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_65%,rgba(16,185,129,0.03)_95%,transparent_100%)] animate-scan opacity-0 group-hover/security:opacity-100 transition-opacity duration-1000"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center group/security">
              <div className="relative inline-block mb-8">
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-[linear-gradient(90deg,#86efac,#5eead4)] tracking-tight">
                  Secure Career Development Environment
                </h2>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-0 group-hover/security:opacity-100 transition-opacity duration-500"></div>
              </div>

              <p className="text-lg text-gray-400/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                Our platform employs advanced encryption and security protocols to ensure your career data and personal
                information remain protected at all times.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    icon: Shield,
                    text: "Data Encryption",
                    description: "End-to-end AES-256 encryption"
                  },
                  {
                    icon: Lock,
                    text: "Secure Access",
                    description: "Multi-factor authentication"
                  },
                  {
                    icon: Key,
                    text: "Privacy Controls",
                    description: "Granular permission settings"
                  },
                  {
                    icon: Eye,
                    text: "Transparent Policies",
                    description: "Regular security audits"
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="relative bg-gradient-to-b from-gray-900/50 to-gray-900/20 backdrop-blur-sm border border-gray-800 rounded-xl p-5 transition-all duration-500 hover:border-green-400/40 hover:shadow-lg hover:shadow-green-500/10 group/card"
                  >
                    {/* Card Hover Effect */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-green-900/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 border border-green-900/20 rounded-xl pointer-events-none"></div>
                    </div>

                    {/* Icon Container */}
                    <div className="relative w-12 h-12 rounded-lg bg-green-900/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      <div className="absolute inset-0 bg-white/5"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400/70 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                      <item.icon className="relative h-6 w-6 text-green-400 z-10 transition-transform duration-300 group-hover/card:scale-110" />
                    </div>

                    <h3 className="text-lg font-semibold mb-1 text-green-300/90 group-hover/card:text-green-200 transition-colors duration-300">
                      {item.text}
                    </h3>
                    <p className="text-sm text-gray-400/80 group-hover/card:text-gray-300 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Quantum Wave Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Animated Wave Grid */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" className="absolute inset-0">
                <pattern
                  id="waveGrid"
                  width="120"
                  height="120"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(15)"
                >
                  <path
                    d="M0,60 Q30,30 60,60 T120,60"
                    stroke="rgba(16,185,129,0.3)"
                    strokeWidth="1"
                    fill="none"
                    className="animate-wave-path"
                  />
                  <path
                    d="M0,0 Q30,30 60,0 T120,0"
                    stroke="rgba(16,185,129,0.3)"
                    strokeWidth="1"
                    fill="none"
                    className="animate-wave-path"
                    style={{ animationDelay: '0.5s' }}
                  />
                  <path
                    d="M0,120 Q30,90 60,120 T120,120"
                    stroke="rgba(16,185,129,0.3)"
                    strokeWidth="1"
                    fill="none"
                    className="animate-wave-path"
                    style={{ animationDelay: '1s' }}
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#waveGrid)" />
              </svg>
            </div>

            {/* Floating Quantum Particles */}
            <div className="absolute inset-0">
              {[...Array(40)].map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute rounded-full bg-green-500/10"
                  style={{
                    width: `${Math.random() * 8 + 4}px`,
                    height: `${Math.random() * 8 + 4}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: `0 0 ${Math.random() * 12 + 6}px rgba(16, 185, 129, 0.4)`,
                    animation: `quantum-float ${Math.random() * 15 + 10}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    filter: 'blur(1px)'
                  }}
                />
              ))}
            </div>

            {/* Pulsing Core Effect */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-green-900/10 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-1000 animate-pulse-slow"></div>
          </div>

          <div className="container px-4 md:px-6">
            <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-10 md:p-16 text-center overflow-hidden group/cta">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 border border-green-500/20 rounded-2xl pointer-events-none"></div>
                <div className="absolute inset-0 border-2 border-transparent rounded-2xl pointer-events-none animate-border-pulse"></div>
              </div>

              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-[linear-gradient(90deg,#86efac,#5eead4,#22d3ee)] tracking-tight">
                  Accelerate Your Professional Growth
                </h1>
                <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300/90 leading-relaxed">
                  Take the next step in your career journey with our advanced tools and resources.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="relative overflow-hidden bg-gradient-to-r from-green-500 to-teal-500 text-black hover:from-green-600 hover:to-teal-600 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-500 group/button"
                  >
                    <Link href="/eduguide/career-roadmap">
                      <span className="relative z-10 flex items-center">
                        Explore Career Paths
                        <Rocket className="ml-3 h-5 w-5 transition-transform duration-300 group-hover/button:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="relative overflow-hidden border-green-400 text-green-400 hover:bg-gray-900/50 hover:text-green-300 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-500 group/button2"
                  >
                    <Link href="/interview">
                      <span className="relative z-10 flex items-center">
                        Practice Interviews
                        <Users className="ml-3 h-5 w-5 transition-transform duration-300 group-hover/button2:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover/button2:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export const TerminalTypingEffect = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const terminalLines = [
    "> Initializing EduGuide...",
    "> Loading modules...",
    "> Analyzing trends...",
    "> System Activated",
    "> EduGuide is ready to help you with your career growth!",
  ];

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentLineIndex >= terminalLines.length) return;

    const line = terminalLines[currentLineIndex];
    let charIndex = 0;
    let startTime: number | null = null;
    const typingSpeed = Math.random() * 50 + 30;
    let animationFrameId: number;

    const type = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }
      const elapsedTime = currentTime - startTime;

      if (elapsedTime > typingSpeed) {
        if (charIndex <= line.length) {
          setCurrentText(line.substring(0, charIndex));
          charIndex++;
          startTime = currentTime;
        } else {
          setDisplayedLines(prev => [...prev, line]);
          setCurrentText('');
          setCurrentLineIndex(prev => prev + 1);
          return;
        }
      }

      animationFrameId = requestAnimationFrame(type);
    };

    animationFrameId = requestAnimationFrame(type);

    return () => cancelAnimationFrame(animationFrameId);
  }, [currentLineIndex]);

  return (
    <div className="terminal-container">
      <ul className="terminal-background">
        <li className="shape"></li>
        <li className="shape"></li>
        <li className="shape"></li>
        <li className="shape"></li>
        <li className="shape"></li>
        <li className="shape"></li>
        <li className="shape"></li>
      </ul>
      <div className="terminal-content">
        {displayedLines.map((line, index) => (
          <div key={index} className="terminal-line">
            {line}
          </div>
        ))}
        <div className="terminal-current-line ">
          {currentText}
          {showCursor && <span className="terminal-cursor" />}
        </div>
      </div>
    </div>
  );
};