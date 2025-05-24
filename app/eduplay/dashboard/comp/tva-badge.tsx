"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { TVAGlitchText } from "./tva-glitch-text"

interface TVABadgeProps {
  userId: string
  userName: string
}

export function TVABadge({ userId, userName }: TVABadgeProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 500)
      }
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div
      className="relative w-72 h-40 cursor-pointer perspective-1000 z-20"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""
          }`}
      >
        {/* Front of badge */}
        <div className="absolute inset-0 backface-hidden">
          <Card
            className={`w-full h-full bg-tva-brown border-2 border-tva-gold rounded-md overflow-hidden tva-hover-glow ${isGlitching ? "animate-glitch" : ""
              }`}
          >
            <div className="absolute inset-0 tva-logo-bg opacity-10"></div>
            <div className="absolute inset-0 crt-overlay opacity-5"></div>
            <div className="p-4 relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <TVAGlitchText
                    text="TIME VARIANCE AUTHORITY"
                    className="text-xs font-mono font-bold text-tva-gold"
                    glitchIntensity="medium"
                  />
                  <div className="h-px w-32 bg-gradient-to-r from-tva-gold/30 via-tva-gold to-tva-gold/30 my-1"></div>
                  <p className="text-xs text-light-gray font-mono">VARIANT IDENTIFICATION</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-loki-green/20 flex items-center justify-center border border-loki-green/50">
                  <span className="text-loki-green font-mono font-bold">TVA</span>
                </div>
              </div>

              <div className="mt-4 flex-grow">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-md bg-dark-gray border border-tva-gold/30 flex items-center justify-center relative overflow-hidden">
                    <span className="text-tva-gold font-mono text-xs">PHOTO</span>
                    <div className="absolute inset-0 bg-loki-green/5"></div>
                    <div className="absolute inset-0 crt-scanlines opacity-20"></div>
                  </div>
                  <div>
                    <p className="text-loki-green font-mono text-sm font-bold">{userName}</p>
                    <p className="text-light-gray font-mono text-xs">VARIANT ID: {userId}</p>
                    <p className="text-light-gray font-mono text-xs mt-1">
                      STATUS: <span className="text-loki-green">MONITORED</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="text-xs text-tva-gold/70 font-mono text-right">TAP TO FLIP</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Back of badge */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <Card className="w-full h-full bg-tva-brown border-2 border-tva-gold rounded-md overflow-hidden tva-hover-glow">
            <div className="absolute inset-0 tva-logo-bg opacity-10"></div>
            <div className="absolute inset-0 crt-overlay opacity-5"></div>
            <div className="p-4 relative z-10 h-full flex flex-col">
              <div>
                <TVAGlitchText
                  text="VARIANT INFORMATION"
                  className="text-sm font-mono font-bold text-tva-gold mb-2"
                  glitchIntensity="low"
                />
                <div className="h-px w-full bg-gradient-to-r from-tva-gold/30 via-tva-gold to-tva-gold/30 mb-3"></div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-light-gray">CLEARANCE:</span>
                    <span className="text-tva-gold">LEVEL 2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">BRANCH:</span>
                    <span className="text-tva-gold">EDUCATION</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">TIMELINE:</span>
                    <span className="text-tva-gold">SACRED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-gray">NEXUS EVENT:</span>
                    <span className="text-loki-green">NONE</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="w-32 h-10 border border-tva-gold/50 rounded-sm flex items-center justify-center relative overflow-hidden bg-dark-gray">
                  <span className="font-mono text-xs text-tva-gold relative z-10">AUTHORIZED SIGNATURE</span>
                  <div className="absolute inset-0 bg-loki-green/5"></div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="text-xs text-tva-gold/70 font-mono text-right">TAP TO FLIP</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <style jsx>{`
            .perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
      `}</style>
    </div>
  )
}