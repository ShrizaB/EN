"use client"

import { useEffect, useRef } from "react"

export function TVAPortalLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for better quality
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2
    ctx.scale(2, 2) // Scale for higher resolution

    // Portal properties
    const centerX = canvas.width / 4 // Divide by 4 because we scaled by 2
    const centerY = canvas.height / 4
    const maxRadius = Math.min(canvas.width / 4, canvas.height / 4) * 0.4
    let currentRadius = 0
    let portalOpacity = 0

    // Particles
    const particles: {
      x: number
      y: number
      size: number
      speed: number
      angle: number
      color: string
      opacity: number
      glowing: boolean
    }[] = []

    // Create particles
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * maxRadius * 0.8

      particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        angle: angle,
        color: i % 3 === 0 ? "#A3BE8C" : i % 3 === 1 ? "#CA8A04" : "#58412B",
        opacity: Math.random() * 0.7 + 0.3,
        glowing: Math.random() > 0.7,
      })
    }

    // Animation
    let animationFrame: number
    const startTime = Date.now()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2) // Divide by 2 because we scaled by 2

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

      // Draw portal inner glow
      const innerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, currentRadius * 0.7)
      innerGlow.addColorStop(0, "rgba(163, 190, 140, 0.3)")
      innerGlow.addColorStop(0.5, "rgba(163, 190, 140, 0.1)")
      innerGlow.addColorStop(1, "rgba(163, 190, 140, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, currentRadius * 0.7, 0, Math.PI * 2)
      ctx.fillStyle = innerGlow
      ctx.fill()

      // Draw portal ring with glow
      ctx.beginPath()
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(163, 190, 140, ${portalOpacity})`
      ctx.lineWidth = 3
      ctx.stroke()

      // Add glow effect
      ctx.shadowColor = "rgba(163, 190, 140, 0.7)"
      ctx.shadowBlur = 15
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw secondary ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, currentRadius * 0.85, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(202, 138, 4, ${portalOpacity * 0.7})`
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particles toward center as portal grows
        const dx = centerX - particle.x
        const dy = centerY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > currentRadius * 0.9) {
          // Pull particles inside the portal
          particle.x += dx * 0.02
          particle.y += dy * 0.02
        } else {
          // Orbit around center
          particle.angle += 0.01 * particle.speed
          particle.x = centerX + Math.cos(particle.angle) * distance * 0.99
          particle.y = centerY + Math.sin(particle.angle) * distance * 0.99
        }

        // Draw particle with glow for some particles
        if (particle.glowing) {
          ctx.shadowColor = particle.color
          ctx.shadowBlur = 5
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()
        ctx.shadowBlur = 0
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
      for (let i = 0; i < canvas.height / 2; i += 4) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
        ctx.fillRect(0, i, canvas.width / 2, 1)
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
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ width: "100%", height: "100%" }} />
      <div className="absolute inset-0 crt-scanlines opacity-20"></div>
    </div>
  )
}
