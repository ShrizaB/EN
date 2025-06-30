"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Zap, Gamepad2, ChevronRight, Cpu } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [showBoxes, setShowBoxes] = useState(false)
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Particle animation
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    const particlesArray: Particle[] = [];
    const numberOfParticles = 200;
    class Particle {
      x; y; size; speedX; speedY; color;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        const colors = [
          "rgba(59, 130, 246, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(34, 211, 238, 0.7)",
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        if (ctx) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    function animate() {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
          for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 - distance / 1000})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
              ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
              ctx.stroke();
            }
          }
          particlesArray[i].update();
          particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
      }
    }
    init();
    animate();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setTimeout(() => {
        setShowBoxes(true)
      }, 1000)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const navigateTo = (path: string) => {
    router.push(path)
  }

  const title = "EduNova"

  return (
    <>
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden overflow-x-hidden">
        <div className={`transition-opacity duration-1000 ${!loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* All background images and effects fade in after loading */}
          {/* Optional: dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
          {/* Red shadow: top and left (lighter, glowy, not center) */}
          <div className="pointer-events-none z-10">
            <div className="absolute left-0 top-0 w-[60vw] h-56 bg-gradient-to-br from-red-500/30 via-transparent to-transparent" style={{ filter: 'blur(32px)' }} />
            <div className="absolute left-0 top-0 w-[30vw] h-1/2 bg-gradient-to-r from-red-500/15 to-transparent" style={{ filter: 'blur(18px)' }} />
            <div className="absolute left-0 top-0 h-24 w-[80vw] bg-gradient-to-b from-red-500/15 to-transparent" style={{ filter: 'blur(18px)' }} />
          </div>
          {/* Blue shadow: top and right (lighter, glowy, not center) */}
          <div className="pointer-events-none z-10">
            <div className="absolute right-0 top-0 w-[60vw] h-56 bg-gradient-to-bl from-blue-500/30 via-transparent to-transparent" style={{ filter: 'blur(32px)' }} />
            <div className="absolute right-0 top-0 w-[30vw] h-1/2 bg-gradient-to-l from-blue-500/15 to-transparent" style={{ filter: 'blur(18px)' }} />
            <div className="absolute right-0 top-0 h-24 w-[80vw] bg-gradient-to-b from-blue-500/15 to-transparent" style={{ filter: 'blur(18px)' }} />
          </div>
          {/* Background Image */}
          <div className="absolute inset-0 flex h-auto z-0 top-8">
            <img
              src="https://i.postimg.cc/hvRqXVMq/pngwing-com.png"
              alt="background"
              className="opacity-40 w-[480px] object-cover h-[300px]"
            />
          </div>
          <div className="absolute inset-0 flex h-full z-0">
            <img
              src="https://i.postimg.cc/zfy0HBdz/pngwing-com-1.png"
              alt="background"
              className="opacity-40 w-[480px] object-cover h-[330px] absolute bottom-0 -left-16"
            />
          </div>
          <div className="absolute inset-0 flex items-center w-full right-0">
            <img
              src="https://i.postimg.cc/KjnKYRRs/imgbin-6596f5f07fcc662f2aa35307c473ce9c.png"
              alt="background"
              className="opacity-45 w-[500px] object-cover h-[800px] absolute right-0 "
            />
          </div>
        </div>
        {/* Particle canvas background */}
        <canvas ref={canvasRef} className="absolute inset-0 opacity-40 pointer-events-none" />
        {/* Cyber grid background */}
        <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(40,1fr)] opacity-20 pointer-events-none">
          {Array.from({ length: 1600 }).map((_, i) => (
            <div
              key={i}
              className="border-[0.5px] border-blue-500/20"
              style={{
                opacity: Math.random() > 0.9 ? 0.5 : 0.1,
                backgroundColor: Math.random() > 0.97 ? "rgba(59, 130, 246, 0.2)" : "transparent",
              }}
            />
          ))}
        </div>
        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Logo animation */}
          <div className={`mb-16 relative transition-all duration-1000 edunova-logo-container ${loading ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
            {/* Modern circular spinner loader above logo during loading */}
            {loading && (
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex items-center justify-center w-20 h-20 z-20">
                <span className="orbit-loader">
                  <span className="orbit-dot orbit-dot-blue" />
                  <span className="orbit-dot orbit-dot-purple" />
                </span>
              </div>
            )}
            <div className="flex items-center">
              <div className="flex edunova-logo-glitch">
                {title.split("").map((letter, i) => (
                  <span
                    key={i}
                    className={`edunova-logo-letter text-6xl md:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-300 cyber-glitch inline-block transition-all duration-700 ${!loading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} animated-glitch-text`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
            <div className="edunova-logo-scanline" />
            <p className={`text-center text-blue-300 mt-6 text-xl font-light tracking-wide transition-opacity duration-500 delay-1000 ${loading ? 'opacity-0' : 'opacity-100'} animated-fade-in`}>Choose your learning experience</p>
          </div>
          {/* Animated grid overlay */}
          <div className="absolute inset-0 pointer-events-none z-0 animated-grid">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute h-full w-0.5 bg-gradient-to-b from-blue-700/0 via-blue-700/30 to-blue-700/0 left-0 animate-glow-line" style={{ left: `${i * 5}%`, animationDelay: `${i * 0.3}s` }} />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i + 100} className="absolute w-full h-0.5 bg-gradient-to-r from-blue-700/0 via-blue-700/30 to-blue-700/0 top-0 animate-glow-line-horizontal" style={{ top: `${i * 5}%`, animationDelay: `${i * 0.3 + 2}s` }} />
            ))}
          </div>
          {/* Two cards */}
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl px-4">
            {/* EduPlay Card */}
            <div
              className={`w-full md:w-1/2 cursor-pointer group transform transition-all duration-700 ${showBoxes ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} hover:scale-[1.04] red-neon-border red-glassmorphism-box shadow-2xl hover:shadow-red-500/60 animated-fade-scale-up red-card`}
              onClick={() => navigateTo("/eduplay/home")}
            >
              <div className="relative overflow-hidden rounded-xl border-2 border-red-500/80 bg-gradient-to-br from-[#1a090a] to-[#2f181c] p-8 h-full transition-all duration-300 hover:shadow-[0_0_60px_rgba(239,68,68,0.9)]">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] bg-cover opacity-10"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-red-700 to-orange-700 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={i}
                      className="bubble bubble-red"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 24 + 12}px`,
                        height: `${Math.random() * 24 + 12}px`,
                        animationDelay: `${Math.random() * 4}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="relative flex flex-col h-full z-10">
                  <div className="flex items-center mb-4">
                    <span className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mr-4 animate-pulse-red red-neon-glow">
                      <Gamepad2 className="h-6 w-6 text-red-400" />
                    </span>
                    <h2 className="text-3xl font-extrabold text-red-200 tracking-tight uppercase drop-shadow-red-glow">EduPlay</h2>
                  </div>
                  <p className="text-red-100/90 mb-2 font-semibold text-base">Interactive learning adventures for teens. Explore subjects through games, quizzes, and challenges designed for your age group.</p>
                  <ul className="features-list flex flex-col gap-2 mb-6 text-base items-start">
                    <li className="flex items-center gap-1"><span className="feature-dot bg-red-400" />Fun learning games</li>
                    <li className="flex items-center gap-1"><span className="feature-dot bg-red-400" />Quizzes & challenges</li>
                    <li className="flex items-center gap-1"><span className="feature-dot bg-red-400" />Easy topic search</li>
                    <li className="flex items-center gap-1"><span className="feature-dot bg-red-400" />Progress dashboard</li>
                  </ul>
                  <div className="mt-6 flex items-center text-red-300 font-bold group-hover:text-red-200 transition-colors">
                    <span>Enter Teen Zone</span>
                    <span className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1">
                      <ChevronRight />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* EduGuide Card */}
            <div
              className={`w-full md:w-1/2 cursor-pointer group transform transition-all duration-700 ${showBoxes ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} hover:scale-[1.04] neon-border glassmorphism-box shadow-2xl hover:shadow-green-500 animated-fade-scale-up dark-card`}
              onClick={() => navigateTo("/eduguide")}
            >
              <div className="relative overflow-hidden rounded-xl border-2 border-green-500/80 bg-gradient-to-br from-[#0a1f1a] to-[#162c2a] p-8 h-full transition-all duration-300 hover:shadow-[0_0_60px_rgba(16,185,129,0.9)]">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] bg-cover opacity-10"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-800 to-teal-800 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
                {/* Digital particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => {
                    // Generate a random angle and distance for each binary string
                    const angle = Math.random() * 2 * Math.PI;
                    const distance = 80 + Math.random() * 60; // 80-140vh
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    const duration = (18 + Math.random() * 10).toFixed(1); // 18-28s, much slower
                    const delay = (Math.random() * 3).toFixed(1);
                    return (
                      <span
                        key={i}
                        className="matrix-code matrix-random-move"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          '--matrix-x': `${x}vh`,
                          '--matrix-y': `${y}vh`,
                          animationDuration: `${duration}s`,
                          animationDelay: `${delay}s`,
                        } as React.CSSProperties}
                      >
                        {Array.from({ length: 8 }).map(() => (Math.random() > 0.5 ? '1' : '0')).join('')}
                      </span>
                    );
                  })}
                </div>
                <div className="relative flex flex-col h-full z-10">
                  <div className="flex items-center mb-4">
                    <span className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mr-4 animate-pulse-green neon-glow">
                      <Cpu className="h-6 w-6 text-green-400" />
                    </span>
                    <h2 className="text-3xl font-extrabold text-green-200 tracking-tight uppercase drop-shadow-green-glow glitch-text">EduGuide</h2>
                  </div>
                  <p className="text-green-100/90 mb-2 font-semibold text-base">Advanced learning paths for adults. Career roadmaps, aptitude tests, and professional development resources.</p>
                  <ul className="features-list flex flex-col gap-2 mb-6 text-base items-start">
                    <li className="flex items-center gap-1"><span className="feature-dot bg-green-400" />Career guidance</li>
                    <li className="flex items-center gap-1"><span className="feature-dot bg-green-400" />Skill assessments</li>
                    <li className="flex items-center gap-1"><span className="feature-dot bg-green-400" />Expert resources</li>
                    <li className="flex items-center gap-1"><span className="feature-dot bg-green-400" />AI Coding</li>
                  </ul>
                  <div className="mt-6 flex items-center text-green-300 font-bold group-hover:text-green-200 transition-colors">
                    <span>Enter Professional Zone</span>
                    <span className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1">
                      <ChevronRight />
                    </span>
                  </div>
                  {/* Animated circuit lines */}
                  <div className="absolute bottom-0 right-0 w-40 h-40 opacity-30 pointer-events-none">
                    <svg width="160" height="160" viewBox="0 0 160 160" className="circuit-animation">
                      <path d="M10,80 L40,80 L60,60 L100,60 L120,80 L150,80" stroke="rgba(16,185,129,0.6)" strokeWidth="2" fill="none" />
                      <path d="M10,100 L30,100 L50,80 L90,80 L110,100 L150,100" stroke="rgba(16,185,129,0.6)" strokeWidth="2" fill="none" />
                      <path d="M80,10 L80,40 L60,60" stroke="rgba(16,185,129,0.6)" strokeWidth="2" fill="none" />
                      <path d="M100,10 L100,40 L120,60" stroke="rgba(16,185,129,0.6)" strokeWidth="2" fill="none" />
                      <circle cx="60" cy="60" r="4" fill="rgba(16,185,129,0.8)" />
                      <circle cx="120" cy="60" r="4" fill="rgba(16,185,129,0.8)" />
                      <circle cx="50" cy="80" r="4" fill="rgba(16,185,129,0.8)" />
                      <circle cx="90" cy="80" r="4" fill="rgba(16,185,129,0.8)" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Custom Animations & Styles */}
        <style jsx global>{`
        .edunova-logo-container {
          filter: drop-shadow(0 0 24px #60a5fa88) drop-shadow(0 0 32px #a78bfa44);
        }
        .edunova-logo-glow {
          filter: drop-shadow(0 0 16px #60a5fa) drop-shadow(0 0 32px #a78bfa);
        }
        .edunova-logo-glitch {
          position: relative;
        }
        .edunova-logo-glitch .edunova-logo-letter {
          animation: edunovaGlitch 2.2s infinite linear alternate;
        }
        @keyframes edunovaGlitch {
          0%, 100% { text-shadow: 0 0 8px #60a5fa, 2px 0 #a78bfa, -2px 0 #38bdf8; }
          10% { text-shadow: 2px 2px 8px #a78bfa, -2px -2px 8px #60a5fa; }
          20% { text-shadow: -2px 2px 8px #38bdf8, 2px -2px 8px #a78bfa; }
          30% { text-shadow: 0 0 12px #60a5fa, 4px 0 #a78bfa, -4px 0 #38bdf8; }
          40% { text-shadow: 0 0 8px #a78bfa, 0 2px #60a5fa, 0 -2px #38bdf8; }
          50% { text-shadow: 0 0 16px #60a5fa, 2px 2px #a78bfa, -2px -2px #38bdf8; }
          60% { text-shadow: 0 0 8px #60a5fa, 2px 0 #a78bfa, -2px 0 #38bdf8; }
        }
        .edunova-logo-scanline {
          position: absolute;
          left: 0; right: 0; top: 0; height: 100%;
          pointer-events: none;
          background: repeating-linear-gradient(180deg, transparent 0 6px, #60a5fa22 6px 8px);
          mix-blend-mode: lighten;
          opacity: 0.25;
          z-index: 1;
          animation: scanlineMove 3.5s linear infinite;
        }
        @keyframes scanlineMove {
          0% { background-position-y: 0; }
          100% { background-position-y: 100px; }
        }
        .animated-grid .animate-glow-line {
          animation: glowLineMove 4s linear infinite alternate;
        }
        .animated-grid .animate-glow-line-horizontal {
          animation: glowLineMoveHorizontal 5s linear infinite alternate;
        }
        @keyframes glowLineMove {
          0% { opacity: 0.1; }
          50% { opacity: 0.5; }
          100% { opacity: 0.1; }
        }
        @keyframes glowLineMoveHorizontal {
          0% { opacity: 0.1; }
          50% { opacity: 0.5; }
          100% { opacity: 0.1; }
        }
        .dark-card {
          background: linear-gradient(135deg, #0a1120 60%, #181c2f 100%) !important;
          border-color: #232a3a !important;
        }
        .glitch-text {
          position: relative;
          color: #a7f3d0;
          text-shadow: 0 0 8px #34d399, 2px 0 #14b8a6, -2px 0 #22d3ee;
          animation: glitchAnim 2.5s infinite linear alternate;
        }
        @keyframes glitchAnim {
          0%, 100% { text-shadow: 0 0 8px #34d399, 2px 0 #14b8a6, -2px 0 #22d3ee; }
          10% { text-shadow: 2px 2px 8px #14b8a6, -2px -2px 8px #34d399; }
          20% { text-shadow: -2px 2px 8px #22d3ee, 2px -2px 8px #14b8a6; }
          30% { text-shadow: 0 0 12px #34d399, 4px 0 #14b8a6, -4px 0 #22d3ee; }
          40% { text-shadow: 0 0 8px #14b8a6, 0 2px #34d399, 0 -2px #22d3ee; }
          50% { text-shadow: 0 0 16px #34d399, 2px 2px #14b8a6, -2px -2px #22d3ee; }
          60% { text-shadow: 0 0 8px #34d399, 2px 0 #14b8a6, -2px 0 #22d3ee; }
        }
        .bubble {
          position: absolute;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(59,130,246,0.18);
          background: radial-gradient(circle at 30% 30%, #fff, rgba(59,130,246,0.10));
          opacity: 0.13;
          animation: float-up 12s ease-in infinite;
        }
        @keyframes float-up {
          0% { transform: translateY(-100%) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(100vh) scale(1); opacity: 0; }
        }
        .matrix-code {
          font-family: monospace;
          font-size: 1rem;
          color: #34d399;
          text-shadow: 0 0 8px #34d399, 0 0 2px #fff;
          white-space: nowrap;
          position: absolute;
        }
        .matrix-random-move {
          animation-name: matrix-random-move;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes matrix-random-move {
          0% {
            opacity: 0;
            transform: translate(0, 0);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--matrix-x, 0), var(--matrix-y, 100vh));
          }
        }
        .bounce {
          animation: bounce 1.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .stylish-underline-bar {
          background: linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #38bdf8 100%);
          height: 5px;
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        .stylish-underline-bar::before {
          content: "";
          position: absolute;
          left: -40%;
          top: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(120deg, #fff 0%, #60a5fa 60%, #a78bfa 100%);
          opacity: 0.7;
          filter: blur(2px);
          animation: underline-shimmer 2.2s infinite linear;
        }
        .stylish-underline-bar::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, #60a5fa44 50%, transparent 100%);
          opacity: 0.5;
          animation: underline-pulse 2.5s infinite ease-in-out;
        }
        @keyframes underline-shimmer {
          0% { left: -40%; }
          100% { left: 100%; }
        }
        @keyframes underline-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .neon-border {
          position: relative;
        }
        .neon-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(90deg, #60a5fa, #a78bfa, #38bdf8, #34d399, #60a5fa);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 2;
          animation: borderRotate 6s linear infinite, borderPulse 2.5s ease-in-out infinite alternate;
        }
        @keyframes borderPulse {
          0% { filter: brightness(1) blur(0px); }
          50% { filter: brightness(1.3) blur(2px); }
          100% { filter: brightness(1) blur(0px); }
        }
        .glassmorphism-box {
          background: rgba(30, 41, 59, 0.85);
          backdrop-filter: blur(16px) saturate(1.3);
          border-radius: 1.25rem;
          box-shadow: 0 0 40px 0 #60a5fa22, 0 0 0 2px #232a3a;
          transition: box-shadow 0.4s;
        }
        .glassmorphism-box:hover {
          box-shadow: 0 0 80px 0 #60a5fa55, 0 0 0 2px #60a5fa;
        }
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .feature-dot {
          display: inline-block;
          width: 0.7em;
          height: 0.7em;
          border-radius: 50%;
          margin-right: 0.3em;
          box-shadow: 0 0 6px currentColor;
        }
        .icon-animate {
          transition: transform 0.3s cubic-bezier(.4,2,.6,1), filter 0.3s;
        }
        .group:hover .icon-animate {
          transform: scale(1.18) rotate(-8deg);
          filter: drop-shadow(0 0 12px #60a5fa) brightness(1.2);
        }
        .red-card {
          background: linear-gradient(135deg, #1a090a 60%, #2f181c 100%) !important;
          border-color: #7f1d1d !important;
        }
        .red-neon-border {
          position: relative;
        }
        .red-neon-border::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(90deg, #ef4444, #f59e42, #f43f5e, #f87171, #ef4444);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 2;
          animation: borderRotate 6s linear infinite, borderPulseRed 2.5s ease-in-out infinite alternate;
        }
        @keyframes borderPulseRed {
          0% { filter: brightness(1) blur(0px); }
          50% { filter: brightness(1.3) blur(2px); }
          100% { filter: brightness(1) blur(0px); }
        }
        .red-glassmorphism-box {
          background: rgba(60, 20, 30, 0.85);
          backdrop-filter: blur(16px) saturate(1.3);
          border-radius: 1.25rem;
          box-shadow: 0 0 40px 0 #ef444422, 0 0 0 2px #7f1d1d;
          transition: box-shadow 0.4s;
        }
        .red-glassmorphism-box:hover {
          box-shadow: 0 0 80px 0 #ef444455, 0 0 0 2px #ef4444;
        }
        .red-neon-glow {
          filter: drop-shadow(0 0 16px #ef4444) drop-shadow(0 0 32px #f87171);
        }
        .drop-shadow-red-glow {
          filter: drop-shadow(0 0 8px #ef4444) drop-shadow(0 0 16px #f87171);
        }
        .animate-pulse-red {
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0%, 100% { box-shadow: 0 0 0px #ef4444; }
          50% { box-shadow: 0 0 20px #ef4444; }
        }
        .bubble-red {
          box-shadow: 0 0 10px #ef4444cc;
          background: radial-gradient(circle at 30% 30%, #fff, #ef444422);
        }
        .orbit-loader {
          position: relative;
          display: inline-block;
          width: 64px;
          height: 64px;
          animation: orbit-rotate 1.2s linear infinite;
        }
        .orbit-dot {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 16px 4px #3b82f6aa;
        }
        .orbit-dot-blue {
          background: linear-gradient(135deg, #3b82f6 60%, #a78bfa 100%);
          animation: orbit-dot-blue 1.2s linear infinite;
          box-shadow: 0 0 24px 6px #3b82f6cc, 0 0 8px #a78bfa99;
        }
        .orbit-dot-purple {
          background: linear-gradient(135deg, #a78bfa 60%, #3b82f6 100%);
          animation: orbit-dot-purple 1.2s linear infinite;
          box-shadow: 0 0 24px 6px #a78bfa99, 0 0 8px #3b82f6cc;
        }
        @keyframes orbit-rotate {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes orbit-dot-blue {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(28px) scale(1); }
          50% { transform: translate(-50%, -50%) rotate(180deg) translateX(28px) scale(1.2); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(28px) scale(1); }
        }
        @keyframes orbit-dot-purple {
          0% { transform: translate(-50%, -50%) rotate(180deg) translateX(28px) scale(1); }
          50% { transform: translate(-50%, -50%) rotate(360deg) translateX(28px) scale(1.2); }
          100% { transform: translate(-50%, -50%) rotate(540deg) translateX(28px) scale(1); }
        }
        html, body {
          overflow-x: hidden;
        }
        `}</style>
      </div>
    </>
  )
}
