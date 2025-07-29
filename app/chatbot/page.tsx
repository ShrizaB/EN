"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Maximize, Minimize, Eye } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import "./venom-theme.css"
import "./venom-theme-fullscreen.css"
import ChatbotLoading from "./loading"
import VisualizationPanel from "@/components/visualization-panel"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  formatted?: boolean
  header?: string
}

export default function VenomChatbot() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "We... are Venom. The darkness hungers for knowledge. What secrets do you seek, host?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 })
  const [isVisualizationOpen, setIsVisualizationOpen] = useState(false)
  const [currentVisualizationTopic, setCurrentVisualizationTopic] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Handle initial loading for 2 seconds
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Custom cursor effect
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setCursorPos({
				x: e.clientX,
				y: e.clientY,
			});
		};
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    setIsClient(true)

    // Fix for mobile keyboard covering input in fullscreen
    if (typeof window !== 'undefined' && window.visualViewport) {
      const handleResize = () => {
        const inputSection = document.querySelector('.input-section') as HTMLElement | null
        if (inputSection && window.visualViewport) {
          // Add extra bottom padding if keyboard is open
          const keyboardHeight = window.innerHeight - window.visualViewport.height
          inputSection.style.paddingBottom = keyboardHeight > 0 ? `${keyboardHeight + 24}px` : 'env(safe-area-inset-bottom, 16px)'
          // Scroll input into view
          inputSection.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      }
      window.visualViewport.addEventListener('resize', handleResize)
      return () => {
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleResize)
        }
      }
    }
  }, [])

  // Show loading screen for the first 2 seconds
  if (isInitialLoading) {
    return <ChatbotLoading />
  }

  // Function to format AI responses with advanced structure and content parsing
  const formatResponse = (content: string) => {
    // If content is too short, return a meaningful fallback
    if (content.length < 15) {
      return { content: "I understand your question. Let me provide a helpful response.", header: "", formatted: false }
    }

    // Advanced content cleaning - completely fix asterisk issues
    let cleanContent = content
      // Remove any excessive or malformed asterisks first
      .replace(/^\*{1,}\s*$/gm, '') // Remove lines with only asterisks
      .replace(/\*{5,}/g, '**') // Convert 5+ asterisks to double for bold
      .replace(/\*{3,4}/g, '**') // Convert 3-4 asterisks to double for bold
      // Fix malformed bold patterns that cause rendering issues
      .replace(/\*\*\s*\*\*/g, '') // Remove empty bold patterns
      .replace(/\*\*\s+\*\*/g, '') // Remove bold with only spaces
      .replace(/\*\*([^*\n]+?)\*\*/g, '**$1**') // Ensure proper bold formatting
      // Remove lone asterisks that aren't part of formatting
      .replace(/(?<![\*])\*(?![\*\s])/g, '') // Remove single asterisks not followed by space or asterisk
      // Clean up spacing and structure
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .trim()

    // If content becomes meaningless after cleaning, provide a fallback
    if (cleanContent.length < 10 || cleanContent === '' || /^\*+$/.test(cleanContent)) {
      return { 
        content: "I understand your question. Let me provide a comprehensive response to help you.", 
        header: "", 
        formatted: false 
      }
    }

    // Enhanced content formatting for perfect structure
    let formattedContent = cleanContent
      // Remove any potential main heading that starts with # or is all caps
      .replace(/^#+\s*.*$/gm, '') // Remove markdown headings
      .replace(/^[A-Z\s]{10,}:?$/gm, '') // Remove long all-caps titles
      // Ensure proper spacing around numbered lists
      .replace(/(\d+\.\s)/g, '\n$1')
      // Handle bullet points properly (convert * to • for cleaner look)
      .replace(/^\*\s+(?!\*)/gm, '• ')
      .replace(/^-\s+/gm, '• ')
      // Format section headings properly
      .replace(/^([A-Z][A-Za-z\s]{3,25}:)\s*/gm, '\n$1\n')
      // Clean up extra newlines
      .replace(/\n{3,}/g, '\n\n')
      // Remove any remaining problematic asterisks
      .replace(/^\*\s*$/gm, '')
      .replace(/^\*{2,}\s*$/gm, '')
      .trim()

    // Final cleanup - remove empty lines and ensure good structure
    formattedContent = formattedContent
      .split('\n')
      .filter(line => line.trim().length > 0)
      .join('\n')

    return { content: formattedContent, header: "", formatted: true }
  }

  // Function to render message content with perfect formatting
  const renderMessageContent = (message: Message) => {
    if (message.role === "user") {
      return (
        <div className="message-content-wrapper">
          <p className="message-text-content">{message.content}</p>
        </div>
      )
    }

    // For assistant messages - use markdown rendering for proper code formatting
    return (
      <div className="message-content-wrapper">
        <div className="message-text-content markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
            // Custom styling for code blocks
            code: ({ inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || '')
              if (!inline && match) {
                return (
                  <div className="code-block-wrapper">
                    <div className="code-block-header">
                      <span className="code-language">{match[1].toUpperCase()}</span>
                      <button 
                        onClick={() => navigator.clipboard?.writeText(String(children))}
                        className="copy-button"
                        title="Copy code"
                      >
                        📋
                      </button>
                    </div>
                    <pre className="code-block">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                )
              }
              return (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              )
            },
            // Custom styling for paragraphs
            p: ({ children }: any) => (
              <p className="markdown-paragraph">{children}</p>
            ),
            // Custom styling for lists
            ul: ({ children }: any) => (
              <ul className="markdown-list">{children}</ul>
            ),
            ol: ({ children }: any) => (
              <ol className="markdown-ordered-list">{children}</ol>
            ),
            li: ({ children }: any) => (
              <li className="markdown-list-item">{children}</li>
            ),
            // Custom styling for headers
            h1: ({ children }: any) => (
              <h1 className="markdown-h1">{children}</h1>
            ),
            h2: ({ children }: any) => (
              <h2 className="markdown-h2">{children}</h2>
            ),
            h3: ({ children }: any) => (
              <h3 className="markdown-h3">{children}</h3>
            ),
            // Custom styling for bold text
            strong: ({ children }: any) => (
              <strong className="markdown-bold">{children}</strong>
            )
          }}
        >
          {message.content}
        </ReactMarkdown>
        </div>
      </div>
    )
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    // Check if this message might benefit from visualization
    const detectedTopic = detectVisualizationTopic(input.trim())
    
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const messagesForAPI = [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: userMessage.role,
          content: userMessage.content,
        },
      ]

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesForAPI,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", response.status, errorText)
        throw new Error(`API returned ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      // Handle the correct API response structure
      let assistantContent = ""
      if (data.content) {
        // This is the correct format from your API
        assistantContent = data.content
      } else if (data.message && data.message.content) {
        assistantContent = data.message.content
      } else if (data.message) {
        assistantContent = data.message
      } else if (typeof data === 'string') {
        assistantContent = data
      } else {
        assistantContent = "The symbiote received an unexpected response format..."
      }

      // Check for visualization data or auto-detect
      if (data.visualization && data.visualization.needsVisualization) {
        setCurrentVisualizationTopic(data.visualization.searchTerm || input.trim())
        setIsVisualizationOpen(true)
      } else if (detectedTopic) {
        // Auto-open visualization for detected topics
        setCurrentVisualizationTopic(detectedTopic)
        setIsVisualizationOpen(true)
      }

      // Format the response for better presentation
      const responseData = formatResponse(assistantContent)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseData.content,
        role: "assistant",
        timestamp: new Date(),
        formatted: responseData.formatted,
        header: responseData.header,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting chatbot response:", error)
      
      // Get more detailed error information
      let errorMessage = "The symbiote connection fractures... The darkness must realign. Try again, host."
      if (error instanceof Error) {
        console.error("Detailed error message:", error.message)
        // Show detailed error for debugging (remove this later)
        errorMessage = `Debug Error: ${error.message}`
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: errorMessage,
          role: "assistant",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  // Function to detect visualization-worthy topics
  const detectVisualizationTopic = (text: string): string | null => {
    const visualizationKeywords = [
      // Objects and creatures
      'dinosaur', 'animal', 'tiger', 'lion', 'elephant', 'shark', 'whale', 'eagle',
      'heart', 'brain', 'skeleton', 'lung', 'eye', 'hand', 
      'car', 'plane', 'ship', 'rocket', 'robot', 'computer',
      'earth', 'moon', 'mars', 'solar system', 'planet',
      'house', 'castle', 'bridge', 'tower', 'pyramid',
      
      // Processes
      'photosynthesis', 'water cycle', 'digestion', 'respiration', 'circulation',
      'how does', 'how do', 'process of', 'cycle of', 'workflow',
      'algorithm', 'steps to', 'procedure', 'method'
    ]
    
    const lowerText = text.toLowerCase()
    for (const keyword of visualizationKeywords) {
      if (lowerText.includes(keyword)) {
        return keyword
      }
    }
    return null
  }

  

  return (
    <div className={`venom-container${isFullscreen ? " fullscreen mt-0" : ""}`}>
      {/* Custom cursor - always rendered, offscreen if no mouse yet */}
			<div
      className="md:visible invisible"
				ref={cursorRef}
				style={{
					position: "fixed",
					left: 0,
					top: 0,
					width: "32px",
					height: "32px",
					background: `url('https://i.postimg.cc/Hkn1RWcn/Screenshot-2025-06-29-145137-removebg-preview.png') center/cover no-repeat`,
					backgroundColor: "transparent",
					borderRadius: "50%",
					pointerEvents: "none",
					zIndex: 9999,
					transform: cursorPos ? `translate3d(${cursorPos.x - 24}px, ${cursorPos.y - 24}px, 0)` : 'translate3d(-9999px, -9999px, 0)',
					willChange: "transform",
					opacity: 1,
				}}
			/>
      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/J4j8hKCj/klipartz-com.png"
              alt="Ultron 1"
              className="opacity-60 w-[400px] fixed top-24 right-10 h-auto md:visible invisible"
            />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/TYvyTgdF/wp8852682-venom-face-wallpapers.jpg"
              alt="Ultron 2"
              className="venom-image opacity-30 w-[460px] fixed top-16 left-0 object-contain h-[460px] scale-x-[-1]"
            />
          </div>
        </div>
      </div>
      {/* Enhanced Animated Background */}
      <div className="venom-background">
        {/* Digital Matrix Rain */}
        <div className="matrix-rain">
          <div className="matrix-column column-1"></div>
          <div className="matrix-column column-2"></div>
          <div className="matrix-column column-3"></div>
          <div className="matrix-column column-4"></div>
          <div className="matrix-column column-5"></div>
          <div className="matrix-column column-6"></div>
          <div className="matrix-column column-7"></div>
          <div className="matrix-column column-8"></div>
        </div>

        {/* Holographic Grid */}
        <div className="holographic-grid">
          <div className="grid-line horizontal line-1"></div>
          <div className="grid-line horizontal line-2"></div>
          <div className="grid-line horizontal line-3"></div>
          <div className="grid-line vertical line-4"></div>
          <div className="grid-line vertical line-5"></div>
          <div className="grid-line vertical line-6"></div>
        </div>

        {/* Floating Black Particles */}
        <div className="dark-particle particle-1"></div>
        <div className="dark-particle particle-2"></div>
        <div className="dark-particle particle-3"></div>
        <div className="dark-particle particle-4"></div>
        <div className="dark-particle particle-5"></div>
        <div className="dark-particle particle-6"></div>
        <div className="dark-particle particle-7"></div>
        <div className="dark-particle particle-8"></div>

        {/* Enhanced Venom Face */}
        <div className="venom-face-enhanced">
          <div className="venom-eye-enhanced left-eye"></div>
          <div className="venom-eye-enhanced right-eye"></div>
          <div className="venom-mouth">
            <div className="fang fang-1"></div>
            <div className="fang fang-2"></div>
            <div className="fang fang-3"></div>
            <div className="fang fang-4"></div>
          </div>
        </div>

        {/* Dynamic Slithering Tendrils */}
        <svg className="enhanced-tendrils" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg">
          <path
            className="slither-tendril tendril-1"
            d="M0,450 Q200,200 400,450 Q600,700 800,450 Q1000,200 1200,450 Q1300,600 1400,450"
          />
          <path className="slither-tendril tendril-2" d="M0,300 Q300,600 600,300 Q900,0 1200,300 Q1350,450 1400,300" />
          <path
            className="slither-tendril tendril-3"
            d="M0,600 Q250,300 500,600 Q750,900 1000,600 Q1200,400 1400,600"
          />
          <path className="slither-tendril tendril-4" d="M0,150 Q350,750 700,150 Q1050,750 1400,150" />
          <path
            className="slither-tendril tendril-5"
            d="M0,750 Q200,450 400,750 Q600,450 800,750 Q1000,450 1200,750 Q1300,600 1400,750"
          />
        </svg>

        {/* Floating Organic Shapes */}
        <div className="organic-shapes">
          <div className="organic-blob blob-1"></div>
          <div className="organic-blob blob-2"></div>
          <div className="organic-blob blob-3"></div>
          <div className="organic-blob blob-4"></div>
          <div className="organic-blob blob-5"></div>
          <div className="organic-blob blob-6"></div>
        </div>

        {/* Symbiotic Energy Waves */}
        <div className="energy-waves">
          <div className="energy-wave wave-1"></div>
          <div className="energy-wave wave-2"></div>
          <div className="energy-wave wave-3"></div>
        </div>

        {/* Enhanced Symbiote Rings Background */}
        <div className="symbiote-rings">
          <div className="symbiote-blob blob-1"></div>
          <div className="symbiote-blob blob-2"></div>
          <div className="symbiote-blob blob-3"></div>
          <div className="symbiote-blob blob-4"></div>
        </div>

        {/* Glitch Overlay */}
        <div className="glitch-overlay"></div>
      </div>

      {/* Fullscreen Button */}
      <button className="fullscreen-button" onClick={toggleFullscreen}>
        <div className=""></div>
        {isFullscreen ? <Minimize className="fullscreen-icon" /> : <Maximize className="fullscreen-icon" />}
      </button>

      {/* Visualization Button */}
      <button 
        className="fullscreen-button" 
        onClick={() => setIsVisualizationOpen(!isVisualizationOpen)}
        style={{ right: '80px' }}
        title="Toggle Visualization Panel"
      >
        <div className=""></div>
        <Eye className={`fullscreen-icon ${isVisualizationOpen ? 'text-green-400' : ''}`} />
      </button>

      {/* Main Chat Interface */}
      <div className={`chat-interface${isFullscreen ? ' pb-24' : ''}`} style={{overflowX: 'hidden'}}>
        {/* Header Section */}
        {!isFullscreen && (
          <div className="header-section">
            <h1 className="eduplay-title">
              <span className="title-main venom-font uppercase">EduPlay</span>
              <span className="title-sub venom-font">CHATBOT</span>
              <div className="title-accent-line"></div>
              <div className="title-glow"></div>
              <div className="holographic-effect"></div>
              <div className="floating-particles">
                <div className="particle-dot dot-1"></div>
                <div className="particle-dot dot-2"></div>
                <div className="particle-dot dot-3"></div>
                <div className="particle-dot dot-4"></div>
                <div className="particle-dot dot-5"></div>
              </div>
            </h1>
          </div>
        )}
        {/* ---Header Section End--- */}

        <div className="messages-area">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`message-container ${message.role}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="avatar-wrapper">
                <div className={`avatar-orb ${message.role}-orb`}>
                  <div className="orb-pulse"></div>
                  <div className="orb-inner-glow"></div>
                  <div className="orb-hologram"></div>
                  <div className="avatar-symbol">
                    {message.role === "user" ? <User className="symbol-icon" /> : <Bot className="symbol-icon" />}
                  </div>
                </div>
              </div>
              <div className={`chat-bubble ${message.role}-bubble`}>
                <div className="bubble-scanner"></div>
                <div className="bubble-hologram"></div>
                <div className="message-text">
                  {renderMessageContent(message)}
                  <span className="time-stamp">
                    {isClient ? message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : "--:--"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-container assistant loading-state">
              <div className="avatar-wrapper">
                <div className="avatar-orb assistant-orb">
                  <div className="orb-pulse"></div>
                  <div className="orb-inner-glow"></div>
                  <div className="orb-hologram"></div>
                  <div className="avatar-symbol">
                    <Bot className="symbol-icon" />
                  </div>
                </div>
              </div>
              <div className="chat-bubble assistant-bubble">
                <div className="bubble-scanner"></div>
                <div className="bubble-hologram"></div>
                <div className="symbiote-processing">
                  <div className="process-blob blob-1"></div>
                  <div className="process-blob blob-2"></div>
                  <div className="process-blob blob-3"></div>
                  <div className="process-blob blob-4"></div>
                  <div className="process-blob blob-5"></div>
                  <span className="process-text">Symbiote consciousness merging...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-section" style={{paddingBottom: isFullscreen ? 'env(safe-area-inset-bottom, 24px)' : undefined}}>
          <form onSubmit={handleSendMessage} className="message-form">
            <div className="input-field-wrapper">
              <input
                type="text"
                placeholder="Whisper to the darkness..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="venom-input-field"
              />
              <div className="input-field-aura"></div>
              <div className="input-scanner"></div>
              <div className="input-tendrils">
                <div className="input-tendril tendril-left"></div>
                <div className="input-tendril tendril-right"></div>
              </div>
            </div>
            <button type="submit" disabled={isLoading || !input.trim()} className="send-button">
              <div className="button-aura"></div>
              <div className="button-hologram"></div>
              <div className="button-pulse-ring"></div>
              <Send className="send-icon" />
            </button>
          </form>
        </div>
      </div>

      {/* Visualization Panel */}
      <VisualizationPanel
        topic={currentVisualizationTopic}
        isOpen={isVisualizationOpen}
        onToggle={() => setIsVisualizationOpen(!isVisualizationOpen)}
      />
    </div>
  )
}

