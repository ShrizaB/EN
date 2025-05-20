"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useAnimation, useInView } from "framer-motion"
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
  Network,
  Lock,
  Shield,
  Zap,
  LineChart,
  Briefcase,
  GraduationCap,
  Database,
  Eye,
  Key,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function EduGuidePage() {
  const [animationComplete, setAnimationComplete] = useState(false)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [terminalText, setTerminalText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  const controls = useAnimation()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isHeaderInView) {
      controls.start("visible")
    }
  }, [isHeaderInView, controls])

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const glitchVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  const services = [
    {
      title: "Learn & Give Aptitude Test",
      description: "Master aptitude topics and test your knowledge with competitive exam-style mock tests",
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-900/30",
      borderColor: "border-blue-500/20 hover:border-blue-500/50",
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
    },
    {
      title: "Career Roadmap",
      description: "Explore career paths and get step-by-step guidance to achieve your professional goals",
      icon: MapPin,
      color: "text-green-400",
      bgColor: "bg-green-900/30",
      borderColor: "border-green-500/20 hover:border-green-500/50",
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
    },
    {
      title: "Give Interview",
      description: "Practice with simulated interviews and get feedback to improve your interview skills",
      icon: Users,
      color: "text-amber-400",
      bgColor: "bg-amber-900/30",
      borderColor: "border-amber-500/20 hover:border-amber-500/50",
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
          <motion.div
            key={particle.id}
            className="absolute font-mono text-green-500/30"
            style={{
              fontSize: `${particle.size}px`,
              top: `${particle.y}%`,
              left: `${particle.x}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [0, 20],
            }}
            transition={{
              duration: particle.animationDuration,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
            }}
          >
            {particle.value}
          </motion.div>
        ))}
      </div>

      {/* Data streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`stream-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"
            style={{
              top: `${Math.random() * 100}%`,
              left: 0,
              right: 0,
              opacity: 0.3,
            }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section ref={headerRef} className="py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={containerVariants}
              className="flex flex-col items-center text-center mb-12"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{
                  rotate: [0, 5, 0, -5, 0],
                  scale: 1.05,
                  transition: { duration: 0.5 },
                }}
                className="mb-6 relative"
              >
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-lg shadow-green-500/20 cyber-scan">
                  <Cpu className="h-14 w-14 text-black" />
                </div>
                <motion.div
                  className="absolute -top-4 -right-4 text-green-400"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Zap className="h-10 w-10" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -left-2 text-teal-400"
                  animate={{
                    rotate: [0, -360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                >
                  <Shield className="h-8 w-8" />
                </motion.div>
              </motion.div>

              <motion.div variants={glitchVariants} className="mb-4 overflow-hidden relative">
                <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 cyber-glitch">
                  EduGuide Professional
                </h1>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent to-teal-500/20"
                  animate={{
                    x: ["200%", "-100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    ease: "linear",
                    delay: 0.5,
                  }}
                />
              </motion.div>

              <motion.p variants={itemVariants} className="text-xl text-gray-400 max-w-2xl">
                Advanced learning paths for career development, aptitude testing, and professional growth. Navigate your
                future with precision.
              </motion.p>

              {/* Terminal text display */}
              <motion.div
                variants={itemVariants}
                className="mt-6 mb-8 w-full max-w-2xl bg-black border border-green-500/50 rounded-lg p-4 font-mono text-sm text-green-400 overflow-hidden"
              >
                <div className="flex items-center mb-2 border-b border-green-500/30 pb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-green-300">system_terminal</span>
                </div>
                <div className="whitespace-pre-line">
                  {terminalText}
                  {cursorVisible && <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse"></span>}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 cyber-button"
                >
                  <Link href="/eduguide/career-roadmap">
                    <motion.span
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      Explore Career Paths
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </motion.span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-950 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300 cyber-button"
                >
                  <Link href="/eduguide/aptitude-test">
                    <motion.span
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      Take Aptitude Test
                      <Brain className="ml-2 h-4 w-4" />
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-950 border-t border-b border-green-900/50 relative overflow-hidden">
          {/* Animated circuit lines */}
          <div className="absolute inset-0 pointer-events-none">
            <svg width="100%" height="100%" className="absolute inset-0 opacity-10">
              <motion.path
                d="M0,100 L200,100 C250,100 250,50 300,50 L1000,50"
                stroke="rgba(16,185,129,0.6)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.path
                d="M0,200 L150,200 C200,200 200,250 250,250 L1000,250"
                stroke="rgba(16,185,129,0.6)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path
                d="M1000,150 L800,150 C750,150 750,200 700,200 L0,200"
                stroke="rgba(16,185,129,0.6)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3, ease: "easeInOut", delay: 1 }}
              />
              <motion.path
                d="M1000,300 L700,300 C650,300 650,350 600,350 L0,350"
                stroke="rgba(16,185,129,0.6)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3, ease: "easeInOut", delay: 1.5 }}
              />
              {/* Connection nodes */}
              {[
                { cx: 200, cy: 100 },
                { cx: 300, cy: 50 },
                { cx: 150, cy: 200 },
                { cx: 250, cy: 250 },
                { cx: 800, cy: 150 },
                { cx: 700, cy: 200 },
                { cx: 700, cy: 300 },
                { cx: 600, cy: 350 },
              ].map((node, i) => (
                <motion.circle
                  key={i}
                  cx={node.cx}
                  cy={node.cy}
                  r="4"
                  fill="rgba(16,185,129,0.8)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    repeatDelay: 5,
                    delay: i * 0.2 + 2,
                  }}
                />
              ))}
            </svg>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative inline-block"
              >
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 cyber-glitch">
                  Professional Development Tools
                </h2>
                <motion.div
                  className="absolute -top-6 -right-6 text-green-500/50"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Network className="h-8 w-8" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -left-6 text-teal-500/50"
                  animate={{
                    rotate: -360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 5 }}
                >
                  <Database className="h-8 w-8" />
                </motion.div>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Advanced resources designed to accelerate your career growth and professional development.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.3)",
                  }}
                  className="bg-gray-900 border border-green-900/50 rounded-xl p-6 shadow-lg transition-all duration-300 neon-border"
                >
                  <motion.div
                    className={`w-16 h-16 rounded-full ${feature.bgColor} flex items-center justify-center mb-4 cyber-scan`}
                    whileHover={{
                      rotate: 360,
                      boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-green-400">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>

                  {/* Animated circuit lines */}
                  <div className="mt-4 h-1 w-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500/50 to-teal-500/50"
                      initial={{ x: "-100%" }}
                      whileInView={{ x: "100%" }}
                      viewport={{ once: false }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", repeatDelay: 1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Services Section */}
        <section className="py-16 relative overflow-hidden">
          {/* Hexagon grid background */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <svg width="100%" height="100%" className="absolute inset-0">
              <pattern
                id="hexagons"
                width="50"
                height="43.4"
                patternUnits="userSpaceOnUse"
                patternTransform="scale(2) rotate(0)"
              >
                <path d="M25 0L50 25L25 50L0 25L25 0z" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
          </div>

          {/* Scanning effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent pointer-events-none"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-white text-glitch">Professional Services</h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Comprehensive tools to help you prepare for aptitude tests, plan your career path, and ace your
                  interviews.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.03 }}
                  onHoverStart={() => setActiveCard(index)}
                  onHoverEnd={() => setActiveCard(null)}
                >
                  <Card
                    className={`overflow-hidden border-2 ${service.borderColor} transition-colors bg-gray-900 text-white h-full cyber-scan`}
                  >
                    <CardHeader className={`bg-gradient-to-r ${service.gradientFrom} ${service.gradientTo} pb-8`}>
                      <motion.div
                        className={`w-12 h-12 rounded-full ${service.bgColor} flex items-center justify-center mb-4`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <service.icon className={`h-6 w-6 ${service.color}`} />
                      </motion.div>
                      <CardTitle className={service.color}>{service.title}</CardTitle>
                      <CardDescription className="text-gray-400">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <motion.li
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-300"
                            animate={activeCard === index ? { x: [0, 5, 0] } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                          >
                            <div className={`w-2 h-2 rounded-full ${service.color.replace("text-", "bg-")}`}></div>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        className={`w-full bg-gradient-to-r ${service.buttonGradientFrom} ${service.buttonGradientTo} ${service.buttonHoverFrom} ${service.buttonHoverTo} cyber-button`}
                      >
                        <Link href={service.link}>
                          <motion.span
                            className="flex items-center justify-center w-full"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            Get Started
                          </motion.span>
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="py-16 bg-gray-950 border-t border-green-900/50 relative overflow-hidden">
          {/* Digital noise effect */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={`noise-${i}`}
                className="absolute bg-green-500"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 cyber-glitch">
                  Advanced Career Tools
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Cutting-edge resources to give you the competitive edge in today's job market.
                </p>
              </motion.div>
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.3)",
                  }}
                  className="bg-gray-900 border border-green-900/30 rounded-lg p-5 hover:border-green-500/30 transition-all duration-300 cyber-scan"
                >
                  <div className="flex items-start">
                    <motion.div
                      className="w-10 h-10 rounded-full bg-green-900/20 flex items-center justify-center mr-4 mt-1"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="h-5 w-5 text-green-500" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-medium text-green-400 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
          <div className="absolute inset-0 z-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`security-${i}`}
                className="absolute text-green-500/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 20 + 10}px`,
                }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                }}
              >
                {
                  [
                    <Lock key="lock" />,
                    <Shield key="shield" />,
                    <Eye key="eye" />,
                    <Key key="key" />,
                    <AlertTriangle key="alert" />,
                  ][Math.floor(Math.random() * 5)]
                }
              </motion.div>
            ))}
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-2xl font-bold mb-4 text-green-400">Secure Career Development Environment</h2>
              <p className="text-gray-400 mb-6">
                Our platform employs advanced encryption and security protocols to ensure your career data and personal
                information remain protected at all times.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Shield, text: "Data Encryption" },
                  { icon: Lock, text: "Secure Access" },
                  { icon: Key, text: "Privacy Controls" },
                  { icon: Eye, text: "Transparent Policies" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="bg-gray-900/50 border border-green-900/30 rounded-lg p-3 text-center"
                  >
                    <item.icon className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-green-900/50 to-teal-900/50 border border-green-500/30 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden">
                {/* Circuit board pattern */}
                <svg width="100%" height="100%" className="absolute inset-0 opacity-20">
                  <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <motion.path
                      d="M10,10 L40,10 L40,40 L70,40 L70,70 L40,70 L40,100"
                      stroke="rgba(16,185,129,0.6)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", repeatDelay: 1 }}
                    />
                    <motion.path
                      d="M30,10 L30,30 L10,30"
                      stroke="rgba(16,185,129,0.6)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 0.5,
                      }}
                    />
                    <motion.path
                      d="M70,10 L70,30 L90,30 L90,70 L70,70"
                      stroke="rgba(16,185,129,0.6)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 1,
                      }}
                    />
                    <motion.path
                      d="M10,50 L30,50 L30,90 L50,90 L50,70"
                      stroke="rgba(16,185,129,0.6)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 1.5,
                      }}
                    />
                    <motion.circle
                      cx="10"
                      cy="10"
                      r="3"
                      fill="rgba(16,185,129,0.8)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 2,
                      }}
                    />
                    <motion.circle
                      cx="70"
                      cy="10"
                      r="3"
                      fill="rgba(16,185,129,0.8)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 2.2,
                      }}
                    />
                    <motion.circle
                      cx="10"
                      cy="50"
                      r="3"
                      fill="rgba(16,185,129,0.8)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 2.4,
                      }}
                    />
                    <motion.circle
                      cx="50"
                      cy="90"
                      r="3"
                      fill="rgba(16,185,129,0.8)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 2.6,
                      }}
                    />
                  </pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit)" />
                </svg>
              </div>

              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 cyber-glitch"
                >
                  Accelerate Your Professional Growth
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl mb-8 max-w-2xl mx-auto text-gray-300"
                >
                  Take the next step in your career journey with our advanced tools and resources.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-green-500 text-black hover:bg-green-600 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 cyber-button"
                  >
                    <Link href="/eduguide/career-roadmap">
                      <motion.span
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        Explore Career Paths
                        <Rocket className="ml-2 h-4 w-4" />
                      </motion.span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-green-500 text-green-400 hover:bg-green-950 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300 cyber-button"
                  >
                    <Link href="/interview">
                      <motion.span
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        Practice Interviews
                        <Users className="ml-2 h-4 w-4" />
                      </motion.span>
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

// https://codepen.io/hk2002/pen/poqvMvj <-- button