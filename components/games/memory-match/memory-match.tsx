"use client"
import './memory-match.css'

import { useState, useEffect, useRef } from "react"
import {
  HelpCircle,
  Brain,
  Zap,
  Puzzle,
  Crown,
  Diamond,
  Star,
  Sparkles,
  Eye,
  Target,
  Crosshair,
  Shield,
  Swords,
  Key,
  Lock,
  Gem,
  Trophy,
  Flame,
  Skull,
  Calculator,
  Code,
  Cog,
  Lightbulb,
  Fullscreen,
  MapPin,
  Search,
  Compass,
  Lightbulb as LightbulbIcon,
  Fingerprint,
  Microscope,
  BookOpen,
  Globe,
  Smartphone,
  Watch,
  Gamepad2,
  Headphones,
  Camera,
  Music,
  Gift,
  Bell,
  Archive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

type Difficulty = "easy" | "medium" | "hard"

import type { ReactElement } from "react"

type CardType = {
  id: number
  icon: ReactElement
  isFlipped: boolean
  isMatched: boolean
  iconName: string
}

const icons = [
  { Icon: HelpCircle, name: "question" },
  { Icon: Brain, name: "brain" },
  { Icon: Puzzle, name: "puzzle" },
  { Icon: Key, name: "key" },
  { Icon: Lock, name: "lock" },
  { Icon: Eye, name: "eye" },
  { Icon: Target, name: "target" },
  { Icon: Lightbulb, name: "lightbulb" },
  { Icon: Search, name: "search" },
  { Icon: Compass, name: "compass" },
  { Icon: Fingerprint, name: "fingerprint" },
  { Icon: Microscope, name: "microscope" },
  { Icon: BookOpen, name: "book" },
  { Icon: Code, name: "code" },
  { Icon: Cog, name: "cog" },
  { Icon: Calculator, name: "calculator" },
  { Icon: Globe, name: "globe" },
  { Icon: Crosshair, name: "crosshair" },
  { Icon: Shield, name: "shield" },
  { Icon: Diamond, name: "diamond" },
  { Icon: Gem, name: "gem" },
  { Icon: Crown, name: "crown" },
  { Icon: Trophy, name: "trophy" },
  { Icon: Star, name: "star" },
  { Icon: Zap, name: "zap" },
  { Icon: Flame, name: "flame" },
  { Icon: Skull, name: "skull" },
  { Icon: Sparkles, name: "sparkles" },
  { Icon: MapPin, name: "pin" },
  { Icon: Swords, name: "swords" },
  { Icon: Smartphone, name: "phone" },
  { Icon: Watch, name: "watch" },
  { Icon: Gamepad2, name: "gamepad" },
  { Icon: Headphones, name: "headphones" },
  { Icon: Camera, name: "camera" },
  { Icon: Music, name: "music" },
  { Icon: Gift, name: "gift" },
  { Icon: Bell, name: "bell" },
  { Icon: Archive, name: "archive" },
]

const getIconColor = (name: string) => {
  const map: Record<string, string> = {
    question: "text-green-400",
    brain: "text-purple-400",
    puzzle: "text-green-300",
    key: "text-yellow-400",
    lock: "text-purple-500",
    eye: "text-green-500",
    target: "text-red-400",
    lightbulb: "text-yellow-300",
    search: "text-green-400",
    compass: "text-purple-400",
    fingerprint: "text-green-300",
    microscope: "text-purple-300",
    book: "text-green-500",
    code: "text-purple-400",
    cog: "text-gray-400",
    calculator: "text-green-400",
    globe: "text-blue-400",
    crosshair: "text-red-500",
    shield: "text-green-500",
    diamond: "text-cyan-400",
    gem: "text-purple-400",
    crown: "text-yellow-400",
    trophy: "text-yellow-300",
    star: "text-yellow-400",
    zap: "text-yellow-500",
    flame: "text-orange-400",
    skull: "text-purple-500",
    sparkles: "text-green-300",
    pin: "text-red-400",
    swords: "text-gray-400",
    phone: "text-green-400",
    watch: "text-purple-400",
    gamepad: "text-green-500",
    headphones: "text-purple-300",
    camera: "text-gray-300",
    music: "text-purple-500",
    gift: "text-red-400",
    bell: "text-yellow-400",
    archive: "text-green-400",
  }

  return map[name] || "text-green-400"
}

const difficultySettings = {
  easy: { grid: 4, pairs: 8 },
  medium: { grid: 4, pairs: 8 },
  hard: { grid: 5, pairs: 10 },
}

const MemoryMatch = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameTime, setGameTime] = useState(0)
  const [showDifficultySelect, setShowDifficultySelect] = useState(true)
  const [gameComplete, setGameComplete] = useState(false)
  const [blobIntensity, setBlobIntensity] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number>(0)

  const initializeGame = (diff: Difficulty) => {
    setShowDifficultySelect(false)
    setDifficulty(diff)
    setGameComplete(false)

    const { grid, pairs } = difficultySettings[diff]
    const selectedIcons = [...icons].sort(() => Math.random() - 0.5).slice(0, pairs)

    const gameCards: CardType[] = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon: <icon.Icon className={`w-8 h-8 ${getIconColor(icon.name)}`} />,
        isFlipped: false,
        isMatched: false,
        iconName: icon.name,
      }))

    setCards(gameCards)
    setScore(0)
    setMoves(0)
    setGameTime(0)
    setFlippedCards([])
    setIsPlaying(true)
    setBlobIntensity(0.3)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      setGameTime((prev) => prev + 1)
    }, 1000)
  }

  const resetGame = () => {
    setShowDifficultySelect(true)
    setDifficulty(null)
    setCards([])
    setIsPlaying(false)
    setGameComplete(false)
    setBlobIntensity(0.2)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const handleCardClick = (cardId: number) => {
    if (!isPlaying) return
    if (flippedCards.length === 2) return
    if (cards[cardId].isMatched) return
    if (flippedCards.includes(cardId)) return

    const newCards = [...cards]
    newCards[cardId].isFlipped = true
    setCards(newCards)

    // Pulse the background blobs when a card is flipped
    setBlobIntensity(0.5)
    setTimeout(() => setBlobIntensity(0.3), 300)

    setFlippedCards((prev) => [...prev, cardId])

    if (flippedCards.length === 1) {
      setMoves((prev) => prev + 1)
      const [firstCard] = flippedCards

      if (cards[firstCard].iconName === cards[cardId].iconName) {
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[firstCard].isMatched = true
          matchedCards[cardId].isMatched = true
          setCards(matchedCards)
          setScore((prev) => prev + 1)
          setFlippedCards([])

          // Intensify the background on match
          setBlobIntensity(0.7)
          setTimeout(() => setBlobIntensity(0.3), 500)

          // Check if game is complete
          const allMatched = matchedCards.every((card) => card.isMatched)
          if (allMatched) {
            if (timerRef.current) {
              clearInterval(timerRef.current)
            }
            setIsPlaying(false)
            setGameComplete(true)
            setBlobIntensity(0.9)
          }
        }, 500)
      } else {
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[firstCard].isFlipped = false
          resetCards[cardId].isFlipped = false
          setCards(resetCards)
          setFlippedCards([])

          // Dim the background on mismatch
          setBlobIntensity(0.2)
          setTimeout(() => setBlobIntensity(0.3), 300)
        }, 1000)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleFullScreen = () => {
    const fs = document.getElementById("gameScreen") as HTMLElement | null;
    const isFullScreen = document.fullscreenElement;

    if (isFullScreen) {
      document.exitFullscreen().catch((err) => {
        console.log("Exit fullscreen error:", err);
      });
    } else {
      fs?.requestFullscreen().catch((err) => {
        console.log("Request fullscreen error:", err);
      });
    }
  };

  return (
    <div className="memory-match-container rounded-xl" id="gameScreen">

      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>
      <div className="orb orb4"></div>

      {/* Riddler Background elements */}
      <div className="memory-match-background">
        <div className="memory-match-overlay"></div>
        {/* Clean animated blobs without emojis */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`blob-${i}`}
            className="memory-match-blob riddler-blob"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${200 + Math.random() * 300}px`,
              height: `${200 + Math.random() * 300}px`,
              animationDuration: `${40 + Math.random() * 40}s`,
              animationDelay: `${-Math.random() * 40}s`,
              opacity: blobIntensity,
              filter: `blur(${80 + Math.random() * 40}px)`,
              transform: `scale(${1 + blobIntensity})`,
              transition: "opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease",
            }}
          />
        ))}
      </div>

      <div className="memory-match-content">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <h1 className="riddler-title">
            <span className="riddler-title-main">RIDDLER'S</span>
            <span className="riddler-title-sub">CHALLENGE</span>
          </h1>

          <AnimatePresence>
            {showDifficultySelect && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center gap-6 p-6 mb-8 rounded-2xl bg-gradient-to-tl from-[#180b23] via-[#a0ffa009] to-[#050510] shadow-xl shadow-[#14271158] border-2 border-[#16691333]"
              >
                <h2 className="text-2xl font-semibold text-green-400 drop-shadow-glow">Choose Your Challenge Level</h2>

                <div className="flex flex-col sm:flex-row gap-4">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((diff, index) => (
                    <motion.div
                      key={diff}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Button
                        onClick={() => initializeGame(diff)}
                        variant="default"
                        className="difficulty-button px-6 py-3 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-glow"
                      >
                        {diff === "easy" ? "EASY" : diff === "medium" ? "MEDIUM" : "HARD"}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mt-4"
                >
                  <Fullscreen
                    className="w-6 h-6 text-white cursor-pointer hover:text-green-400 transition-colors duration-300"
                    onClick={handleFullScreen}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {difficulty && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-5"
            >
              <Badge variant="outline" className="game-stat-badge">
                <span className="text-green-400 mr-1">Level:</span> {difficulty}
              </Badge>
              <Badge variant="outline" className="game-stat-badge">
                <span className="text-blue-400 mr-1">Score:</span> {score}
              </Badge>
              <Badge variant="outline" className="game-stat-badge">
                <span className="text-green-400 mr-1">Moves:</span> {moves}
              </Badge>
              <Badge variant="outline" className="game-stat-badge">
                <span className="text-blue-400 mr-1">Time:</span> {formatTime(gameTime)}
              </Badge>
            </motion.div>
          )}
        </motion.div>

        {gameComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-8 relative"
          >
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    backgroundColor: `hsl(${120 + Math.random() * 60}, ${70 + Math.random() * 30}%, ${40 + Math.random() * 30}%)`,
                  }}
                />
              ))}
            </div>
            <div className="complete-message">
              <h2 className="text-2xl font-bold text-green-400 mb-3">🎭 Riddle Solved! 🎭</h2>
              <p className="text-lg text-purple-300">
                You cracked the {difficulty} challenge in {formatTime(gameTime)} with {moves} moves!
              </p>
              <p className="text-sm text-green-300 mt-2 italic">
                "Congratulations, you've proven yourself worthy of the Riddler's respect!"
              </p>
            </div>
            <Button onClick={resetGame} className="play-again-button">
              Play Again
            </Button>
          </motion.div>
        )}


        {difficulty && !gameComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`memory-match-grid ${difficulty === "easy"
              ? "memory-match-grid-easy"
              : difficulty === "medium"
                ? "memory-match-grid-medium"
                : "memory-match-grid-hard"
              }`}
          >
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0, rotateY: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateY: 0,
                  transition: {
                    delay: index * 0.03,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  },
                }}
                className={`memory-match-card ${card.isFlipped ? "memory-match-card-flipped" : ""
                  } ${card.isMatched ? "memory-match-card-matched" : ""} `}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="memory-match-card-inner">
                  <div className="memory-match-card-front">
                    <div className="memory-match-card-content">
                      <div className="riddler-question-mark">?</div>
                    </div>
                  </div>
                  <div className="memory-match-card-back">
                    <div className="memory-match-card-content">{card.icon}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {difficulty && !showDifficultySelect && !gameComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center flex flex-col items-center gap-4"
          >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }}>
              <Button
                onClick={resetGame}
                variant="outline"
                className="reset-button px-5 py-2 text-white border-green-500/30 hover:bg-green-500/10 transition-all"
              >
                Change Difficulty
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="cursor-pointer"
            >
              <Fullscreen
                className="w-6 h-6 text-white hover:text-green-400 transition-colors duration-300"
                onClick={handleFullScreen}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MemoryMatch
