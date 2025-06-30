"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Youtube, Maximize2, Minimize2, Bot } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { useAuth } from "@/contexts/auth-context"
import "./ultron-theme.css"
import Loading from "./loading"

// Initialize the Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

// YouTube API key - you'll need to add this to your environment variables
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "AIzaSyCd4Nl9qskVrhr8J-Xt9pMXUaXInw_NY3k"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  videos?: YouTubeVideo[]
  timestamp: Date
}

interface YouTubeVideo {
  id: string
  title: string
  channelTitle: string
  description: string
  thumbnailUrl: string
  publishedAt: string
}

export default function VideoSearchPage() {
  const [showLoader, setShowLoader] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I can help you find educational videos on any topic. What would you like to learn about today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Fullscreen toggle handler
  const handleFullscreen = () => {
    const el = chatContainerRef.current
    if (!el) return
    if (!isFullscreen) {
      if (el.requestFullscreen) el.requestFullscreen()
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen()
      else if ((el as any).msRequestFullscreen) (el as any).msRequestFullscreen()
    } else {
      if (document.exitFullscreen) document.exitFullscreen()
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen()
      else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen()
    }
  }

  // Listen for fullscreen change to update state
  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", onChange)
    document.addEventListener("webkitfullscreenchange", onChange)
    document.addEventListener("msfullscreenchange", onChange)
    return () => {
      document.removeEventListener("fullscreenchange", onChange)
      document.removeEventListener("webkitfullscreenchange", onChange)
      document.removeEventListener("msfullscreenchange", onChange)
    }
  }, [])

  // Preload the sound effect
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new window.Audio('/sounds/ultron-key.mp3')
      audio.volume = 0.18 // Not too loud
      audioRef.current = audio
    }
    // Keydown handler
    const handleKeyDown = (e: KeyboardEvent) => {
      // Play the sound for every key
      if (audioRef.current) {
        // Restart sound if already playing
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Update the searchYouTubeVideos function to search for kid-friendly content
  const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
    try {
      if (!YOUTUBE_API_KEY) {
        console.error("YouTube API key is missing")
        return []
      }

      // Add "for kids" to the search query to get more kid-friendly results
      const kidFriendlyQuery = `${query} for kids educational`

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
          kidFriendlyQuery,
        )}&type=video&key=${YOUTUBE_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()

      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
      }))
    } catch (error) {
      console.error("Error searching YouTube:", error)
      return []
    }
  }

  // Update the rankVideosWithAI function to prioritize kid-friendly content
  const rankVideosWithAI = async (query: string, videos: YouTubeVideo[]): Promise<YouTubeVideo[]> => {
    try {
      if (videos.length === 0) return []

      // Create a prompt for the AI to rank the videos
      const prompt = `
        I'm looking for the best educational videos about "${query}" specifically for children.
        Here are some videos I found. Please rank them from most to least relevant for children's learning.
        Consider factors like:
        1. Child-friendliness (appropriate for kids)
        2. Educational value for children
        3. Engagement level for young learners
        4. Clarity and simplicity of explanation
      
        Videos:
        ${videos
          .map(
            (video, index) => `
        Video ${index + 1}:
        Title: ${video.title}
        Channel: ${video.channelTitle}
        Description: ${video.description}
      `,
          )
          .join("\n")}
      
      Return ONLY the ranked list of video indices (e.g., [3, 1, 5, 2, 4]) with the most kid-friendly and educational video first.
    `

      const result = await model.generateContent(prompt)
      const responseText = result.response.text()

      // Extract the ranked indices from the response
      const indexMatch = responseText.match(/\[[\d,\s]+\]/)
      if (!indexMatch) return videos.slice(0, 3) // Return first 3 if no ranking found

      const rankedIndices = JSON.parse(indexMatch[0])

      // Reorder videos based on AI ranking
      const rankedVideos: YouTubeVideo[] = []
      for (const idx of rankedIndices) {
        if (videos[idx - 1]) {
          rankedVideos.push(videos[idx - 1])
        }
      }

      // Add any videos that weren't ranked
      const rankedIds = new Set(rankedVideos.map((v) => v.id))
      const unrankedVideos = videos.filter((v) => !rankedIds.has(v.id))

      // Return only the top 3 videos
      return [...rankedVideos, ...unrankedVideos].slice(0, 3)
    } catch (error) {
      console.error("Error ranking videos with AI:", error)
      return videos.slice(0, 3) // Return first 3 if ranking fails
    }
  }

  // Update the generateResponse function to specify kid-friendly content
  const generateResponse = async (query: string, videos: YouTubeVideo[]): Promise<string> => {
    try {
      if (videos.length === 0) {
        return "I couldn't find any videos on that topic. Please try a different search term."
      }

      const prompt = `
      The user is looking for educational videos about "${query}" for children.
      I found ${videos.length} kid-friendly educational videos on this topic.
      
      Write a helpful, friendly response that:
      1. Acknowledges their search query
      2. Mentions these are specifically selected for kids
      3. Encourages them to check out the videos below
      4. Suggests they can ask for more specific videos if needed
      
      Keep it concise (2-3 sentences) and friendly, as if speaking to a parent or teacher helping a child.
    `

      const result = await model.generateContent(prompt)
      return result.response.text().trim()
    } catch (error) {
      console.error("Error generating AI response:", error)
      return "Here are some kid-friendly videos I found on that topic. I hope they're helpful for your child's learning!"
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Search for videos
      const videos = await searchYouTubeVideos(input)

      // Rank videos with AI
      const rankedVideos = await rankVideosWithAI(input, videos)

      // Generate AI response
      const responseText = await generateResponse(input, rankedVideos)

      // Add assistant message with videos
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        videos: rankedVideos,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error in chat flow:", error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while searching for videos. Please try again later.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (showLoader) return <Loading />;

  return (
    <div className="ultron-container">

      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/QMSVs16b/ultron-marvel-rivals-by-tettris11-djvjdtn.png"
              alt="Ultron 1"
              className="opacity-100 w-[300px] fixed bottom-16 left-10 h-auto md:visible invisible"
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/SQgfS1TB/pngegg-5.png"
              alt="Ultron 2"
              className="ultron-image opacity-80 w-[360px] fixed top-16 right-10 h-auto scale-x-[-1]"
            />
          </div>
        </div>
      </div>

      {/* Hide default cursor and render a custom cursor image that follows the mouse */}
      <style>{`
        html, body, #__next, .ultron-container, * {
          cursor: none !important;
        }
      `}</style>
      {/* Custom cursor image */}
      <CustomCursor />

      {/* Dynamic Background */}
      <div className="ultron-background">
        <div className="ultron-grid"></div>
        <div className="ultron-particles"></div>
        <div className="ultron-matrix"></div>
        <div className="ultron-scanlines"></div>
      </div>

      {/* Neural Network Overlay */}
      <div className="ultron-neural-network">
        <div className="neural-node neural-node-1"></div>
        <div className="neural-node neural-node-2"></div>
        <div className="neural-node neural-node-3"></div>
        <div className="neural-node neural-node-4"></div>
        <div className="neural-connection neural-connection-1"></div>
        <div className="neural-connection neural-connection-2"></div>
        <div className="neural-connection neural-connection-3"></div>
      </div>

      <div className="container py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="ultron-badge">
              <div className="badge-glow"></div>
              <Youtube className="h-5 w-5 mr-1.5" />
              <span>Video Search</span>
              <div className="badge-pulse"></div>
            </div>
            <h1 className="ultron-title" style={{ WebkitTextFillColor: 'unset', color: 'var(--ultron-red)', textShadow: '0 0 16px var(--ultron-glow-red), 0 2px 8px #000' }}>
              <span className="title-glitch" data-text="Educational Video Search" style={{ WebkitTextFillColor: 'unset', color: 'var(--ultron-red)', textShadow: '0 0 16px var(--ultron-glow-red), 0 2px 8px #000' }}>
                Educational Video Search
              </span>
            </h1>
            <p className="ultron-subtitle">
              Ask me to find educational videos on any topic. I'll search YouTube and show you the best results.
            </p>
          </div>

          {/* Chat container */}
          <div
            className="ultron-chat-container"
            ref={chatContainerRef}
            style={{
              minHeight: isFullscreen ? '100vh' : '520px',
              height: isFullscreen ? '100vh' : '48vh',
              maxHeight: isFullscreen ? '100vh' : '700px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {isFullscreen && false && (
              <div style={{
                position: 'absolute',
                top: 12,
                right: 16,
                zIndex: 20,
                color: 'var(--ultron-red)',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 2,
                textShadow: '0 0 12px var(--ultron-glow-red)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}>
                FULL SCREEN
              </div>
            )}
            <div className="chat-header flex flex-row items-center justify-between gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <div className="status-indicator flex flex-row items-center gap-2">
                  <div className="status-dot"></div>
                  <span className="hidden sm:inline">AI SYSTEM ONLINE</span>
                  <span className="inline sm:hidden text-xs">AI ONLINE</span>
                </div>
                <button
                  type="button"
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  onClick={handleFullscreen}
                  className="ultron-fullscreen-btn ml-2"
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  style={{
                    padding: window.innerWidth <= 768 ? '7px 14px' : undefined,
                    fontSize: window.innerWidth <= 768 ? 12 : undefined,
                    minWidth: window.innerWidth <= 768 ? 0 : undefined,
                    gap: window.innerWidth <= 768 ? 6 : undefined,
                  }}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  <span style={{ fontSize: window.innerWidth <= 768 ? 11 : 13, fontWeight: 600, letterSpacing: 1, userSelect: 'none' }}>
                    {isFullscreen ? (window.innerWidth <= 768 ? 'Exit Full Screen' : 'Exit Full Screen') : (window.innerWidth <= 768 ? 'Full Screen' : 'Full Screen')}
                  </span>
                </button>
              </div>
              {/* Hide system metrics on mobile */}
              <div className="system-metrics hidden md:flex">
                <div className="metric">
                  <span>CPU</span>
                  <div className="metric-bar">
                    <div className="metric-fill"></div>
                  </div>
                </div>
                <div className="metric">
                  <span>MEM</span>
                  <div className="metric-bar">
                    <div className="metric-fill metric-fill-2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div
              className="ultron-messages-area text-[11px] md:text-xs lg:text-sm"
              style={{
                flex: 1,
                minHeight: 0,
                height: isFullscreen ? 'auto' : 'calc(48vh - 140px)',
                maxHeight: isFullscreen ? 'none' : '600px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar
                      className={`ultron-avatar ${message.role === "assistant" ? "ultron-avatar-ai" : "ultron-avatar-user"}`}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="w-6 h-6 text-white" />
                      ) : (
                        <AvatarFallback>
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      )}
                      <div className="avatar-pulse"></div>
                    </Avatar>
                    <div
                      className={`ultron-message ${message.role === "user" ? "ultron-message-user" : "ultron-message-ai"} text-[11px] md:text-xs lg:text-sm`}
                    >
                      <div className="message-border"></div>
                      <p className="whitespace-pre-wrap text-[11px] md:text-xs lg:text-sm">{message.content}</p>

                      {/* Video results */}
                      {message.videos && message.videos.length > 0 && (
                        <div className="mt-4">
                          <div className="grid grid-cols-1 gap-4">
                            {message.videos.map((video, index) => (
                              <div
                                key={video.id}
                                className="ultron-video-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                <div className="video-card-glow"></div>
                                <div className="flex flex-col md:flex-row">
                                  <div className="md:w-1/2 aspect-video ultron-video-frame">
                                    <div className="video-overlay"></div>
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      src={`https://www.youtube.com/embed/${video.id}`}
                                      title={video.title}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                  <div className="p-4 md:w-1/2 flex flex-col">
                                    <h4 className="ultron-video-title">{video.title}</h4>
                                    <p className="ultron-video-channel">{video.channelTitle}</p>
                                    <p className="ultron-video-description">{video.description}</p>
                                    <div className="mt-auto pt-2">
                                      <a
                                        href={`https://www.youtube.com/watch?v=${video.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ultron-video-link"
                                      >
                                        <span>Watch on YouTube</span>
                                        <div className="link-glow"></div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <Avatar className="ultron-avatar ultron-avatar-ai">
                      <AvatarFallback>AI</AvatarFallback>
                      <div className="avatar-pulse"></div>
                    </Avatar>
                    <div className="ultron-message ultron-message-ai">
                      <div className="message-border"></div>
                      <div className="flex items-center gap-2">
                        <div className="ultron-loader">
                          <div className="loader-ring"></div>
                          <div className="loader-ring"></div>
                          <div className="loader-ring"></div>
                        </div>
                        <p>Searching for videos...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="ultron-input-area" style={{ flexShrink: 0 }}>
              <div className="input-glow"></div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="input-wrapper">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me to find videos on any topic..."
                    disabled={isLoading}
                    className="ultron-input flex-1 text-[10px] md:text-[16px] "
                  />
                  <div className="input-border"></div>
                </div>
                <Button type="submit" disabled={isLoading || !input.trim()} className="ultron-button">
                  <div className="button-glow"></div>
                  {isLoading ? (
                    <div className="ultron-loader-small">
                      <div className="loader-ring"></div>
                    </div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="ultron-footer">
            <div className="footer-glow"></div>
            <p>
              <span className="footer-highlight">POWERED BY</span> YouTube and Gemini AI. Results are based on YouTube's
              search algorithm and may vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Custom cursor component
function CustomCursor() {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const lastPos = React.useRef({ x: 0, y: 0 });
  React.useEffect(() => {
    // Lower sensitivity: only update if mouse moved > 8px
    const move = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - lastPos.current.x);
      const dy = Math.abs(e.clientY - lastPos.current.y);
      if (dx > 9 || dy > 9) {
        setPos({ x: e.clientX, y: e.clientY });
        lastPos.current = { x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <img
      src="/ultron-cursor.png"
      alt="Ultron Cursor"
      className="md:visible invisible"
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: 52,
        height: 52,
        pointerEvents: 'none',
        zIndex: 999999999,
        userSelect: 'none',
        mixBlendMode: 'exclusion',
        transform: 'translate(0, 0)',
      }}
      draggable={false}
    />
  );
}