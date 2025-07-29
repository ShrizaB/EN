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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

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

  // Enhanced kid-friendly video search with comprehensive content filtering
  const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
    try {
      if (!YOUTUBE_API_KEY) {
        console.error("YouTube API key is missing")
        return []
      }

      // Enhanced educational search query with strict kid-friendly terms
      const kidFriendlyQuery = `${query} for kids educational children learning tutorial lesson safe`

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${encodeURIComponent(
          kidFriendlyQuery,
        )}&type=video&safeSearch=strict&regionCode=US&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()

      // Define terms arrays outside for reuse
      const blacklistedTerms = [
        // Adult content
        'adult', 'mature', 'explicit', 'nsfw', 'sexy', 'hot', 'nude', 'naked', 'bikini', 'underwear',
        'romantic', 'dating', 'kiss', 'love story', 'relationship', 'marriage', 'wedding',
        
        // Violence & scary content
        'violent', 'scary', 'horror', 'blood', 'kill', 'death', 'weapon', 'gun', 'fight', 'war',
        'battle', 'zombie', 'ghost', 'monster', 'demon', 'devil', 'evil', 'dark', 'nightmare',
        
        // Substances
        'drug', 'alcohol', 'beer', 'wine', 'smoke', 'cigarette', 'drunk', 'high', 'weed', 'cannabis',
        
        // Inappropriate language/behavior
        'stupid', 'idiot', 'hate', 'dumb', 'crazy', 'insane', 'mad', 'angry', 'furious',
        'curse', 'swear', 'bad word', 'inappropriate', 'offensive', 'rude', 'mean',
        
        // Non-educational entertainment
        'prank', 'troll', 'roast', 'diss', 'beef', 'drama', 'gossip', 'scandal', 'controversy',
        'clickbait', 'exposed', 'leaked', 'secret', 'hidden', 'conspiracy',
        
        // Gaming content (can be inappropriate)
        'minecraft', 'fortnite', 'roblox', 'gaming', 'gamer', 'gameplay', 'streamer', 'twitch',
        'discord', 'mod', 'hack', 'cheat', 'glitch',
        
        // Social media/trends
        'tiktok', 'instagram', 'snapchat', 'viral', 'trend', 'challenge', 'dance', 'vlog',
        'reaction', 'review', 'unboxing', 'haul', 'makeup', 'fashion',
        
        // Inappropriate topics for kids
        'money', 'rich', 'expensive', 'buy', 'purchase', 'shopping', 'brand', 'luxury',
        'celebrity', 'famous', 'star', 'popular', 'cool', 'awesome', 'epic', 'insane'
      ]

      const educationalTerms = [
        'learn', 'education', 'educational', 'tutorial', 'lesson', 'teach', 'teaching',
        'school', 'student', 'study', 'academic', 'knowledge', 'skill', 'training',
        'kids', 'children', 'child', 'toddler', 'preschool', 'kindergarten',
        'elementary', 'primary', 'grade', 'classroom', 'homeschool',
        'science', 'math', 'mathematics', 'reading', 'writing', 'history', 'geography',
        'art', 'music', 'coding', 'programming', 'computer', 'technology',
        'nature', 'animal', 'plant', 'environment', 'space', 'solar system',
        'alphabet', 'number', 'count', 'color', 'shape', 'pattern', 'basic', 'simple',
        'beginner', 'introduction', 'fundamental', 'concept', 'theory', 'practice'
      ]

      // Comprehensive content filtering
      let safeVideos = data.items.filter((item: any) => {
        const title = item.snippet.title.toLowerCase()
        const description = item.snippet.description.toLowerCase()
        const channelTitle = item.snippet.channelTitle.toLowerCase()
        
        // Check for blacklisted terms
        const hasBlacklistedContent = blacklistedTerms.some((term: string) => 
          title.includes(term) || description.includes(term) || channelTitle.includes(term)
        )
        
        // Educational whitelist - content must contain these terms
        const hasEducationalContent = educationalTerms.some((term: string) => 
          title.includes(term) || description.includes(term) || channelTitle.includes(term)
        )
        
        // Additional safety checks
        const isSafeChannel = !channelTitle.includes('gaming') && 
                             !channelTitle.includes('entertainment') &&
                             !channelTitle.includes('fun') &&
                             !channelTitle.includes('comedy')
        
        const isSafeTitle = title.length > 10 && // Avoid very short, potentially clickbait titles
                           !title.includes('!') && // Avoid sensational titles
                           !title.includes('???') && // Avoid mysterious titles
                           !title.includes('shocking') &&
                           !title.includes('amazing') &&
                           !title.includes('incredible')
        
        // Final safety check: must be educational, not blacklisted, and from safe channel
        return hasEducationalContent && !hasBlacklistedContent && isSafeChannel && isSafeTitle
      })

      // If we don't have enough safe videos, try a broader search
      if (safeVideos.length < 3) {
        const broadQuery = `${query} educational kids learning`
        const broadResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(
            broadQuery,
          )}&type=video&safeSearch=strict&regionCode=US&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`,
        )

        if (broadResponse.ok) {
          const broadData = await broadResponse.json()
          const additionalVideos = broadData.items.filter((item: any) => {
            const title = item.snippet.title.toLowerCase()
            const description = item.snippet.description.toLowerCase()
            const channelTitle = item.snippet.channelTitle.toLowerCase()
            
            const hasEducationalContent = educationalTerms.some((term: string) => 
              title.includes(term) || description.includes(term) || channelTitle.includes(term)
            )
            
            const hasBlacklistedContent = blacklistedTerms.some((term: string) => 
              title.includes(term) || description.includes(term) || channelTitle.includes(term)
            )
            
            return hasEducationalContent && !hasBlacklistedContent
          })
          
          // Add unique videos to safe videos
          const existingIds = new Set(safeVideos.map((v: any) => v.id.videoId))
          const newVideos = additionalVideos.filter((v: any) => !existingIds.has(v.id.videoId))
          safeVideos = [...safeVideos, ...newVideos]
        }
      }

      // Ensure we have at least 3 videos - if still not enough, use basic educational search
      if (safeVideos.length < 3) {
        const basicQuery = `basic educational video children`
        const basicResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(
            basicQuery,
          )}&type=video&safeSearch=strict&regionCode=US&relevanceLanguage=en&key=${YOUTUBE_API_KEY}`,
        )

        if (basicResponse.ok) {
          const basicData = await basicResponse.json()
          const basicVideos = basicData.items.filter((item: any) => {
            const title = item.snippet.title.toLowerCase()
            const description = item.snippet.description.toLowerCase()
            
            return (title.includes('educational') || title.includes('learning') || 
                   title.includes('kids') || description.includes('educational'))
          })
          
          const existingIds = new Set(safeVideos.map((v: any) => v.id.videoId))
          const newBasicVideos = basicVideos.filter((v: any) => !existingIds.has(v.id.videoId))
          safeVideos = [...safeVideos, ...newBasicVideos]
        }
      }

      // Return at least 3 videos, maximum 5
      const finalVideos = safeVideos.slice(0, Math.max(3, Math.min(5, safeVideos.length)))
      
      return finalVideos.map((item: any) => ({
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

  // Enhanced AI ranking with strict child safety and educational focus
  const rankVideosWithAI = async (query: string, videos: YouTubeVideo[]): Promise<YouTubeVideo[]> => {
    try {
      if (videos.length === 0) return []

      // AI prompt with strict educational and safety criteria
      const prompt = `
        You are evaluating educational videos for children aged 3-12. These videos must meet STRICT safety and educational standards.
        
        Query: "${query}"
        
        MANDATORY REQUIREMENTS - Videos must be:
        1. 100% child-safe (no violence, scary content, inappropriate language, adult themes)
        2. Purely educational and age-appropriate
        3. From trusted educational channels or certified kid-friendly creators
        4. Clear, engaging, and pedagogically sound for children
        5. Focused on learning outcomes, not entertainment
        
        AUTOMATIC REJECTION CRITERIA - Reject videos that contain:
        - Any gaming content (Minecraft, Roblox, etc.)
        - Pranks, challenges, or social media content
        - Adult themes, violence, or inappropriate language
        - Entertainment-focused content without educational value
        - Commercial or promotional content
        - Unverified or suspicious channels
        
        EDUCATIONAL PRIORITY - Prefer videos that:
        - Are from established educational channels
        - Have clear learning objectives
        - Are appropriate for classroom use
        - Have structured, pedagogical content
        - Focus on fundamental concepts and skills
        
        Videos to evaluate:
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
        
        Return ONLY a JSON array with the indices of videos that meet ALL safety and educational criteria, ranked by educational value.
        Example: [3, 1, 2] (only include videos that pass all requirements)
        If NO videos meet the criteria, return: []
      `

      const result = await model.generateContent(prompt)
      const responseText = result.response.text()

      // Extract ranked indices
      const indexMatch = responseText.match(/\[[\d,\s]*\]/)
      if (!indexMatch) {
        console.log("No safe videos found by AI filter")
        return []
      }

      const rankedIndices = JSON.parse(indexMatch[0])
      
      // Return only videos that passed AI safety check
      const safeVideos: YouTubeVideo[] = []
      for (const idx of rankedIndices) {
        if (videos[idx - 1]) {
          safeVideos.push(videos[idx - 1])
        }
      }

      return safeVideos.slice(0, Math.max(3, Math.min(5, safeVideos.length))) // Ensure at least 3, max 5
    } catch (error) {
      console.error("Error ranking videos with AI:", error)
      // If AI fails, return the original videos (still maintaining safety)
      return videos.slice(0, Math.max(3, Math.min(5, videos.length)))
    }
  }

  // Enhanced response generation with safety emphasis
  const generateResponse = async (query: string, videos: YouTubeVideo[]): Promise<string> => {
    try {
      if (videos.length === 0) {
        return "I couldn't find any child-safe educational videos on that topic. Please try searching for basic educational concepts like 'learning colors', 'counting numbers', or 'alphabet for kids'."
      }

      const prompt = `
        Generate a friendly, reassuring response for parents/teachers about educational videos for children.
        
        Search query: "${query}"
        Found: ${videos.length} carefully filtered, child-safe educational videos
        
        Write a response that:
        1. Acknowledges the search in a positive way
        2. Emphasizes that all videos are strictly filtered for child safety
        3. Mentions they are educational and age-appropriate
        4. Encourages viewing the selected videos
        5. Suggests they can search for more specific educational topics
        
        Keep it warm, professional, and reassuring (2-3 sentences max).
        Focus on safety and educational value.
      `

      const result = await model.generateContent(prompt)
      return result.response.text().trim()
    } catch (error) {
      console.error("Error generating AI response:", error)
      return "I found some carefully selected, child-safe educational videos on that topic. All content has been filtered to ensure it's appropriate and educational for children!"
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
              <br />
              <span className="text-sm text-green-400 font-semibold">
                🛡️ All videos are strictly filtered for child safety and educational content only
              </span>
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
                  {message.role === "user" ? (
                    <div className="flex gap-3">
                      <div className="ultron-message ultron-message-user">
                        <div className="message-border"></div>
                        <p>{message.content}</p>
                      </div>
                      <Avatar className="ultron-avatar ultron-avatar-user">
                        <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Avatar className="ultron-avatar ultron-avatar-ai">
                        <AvatarFallback>AI</AvatarFallback>
                        <div className="avatar-pulse"></div>
                      </Avatar>
                      <div className="ultron-message ultron-message-ai">
                        <div className="message-border"></div>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced video card rendering with safety indicators */}
                  {message.videos && message.videos.length > 0 && (
                    <div className="flex flex-col gap-4 w-full mt-2">
                      {message.videos.map((video) => (
                        <div key={video.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 bg-black/40 rounded-lg p-3 shadow-md w-full max-w-2xl mx-auto">
                          <div className="relative">
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="w-full sm:w-48 h-32 sm:h-28 object-cover rounded-md flex-shrink-0"
                              style={{maxWidth: 220, minWidth: 0}}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                              <a
                                href={`https://www.youtube.com/watch?v=${video.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-red-400 transition-colors"
                                title="Watch on YouTube (opens in new tab)"
                              >
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </a>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-base md:text-lg text-ultron-red mb-1 line-clamp-2" title={video.title}>{video.title}</div>
                            <div className="text-xs md:text-sm text-ultron-gray mb-1 truncate" title={video.channelTitle}>{video.channelTitle}</div>
                            <div className="text-xs md:text-sm text-ultron-gray mb-1">{new Date(video.publishedAt).toLocaleDateString()}</div>
                            <div className="text-xs md:text-sm text-ultron-gray whitespace-pre-line break-words line-clamp-3" style={{wordBreak: 'break-word'}}>{video.description}</div>
                            <div className="mt-2 text-xs text-green-400 font-semibold">
                              ✅ Child-safe & Educational
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                        <p>Searching for safe educational videos...</p>
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
              <br />
              <span className="text-xs text-yellow-400">
                ⚠️ All videos are pre-filtered for child safety. Parent supervision recommended.
              </span>
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
        width: 22,
        height: 22,
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