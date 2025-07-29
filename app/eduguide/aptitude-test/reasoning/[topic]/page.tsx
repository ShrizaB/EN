"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronRight, BookOpen, Video, PenTool, ExternalLink, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateContent } from "@/lib/gemini-api"
import { searchYouTubeVideos, type YouTubeVideo } from "@/lib/youtube-api"
import { generateMockTest, type MockTestQuestion } from "@/lib/mock-test-generator"
import MockTest from "@/components/aptitude/mock-test"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './reasoning-topics.css'

// Enhanced CyberGridBackground with more effects
const CyberGridBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Create pulse effect at mouse position
      if (gridRef.current) {
        const pulse = document.createElement('div')
        pulse.className = 'cyber-pulse'
        pulse.style.left = `${e.clientX}px`
        pulse.style.top = `${e.clientY}px`
        gridRef.current.appendChild(pulse)
        
        setTimeout(() => {
          pulse.remove()
        }, 1000)
      }
    }

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)
    
    // Matrix rain effect
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const matrix = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
    const fontSize = 16
    const columns = canvas.width / fontSize
    const drops: number[] = []
    
    for(let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100 // Start at random positions above viewport
    }
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 10, 5, 0.03)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff88'
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`
      
      for(let i = 0; i < drops.length; i++) {
        const text = matrix.charAt(Math.floor(Math.random() * matrix.length))
        const yPos = drops[i] * fontSize
        const opacity = Math.min(1, yPos / canvas.height * 2)
        
        ctx.globalAlpha = opacity
        ctx.fillText(text, i * fontSize, yPos)
        
        if(yPos > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        
        drops[i]++
      }
      ctx.globalAlpha = 1
    }
    
    const interval = setInterval(draw, 33)
    
    // Grid connection animation
    const grid = gridRef.current
    if (grid) {
      const animateGrid = () => {
        const nodes = Array.from({ length: 20 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          vx: Math.random() * 0.2 - 0.1,
          vy: Math.random() * 0.2 - 0.1
        }))
        
        const updateGrid = () => {
          grid.innerHTML = ''
          
          // Draw connections
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const dx = nodes[i].x - nodes[j].x
              const dy = nodes[i].y - nodes[j].y
              const distance = Math.sqrt(dx * dx + dy * dy)
              
              if (distance < 15) {
                const line = document.createElement('div')
                line.className = 'grid-connection'
                line.style.left = `${nodes[i].x}%`
                line.style.top = `${nodes[i].y}%`
                line.style.width = `${distance}%`
                line.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`
                line.style.opacity = `${1 - distance / 15}`
                grid.appendChild(line)
              }
            }
            
            // Update node positions
            nodes[i].x += nodes[i].vx
            nodes[i].y += nodes[i].vy
            
            // Bounce off edges
            if (nodes[i].x < 0 || nodes[i].x > 100) nodes[i].vx *= -1
            if (nodes[i].y < 0 || nodes[i].y > 100) nodes[i].vy *= -1
          }
          
          requestAnimationFrame(updateGrid)
        }
        
        updateGrid()
      }
      
      animateGrid()
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      clearInterval(interval)
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
      ref={gridRef}
    >
      <canvas ref={canvasRef} className="matrix-canvas absolute inset-0 z-0" />
      <div className="cyber-grid"></div>
      <div className="cyber-glow"></div>
      <div className="cyber-scanlines"></div>
      <div className="circuit-overlay"></div>
      <div className="binary-rain"></div>
    </div>
  )
}

// Enhanced Particle Animation with cyber effects
const ParticleAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      life: number
      maxLife: number
    }[] = []
    
    const particleCount = Math.floor(window.innerWidth / 10)
    const colors = ['#00ff88', '#00ccff', '#9933ff', '#ff3366', '#00ff88']
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 200
      })
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create occasional bursts of particles
      if (Math.random() > 0.98) {
        const burstX = Math.random() * canvas.width
        const burstY = Math.random() * canvas.height
        for (let i = 0; i < 10; i++) {
          particles.push({
            x: burstX,
            y: burstY,
            size: Math.random() * 5 + 2,
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * 6 - 3,
            color: '#00ff88',
            life: 0,
            maxLife: 50 + Math.random() * 100
          })
        }
      }
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        
        // Update position
        p.x += p.speedX
        p.y += p.speedY
        p.life++
        
        // Remove dead particles
        if (p.life > p.maxLife) {
          particles.splice(i, 1)
          i--
          continue
        }
        
        // Draw particle with pulsing effect
        const pulse = Math.sin(p.life * 0.1) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (0.5 + pulse * 0.5), 0, Math.PI * 2)
        
        // Create gradient for particles
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size
        )
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150) {
            ctx.beginPath()
            const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y)
            gradient.addColorStop(0, p.color)
            gradient.addColorStop(1, p2.color)
            
            ctx.strokeStyle = gradient
            ctx.globalAlpha = (1 - distance / 150) * 0.3
            ctx.lineWidth = 0.8
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
      
      requestAnimationFrame(animate)
    }
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', handleResize)
    const animationId = requestAnimationFrame(animate)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  return <canvas ref={canvasRef} className="particle-canvas fixed inset-0 -z-10" />
}

// Topic name mapping
const topicNames = {
  clock: "Clock Problems",
  "blood-relation": "Blood Relation",
  "coding-decoding": "Coding Decoding",
  "math-operations": "Math Operations",
  calendar: "Calendar",
  jumbling: "Jumbling",
  analogy: "Analogy",
  "odd-one-out": "Odd One Out",
  "direction-sense": "Direction Sense",
  "number-series": "Number Series",
  "alphabet-series": "Alphabet Series",
  "ranking-test": "Ranking Test",
  "puzzle-test": "Puzzle Test",
  assumptions: "Assumptions",
  conclusion: "Conclusion",
  arguments: "Arguments",
  "course-of-action": "Course of Action",
  "cause-and-effect": "Cause and Effect",
  syllogism: "Syllogism",
  matrix: "Matrix",
  "cube-and-cuboid": "Cube and Cuboid",
  dice: "Dice",
  "decision-making": "Decision Making",
  "non-verbal": "Non Verbal Reasoning",
}

export default function ReasoningTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topic as string
  const topicName = topicNames[topicId as keyof typeof topicNames] || topicId
  const [content, setContent] = useState<string>("")
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [questions, setQuestions] = useState<MockTestQuestion[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [videosLoading, setVideosLoading] = useState<boolean>(true)
  const [questionsLoading, setQuestionsLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("learn")
  const [showTest, setShowTest] = useState<boolean>(false)
  const [glitchEffect, setGlitchEffect] = useState<boolean>(false)

  useEffect(() => {
    async function fetchContent() {
      setLoading(true)
      try {
        const prompt = `Create a comprehensive educational content about ${topicName} for competitive exam preparation. Include:
        1. Introduction to ${topicName}
        2. Key concepts and techniques
        3. Step-by-step examples with solutions
        4. Common patterns and tricks
        5. Tips for solving problems quickly in exams
        
        Format the content with proper headings, bullet points, and organized sections.
        Make it educational and easy to understand for students preparing for competitive exams.
        
        IMPORTANT: Do NOT include any diagrams, flowcharts, visual representations, ASCII art, or any visual elements. Provide only text-based explanations and written examples.`

        const generatedContent = await generateContent(prompt)
        setContent(generatedContent)
      } catch (error) {
        console.error("Error generating content:", error)
        setContent("Failed to load content. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    async function fetchVideos() {
      setVideosLoading(true)
      try {
        const searchQuery = `${topicName} reasoning tutorial for competitive exams`
        const fetchedVideos = await searchYouTubeVideos(searchQuery, 6)
        setVideos(fetchedVideos)
      } catch (error) {
        console.error("Error fetching videos:", error)
        setVideos([])
      } finally {
        setVideosLoading(false)
      }
    }

    async function fetchQuestions() {
      setQuestionsLoading(true)
      try {
        const generatedQuestions = await generateMockTest(topicName, "Reasoning", 20)
        setQuestions(generatedQuestions)
      } catch (error) {
        console.error("Error generating questions:", error)
        setQuestions([])
      } finally {
        setQuestionsLoading(false)
      }
    }

    fetchContent()
    fetchVideos()
    fetchQuestions()

    // Trigger glitch effect on mount
    setGlitchEffect(true)
    const timer = setTimeout(() => setGlitchEffect(false), 1000)
    return () => clearTimeout(timer)
  }, [topicName])

  const handleStartTest = () => {
    setGlitchEffect(true)
    setTimeout(() => {
      setGlitchEffect(false)
      setShowTest(true)
    }, 800)
  }

  const handleFinishTest = () => {
    setShowTest(false)
    setActiveTab("learn")
  }

  const handleBackFromTest = () => {
    setShowTest(false)
  }

  if (showTest) {
    return (
      <MockTest
        topic={topicName}
        subject="Reasoning"
        questions={questions}
        onFinish={handleFinishTest}
        onBack={handleBackFromTest}
      />
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 overflow-hidden mt-10 ${glitchEffect ? 'glitch-effect' : ''}`}>
      <CyberGridBackground />
      <ParticleAnimation />
      
      {/* HUD elements */}
      <div className="hud-corner hud-top-left"></div>
      <div className="hud-corner hud-top-right"></div>
      <div className="hud-corner hud-bottom-left"></div>
      <div className="hud-corner hud-bottom-right"></div>
      
      {/* Animated binary code floating in background */}
      <div className="binary-floater" data-content="01001000 01100001 01100011 01101011"></div>
      <div className="binary-floater" data-content="01010010 01100101 01100001 01110011 01101111 01101110 01101001 01101110 01100111"></div>
      <div className="binary-floater" data-content="01010100 01110010 01100001 01101001 01101110 01101001 01101110 01100111"></div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        <div className="mb-12">
          <div className="relative z-10 w-full flex flex-col items-center text-center">
            <div className="max-w-4xl w-full px-4">
              <h1 className="text-5xl font-bold tracking-tight mb-6 font-orbitron lightsaber-text inline-block" data-text={topicName}>
                {topicName}
              </h1>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mt-5">
                Master <span className="text-accent-primary font-medium neon-text">{topicName}</span> concepts with our comprehensive guide, 
                featuring detailed explanations, video tutorials, and practice tests to boost your reasoning skills.
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => {
          setGlitchEffect(true)
          setTimeout(() => {
            setGlitchEffect(false)
            setActiveTab(value)
          }, 300)
        }} className="mb-8 cyber-tab-group">
          <TabsList className="grid w-full grid-cols-3 cyber-tabs">
            <TabsTrigger value="learn" className="flex items-center gap-2 cyber-tab-trigger">
              <BookOpen className="h-4 w-4 tab-icon" />
              <span className="relative">
                Learn
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-primary transition-all duration-300 group-hover:w-full"></span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2 cyber-tab-trigger">
              <Video className="h-4 w-4 tab-icon" />
              <span className="relative">
                Videos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-primary transition-all duration-300 group-hover:w-full"></span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2 cyber-tab-trigger">
              <PenTool className="h-4 w-4 tab-icon" />
              <span className="relative">
                Mock Test
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-primary transition-all duration-300 group-hover:w-full"></span>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="space-y-8">
            <div className="cyber-card p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl relative overflow-hidden hover:shadow-accent-primary/20 transition-all duration-300">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="absolute -inset-1 bg-accent-primary/10 blur-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                {loading ? (
                  <div className="space-y-6">
                    <div className="h-10 bg-gray-800/50 rounded-lg animate-pulse w-1/2"></div>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-800/50 rounded-full animate-pulse"></div>
                    ))}
                    <div className="h-8 bg-gray-800/50 rounded-lg animate-pulse w-1/3 mt-6"></div>
                    {[...Array(3)].map((_, i) => (
                      <div key={`p2-${i}`} className="h-4 bg-gray-800/50 rounded-full animate-pulse"></div>
                    ))}
                    <div className="h-40 bg-gray-800/50 rounded-xl animate-pulse mt-6"></div>
                  </div>
                ) : (
                  <div className="prose prose-lg max-w-none text-gray-100">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-4xl font-bold text-accent-primary mb-6 mt-8 border-b border-accent-primary/30 pb-3 tracking-tight">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-3xl font-bold text-accent-primary mb-4 mt-6">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-2xl font-semibold text-accent-secondary mb-3 mt-5">
                            {children}
                          </h3>
                        ),
                        h4: ({ children }) => (
                          <h4 className="text-xl font-semibold text-gray-200 mb-2 mt-4">
                            {children}
                          </h4>
                        ),
                        h5: ({ children }) => (
                          <h5 className="text-lg font-medium text-gray-300 mb-2 mt-3">
                            {children}
                          </h5>
                        ),
                        h6: ({ children }) => (
                          <h6 className="text-base font-medium text-gray-400 mb-2 mt-3">
                            {children}
                          </h6>
                        ),
                        p: ({ children }) => (
                          <p className="text-gray-100 leading-relaxed mb-4">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-accent-secondary font-semibold">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="text-accent-primary italic">
                            {children}
                          </em>
                        ),
                        ul: ({ children }) => (
                          <ul className="text-gray-100 space-y-2 mb-4 ml-6 list-none">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="text-gray-100 space-y-2 mb-4 ml-6 list-none">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-100 leading-relaxed relative pl-6 before:content-['▪'] before:text-accent-primary before:absolute before:left-0 before:font-bold">
                            {children}
                          </li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-accent-primary bg-gray-800/30 pl-4 py-2 italic text-gray-200 my-4">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children, className }) => {
                          const isInline = !className
                          if (isInline) {
                            return (
                              <code className="bg-gray-800 px-2 py-1 rounded text-accent-secondary text-sm">
                                {children}
                              </code>
                            )
                          }
                          return (
                            <code className="block bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 text-accent-secondary text-sm overflow-x-auto">
                              {children}
                            </code>
                          )
                        },
                        pre: ({ children }) => (
                          <pre className="bg-gray-900/80 border border-gray-700/50 shadow-lg rounded-xl overflow-x-auto p-4 max-h-[500px] mb-4">
                            {children}
                          </pre>
                        ),
                        a: ({ children, href }) => (
                          <a 
                            href={href} 
                            className="text-accent-secondary no-underline hover:text-accent-primary hover:underline transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                        table: ({ children }) => (
                          <table className="border-collapse border border-gray-600 w-full mb-4">
                            {children}
                          </table>
                        ),
                        th: ({ children }) => (
                          <th className="bg-gray-800 text-accent-primary font-semibold p-3 border border-gray-600 text-left">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="p-3 border border-gray-600 text-gray-100">
                            {children}
                          </td>
                        ),
                        hr: () => (
                          <hr className="border-accent-primary/30 my-8" />
                        )
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold neon-text">Recommended Videos</h2>
              {videosLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 rounded-full border-4 border-accent-primary border-t-transparent animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Finding the best videos...</p>
                </div>
              ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div key={video.id} className="cyber-video-card bg-card border border-border rounded-lg overflow-hidden hover:border-accent-primary transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/20">
                      <div className="aspect-video bg-secondary/50 relative group overflow-hidden">
                        <img
                          src={video.thumbnailUrl || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <Button
                            variant="outline"
                            size="sm"
                            className="cyber-yt-button"
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}
                          >
                            <Video className="h-4 w-4 yt-icon mr-2" />
                            Watch on YouTube
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1 line-clamp-2 hover:text-accent-primary transition-colors">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {video.channelTitle}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cyber-watch-button w-full"
                          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}
                        >
                          <Video className="h-4 w-4 play-icon" />
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No videos found. Please try again later.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="test" className="mt-6">
            <div className="text-center py-12 space-y-6 relative">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-accent-primary/10 rounded-full filter blur-xl animate-pulse-slow"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-secondary/10 rounded-full filter blur-xl animate-pulse-slow"></div>
              
              <h2 className="text-2xl font-bold neon-text">Mock Test: {topicName}</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Test your knowledge with a 20-question mock test designed like competitive exams.
              </p>
              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                <div className="flex justify-between text-sm">
                  <span>Questions: 20</span>
                  <span>Time: 20 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Difficulty: Medium</span>
                  <span>Passing: 60%</span>
                </div>
              </div>
              {questionsLoading ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-8 h-8 rounded-full border-4 border-accent-primary border-t-transparent animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Generating questions...</p>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="mt-4 cyber-start-test-button relative overflow-hidden"
                  onClick={handleStartTest}
                >
                  <span className="relative z-10">Start Mock Test</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}