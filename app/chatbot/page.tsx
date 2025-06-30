"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Maximize, Minimize } from "lucide-react"
import "./venom-theme.css"
import "./venom-theme-fullscreen.css"
import ChatbotLoading from "./loading"

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
    if (message.role === "user" || !message.formatted) {
      return (
        <div className="message-content-wrapper">
          <p className="message-text-content">{message.content}</p>
        </div>
      )
    }

    // For formatted assistant messages - COMPLETELY FIXED
    const lines = message.content.split('\n').filter(line => line.trim())
    
    return (
      <div className="message-content-wrapper">
        <div className="response-content">
          {lines.map((line, index) => {
            const trimmedLine = line.trim()
            
            // Skip empty lines, lone asterisks, or malformed content
            if (!trimmedLine || 
                trimmedLine === '*' || 
                /^\*+$/.test(trimmedLine) || 
                trimmedLine.length < 2) {
              return null
            }
            
            // Handle **bold text** - COMPLETELY FIXED PARSING
            if (trimmedLine.includes('**')) {
              // Advanced bold parsing to handle all edge cases
              const boldPattern = /\*\*([^*\n]+?)\*\*/g
              
              if (boldPattern.test(trimmedLine)) {
                // Reset regex for actual replacement
                boldPattern.lastIndex = 0
                const parts = []
                let lastIndex = 0
                let match
                
                // Parse the line piece by piece
                while ((match = boldPattern.exec(trimmedLine)) !== null) {
                  // Add text before the bold part
                  if (match.index > lastIndex) {
                    const beforeText = trimmedLine.slice(lastIndex, match.index)
                    if (beforeText.trim()) {
                      parts.push({ type: 'text', content: beforeText })
                    }
                  }
                  
                  // Add the bold part
                  const boldText = match[1].trim()
                  if (boldText) {
                    parts.push({ type: 'bold', content: boldText })
                  }
                  
                  lastIndex = match.index + match[0].length
                }
                
                // Add any remaining text after the last bold part
                if (lastIndex < trimmedLine.length) {
                  const afterText = trimmedLine.slice(lastIndex)
                  if (afterText.trim()) {
                    parts.push({ type: 'text', content: afterText })
                  }
                }
                
                // Render the parsed parts
                if (parts.length > 0) {
                  return (
                    <div key={index} className="text-with-bold">
                      {parts.map((part, partIndex) => {
                        if (part.type === 'bold') {
                          return (
                            <strong key={partIndex} className="bold-emphasis">
                              {part.content}
                            </strong>
                          )
                        }
                        return (
                          <span key={partIndex}>{part.content}</span>
                        )
                      })}
                    </div>
                  )
                }
              }
            }
            
            // Check if it's a numbered list item
            if (/^\d+\.\s/.test(trimmedLine)) {
              const match = trimmedLine.match(/^(\d+)\.\s(.+)/)
              if (match && match[2].trim()) {
                return (
                  <div key={index} className="numbered-item">
                    <span className="item-number">{match[1]}</span>
                    <span className="item-text">{match[2]}</span>
                  </div>
                )
              }
              return null
            }
            
            // Check if it's a bullet point
            if (/^[•\-]\s/.test(trimmedLine)) {
              const text = trimmedLine.replace(/^[•\-]\s/, '').trim()
              if (text && text.length > 1) {
                return (
                  <div key={index} className="bullet-item">
                    <span className="bullet-point">•</span>
                    <span className="item-text">{text}</span>
                  </div>
                )
              }
              return null
            }
            
            // Check if it's a question
            if (trimmedLine.includes('?') && trimmedLine.length > 5) {
              return (
                <div key={index} className="question-item">
                  <span className="question-icon">❓</span>
                  <span className="question-text">{trimmedLine}</span>
                </div>
              )
            }
            
            // Check if it's code (contains backticks)
            if (trimmedLine.includes('`')) {
              const codePattern = /`([^`]+)`/g
              if (codePattern.test(trimmedLine)) {
                // Reset regex
                codePattern.lastIndex = 0
                const parts = []
                let lastIndex = 0
                let match
                
                while ((match = codePattern.exec(trimmedLine)) !== null) {
                  if (match.index > lastIndex) {
                    parts.push({ type: 'text', content: trimmedLine.slice(lastIndex, match.index) })
                  }
                  parts.push({ type: 'code', content: match[1] })
                  lastIndex = match.index + match[0].length
                }
                
                if (lastIndex < trimmedLine.length) {
                  parts.push({ type: 'text', content: trimmedLine.slice(lastIndex) })
                }
                
                return (
                  <div key={index} className="text-with-code">
                    {parts.map((part, partIndex) => {
                      if (part.type === 'code') {
                        return (
                          <code key={partIndex} className="inline-code">
                            {part.content}
                          </code>
                        )
                      }
                      return part.content ? <span key={partIndex}>{part.content}</span> : null
                    })}
                  </div>
                )
              }
            }
            
            // Check if it's a section title (short, important line)
            if (trimmedLine.length < 60 && trimmedLine.length > 3 &&
                (trimmedLine.endsWith(':') || 
                 /^[A-Z][A-Z\s]{2,}$/.test(trimmedLine) ||
                 /^[A-Z][^.!?]*:?$/.test(trimmedLine))) {
              return (
                <h3 key={index} className="section-title">
                  {trimmedLine.replace(':', '')}
                </h3>
              )
            }
            
            // Regular paragraph (only if it has meaningful content)
            if (trimmedLine.length > 3) {
              return (
                <p key={index} className="content-paragraph">
                  {trimmedLine}
                </p>
              )
            }
            
            return null
          })}
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

  

  return (
    <div className={`venom-container${isFullscreen ? " fullscreen mt-0" : ""}`}>
      {/* Custom cursor - always rendered, offscreen if no mouse yet */}
			<div
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

      {/* Main Chat Interface */}
      <div className="chat-interface">
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

        <div className="input-section">
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
    </div>
  )
}

