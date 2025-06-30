"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Rocket, Zap, Award, Play, Fullscreen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import "./math-asteroid-blaster.css"

// Types
interface MathProblem {
  question: string
  answer: number
  difficulty: "easy" | "medium" | "hard"
}

interface Asteroid {
  id: string
  x: number
  y: number
  value: number
  size: number
  speed: number
  rotation: number
  isCorrect: boolean
}

interface Bullet {
  id: string
  x: number
  y: number
  speed: number
}

interface Particle {
  id: string
  x: number
  y: number
  size: number
  color: string
  speed: number
  angle: number
  opacity: number
  life: number
}

interface PowerUp {
  id: string
  x: number
  y: number
  type: "multishot" | "shield" | "slowmo"
  duration: number
}

interface GameState {
  score: number
  lives: number
  level: number
  isGameOver: boolean
  isPaused: boolean
  currentProblem: MathProblem
  combo: number
  maxCombo: number
  shield: number
  multishot: number
  slowmo: number
}

// Helper functions
const generateMathProblem = (level: number): MathProblem => {
  const difficulties = ["easy", "medium", "hard"] as const
  const difficulty = difficulties[Math.min(Math.floor(level / 3), 2)]

  let num1, num2, operator, question, answer

  switch (difficulty) {
    case "easy":
      num1 = Math.floor(Math.random() * 10) + 1
      num2 = Math.floor(Math.random() * 10) + 1
      operator = "+"
      question = `${num1} ${operator} ${num2} = ?`
      answer = num1 + num2
      break
    case "medium":
      num1 = Math.floor(Math.random() * 15) + 5
      num2 = Math.floor(Math.random() * 10) + 1
      operator = Math.random() > 0.5 ? "+" : "-"
      if (operator === "-" && num2 > num1) {
        ;[num1, num2] = [num2, num1] // Swap to avoid negative answers
      }
      question = `${num1} ${operator} ${num2} = ?`
      answer = operator === "+" ? num1 + num2 : num1 - num2
      break
    case "hard":
      num1 = Math.floor(Math.random() * 12) + 1
      num2 = Math.floor(Math.random() * 12) + 1
      operator = Math.random() > 0.5 ? "×" : "÷"
      if (operator === "÷") {
        answer = Math.floor(Math.random() * 10) + 1
        num1 = num2 * answer // Ensure clean division
        question = `${num1} ${operator} ${num2} = ?`
      } else {
        question = `${num1} ${operator} ${num2} = ?`
        answer = num1 * num2
      }
      break
    default:
      num1 = Math.floor(Math.random() * 10) + 1
      num2 = Math.floor(Math.random() * 10) + 1
      question = `${num1} + ${num2} = ?`
      answer = num1 + num2
  }

  return { question, answer, difficulty }
}

const generateAsteroidValue = (correctAnswer: number, level: number): number => {
  if (Math.random() < 0.3) {
    return correctAnswer // 30% chance to be correct
  }

  // Generate a wrong answer that's close to the correct one
  const diff = Math.floor(Math.random() * 5) + 1
  const sign = Math.random() > 0.5 ? 1 : -1
  return correctAnswer + sign * diff
}

const getAsteroidColor = (isCorrect: boolean, difficulty: string): string => {
  // All asteroids look the same - no visual indication of correct answer
  switch (difficulty) {
    case "easy":
      return "bg-gradient-to-br from-gray-800/90 to-gray-600/90 border-2 border-red-400/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]" // Basic enemy drones
    case "medium":
      return "bg-gradient-to-br from-red-900/90 to-red-700/90 border-2 border-orange-400/60 shadow-[0_0_12px_rgba(251,146,60,0.5)]" // Advanced enemy suits
    case "hard":
      return "bg-gradient-to-br from-orange-900/90 to-red-800/90 border-2 border-red-500/60 shadow-[0_0_15px_rgba(220,38,38,0.6)]" // Elite enemy tech
    default:
      return "bg-gradient-to-br from-slate-800/90 to-slate-600/90 border-2 border-gray-400/60 shadow-[0_0_8px_rgba(156,163,175,0.4)]" // Unknown threats
  }
}

const MathAsteroidBlaster = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    isGameOver: false,
    isPaused: false,
    currentProblem: generateMathProblem(1),
    combo: 0,
    maxCombo: 0,
    shield: 0,
    multishot: 0,
    slowmo: 0,
  })

  const [rocketPosition, setRocketPosition] = useState(50)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [highScore, setHighScore] = useState(0)

  // Use refs for frequently updated game elements to avoid re-renders
  const asteroidsRef = useRef<Asteroid[]>([])
  const bulletsRef = useRef<Bullet[]>([])
  const particlesRef = useRef<Particle[]>([])
  const powerUpsRef = useRef<PowerUp[]>([])
  const gameStateRef = useRef<GameState>(gameState)

  // State for rendering
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])

  const gameAreaRef = useRef<HTMLDivElement>(null)
  const lastShotTime = useRef(0)
  const gameLoopRef = useRef<number | null>(null)
  const isMounted = useRef(true)
  const frameCountRef = useRef(0)
  const lastUpdateTimeRef = useRef(0)
  const [isClient, setIsClient] = useState(false)
  const [showStars, setShowStars] = useState(false)

  // Fix for Next.js hydration issues
  useEffect(() => {
    setIsClient(true)
    setShowStars(true)

    // Load high score from localStorage
    try {
      const savedHighScore = localStorage.getItem("mathAsteroidHighScore")
      if (savedHighScore) {
        setHighScore(Number.parseInt(savedHighScore))
      }
    } catch (error) {
      console.log("Error loading high score:", error)
    }

    // Set mounted flag
    isMounted.current = true

    // Cleanup function
    return () => {
      isMounted.current = false

      // Cancel any animation frames when component unmounts
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }
  }, [])

  // Update ref when state changes
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  // Save high score to localStorage
  useEffect(() => {
    if (gameState.isGameOver && gameState.score > highScore) {
      try {
        setHighScore(gameState.score)
        localStorage.setItem("mathAsteroidHighScore", gameState.score.toString())
      } catch (error) {
        console.log("Error saving high score:", error)
      }
    }
  }, [gameState.isGameOver, gameState.score, highScore])

  const playSound = (soundName: string, volume = 0.2) => {
    try {
      if (typeof window !== "undefined" && isClient) {
        const audio = new Audio(`/sounds/${soundName}.mp3`)
        audio.volume = volume

        const playPromise = audio.play()

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio playback prevented:", error)
          })
        }
      }
    } catch (error) {
      console.log("Audio error:", error)
    }
  }

  const createExplosion = useCallback((x: number, y: number, color: string, count = 5) => {
    if (!isMounted.current) return

    const newParticles: Particle[] = []
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 9)

    // Reduced particle count for better performance
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `particle-${timestamp}-${randomId}-${i}`,
        x,
        y,
        size: Math.random() * 1.5 + 0.5, // Smaller particles
        color,
        speed: Math.random() * 1.2 + 0.3, // Reduced speed
        angle: Math.random() * Math.PI * 2,
        opacity: 1,
        life: Math.random() * 10 + 5, // Shorter life
      })
    }

    particlesRef.current = [...particlesRef.current, ...newParticles]
    // Update the state for rendering, but less frequently
    setParticles((prev) => [...prev, ...newParticles])
  }, [])

  const shootBullet = useCallback(() => {
    if (!isMounted.current || gameStateRef.current.isGameOver || gameStateRef.current.isPaused) return

    const now = Date.now()
    const cooldown = 300 // 300ms cooldown between shots

    if (now - lastShotTime.current < cooldown) return
    lastShotTime.current = now

    const newBullets: Bullet[] = []
    const timestamp = Date.now()

    if (gameStateRef.current.multishot > 0) {
      newBullets.push(
        { id: `bullet-${timestamp}-1`, x: rocketPosition - 2, y: 80, speed: 5 },
        { id: `bullet-${timestamp}-2`, x: rocketPosition, y: 80, speed: 5 },
        { id: `bullet-${timestamp}-3`, x: rocketPosition + 2, y: 80, speed: 5 },
      )
    } else {
      newBullets.push({ id: `bullet-${timestamp}`, x: rocketPosition, y: 80, speed: 5 })
    }

    bulletsRef.current = [...bulletsRef.current, ...newBullets]
    setBullets((prev) => [...prev, ...newBullets])

    // Play sound effect
    playSound("laser")
  }, [rocketPosition])

  const moveRocket = useCallback(
    (e: KeyboardEvent) => {
      if (!isMounted.current || !isGameStarted || gameStateRef.current.isGameOver || gameStateRef.current.isPaused)
        return

      if (e.key === "ArrowLeft" || e.key === "a") {
        setRocketPosition((prev) => Math.max(5, prev - 5))
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setRocketPosition((prev) => Math.min(95, prev + 5))
      } else if (e.key === " " || e.key === "w" || e.key === "ArrowUp") {
        e.preventDefault() // Prevent scrolling on spacebar
        shootBullet()
      } else if (e.key === "p" || e.key === "Escape") {
        setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
      }
    },
    [isGameStarted, shootBullet],
  )

  // Touch/mouse controls
  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (
        !isMounted.current ||
        !isGameStarted ||
        gameStateRef.current.isGameOver ||
        gameStateRef.current.isPaused ||
        !gameAreaRef.current
      )
        return

      let clientX: number

      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
      } else if ("clientX" in e) {
        clientX = e.clientX
      } else {
        return // Exit if we can't get a valid clientX
      }

      const rect = gameAreaRef.current.getBoundingClientRect()
      const relativeX = ((clientX - rect.left) / rect.width) * 100
      setRocketPosition(Math.max(5, Math.min(95, relativeX)))
    },
    [isGameStarted],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isMounted.current || !isGameStarted || gameStateRef.current.isGameOver || gameStateRef.current.isPaused)
        return
      handleTouchMove(e)
    },
    [handleTouchMove, isGameStarted],
  )

  const handleClick = useCallback(() => {
    if (!isMounted.current || !isGameStarted || gameStateRef.current.isGameOver || gameStateRef.current.isPaused) return
    shootBullet()
  }, [isGameStarted, shootBullet])

  // Ensure we always have 4 asteroids
  const ensureFourAsteroids = useCallback(() => {
    if (!isMounted.current) return

    const currentAsteroids = asteroidsRef.current

    // If we already have 4 or more, don't add more
    if (currentAsteroids.length >= 4) return

    const neededAsteroids = 4 - currentAsteroids.length
    const newAsteroids: Asteroid[] = []

    // Randomly decide which of the new asteroids will have the correct answer
    // If we already have a correct asteroid, don't add another one
    const hasCorrectAlready = currentAsteroids.some((asteroid) => asteroid.isCorrect)
    const correctIndex = hasCorrectAlready ? -1 : Math.floor(Math.random() * neededAsteroids)

    for (let i = 0; i < neededAsteroids; i++) {
      const isCorrect = i === correctIndex
      const value = isCorrect
        ? gameStateRef.current.currentProblem.answer
        : generateUniqueWrongAnswer(
          gameStateRef.current.currentProblem.answer,
          gameStateRef.current.level,
          [...currentAsteroids, ...newAsteroids].map((a) => a.value),
        )

      // Make asteroids bigger (20-30 instead of 10-20)
      const size = Math.random() * 10 + 20
      const speed = Math.random() * 0.3 + 0.2

      // Distribute them across the width
      const xPosition = 10 + (i + 1) * 20 + (Math.random() * 10 - 5)
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 9)

      newAsteroids.push({
        id: `asteroid-${timestamp}-${randomId}-${i}`,
        x: xPosition,
        y: -10,
        value,
        size,
        speed,
        rotation: Math.random() * 360,
        isCorrect,
      })
    }

    asteroidsRef.current = [...currentAsteroids, ...newAsteroids]
    setAsteroids((prev) => [...prev, ...newAsteroids])
  }, [])

  // Helper function to generate unique wrong answers
  const generateUniqueWrongAnswer = (correctAnswer: number, level: number, existingValues: number[]): number => {
    let wrongAnswer
    let attempts = 0

    do {
      // Generate a wrong answer that's close to the correct one
      const diff = Math.floor(Math.random() * 5) + 1
      const sign = Math.random() > 0.5 ? 1 : -1
      wrongAnswer = correctAnswer + sign * diff

      // Prevent negative answers for young learners
      if (wrongAnswer < 0) wrongAnswer = correctAnswer + diff

      attempts++
      // Prevent infinite loops
      if (attempts > 10) {
        wrongAnswer = correctAnswer + 10
        break
      }
    } while (wrongAnswer === correctAnswer || existingValues.includes(wrongAnswer))

    return wrongAnswer
  }

  // Set up event listeners
  useEffect(() => {
    window.addEventListener("keydown", moveRocket)
    return () => {
      window.removeEventListener("keydown", moveRocket)
    }
  }, [isGameStarted, moveRocket])

  // Main game loop
  useEffect(() => {
    if (!isMounted.current || !isGameStarted || gameStateRef.current.isGameOver || gameStateRef.current.isPaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
      return
    }

    // Initial spawn of 4 asteroids when game starts
    if (asteroidsRef.current.length === 0) {
      ensureFourAsteroids()
    }

    const updateGame = () => {
      if (!isMounted.current) {
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current)
          gameLoopRef.current = null
        }
        return
      }

      // Check if game is paused - exit early if it is
      if (gameStateRef.current.isPaused) {
        gameLoopRef.current = requestAnimationFrame(updateGame)
        return
      }

      // Increment frame counter
      frameCountRef.current += 1

      // Update powerup timers
      setGameState((prev) => ({
        ...prev,
        shield: Math.max(0, prev.shield - 1),
        multishot: Math.max(0, prev.multishot - 1),
        slowmo: Math.max(0, prev.slowmo - 1),
      }))

      // Move bullets
      const updatedBullets = bulletsRef.current
        .filter((bullet) => bullet.y > 0)
        .map((bullet) => ({ ...bullet, y: bullet.y - bullet.speed }))

      bulletsRef.current = updatedBullets

      // Move particles - reduced count for better performance
      let updatedParticles = particlesRef.current

      // If we have too many particles, remove the oldest ones (reduced from 30 to 15)
      if (updatedParticles.length > 15) {
        updatedParticles = updatedParticles.slice(-15)
      }

      updatedParticles = updatedParticles
        .filter((particle) => particle.life > 0)
        .map((particle) => ({
          ...particle,
          x: particle.x + Math.cos(particle.angle) * particle.speed,
          y: particle.y + Math.sin(particle.angle) * particle.speed,
          opacity: particle.opacity - 0.05, // Faster fade for better performance
          life: particle.life - 1.5, // Shorter life for better performance
        }))

      particlesRef.current = updatedParticles

      // Move powerups
      const updatedPowerUps = powerUpsRef.current
        .filter((powerUp) => powerUp.y < 100)
        .map((powerUp) => ({ ...powerUp, y: powerUp.y + 0.5 }))

      powerUpsRef.current = updatedPowerUps

      // Move asteroids and ensure we have 4
      let updatedAsteroids = asteroidsRef.current
      const timeScale = gameStateRef.current.slowmo > 0 ? 0.5 : 1 // Slow motion effect

      // Check if we need to spawn new asteroids to maintain 4
      if (updatedAsteroids.length < 4 && frameCountRef.current % 60 === 0) {
        ensureFourAsteroids()
        updatedAsteroids = asteroidsRef.current // Get the updated asteroids after ensuring 4
      }

      // Move existing asteroids
      updatedAsteroids = updatedAsteroids
        .filter((asteroid) => asteroid.y < 100)
        .map((asteroid) => ({
          ...asteroid,
          y: asteroid.y + asteroid.speed * timeScale,
          rotation: asteroid.rotation + 0.5,
        }))

      asteroidsRef.current = updatedAsteroids

      // Check collisions between bullets and asteroids
      const newAsteroids = [...updatedAsteroids]
      let newBullets = [...updatedBullets]
      const bulletsToRemove = new Set<string>()
      let needNewProblem = false

      // Check each asteroid against each bullet
      for (let i = newAsteroids.length - 1; i >= 0; i--) {
        const asteroid = newAsteroids[i]

        for (let j = 0; j < newBullets.length; j++) {
          // Skip if this bullet is already marked for removal
          if (bulletsToRemove.has(newBullets[j].id)) continue

          const bullet = newBullets[j]
          const hitboxSize = asteroid.size / 2

          if (Math.abs(asteroid.x - bullet.x) < hitboxSize && Math.abs(asteroid.y - bullet.y) < hitboxSize) {
            // Create explosion effect
            createExplosion(
              asteroid.x,
              asteroid.y,
              asteroid.isCorrect ? "#10b981" : "#ef4444",
              asteroid.isCorrect ? 8 : 5, // Reduced particle count for performance
            )

            // Mark bullet for removal
            bulletsToRemove.add(bullet.id)

            // Handle hit on correct or incorrect asteroid
            if (asteroid.isCorrect) {
              // Hit correct asteroid
              newAsteroids.splice(i, 1)
              needNewProblem = true

              // Update game state
              setGameState((prev) => {
                const newCombo = prev.combo + 1
                const comboBonus = Math.floor(newCombo / 3) * 50
                const newScore = prev.score + 100 + comboBonus
                const newLevel = Math.floor(newScore / 500) + 1
                const levelUp = newLevel > prev.level

                // Chance to spawn power-up on correct hit
                if (Math.random() < 0.2) {
                  const powerUpTypes = ["multishot", "shield", "slowmo"] as const
                  const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
                  const timestamp = Date.now()
                  const randomId = Math.random().toString(36).substring(2, 9)

                  const newPowerUp = {
                    id: `powerup-${timestamp}-${randomId}`,
                    x: asteroid.x,
                    y: asteroid.y,
                    type,
                    duration: 300, // 300 frames = ~5 seconds
                  }

                  powerUpsRef.current = [...powerUpsRef.current, newPowerUp]
                  setPowerUps((prev) => [...prev, newPowerUp])
                }

                // Play sound effect
                playSound("correct", 0.3)

                if (levelUp) {
                  // Play level up sound
                  playSound("levelup", 0.4)
                }

                // Generate a new problem when hitting the correct asteroid
                const newProblem = levelUp ? generateMathProblem(newLevel) : generateMathProblem(prev.level)

                return {
                  ...prev,
                  score: newScore,
                  combo: newCombo,
                  maxCombo: Math.max(prev.maxCombo, newCombo),
                  level: newLevel,
                  currentProblem: newProblem,
                }
              })
            } else {
              // Hit incorrect asteroid - check shield first
              newAsteroids.splice(i, 1)

              // Update game state - lose combo and life (unless shielded)
              setGameState((prev) => {
                // If shield is active, use it up instead of losing life
                if (prev.shield > 0) {
                  // Play shield sound
                  playSound("powerup", 0.2)
                  
                  return {
                    ...prev,
                    combo: 0,
                    shield: 0, // Use up the shield
                  }
                } else {
                  // No shield - lose life
                  const newLives = prev.lives - 0.5

                  // Play sound effect
                  playSound("wrong", 0.2)

                  return {
                    ...prev,
                    combo: 0,
                    lives: newLives,
                    isGameOver: newLives <= 0,
                  }
                }
              })
            }

            break
          }
        }
      }

      // Remove all bullets marked for removal
      newBullets = newBullets.filter((bullet) => !bulletsToRemove.has(bullet.id))

      bulletsRef.current = newBullets
      asteroidsRef.current = newAsteroids

      // Check for asteroids hitting bottom
      const hitBottom = newAsteroids.filter((asteroid) => asteroid.y >= 90)

      if (hitBottom.length > 0) {
        const newAsteroidsAfterHit = newAsteroids.filter((asteroid) => asteroid.y < 90)

        hitBottom.forEach((asteroid) => {
          if (asteroid.isCorrect) {
            // Missed correct answer
            setGameState((prev) => {
              // Don't lose life if shield is active
              if (prev.shield > 0) {
                return {
                  ...prev,
                  shield: 0, // Use up the shield
                  combo: 0,
                  currentProblem: generateMathProblem(prev.level),
                }
              }

              const newLives = prev.lives - 0.5

              // Play sound effect
              playSound("explosion", 0.3)

              return {
                ...prev,
                lives: newLives,
                isGameOver: newLives <= 0,
                combo: 0,
                currentProblem: generateMathProblem(prev.level),
              }
            })

            // Create explosion at bottom
            createExplosion(asteroid.x, 90, "#ef4444", 8) // Reduced particle count
          }
        })

        asteroidsRef.current = newAsteroidsAfterHit
      }

      // Check for rocket collecting powerups
      const newPowerUps = [...powerUpsRef.current]
      const rocketHitbox = 5
      let powerUpCollected = false

      for (let i = newPowerUps.length - 1; i >= 0; i--) {
        const powerUp = newPowerUps[i]

        if (Math.abs(powerUp.x - rocketPosition) < rocketHitbox && powerUp.y > 85 && powerUp.y < 95) {
          // Apply power-up effect
          setGameState((prevState) => {
            // Play power-up sound
            playSound("powerup", 0.3)

            switch (powerUp.type) {
              case "multishot":
                return { ...prevState, multishot: powerUp.duration }
              case "shield":
                return { ...prevState, shield: powerUp.duration }
              case "slowmo":
                return { ...prevState, slowmo: powerUp.duration }
              default:
                return prevState
            }
          })

          // Create collection effect
          createExplosion(powerUp.x, powerUp.y, "#8b5cf6", 6) // Reduced particle count

          // Remove the power-up
          newPowerUps.splice(i, 1)
          powerUpCollected = true
        }
      }

      powerUpsRef.current = newPowerUps

      // If we hit the correct asteroid, clear all asteroids to prepare for the new problem
      if (needNewProblem) {
        asteroidsRef.current = []
        setAsteroids([])
      }

      // Update the state for rendering, but only periodically to avoid too many re-renders
      const now = Date.now()
      if (now - lastUpdateTimeRef.current > 200 || powerUpCollected || needNewProblem) {
        // Update less frequently (200ms instead of 150ms) to reduce lag further
        lastUpdateTimeRef.current = now
        setBullets([...bulletsRef.current])
        setAsteroids([...asteroidsRef.current])
        setParticles([...particlesRef.current])
        setPowerUps([...powerUpsRef.current])
      }

      if (isMounted.current && !gameStateRef.current.isGameOver) {
        gameLoopRef.current = requestAnimationFrame(updateGame)
      }
    }

    gameLoopRef.current = requestAnimationFrame(updateGame)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }
  }, [isGameStarted, rocketPosition, createExplosion, ensureFourAsteroids])

  const startGame = useCallback(() => {
    if (!isMounted.current) return

    const initialProblem = generateMathProblem(1)

    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      isGameOver: false,
      isPaused: false,
      currentProblem: initialProblem,
      combo: 0,
      maxCombo: 0,
      shield: 0,
      multishot: 0,
      slowmo: 0,
    })

    gameStateRef.current = {
      score: 0,
      lives: 3,
      level: 1,
      isGameOver: false,
      isPaused: false,
      currentProblem: initialProblem,
      combo: 0,
      maxCombo: 0,
      shield: 0,
      multishot: 0,
      slowmo: 0,
    }

    // Reset all game elements
    asteroidsRef.current = []
    bulletsRef.current = []
    particlesRef.current = []
    powerUpsRef.current = []

    setAsteroids([])
    setBullets([])
    setParticles([])
    setPowerUps([])

    frameCountRef.current = 0
    lastUpdateTimeRef.current = 0
    setIsGameStarted(true)
    setShowTutorial(false)

    // Play game start sound
    playSound("start", 0.3)
  }, [])

  const togglePause = useCallback(() => {
    if (!isMounted.current) return
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
  }, [])

  const showTutorialScreen = useCallback(() => {
    if (!isMounted.current) return
    setShowTutorial(true)
  }, [])

  const handleFullscreen = () => {
    const fs = document.getElementById("gameScreen") as HTMLElement | null
    const isFullScreen = document.fullscreenElement

    if (isFullScreen) {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen error:", err)
      })
    } else {
      fs?.requestFullscreen().catch((err) => {
        console.error("Request fullscreen error:", err)
      })

      const ga = document.getElementById("gameArea")
      ga?.style.setProperty("height", "700px")
    }
  }

  // Render start screen
  if (!isGameStarted) {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[600px] bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center overflow-hidden relative rounded-xl">
        {/* Outer Space Background */}
        {isClient && showStars && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Reduced stars for better performance */}
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute rounded-full bg-white opacity-50"
                style={{
                  width: `${Math.random() * 1.5 + 0.5}px`,
                  height: `${Math.random() * 1.5 + 0.5}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}

            {/* Simplified distant objects */}
            <div className="absolute top-[10%] left-[15%] w-[20%] h-[20%] rounded-full bg-gradient-to-br from-red-900/20 to-red-700/10 blur-2xl"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[25%] h-[15%] rounded-full bg-gradient-to-tl from-orange-800/15 to-red-900/10 blur-2xl"></div>
            
            {/* Reduced space debris */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`debris-${i}`}
                className="absolute rounded-full bg-gray-400 opacity-20"
                style={{
                  width: `${Math.random() * 1 + 0.3}px`,
                  height: `${Math.random() * 1 + 0.3}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}

        {showTutorial ? (
          <div className="relative z-10 max-w-md w-full">
            <Card className="p-6 bg-gradient-to-br from-black/95 via-red-900/20 to-black/95 backdrop-blur-sm border-2 border-red-500/30">
              <h2 className="text-2xl font-bold mb-4 text-center text-red-400">
                IRON MAN COMBAT TUTORIAL
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-r from-red-500 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">?</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-300">Solve Math Problems</h3>
                    <p className="text-sm text-gray-300">
                      Use repulsors to destroy asteroids with the correct math answer. Avoid wrong calculations!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-300">Suit Controls</h3>
                    <p className="text-sm text-gray-300">
                      Arrow keys or A/D to move • Space/W to fire • P to pause • Mobile: Tap controls
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-red-500/30 to-orange-500/30 p-2 rounded-full">
                    <Award className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-300">Power Enhancements</h3>
                    <p className="text-sm text-gray-300">
                      Collect power-ups: Red multishot • Orange shield • Red slowmo
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 px-8 py-3 rounded-lg text-lg font-bold transition-all border border-orange-400/50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-orange-300 to-red-400 rounded-full"></div>
                  Initialize Combat
                </div>
              </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="relative z-10 text-center max-w-2xl px-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-red-500 via-orange-400 to-red-400 bg-clip-text text-transparent">
                IRON MAN: MATH COMBAT
              </h1>
              <div className="flex justify-center mb-10 mt-3">
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-1 border-orange-400/50 text-orange-300 uppercase tracking-widest"
                >
                  MARK 85 EDITION
                </Badge>
              </div>
            </div>

            <p className="text-xl mb-8 text-gray-300 max-w-lg mx-auto">
              Engage in mathematical combat! Use your repulsor technology to 
              destroy asteroids with correct answers and protect Earth from numerical threats!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-8 py-6 rounded-lg text-xl font-bold transition-all border border-orange-400/50"
              >
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-orange-300 to-red-400 rounded-full"></div> Deploy Suit
                </span>
              </Button>

              <Button
                onClick={showTutorialScreen}
                variant="outline"
                className="border-orange-400/50 text-orange-300 hover:bg-orange-500/10 px-8 py-6 rounded-lg text-xl font-bold transition-all"
              >
                Tutorial
              </Button>
            </div>

            {highScore > 0 && (
              <div className="flex justify-center items-center gap-2 text-orange-400">
                <Award className="w-5 h-5" />
                <span className="font-bold">High Score: {highScore}</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-black">
      {isClient && (
        <>
          {/* Game UI */}
          <div className="relative z-10 p-3 md:p-4 bg-gradient-to-b from-black via-red-950/10 to-black iron-man-hud-overlay" id="gameScreen">
            {/* Math Problem with UI elements on sides */}
            <div className="flex items-center justify-between mb-4 p-3 rounded-lg backdrop-blur-sm bg-gradient-to-r from-red-900/30 to-orange-900/20 border border-red-500/30">
              {/* Lives and Level - Left Side */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: Math.ceil(gameState.lives) }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-red-500 mx-0.5 animate-scaleIn`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {i < gameState.lives && gameState.lives % 1 !== 0 && Math.ceil(gameState.lives) - 1 === i
                        ? "💔"
                        : "❤️"}
                    </span>
                  ))}
                </div>
                <Badge variant="outline" className="bg-red-900/60 border-red-500/40 text-red-300">
                  Lv.{gameState.level}
                </Badge>

                <button className="z-10" onClick={handleFullscreen}>
                  <Fullscreen className="z-10 w-6 h-6 text-orange-400 hover:text-orange-200 transition" />
                </button>
              </div>

              {/* Math Problem - Center */}
              <div className="text-center">
                <div className="text-sm text-orange-300 mb-1">Solve:</div>
                <div
                  className="text-2xl md:text-3xl font-bold text-white animate-popIn"
                  key={gameState.currentProblem.question}
                >
                  {gameState.currentProblem.question}
                </div>
              </div>

              {/* Score - Right Side */}
              <div className="flex flex-col items-end gap-1">
                <div className="text-lg md:text-xl font-bold text-white">{gameState.score}</div>
                {gameState.combo > 1 && (
                  <div className="animate-scaleIn">
                    <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500/50">
                      x{gameState.combo}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Active power-ups */}
            <div className="flex gap-2 mb-2">
              {gameState.shield > 0 && (
                <div className="animate-slideRight">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                    🛡️ {Math.ceil(gameState.shield / 60)}s
                  </Badge>
                </div>
              )}
              {gameState.multishot > 0 && (
                <div className="animate-slideRight" style={{ animationDelay: "0.1s" }}>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                    🔫 {Math.ceil(gameState.multishot / 60)}s
                  </Badge>
                </div>
              )}
              {gameState.slowmo > 0 && (
                <div className="animate-slideRight" style={{ animationDelay: "0.2s" }}>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">
                    ⏱️ {Math.ceil(gameState.slowmo / 60)}s
                  </Badge>
                </div>
              )}
            </div>

            {/* Game Over Screen */}
            {gameState.isGameOver && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
                <div className="animate-scaleIn" style={{ animationDelay: "0.2s" }}>
                  <Card className="w-full max-w-md bg-[#0c0c16]/90 border-[#2a2a4a] shadow-xl border-2">
                    <div className="text-center p-6">
                      <h2
                        className="text-4xl font-bold mb-2 text-red-500 animate-slideDown"
                        style={{ animationDelay: "0.3s" }}
                      >
                        Game Over!
                      </h2>
                      <p className="text-2xl mb-6 text-white animate-slideDown" style={{ animationDelay: "0.4s" }}>
                        Final Score: {gameState.score}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-6 animate-slideUp" style={{ animationDelay: "0.5s" }}>
                        <div className="bg-red-900/50 p-3 rounded-lg border border-red-500/40">
                          <div className="text-sm text-red-300">Level Reached</div>
                          <div className="text-xl font-bold text-white">{gameState.level}</div>
                        </div>
                        <div className="bg-red-900/30 p-3 rounded-lg border border-orange-400/30">
                          <div className="text-sm text-orange-300">Max Combo</div>
                          <div className="text-xl font-bold text-white">{gameState.maxCombo}x</div>
                        </div>
                      </div>

                      {gameState.score > highScore && (
                        <div
                          className="mb-6 p-3 bg-orange-500/20 rounded-lg text-orange-300 flex items-center justify-center gap-2 border border-orange-500/30 animate-popIn"
                          style={{ animationDelay: "0.6s" }}
                        >
                          <Award className="w-5 h-5" />
                          <span className="font-bold">New High Score!</span>
                        </div>
                      )}

                      <div
                        className="flex flex-col sm:flex-row gap-3 justify-center animate-slideUp"
                        style={{ animationDelay: "0.7s" }}
                      >
                        <Button
                          onClick={startGame}
                          className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-6 py-2 rounded-lg text-lg font-bold transition-all shadow-[0_0_15px_rgba(255,107,53,0.5)] border border-orange-400/50"
                        >
                          Play Again
                        </Button>

                        <Button
                          onClick={() => setIsGameStarted(false)}
                          variant="outline"
                          className="border-slate-600 hover:bg-slate-800/50"
                        >
                          Main Menu
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Pause Screen */}
            {gameState.isPaused && !gameState.isGameOver && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
                <div className="animate-scaleIn">
                  <Card className="w-full max-w-md bg-[#0c0c16]/90 border-[#2a2a4a] shadow-xl border-2">
                    <div className="text-center p-6">
                      <h2
                        className="text-4xl font-bold mb-6 bg-clip-text text-transparent iron-man-title animate-slideDown"
                        style={{ animationDelay: "0.1s" }}
                      >
                        Game Paused
                      </h2>

                      <div className="flex flex-col gap-3 mb-6 animate-slideUp" style={{ animationDelay: "0.2s" }}>
                        <div className="flex justify-between p-3 bg-red-900/50 rounded-lg border border-red-500/40">
                          <span className="text-red-300">Score:</span>
                          <span className="font-bold text-white">{gameState.score}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-red-900/50 rounded-lg border border-red-500/40">
                          <span className="text-red-300">Level:</span>
                          <span className="font-bold text-white">{gameState.level}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-red-900/30 rounded-lg border border-orange-400/30">
                          <span className="text-orange-300">Current Combo:</span>
                          <span className="font-bold text-white">{gameState.combo}x</span>
                        </div>
                      </div>

                      <div
                        className="flex flex-col sm:flex-row gap-3 justify-center animate-slideUp"
                        style={{ animationDelay: "0.3s" }}
                      >
                        <Button
                          onClick={togglePause}
                          className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-6 py-2 rounded-lg text-lg font-bold transition-all shadow-[0_0_15px_rgba(255,107,53,0.5)] border border-orange-400/50"
                        >
                          <Play className="w-4 h-4 mr-2" /> Resume
                        </Button>

                        <Button
                          onClick={() => setIsGameStarted(false)}
                          variant="outline"
                          className="border-slate-600 hover:bg-slate-800/50"
                        >
                          Main Menu
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Game Area */}
            <div
              ref={gameAreaRef}
              className="relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] border border-[#2a2a4a]/50 rounded-lg bg-black/30 backdrop-blur-sm overflow-hidden shadow-inner"
              id="gameArea"
              onMouseMove={handleTouchMove}
              onTouchMove={handleTouchMove}
              onMouseDown={handleTouchStart}
              onTouchStart={handleTouchStart}
              onClick={handleClick}
            >
              {/* Outer Space Background */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Reduced stars for game area performance */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={`game-star-${i}`}
                    className="absolute rounded-full bg-white opacity-60"
                    style={{
                      width: `${Math.random() * 1.5 + 0.5}px`,
                      height: `${Math.random() * 1.5 + 0.5}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}

                {/* Simplified distant space objects */}
                <div className="absolute top-[15%] left-[5%] w-[15%] h-[12%] rounded-full bg-gradient-to-br from-red-900/15 to-orange-800/8 blur-xl"></div>
                <div className="absolute bottom-[25%] right-[8%] w-[18%] h-[15%] rounded-full bg-gradient-to-tl from-orange-900/12 to-red-800/8 blur-xl"></div>
                
                {/* Reduced space dust */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={`dust-${i}`}
                    className="absolute rounded-full bg-gray-300 opacity-15"
                    style={{
                      width: `${Math.random() * 0.8 + 0.2}px`,
                      height: `${Math.random() * 0.8 + 0.2}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}

                {/* Simplified HUD Elements */}
                <div className="absolute top-2 left-2 w-10 h-10 border border-red-500/15 rounded-lg opacity-30"></div>
                <div className="absolute top-2 right-2 w-10 h-10 border border-orange-400/15 rounded-lg opacity-30"></div>
                <div className="absolute bottom-2 left-2 w-10 h-10 border border-red-500/15 rounded-lg opacity-30"></div>
                <div className="absolute bottom-2 right-2 w-10 h-10 border border-orange-400/15 rounded-lg opacity-30"></div>
              </div>

              {/* Particles */}
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className="absolute rounded-full animate-fadeOut"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    transform: `translate(-50%, -50%)`,
                    boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                    opacity: particle.opacity,
                  }}
                />
              ))}

              {/* Iron Man Tech Power-ups */}
              {powerUps.map((powerUp) => (
                <div
                  key={powerUp.id}
                  className="absolute w-8 h-8 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${powerUp.x}%`,
                    top: `${powerUp.y}%`,
                    backgroundColor:
                      powerUp.type === "multishot"
                        ? "rgba(239, 68, 68, 0.8)" // Red for multishot
                        : powerUp.type === "shield"
                          ? "rgba(255, 107, 53, 0.8)" // Orange for shield
                          : "rgba(251, 146, 60, 0.8)", // Light orange for slowmo
                    boxShadow:
                      powerUp.type === "multishot"
                        ? "0 0 20px rgba(239, 68, 68, 0.8)"
                        : powerUp.type === "shield"
                          ? "0 0 20px rgba(255, 107, 53, 0.8)"
                          : "0 0 20px rgba(251, 146, 60, 0.8)",
                  }}
                >
                  {powerUp.type === "multishot" && <Zap className="w-5 h-5 text-white" />}
                  {powerUp.type === "shield" && <div className="text-lg">🛡️</div>}
                  {powerUp.type === "slowmo" && <div className="text-lg">⏰</div>}
                </div>
              ))}

              {/* Enemy Targets */}
              {asteroids.map((asteroid) => (
                <div
                  key={asteroid.id}
                  className={`absolute rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${getAsteroidColor(asteroid.isCorrect, gameState.currentProblem.difficulty)}`}
                  style={{
                    left: `${asteroid.x}%`,
                    top: `${asteroid.y}%`,
                    width: `${asteroid.size * 2}px`,
                    height: `${asteroid.size * 2}px`,
                    transform: `translate(-50%, -50%) rotate(${asteroid.rotation}deg)`,
                  }}
                >
                  <span className="text-lg font-bold text-white">{asteroid.value}</span>

                  {/* Simple enemy indicators */}
                  <div className="absolute w-[25%] h-[25%] rounded-full bg-red-400/40 top-[15%] left-[15%]"></div>
                  <div className="absolute w-[20%] h-[20%] rounded-full bg-orange-300/40 bottom-[25%] right-[20%]"></div>
                  
                  {/* Threat indicator */}
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              ))}

              {/* Iron Man Repulsor Beams */}
              {bullets.map((bullet) => (
                <div key={bullet.id} className="repulsor-container">
                  {/* Main Repulsor Beam */}
                  <div
                    className="absolute"
                    style={{
                      left: `${bullet.x}%`,
                      top: `${bullet.y}%`,
                      width: "6px",
                      height: "24px",
                      backgroundColor: "#ff6b35", // Orange repulsor beam
                      transform: "translateX(-50%)",
                      borderRadius: "50%",
                      zIndex: 5,
                      opacity: 0.9,
                      boxShadow: "0 0 8px rgba(255, 107, 53, 0.8), 0 0 12px rgba(255, 170, 0, 0.5)",
                    }}
                  />

                  {/* Repulsor Energy Trail */}
                  <div
                    className="absolute"
                    style={{
                      left: `${bullet.x}%`,
                      top: `${bullet.y}%`,
                      width: "4px",
                      height: "90%",
                      background:
                        "linear-gradient(to top, transparent, rgba(255, 107, 53, 0.4), rgba(255, 170, 0, 0.6), transparent)",
                      transform: "translateX(-50%)",
                      filter: "blur(1px)",
                      zIndex: 4,
                    }}
                  />
                </div>
              ))}

              {/* Iron Man Mark 85 Suit */}
              <div
                className={`absolute bottom-2 transform -translate-x-1/2 transition-all duration-300 ${gameState.shield > 0 ? "shield-active" : ""
                  } hover:-translate-y-1 hover:scale-105`}
                style={{ left: `${rocketPosition}%` }}
              >
                {/* Shield Field */}
                {gameState.shield > 0 && (
                  <div className="absolute w-18 h-18 rounded-full bg-gradient-to-br from-orange-400/30 to-red-400/20 border border-orange-300/50 -translate-x-1/3 -translate-y-1/3">
                    {/* Shield Glow */}
                    <div className="absolute inset-0 rounded-full bg-orange-400/20 blur-md" />
                  </div>
                )}

                {/* Main Suit Body */}
                <div className="relative w-10 h-14 md:w-11 md:h-15">
                  {/* Thruster Glow */}
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-t from-orange-500/60 via-red-400/40 to-transparent blur-[5px]" />

                  {/* Iron Man Torso */}
                  <div className="relative w-full h-full bg-gradient-to-b from-red-600 via-red-500 to-red-700 rounded-[40%] overflow-hidden shadow-[0_0_12px_rgba(239,68,68,0.4)] z-10 border border-orange-400/50">
                    {/* Gold Accent Shine */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-orange-300/40 to-transparent" />

                    {/* Arc Reactor Core */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-4.5 md:h-4.5 rounded-full border border-orange-200 shadow-[0_0_10px_3px_rgba(255,107,53,0.6)]">
                      <div className="absolute inset-0.5 rounded-full bg-gradient-to-r from-orange-300 to-red-400" />
                      <div className="absolute inset-1 rounded-full bg-white/90 opacity-80" />
                    </div>

                    {/* Orange Racing Stripes */}
                    <div className="absolute top-7 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400/90 to-transparent"></div>
                    <div className="absolute top-8 left-1/4 w-1/2 h-[2px] bg-orange-500/80"></div>

                    {/* Mark Designation */}
                    <div className="absolute top-9 left-1/2 transform -translate-x-1/2 text-[5px] md:text-[6px] font-bold text-orange-300 tracking-widest">
                      MK-85
                    </div>
                  </div>

                  {/* Arm Sections */}
                  <div className="absolute -left-2 bottom-2 w-2 h-4 bg-gradient-to-br from-red-500/90 via-red-600/70 to-red-700 transform skew-x-[-25deg] rounded-l-sm shadow-[1px_1px_3px_rgba(255,107,53,0.3)] z-0 border-t border-orange-400/40">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_70%,rgba(255,107,53,0.4)_100%)]"></div>
                    {/* Left Hand Repulsor */}
                    <div className="absolute top-1 left-0.5 w-1 h-1 bg-orange-300 rounded-full shadow-orange-300/70 shadow-sm" />
                  </div>
                  <div className="absolute -right-2 bottom-2 w-2 h-4 bg-gradient-to-bl from-red-500/90 via-red-600/70 to-red-700 transform skew-x-[25deg] rounded-r-sm shadow-[1px_1px_3px_rgba(255,107,53,0.3)] z-0 border-t border-orange-400/40">
                    <div className="absolute inset-0 bg-[linear-gradient(225deg,transparent_70%,rgba(255,107,53,0.4)_100%)]"></div>
                    {/* Right Hand Repulsor */}
                    <div className="absolute top-1 right-0.5 w-1 h-1 bg-orange-300 rounded-full shadow-orange-300/70 shadow-sm" />
                  </div>

                  {/* Helmet Details */}
                  <div className="absolute -left-0.5 top-4 w-0.8 h-2 bg-orange-500/90 transform skew-y-[40deg] rounded-t-sm border border-orange-300/50"></div>
                  <div className="absolute -right-0.5 top-4 w-0.8 h-2 bg-orange-500/90 transform skew-y-[-40deg] rounded-t-sm border border-orange-300/50"></div>

                  {/* Boot Thrusters */}
                  <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 flex justify-center">
                    <div className="relative w-7 h-10">
                      {/* Thruster Flames */}
                      <div className="absolute w-full h-full bg-gradient-to-t from-orange-600 via-orange-500 to-transparent rounded-b-full" />
                      <div className="absolute w-full h-full bg-gradient-to-t from-red-500/90 to-transparent rounded-b-full" />
                      <div className="absolute w-full h-full bg-gradient-to-t from-orange-500/70 to-transparent rounded-b-full" />
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2.5 h-5 bg-gradient-to-t from-white to-orange-300 rounded-b-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Iron Man Mobile Controls */}
          <div className="sm:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-8 z-20 px-4">
            <div className="touch-none hover:scale-90 active:scale-75 transition-transform">
              <Button
                onClick={() => setRocketPosition((prev) => Math.max(5, prev - 10))}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-full w-12 h-12 flex items-center justify-center border-2 border-orange-400 shadow-[0_0_8px_rgba(255,107,53,0.4)]"
              >
                ←
              </Button>
            </div>

            <div className="touch-none hover:scale-90 active:scale-75 transition-transform">
              <Button
                onClick={shootBullet}
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 rounded-full w-14 h-14 flex items-center justify-center border-2 border-red-300 shadow-[0_0_10px_rgba(255,107,53,0.5)]"
              >
                <Zap className="w-6 h-6" />
              </Button>
            </div>

            <div className="touch-none hover:scale-90 active:scale-75 transition-transform">
              <Button
                onClick={() => setRocketPosition((prev) => Math.min(95, prev + 10))}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-full w-12 h-12 flex items-center justify-center border-2 border-orange-400 shadow-[0_0_8px_rgba(255,107,53,0.4)]"
              >
                →
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MathAsteroidBlaster
