import type { Metadata } from "next"
import AICodeChallenge from "@/components/ai-code/ai-code-challenge"
import { Share_Tech_Mono } from 'next/font/google'
import './hacker-theme.css'

const hackerFont = Share_Tech_Mono({ subsets: ['latin'], weight: ['400'] })

export const metadata: Metadata = {
  title: "AI CODE - Programming Challenges | EduGuide",
  description: "Test your programming skills with AI-powered feedback on your code solutions.",
}

export default function AICodePage() {
  return (
    <div className={`${hackerFont.className} relative min-h-screen overflow-hidden hacker-bg-animate`}>
      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Minimal matrix effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="matrix-rain"></div>
      </div>
      
      {/* Scanning lines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-line"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-12 mt-7">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 neon-flicker cyber-text">
            &gt; AI_CODE_
          </h1>
          <div className="text-xl md:text-2xl mb-12 terminal-text max-w-4xl mx-auto">
            <span className="text-purple-300">[SYSTEM_INIT]</span> Professional programming challenges with AI-powered analysis
            <br />
            <span className="text-purple-400">[STATUS]</span> Ready to test your skills across multiple difficulty levels
            <span className="cursor-blink">▊</span>
          </div>
        </div>
        
        <AICodeChallenge />
      </div>
    </div>
  )
}
