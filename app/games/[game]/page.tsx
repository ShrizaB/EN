"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Gamepad2, Brain, Palette } from "lucide-react"
import MathAsteroidBlaster from "@/components/games/math-asteroid-blaster/math-asteroid-blaster"
import { WordScrambleChallenge } from "@/components/games/word-scramble-challange/word-scramble-challenge"
import MemoryMatch from "@/components/games/memory-match/memory-match"
import CreativeArtStudio from "@/components/games/creative-art-studio/creative-art-studio"

// Define game data
interface GameData {
  title: string;
  description: string;
  component: React.ComponentType | null;
  category: string;
  skills: string[];
  instructions: string[];
  comingSoon?: boolean;
  color: string;
  backgroundImage?: string;
  backgroundImageStyle?: string;
}

const gamesData: Record<string, GameData> = {
  "math-asteroid-blaster": {
    title: "Math Asteroid Blaster",
    description: "Blast asteroids by solving math problems in this action-packed space adventure!",
    component: MathAsteroidBlaster,
    category: "Mathematics",
    skills: ["Quick thinking", "Math skills", "Hand-eye coordination"],
    instructions: [
      "Solve the math problem at the top of the screen",
      "Click the button with the correct answer to fire your laser",
      "Move your ship by moving your mouse or finger across the game area",
      "Don't let the correct answer asteroid reach the bottom, or you'll lose a life!",
    ],
    color: "purple",
    backgroundImage: "https://i.postimg.cc/Hs6SQjq6/favpng-86dc32c98cec801ffa15a99a11a3fdde.png",
    backgroundImageStyle: "opacity-100 w-[500px] h-auto fixed top-0 right-10 drop-shadow-[0_0_40px_#ff3300]  scale-x-[-1]",
  },
  "word-scramble-challenge": {
    title: "Word Scramble Challenge",
    description: "Unscramble letters to form words before time runs out in this fast-paced word game!",
    component: WordScrambleChallenge,
    category: "Reading",
    skills: ["Vocabulary", "Spelling", "Word recognition"],
    instructions: [
      "Unscramble the letters to form the correct word",
      "Click on the letters in the correct order to form the word",
      "Use the 'Reset' button to start over if you make a mistake",
      "Use the 'Hint' button if you're stuck, but it will cost you time!",
    ],
    color: "green-goblin",
    backgroundImage: "https://i.postimg.cc/1XrmnqMH/Daco-4421018.png",
    backgroundImageStyle: "opacity-90 w-[400px] h-auto fixed top-5 right-10 drop-shadow-[0_0_40px_#00ff5e] animate-glow scale-x-[-1]",
  },
  "memory-match": {
    title: "Riddler's Challenge",
    description: "Enter the mind of the Riddler! Match pairs of mysterious symbols and solve the ultimate puzzle challenge in this DC-themed memory game!",
    component: MemoryMatch,
    category: "Logic & Riddles",
    skills: ["Memory", "Puzzle solving", "Pattern recognition", "DC Comics knowledge"],
    instructions: [
      "Click on cards to reveal hidden Riddler symbols",
      "Match pairs of identical puzzle pieces and mystery icons",
      "Use your detective skills to remember card positions",
      "Solve all riddles to prove you're worthy of the Riddler's respect",
    ],
    comingSoon: false,
    color: "riddler",
    backgroundImage: "https://i.postimg.cc/tgf2bH4p/pngegg-6.png",
    backgroundImageStyle: "opacity-100 w-[400px] h-auto fixed top-5 right-10 drop-shadow-[0_0_40px_#00ff5e] animate-glow scale-x-[-1]",
  },
  "art-studio": {
    title: "Creative Art Studio",
    description: "Express yourself through digital art with various tools, colors, and templates!",
    component: CreativeArtStudio,
    category: "Art",
    skills: ["Creativity", "Fine motor skills", "Color theory"],
    instructions: [
      "Choose from different drawing tools and brushes",
      "Select colors from the color palette",
      "Use templates as starting points for your creations",
      "Save and share your artwork when finished",
    ],
    comingSoon: false,
    color: "orange",
    backgroundImage: "https://i.postimg.cc/Hs6SQjq6/favpng-86dc32c98cec801ffa15a99a11a3fdde.png",
    backgroundImageStyle: "opacity-100 w-[500px] h-auto fixed top-0 right-10 scale-x-[-1]",

  },
}

export default function GamePage() {
  const params = useParams() as { game?: string }
  const gameKey = params.game || ""

  if (!gamesData[gameKey]) {
    notFound()
  }

  const gameData = gamesData[gameKey]
  const GameComponent = gameData.component

  // Define color classes based on game color
  const getColorClass = (color: string) => {
    switch (color) {
      case "purple":
        return "text-purple-500"
      case "red":
        return "text-[#fc4949]"
      case "green":
        return "text-green-500"
      case "riddler":
        return "bg-gradient-to-r from-green-400 via-purple-400 to-green-500 bg-clip-text text-transparent"
      case "orange":
        return "text-[#f59042]"
      default:
        return "text-primary"
    }
  }

  const headingColorClass = getColorClass(gameData.color)

  return (
    <div className="container py-12 md:py-20">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex h-auto w-auto">
        <img
          src={gameData.backgroundImage}
          alt="background"
          className={gameData.backgroundImageStyle}
        />
      </div>
      <div className="mb-8">
        <Link
          href="/games"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Games
        </Link>

        <div className={`relative overflow-hidden rounded-xl p-8 mb-12 ${
          gameKey === "math-asteroid-blaster"
            ? "bg-gradient-to-br from-black/95 via-red-950/30 to-black/90 border-2 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            : gameKey === "memory-match"
            ? "bg-gradient-to-br from-black/95 via-green-950/40 to-purple-950/30 border-2 border-green-500/60 shadow-[0_0_25px_rgba(34,197,94,0.4)]"
            : "bg-secondary/30 border border-secondary"
          }`}>
          <div className={`absolute inset-0 ${
            gameKey === "math-asteroid-blaster"
              ? "bg-gradient-to-br from-red-900/10 to-orange-900/5"
              : gameKey === "memory-match"
              ? "bg-gradient-to-br from-green-900/15 to-purple-900/10"
              : gameKey === "word-scramble-challenge"
              ? "bg-gradient-to-br from-[#00ff85]/10 via-[#9d4edd]/10 to-[#0c1b13]/10"
              : "pattern-dots"
            } opacity-20`}></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 ${
              gameKey === "math-asteroid-blaster"
                ? "bg-gradient-to-r from-red-600/30 to-orange-500/30 border-2 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                : gameKey === "memory-match"
                ? "bg-gradient-to-r from-green-600/40 to-purple-600/30 border-2 border-green-500/60 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                : gameKey === "word-scramble-challenge"
                ? "bg-gradient-to-br from-[#00ff85]/30 via-[#9d4edd]/30 to-[#0c1b13]/30 border-2 border-[var(--green-goblin-purple)] shadow-[0_0_24px_#00ff85] animate-pulse"
                : "bg-primary/10"
              }`}>
              {gameKey === "math-asteroid-blaster" || gameKey === "word-scramble-challenge" ? (
                <Gamepad2 className={`h-10 w-10 ${gameKey === "math-asteroid-blaster" ? "text-orange-400" : "text-primary"
                  }`} />
              ) : gameKey === "memory-match" ? (
                <Brain className="h-10 w-10 text-green-400" />
              ) : (
                <Palette className="h-10 w-10 text-primary" />
              )}
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                gameKey === "math-asteroid-blaster"
                  ? "bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent"
                  : gameKey === "memory-match"
                  ? "bg-gradient-to-r from-green-400 via-purple-400 to-green-500 bg-clip-text text-transparent"
                  : gameKey === "word-scramble-challenge"
                  ? "bg-gradient-to-r from-[#00ff85] via-[#9d4edd] to-[#00ff85] bg-clip-text text-transparent drop-shadow-[0_0_12px_#00ff85] animate-glow"
                  : headingColorClass
                }`}>
                {gameData.title}
              </h1>
              <p className={`text-lg max-w-3xl ${
                gameKey === "math-asteroid-blaster"
                  ? "text-orange-200/80"
                  : gameKey === "memory-match"
                  ? "text-green-200/90"
                  : gameKey === "word-scramble-challenge"
                  ? "text-[var(--green-goblin-green)] drop-shadow-[0_0_8px_#00ff85]"
                  : "text-muted-foreground"
                }`}>{gameData.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className={`px-2 py-0.5 rounded-full text-xs ${
                  gameKey === "math-asteroid-blaster"
                    ? "bg-red-900/40 text-red-300 border border-red-500/30"
                    : gameKey === "memory-match"
                    ? "bg-green-900/40 text-green-300 border border-green-500/40"
                    : gameKey === "word-scramble-challenge"
                    ? "bg-[var(--green-goblin-lair)] text-[var(--green-goblin-green)] border border-[var(--green-goblin-purple)] shadow-[0_0_8px_#00ff85]"
                    : "bg-secondary/50"
                  }`}>{gameData.category}</div>
                {gameData.skills.map((skill, index) => (
                  <div key={index} className={`px-2 py-0.5 rounded-full text-xs ${
                    gameKey === "math-asteroid-blaster"
                      ? "bg-orange-900/30 text-orange-300 border border-orange-500/20"
                      : gameKey === "memory-match"
                      ? "bg-purple-900/30 text-purple-300 border border-purple-500/30"
                      : gameKey === "word-scramble-challenge"
                      ? "bg-[var(--green-goblin-purple)]/80 text-[#00c46b] border border-[var(--green-goblin-green)] shadow-[0_0_8px_#00ff85]"
                      : "bg-secondary/50"
                    }`}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {gameData.comingSoon ? (
          <div className={`mt-5 flex items-center flex-col bg-[#8137dc32] border-[#a256ffe1] border-2 rounded-lg p-8 w-[800px] mx-auto shadow-[0px_0px_46px_-19px_rgba(153,64,255,1)]`}>
            <h2 className={`text-3xl text-center mb-4 font-bold ${headingColorClass}`}>Coming Soon!</h2>
            <p className="text-lg text-muted-foreground max-w-3xl text-center">
              This game is currently under development. Stay tuned for updates!
            </p>
          </div>
        ) : GameComponent ? (
          <GameComponent />
        ) : (
          <h2 className="text-3xl text-center">Game Loading Error</h2>
        )}
      </div>
    </div>
  )
}