"use client"

import React from 'react'
import './styles.css'

import {
  Gamepad2,
  Award,
  Lightbulb,
  Zap
} from "lucide-react"

export default function FeaturesSection() {
  // Particle configs for permanent animation
  const particles = {
    yellow: Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 3,
      duration: Math.random() * 8 + 5,
      delay: Math.random() * 3,
      x: Math.random() * 100,
      y: Math.random() * 100
    })),
    green: Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 3,
      duration: Math.random() * 8 + 5,
      delay: Math.random() * 3,
      x: Math.random() * 100,
      y: Math.random() * 100
    })),
    blue: Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 3,
      duration: Math.random() * 8 + 5,
      delay: Math.random() * 3,
      x: Math.random() * 100,
      y: Math.random() * 100
    }))
  }

  return (
    <section className="z-0 py-16 bg-gradient-to-b from-[#0d0717] via-[#0c0014] to-black relative overflow-hidden marvel-theme">
      {/* Marvel-style animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://i.postimg.cc/8z7W3K3Q/marvel-comic-bg.png')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-red-900/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-900/10 blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* Your original decorative elements kept exactly */}
      <div className="absolute flex flex-col gap-0 items-center">
        <img 
          src="https://i.postimg.cc/sDPgwrxN/8ac29e871cbeab10226041657e42deab.png" 
          alt="" 
          className="z-10 w-[100px] relative bottom-12 animate-float" 
        />
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 91.16 122.88"
          className="w-[65px] h-[65px] relative z-0 bottom-[58px] animate-float"
          fill="none"
          overflow="visible"
        >
          <defs>
            <style>
              {`
                .cls-1 { fill: #ff5c00; fill-rule: evenodd; }
                .cls-2 { fill: #ffd700; fill-rule: evenodd; }
                .cls-3 { fill: #fff89a; fill-rule: evenodd; }
              `}
            </style>
          </defs>
          <g
            transform="rotate(180, 45.58, 61.44)"
            style={{
              filter: "drop-shadow(0 0 5px #ff7300) drop-shadow(0 0 5px #ff7300) drop-shadow(0 0 5px #ffd700)",
            }}
          >
            <path className="cls-1" d="M14.45,35.35c1.82,14.45,4.65,25.4,9.44,29.45C24.48,30.87,43,27.4,38.18,0,53.52,3,67.77,33.33,71.36,66.15a37.5,37.5,0,0,0,6.53-19.46c13.76,15.72,21.31,56.82-.17,69.52-12.53,7.41-38.13,7.79-51.46,5.27a27.64,27.64,0,0,1-13.5-5.36c-19.2-14.66-15.17-62.25,1.69-80.77Z"/>
            <path className="cls-2" d="M77.73,116.2h0c-8,4.74-21.42,6.61-33.51,6.67H42.45a95.69,95.69,0,0,1-16.19-1.39,27.64,27.64,0,0,1-13.5-5.36,2.43,2.43,0,0,0-.25-.2c-2.13-10.28,1.76-24,8.49-31.29a25.49,25.49,0,0,0,4.85,13.71C28.51,75.22,39.11,57,50.5,54.94c-3,19.1,11,24.21,10.62,42.45,3.56-2.85,5.66-10.57,7-20.75,9.12,9.49,13.59,26.32,9.59,39.56Z"/>
            <path className="cls-3" d="M65.81,120.73a115,115,0,0,1-39.55.82l-1-.13c.06-5.73,2.21-12,5.47-15.73a17.18,17.18,0,0,0,2.93,8.84c1.61-14.91,8-26.63,14.88-28-1.79,12.32,6.65,15.61,6.4,27.37,2.15-1.84,3.42-6.82,4.23-13.38,4.47,5,7.09,12.84,6.63,20.19Z"/>
          </g>
        </svg>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-white comic-font">
              <span className="text-red-500">Why</span> Kids <span className="text-blue-400">Love</span> EduPlay
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto comic-font-secondary">
              Learning has never been this much fun!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Fun Games Card - Marvel Enhanced */}
          <div
            className="bg-[#0b0418]/90 rounded-3xl p-6 text-center relative overflow-hidden animate-slide-up border-2 border-yellow-500/20 marvel-card"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Permanent glowy border effect */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-30"></div>
              <div className="absolute inset-0 rounded-3xl border-2 border-yellow-500/10"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-yellow-100/10 flex items-center justify-center mx-auto mb-4 relative marvel-icon-container">
                <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-md animate-pulse"></div>
                <Gamepad2 className="h-10 w-10 text-yellow-400 marvel-icon" />
                <Zap className="absolute h-4 w-4 text-yellow-300 animate-sparkle" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white comic-font">Fun Games</h3>
              <p className="text-gray-300 comic-font-secondary">
                Educational games that make learning exciting and engaging.
              </p>
            </div>

            {/* Permanent particle effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {particles.yellow.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute rounded-full bg-yellow-400/20 animate-float-permanent"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animationDuration: `${particle.duration}s`,
                    animationDelay: `${particle.delay}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* 2. Rewards Card - Marvel Enhanced */}
          <div
            className="bg-[#0b0418]/90 rounded-3xl p-6 text-center relative overflow-hidden animate-slide-up border-2 border-green-500/20 marvel-card"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Permanent glowy border effect */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-30"></div>
              <div className="absolute inset-0 rounded-3xl border-2 border-green-500/10"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-green-100/10 flex items-center justify-center mx-auto mb-4 relative marvel-icon-container">
                <div className="absolute inset-0 rounded-full bg-green-500/20 blur-md animate-pulse"></div>
                <Award className="h-10 w-10 text-green-400 marvel-icon" />
                <Zap className="absolute h-4 w-4 text-green-300 animate-sparkle animation-delay-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white comic-font">Rewards</h3>
              <p className="text-gray-300 comic-font-secondary">
                Earn stars, badges, and unlock achievements as you learn.
              </p>
            </div>

            {/* Permanent particle effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {particles.green.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute rounded-full bg-green-400/20 animate-float-permanent"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animationDuration: `${particle.duration}s`,
                    animationDelay: `${particle.delay}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* 3. Smart Learning Card - Marvel Enhanced */}
          <div
            className="bg-[#0b0418]/90 rounded-3xl p-6 text-center relative overflow-hidden animate-slide-up border-2 border-blue-500/20 marvel-card"
            style={{ animationDelay: "0.5s" }}
          >
            {/* Permanent glowy border effect */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-30"></div>
              <div className="absolute inset-0 rounded-3xl border-2 border-blue-500/10"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-blue-100/10 flex items-center justify-center mx-auto mb-4 relative marvel-icon-container">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse"></div>
                <Lightbulb className="h-10 w-10 text-blue-400 marvel-icon" />
                <Zap className="absolute h-4 w-4 text-blue-300 animate-sparkle animation-delay-1000" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white comic-font">Smart Learning</h3>
              <p className="text-gray-300 comic-font-secondary">
                Personalized content that adapts to your learning style and pace.
              </p>
            </div>

            {/* Permanent particle effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {particles.blue.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute rounded-full bg-blue-400/20 animate-float-permanent"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    animationDuration: `${particle.duration}s`,
                    animationDelay: `${particle.delay}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add this to your styles.css */}
      <style jsx global>{`
        @keyframes float-permanent {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float-permanent {
          animation: float-permanent var(--duration) infinite ease-in-out;
        }
        .marvel-theme {
          --marvel-red: #ED1D24;
          --marvel-blue: #037EF3;
          --marvel-yellow: #F7C744;
        }
        .comic-font {
          font-family: 'Bangers', cursive, sans-serif;
          letter-spacing: 1px;
          text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
        }
        .comic-font-secondary {
          font-family: 'Roboto Condensed', sans-serif;
        }
        .marvel-card {
          box-shadow: 0 10px 30px -5px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }
        .marvel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px -5px rgba(0,0,0,0.4);
        }
        .marvel-icon-container {
          transition: all 0.3s ease;
        }
        .marvel-icon {
          filter: drop-shadow(0 0 2px currentColor);
        }
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0.5); }
        }
        .animate-sparkle {
          animation: sparkle 1.5s infinite;
        }
        /* Only on mobile, override comic font with curly font */
        @media (max-width: 600px) {
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Caveat:wght@700&display=swap');
          .comic-font {
            font-family: 'Pacifico', cursive, sans-serif !important;
          }
          .comic-font-secondary {
            font-family: 'Caveat', cursive, sans-serif !important;
          }
        }
      `}</style>
    </section>
  )
}