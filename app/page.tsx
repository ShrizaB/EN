"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, useAnimation } from "framer-motion"
import { Sparkles, Zap, Gamepad2, ChevronRight, Cpu } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [showBoxes, setShowBoxes] = useState(false)
  const [loading, setLoading] = useState(true)
  const controls = useAnimation()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Particle animation
 useEffect(() => {
  if (!canvasRef.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return; // ctx will be checked here

  // Set canvas dimensions
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Particle settings
  const particlesArray: Particle[] = [];
  const numberOfParticles = 200;

  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;

    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 1;
      this.speedY = (Math.random() - 0.5) * 1;

      // Color palette: blue, purple, cyan
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

  // Create particles
  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  // Animation loop
  function animate() {
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections between particles
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
    // Simulate loading time for the cyber animation
    const timer = setTimeout(() => {
      setLoading(false)
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 1.5, times: [0, 0.5, 1], repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
      })

      // Show boxes after the logo animation completes
      setTimeout(() => {
        setShowBoxes(true)
      }, 1000)
    }, 2500)

    return () => clearTimeout(timer)
  }, [controls])

  const navigateTo = (path: string) => {
    router.push(path)
  }

  // Text animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  const title = "EduNova"

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-16 relative"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: loading ? "0%" : "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute -bottom-4 left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"
          />

          <div className="flex items-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
                filter: [
                  "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
                  "drop-shadow(0 0 16px rgba(59, 130, 246, 0.8))",
                  "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
                ],
              }}
              transition={{
                rotate: { duration: 10, ease: "linear", repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
                scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                filter: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
              }}
              className="mr-3"
            >
              <Sparkles className="h-12 w-12 text-blue-500" />
            </motion.div>

            <div className="flex">
              {title.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={letterVariants}
                  className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 cyber-glitch inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ rotate: 0 }}
              animate={{
                rotate: -360,
                scale: [1, 1.2, 1],
                filter: [
                  "drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))",
                  "drop-shadow(0 0 16px rgba(168, 85, 247, 0.8))",
                  "drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))",
                ],
              }}
              transition={{
                rotate: { duration: 10, ease: "linear", repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
                scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1.5 },
                filter: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1.5 },
              }}
              className="ml-3"
            >
              <Zap className="h-12 w-12 text-purple-500" />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center text-blue-300 mt-6 text-xl font-light tracking-wide"
          >
            Choose your learning experience
          </motion.p>
        </motion.div>

        {/* Two boxes */}
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl px-4">
          {/* EduPlay Box */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: showBoxes ? 1 : 0, y: showBoxes ? 0 : 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className="w-full md:w-1/2 cursor-pointer group"
            onClick={() => navigateTo("/eduplay/home")}
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-8 h-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] bg-cover opacity-10"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>

              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, y: -20, opacity: 0 }}
                    animate={{
                      x: Math.random() * 100 + "%",
                      y: Math.random() * 100 + "%",
                      opacity: [0, 0.5, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 5 + 5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 5,
                    }}
                    className="absolute w-8 h-8 rounded-full bg-blue-400/20"
                  />
                ))}
              </div>

              <div className="relative flex flex-col h-full z-10">
                <div className="flex items-center mb-4">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(59, 130, 246, 0.5)",
                        "0 0 20px rgba(59, 130, 246, 0.8)",
                        "0 0 0px rgba(59, 130, 246, 0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Gamepad2 className="h-6 w-6 text-blue-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-blue-300">EduPlay</h2>
                </div>

                <p className="text-blue-200/80 mb-6">
                  Interactive learning adventures designed for kids. Explore subjects through games, quizzes, and fun
                  activities!
                </p>

                <div className="mt-auto flex items-center text-blue-300 font-medium group-hover:text-blue-200">
                  <span>Enter Kids Zone</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </div>

                {/* Animated bubbles */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-blue-400"
                      style={{
                        width: `${Math.random() * 20 + 10}px`,
                        height: `${Math.random() * 20 + 10}px`,
                        bottom: `${Math.random() * 100}%`,
                        right: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        x: [0, Math.random() * 10 - 5, 0],
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: Math.random() * 4 + 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* EduGuide Box */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: showBoxes ? 1 : 0, y: showBoxes ? 0 : 50 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className="w-full md:w-1/2 cursor-pointer group"
            onClick={() => navigateTo("/eduguide")}
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-green-500/50 bg-gradient-to-br from-green-900/50 to-teal-900/50 p-8 h-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] bg-cover opacity-10"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>

              {/* Digital particles */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-green-500/30 font-mono"
                    style={{
                      fontSize: `${Math.random() * 10 + 8}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [0, 10],
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 5,
                    }}
                  >
                    {Math.random() > 0.5 ? "1" : "0"}
                  </motion.div>
                ))}
              </div>

              <div className="relative flex flex-col h-full z-10">
                <div className="flex items-center mb-4">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(16, 185, 129, 0.5)",
                        "0 0 20px rgba(16, 185, 129, 0.8)",
                        "0 0 0px rgba(16, 185, 129, 0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                  >
                    <Cpu className="h-6 w-6 text-green-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-green-300">EduGuide</h2>
                </div>

                <p className="text-green-200/80 mb-6">
                  Advanced learning paths for adults. Career roadmaps, aptitude tests, and professional development
                  resources.
                </p>

                <div className="mt-auto flex items-center text-green-300 font-medium group-hover:text-green-200">
                  <span>Enter Professional Zone</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                  >
                    <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </div>

                {/* Animated circuit lines */}
                <div className="absolute bottom-0 right-0 w-40 h-40 opacity-30">
                  <svg width="160" height="160" viewBox="0 0 160 160" className="circuit-animation">
                    <motion.path
                      d="M10,80 L40,80 L60,60 L100,60 L120,80 L150,80"
                      stroke="rgba(16,185,129,0.6)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", repeatDelay: 1 }}
                    />
                    <motion.path
                      d="M10,100 L30,100 L50,80 L90,80 L110,100 L150,100"
                      stroke="rgba(16,185,129,0.6)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 0.5,
                      }}
                    />
                    <motion.path
                      d="M80,10 L80,40 L60,60"
                      stroke="rgba(16,185,129,0.6)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 1,
                      }}
                    />
                    <motion.path
                      d="M100,10 L100,40 L120,60"
                      stroke="rgba(16,185,129,0.6)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 1.2,
                      }}
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="4"
                      fill="rgba(16,185,129,0.8)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 1.5,
                      }}
                    />
                    <motion.circle
                      cx="120"
                      cy="60"
                      r="4"
                      fill="rgba(16,185,129,0.8)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 1.7,
                      }}
                    />
                    <motion.circle
                      cx="50"
                      cy="80"
                      r="4"
                      fill="rgba(16,185,129,0.8)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 1.9,
                      }}
                    />
                    <motion.circle
                      cx="90"
                      cy="80"
                      r="4"
                      fill="rgba(16,185,129,0.8)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        repeatDelay: 1,
                        delay: 2.1,
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
