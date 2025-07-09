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
import './aptitude-maths-topics.css'

// --- CyberGridBackground with enhanced animations ---
const CyberGridBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
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
    
    const matrix = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%^&*()_+=-{}[]|:;'<>,.?/~`"
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []
    
    for(let i = 0; i < columns; i++) drops[i] = 1
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 10, 5, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff88'
      ctx.font = `${fontSize}px monospace`
      
      for(let i = 0; i < drops.length; i++) {
        const text = matrix.charAt(Math.floor(Math.random() * matrix.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) 
          drops[i] = 0
        
        drops[i]++
      }
    }
    
    const interval = setInterval(draw, 50)
    
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
    >
      <canvas ref={canvasRef} className="matrix-canvas absolute inset-0 z-0" />
      <div className="cyber-grid"></div>
      <div className="cyber-glow"></div>
      <div className="cyber-scanlines"></div>
      <div className="circuit-overlay"></div>
    </div>
  )
}

// Enhanced Particle Animation Component
const ParticleAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const particles: Particle[] = []
    const particleCount = 150
    
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      canvasWidth: number
      canvasHeight: number
      private ctx: CanvasRenderingContext2D
      
      constructor(canvasWidth: number, canvasHeight: number, ctx: CanvasRenderingContext2D) {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.ctx = ctx
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.color = `rgba(100, 200, 255, ${Math.random() * 0.6 + 0.2})`
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        if (this.x > this.canvasWidth || this.x < 0) this.speedX = -this.speedX
        if (this.y > this.canvasHeight || this.y < 0) this.speedY = -this.speedY
      }
      
      draw() {
        this.ctx.fillStyle = this.color
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }
    
    const createParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height, ctx))
      }
    }
    
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
        
        // Connect particles with lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 * (1 - distance/100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      
      requestAnimationFrame(animateParticles)
    }
    
    createParticles()
    animateParticles()
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  return <canvas ref={canvasRef} className="particle-canvas absolute inset-0 z-0" />
}

// Topic name mapping
const topicNames = {
  "time-and-distance": "Time and Distance",
  percentage: "Percentage",
  "profit-and-loss": "Profit and Loss",
  "ratio-and-proportion": "Ratio and Proportion",
  "square-roots": "Square Roots",
  squares: "Squares",
  "cube-and-cube-root": "Cube and Cube Root",
  multiplication: "Multiplication",
  addition: "Addition",
  simplifications: "Simplifications",
  "decimal-fractions": "Decimal Fractions",
  "surds-and-indices": "Surds and Indices",
  "time-and-work": "Time and Work",
  "pipe-and-cistern": "Pipe and Cistern",
  "simple-interest": "Simple Interest",
  "compound-interest": "Compound Interest",
  "data-interpretation": "Data Interpretation",
  "data-sufficiency": "Data Sufficiency",
  mensuration: "Mensuration",
}

export default function MathTopicPage() {
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
  const [isGlitching, setIsGlitching] = useState<boolean>(false)

  // Trigger random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200 + Math.random() * 300)
    }, 5000 + Math.random() * 10000)
    
    return () => clearInterval(glitchInterval)
  }, [])

  useEffect(() => {
    async function fetchContent() {
      setLoading(true)
      try {
        const prompt = `Create a comprehensive educational content about ${topicName} for competitive exam preparation. Include:
        1. Introduction to ${topicName}
        2. Key formulas and concepts
        3. Step-by-step examples with solutions
        4. Common tricks and shortcuts
        5. Tips for solving problems quickly in exams
        
        Format the content with proper headings, bullet points, and mathematical notations where needed.
        Make it educational and easy to understand for students preparing for competitive exams.`

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
        const searchQuery = `${topicName} math tutorial for competitive exams`
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
        const generatedQuestions = await generateMockTest(topicName, "Mathematics", 20)
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
  }, [topicName])

  const handleStartTest = () => {
    setShowTest(true)
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
        subject="Mathematics"
        questions={questions}
        onFinish={handleFinishTest}
        onBack={handleBackFromTest}
      />
    )
  }

  return (
    <main className="main-content">
      <div className="aptitude-test-page">
        <CyberGridBackground />
        <ParticleAnimation />
        <div className="container">
          <div className="topic-header">
            <Link
              href="/eduguide/aptitude-test/maths"
              className="text-sm text-muted-foreground hover:text-primary flex items-center mb-2 group"
            >
              <ChevronRight className="h-4 w-4 mr-1 rotate-180 group-hover:text-accent-primary transition-colors duration-300" />
              <span className="group-hover:text-accent-primary transition-colors duration-300">Back to Mathematics Topics</span>
            </Link>
            <h1 
              className={`topic-title glitch-text ${isGlitching ? 'glitch-active' : ''}`} 
              data-text={topicName}
            >
              <span>{topicName}</span>
            </h1>
            <p className="topic-description">
              Learn the concepts, practice with examples, and test your knowledge with a mock test.
            </p>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="mb-8 relative z-10"
          >
            <TabsList className="w-full cyber-tabs">
              <TabsTrigger 
                value="learn" 
                className="cyber-tab-trigger flex-1 flex items-center justify-center gap-2"
              >
                <BookOpen className="h-4 w-4 tab-icon" />
                <span>Learn</span>
              </TabsTrigger>
              <TabsTrigger 
                value="videos" 
                className="cyber-tab-trigger flex-1 flex items-center justify-center gap-2"
              >
                <Video className="h-4 w-4 tab-icon" />
                <span>Videos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="test" 
                className="cyber-tab-trigger flex-1 flex items-center justify-center gap-2"
              >
                <PenTool className="h-4 w-4 tab-icon" />
                <span>Mock Test</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="learn" className="mt-6 cyber-card">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 rounded-full border-4 border-accent-primary border-t-transparent animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Generating content...</p>
                  <div className="mt-4 flex space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none cyber-content">
                  <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="mt-6 cyber-card">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold cyber-heading">
                  <Sparkles className="h-6 w-6 inline mr-2 text-accent-primary animate-pulse" />
                  Recommended Videos
                </h2>
                {videosLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 rounded-full border-4 border-accent-primary border-t-transparent animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Scanning the network for videos...</p>
                  </div>
                ) : videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video) => (
                      <div key={video.id} className="cyber-card-video border border-accent-primary/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-accent-primary hover:shadow-glow">
                        <div className="aspect-video bg-secondary/50 relative group">
                          <div className="video-thumbnail-wrapper">
                            <img
                              src={video.thumbnailUrl || "/placeholder.svg"}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-4 transition-all duration-300">
                            <button
                              className="cyber-yt-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank");
                              }}
                            >
                              <svg
                                className="yt-icon h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                              </svg>
                              <span>WATCH ON YOUTUBE</span>
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-1 line-clamp-2 text-accent-secondary">{video.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {video.channelTitle} • {video.duration}
                          </p>
                          <button
                            className="cyber-watch-button flex items-center justify-center"
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}
                          >
                            <svg
                              className="play-icon h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>WATCH NOW</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 cyber-card">
                    <p className="text-muted-foreground">No videos found. Scanning the network again...</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="test" className="mt-6 cyber-card">
              <div className="text-center py-12 space-y-6">
                <h2 className="text-2xl font-bold cyber-heading ">
                  <Sparkles className="h-6 w-6 inline mr-2 text-accent-primary animate-pulse" />
                  Mock Test: {topicName}
                </h2>
                <div className="flex flex-col gap-2 max-w-xs mx-auto cyber-stats">
                  <div className="flex justify-between text-sm">
                    <span>Questions: <span className="text-accent-primary">20</span></span>
                    <span>Time: <span className="text-accent-primary">20 min</span></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Difficulty: <span className="text-accent-primary">Medium</span></span>
                    <span>Passing: <span className="text-accent-primary">60%</span></span>
                  </div>
                </div>
                {questionsLoading ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-12 h-12 rounded-full border-4 border-accent-primary border-t-transparent animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Compiling test questions...</p>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="mt-4 cyber-button"
                    onClick={handleStartTest}
                  >
                    <span className="glow-text">Start Mock Test</span>
                    <span className="button-pulse"></span>
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}