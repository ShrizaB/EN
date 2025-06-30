"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface TimelineData {
  name: string
  value: number
  count: number
  color: string
}

interface TVATimelineProps {
  data: TimelineData[]
}

export function TVATimeline({ data }: TVATimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const animationFrameRef = useRef<number>(0)
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Handle touch/mouse enter with debouncing
  const handleEnter = useCallback((index: number) => {
    setActiveIndex(index)
    setHoveredIndex(index)
    
    // Clear any existing timeout
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current)
      touchTimerRef.current = null
    }
    
    // Only set timeout for mobile
    if (isMobile) {
      // Set a longer timeout for mobile (15 seconds)
      touchTimerRef.current = setTimeout(() => {
        setHoveredIndex(null)
      }, 15000)
    }
  }, [isMobile])

  const handleLeave = useCallback(() => {
    // On mobile, don't clear hover state immediately
    if (!isMobile) {
      setHoveredIndex(null)
    }
  }, [isMobile])
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current)
      }
    }
  }, [])

  // Enhanced canvas drawing for better performance
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions - reduced resolution for better performance
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let angle = 0

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw enhanced timeline branches
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) * 0.5

      // Draw main timeline with glow effect
      ctx.beginPath()
      ctx.moveTo(centerX - radius, centerY)
      ctx.lineTo(centerX + radius, centerY)
      ctx.strokeStyle = "rgba(0, 255, 136, 0.4)"
      ctx.lineWidth = 3
      ctx.shadowColor = "#00FF88"
      ctx.shadowBlur = 5
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw enhanced branches - only when data exists
      if (data.length > 0) {
        data.forEach((entry, index) => {
          const branchAngle = (index / data.length) * Math.PI * 2 + angle
          const branchLength = radius * (entry.value / 100) * 0.6

          ctx.beginPath()
          ctx.moveTo(centerX, centerY)

          const endX = centerX + Math.cos(branchAngle) * branchLength
          const endY = centerY + Math.sin(branchAngle) * branchLength

          ctx.lineTo(endX, endY)
          ctx.strokeStyle = index === hoveredIndex ? "#00FF88" : entry.color
          ctx.lineWidth = index === hoveredIndex ? 3 : 2

          if (index === hoveredIndex) {
            ctx.shadowColor = "#00FF88"
            ctx.shadowBlur = 8
          }

          ctx.stroke()
          ctx.shadowBlur = 0

          // Draw enhanced nodes with glow
          ctx.beginPath()
          ctx.arc(endX, endY, index === hoveredIndex ? 6 : 4, 0, Math.PI * 2)
          ctx.fillStyle = index === hoveredIndex ? "#00FF88" : entry.color

          if (index === hoveredIndex) {
            ctx.shadowColor = "#00FF88"
            ctx.shadowBlur = 10
          }

          ctx.fill()
          ctx.shadowBlur = 0
        })
      }

      // Slower rotation for better performance
      angle += 0.003

      // Enhanced glitch frequency
      if (Math.random() > 0.98) {
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [data, hoveredIndex])

  return (
    <div className="relative h-full w-full">
      {/* Enhanced background timeline visualization */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-0 ${isAnimating ? "animate-glitch" : ""}`}
        style={{ willChange: "auto" }}
      />

      {/* Enhanced pie chart with bright colors */}
      <div className="relative z-10 h-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {data.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                  </linearGradient>
                ))}

                {/* Enhanced gradients with bright green */}
                <linearGradient id="lokiGreenGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00FF88" stopOpacity={1} />
                  <stop offset="100%" stopColor="#D4A017" stopOpacity={0.8} />
                </linearGradient>

                <linearGradient id="tvaGoldGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#D4A017" stopOpacity={1} />
                  <stop offset="100%" stopColor="#E76F51" stopOpacity={0.8} />
                </linearGradient>

                <linearGradient id="tvaOrangeGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E76F51" stopOpacity={1} />
                  <stop offset="100%" stopColor="#00FF88" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <Pie
                activeIndex={activeIndex}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(e, index) => handleEnter(index)}
                onMouseLeave={handleLeave}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const target = document.elementFromPoint(touch.clientX, touch.clientY);
                  // Find the nearest slice
                  const slice = target?.closest('.recharts-pie-sector');
                  if (slice) {
                    const index = parseInt(slice.getAttribute('sector-idx') || '0', 10);
                    handleEnter(index);
                  }
                }}
                onTouchEnd={(e) => {
                  // Don't prevent default to allow natural touch behavior
                  if (!isMobile) {
                    e.preventDefault();
                  }
                }}
                animationBegin={0}
                animationDuration={0} // Disabled animations
                stroke="#1A1A1A"
                strokeWidth={2}
                isAnimationActive={false} // Disabled animations
              >
                {data.map((entry, index) => {
                  let fillGradient = `url(#colorGradient-${index})`

                  // Use specific gradients for TVA aesthetic
                  if (index === 0) fillGradient = "url(#lokiGreenGradient)"
                  else if (index === 1) fillGradient = "url(#tvaGoldGradient)"
                  else if (index === 2) fillGradient = "url(#tvaOrangeGradient)"

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={fillGradient}
                      stroke="#1A1A1A"
                      strokeWidth={2}
                      style={{
                        filter: index === activeIndex ? "drop-shadow(0 0 12px #00FF88)" : "none",
                      }}
                    />
                  )
                })}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#3C2F2F",
                  border: "1px solid #00FF88",
                  borderRadius: "4px",
                  padding: "8px",
                  color: "#D9D9D9",
                  fontFamily: "Courier New, monospace",
                  boxShadow: "0 0 15px rgba(0, 255, 136, 0.3)",
                }}
                itemStyle={{ color: "#D9D9D9" }}
                labelStyle={{ color: "#00FF88" }}
                formatter={(value: number, name: string, props: any) => {
                  return [`${value}%`, `${name} (${props.payload.count} activities)`]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-loki-green font-mono">NO TIMELINE DATA</p>
              <p className="text-sm text-light-gray font-mono">Complete activities to see your progress</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
