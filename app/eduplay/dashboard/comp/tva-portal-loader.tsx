"use client"

import { useEffect, useRef } from "react"

export function TVAPortalLoader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Fix for React 18 StrictMode double effect
    let destroyed = false

    // Set canvas dimensions for high-DPI screens
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transform
    ctx.scale(dpr, dpr)

    // Portal properties
    const centerX = canvas.width / (2 * dpr)
    const centerY = canvas.height / (2 * dpr)
    const maxRadius = Math.min(centerX, centerY) * 0.8
    let currentRadius = 0
    let portalOpacity = 0

    // Particle type
    type Particle = {
      x: number
      y: number
      size: number
      speed: number
      angle: number
      color: string
      opacity: number
      glowing: boolean
    }
    const particles: Particle[] = []

    // Create particles
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * maxRadius * 0.8
      particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        angle,
        color: i % 3 === 0 ? "#A3BE8C" : i % 3 === 1 ? "#CA8A04" : "#58412B",
        opacity: Math.random() * 0.7 + 0.3,
        glowing: Math.random() > 0.7,
      })
    }

    // Helper: Draw a portal ring with optional ripple
    type RingProps = {
      radius: number
      color: string
      opacity: number
      width: number
      ripple?: number
      rotate?: number
    }
    function drawPortalRing({ radius, color, opacity, width, ripple = 0, rotate = 0 }: RingProps) {
      ctx.save()
      ctx.strokeStyle = color
      ctx.globalAlpha = opacity
      ctx.lineWidth = width
      ctx.shadowColor = color
      ctx.shadowBlur = 18
      ctx.beginPath()
      for (let i = 0; i <= 360; i += 2) {
        const angle = (i + rotate) * Math.PI / 180
        const r = radius + Math.sin(angle * 6 + Date.now() / 400) * ripple
        const x = centerX + Math.cos(angle) * r
        const y = centerY + Math.sin(angle) * r
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
      ctx.restore()
    }

    // Animation
    let animationFrame: number
    const startTime = Date.now()

    const animate = () => {
      if (destroyed) return

      // Clear entire canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const elapsed = Date.now() - startTime
      const animationProgress = Math.min(elapsed / 2000, 1) // 2 second animation

      // Update portal
      currentRadius = maxRadius * animationProgress
      portalOpacity = animationProgress

      // Draw portal background
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, currentRadius)
      gradient.addColorStop(0, "rgba(88, 65, 43, 0.8)")
      gradient.addColorStop(0.4, "rgba(88, 65, 43, 0.5)")
      gradient.addColorStop(0.7, "rgba(163, 190, 140, 0.3)")
      gradient.addColorStop(1, "rgba(88, 65, 43, 0)")
      ctx.beginPath()
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw animated portal rings
      drawPortalRing({
        radius: currentRadius * 0.98,
        color: "#A3BE8C",
        opacity: 0.8 * portalOpacity,
        width: 7,
        ripple: 6 * portalOpacity,
        rotate: (Date.now() / 12) % 360,
      })
      drawPortalRing({
        radius: currentRadius * 0.85,
        color: "#CA8A04",
        opacity: 0.5 * portalOpacity,
        width: 4,
        ripple: 3 * portalOpacity,
        rotate: (Date.now() / 20) % 360,
      })
      drawPortalRing({
        radius: currentRadius * 0.7,
        color: "#58412B",
        opacity: 0.3 * portalOpacity,
        width: 2,
        ripple: 2 * portalOpacity,
        rotate: (Date.now() / 30) % 360,
      })

      // Draw inner glow
      const innerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, currentRadius * 0.7)
      innerGlow.addColorStop(0, "rgba(163, 190, 140, 0.3)")
      innerGlow.addColorStop(0.5, "rgba(163, 190, 140, 0.1)")
      innerGlow.addColorStop(1, "rgba(163, 190, 140, 0)")
      ctx.beginPath()
      ctx.arc(centerX, centerY, currentRadius * 0.7, 0, Math.PI * 2)
      ctx.fillStyle = innerGlow
      ctx.fill()

      // Draw secondary ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, currentRadius * 0.85, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(202, 138, 4, ${portalOpacity * 0.7})`
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Optimize particle drawing by grouping by color
      const colors = ["#A3BE8C", "#CA8A04", "#58412B"]
      colors.forEach((color) => {
        ctx.fillStyle = color // Set fillStyle once per color
        particles
          .filter((particle) => particle.color === color)
          .forEach((particle) => {
            // Update particle position
            const dx = centerX - particle.x
            const dy = centerY - particle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance > currentRadius * 0.9) {
              particle.x += dx * 0.02
              particle.y += dy * 0.02
            } else {
              particle.angle += 0.01 * particle.speed
              particle.x = centerX + Math.cos(particle.angle) * distance * 0.99
              particle.y = centerY + Math.sin(particle.angle) * distance * 0.99
            }

            // Draw particle
            if (particle.glowing) {
              ctx.shadowColor = color
              ctx.shadowBlur = 5
            }
            ctx.globalAlpha = particle.opacity
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            ctx.fill()
            ctx.shadowBlur = 0
            ctx.globalAlpha = 1
          })
      })

      // Add glitch effect
      if (Math.random() > 0.95) {
        ctx.fillStyle = "rgba(163, 190, 140, 0.2)"
        ctx.fillRect(
          centerX - currentRadius * Math.random(),
          centerY - currentRadius * Math.random() * 0.5,
          currentRadius * Math.random() * 2,
          10,
        )
      }

      // Add scan lines
      for (let i = 0; i < canvas.height / dpr; i += 4) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
        ctx.fillRect(0, i, canvas.width / dpr, 1)
      }

      // Add TVA text
      if (animationProgress > 0.5) {
        const textOpacity = (animationProgress - 0.5) * 2
        ctx.font = "bold 16px monospace"
        ctx.textAlign = "center"
        ctx.fillStyle = `rgba(163, 190, 140, ${textOpacity})`
        ctx.fillText("TVA PORTAL ACTIVATED", centerX, centerY + currentRadius + 30)
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      destroyed = true
      cancelAnimationFrame(animationFrame)
      ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transform on cleanup
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: "100%", height: "100%" }} />
      <div className="absolute inset-0 crt-scanlines opacity-20"></div>
    </div>
  )
}