"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Gamepad2, Brain, Palette } from "lucide-react"
import MathAsteroidBlaster from "@/components/games/math-asteroid-blaster/math-asteroid-blaster"
import { WordScrambleChallenge } from "@/components/games/word-scramble-challenge"
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
    color: "red",
  },
  "memory-match": {
    title: "Memory Match",
    description: "Test your memory by matching pairs of cards in this classic concentration game!",
    component: MemoryMatch,
    category: "Logic",
    skills: ["Memory", "Concentration", "Pattern recognition"],
    instructions: [
      "Click on cards to flip them over",
      "Try to find matching pairs of cards",
      "Remember the positions of cards you've seen",
      "Match all pairs to complete the level",
    ],
    comingSoon: false,
    color: "green",
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
      case "orange":
        return "text-[#f59042]"
      default:
        return "text-primary"
    }
  }

  const headingColorClass = getColorClass(gameData.color)

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-8">
        <Link
          href="/games"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Games
        </Link>

        <div className="relative overflow-hidden rounded-xl bg-secondary/30 border border-secondary p-8 mb-12">
          <div className="absolute inset-0 pattern-dots opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              {gameKey === "math-asteroid-blaster" || gameKey === "word-scramble-challenge" ? (
                <Gamepad2 className="h-10 w-10 text-primary" />
              ) : gameKey === "memory-match" ? (
                <Brain className="h-10 w-10 text-primary" />
              ) : (
                <Palette className="h-10 w-10 text-primary" />
              )}
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${headingColorClass}`}>
                {gameData.title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">{gameData.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="px-2 py-0.5 rounded-full bg-secondary/50 text-xs">{gameData.category}</div>
                {gameData.skills.map((skill, index) => (
                  <div key={index} className="px-2 py-0.5 rounded-full bg-secondary/50 text-xs">
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