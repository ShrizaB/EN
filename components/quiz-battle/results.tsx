"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Target, Zap, RotateCcw, Home, TrendingUp, Award, Medal } from "lucide-react"

interface QuizBattleResultsProps {
  results: {
    playerScore: number
    opponentScore: number
    totalQuestions: number
    playerCorrect: number
    opponentCorrect: number
    winner: "player" | "opponent"
  }
  onPlayAgain: () => void
  onBackToMenu: () => void
}

export function QuizBattleResults({ results, onPlayAgain, onBackToMenu }: QuizBattleResultsProps) {
  const isWinner = results.winner === "player"
  const accuracy = Math.round((results.playerCorrect / (results.totalQuestions / 2)) * 100)

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-950 dark:via-blue-950 dark:to-pink-950 p-4"
    >
      {/* Confetti Animation */}
      {isWinner && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][
                  Math.floor(Math.random() * 6)
                ],
              }}
              initial={{ y: -100, opacity: 1 }}
              animate={{
                y: window.innerHeight + 100,
                x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100],
                rotate: [0, Math.random() * 360],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Main Result Card */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card
            className={`border-4 mb-8 ${isWinner ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950" : "border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950"}`}
          >
            <CardContent className="p-12 text-center">
              {/* Winner/Loser Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
                className="mb-6"
              >
                {isWinner ? (
                  <div className="relative">
                    <Crown className="h-32 w-32 text-yellow-500 mx-auto" />
                    <motion.div
                      className="absolute -top-4 -right-4"
                      animate={{
                        rotate: [0, 20, 0, -20, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Star className="h-12 w-12 text-yellow-400" />
                    </motion.div>
                  </div>
                ) : (
                  <Medal className="h-32 w-32 text-gray-500 mx-auto" />
                )}
              </motion.div>

              {/* Result Text */}
              <motion.h1
                className={`text-5xl md:text-6xl font-bold mb-4 ${isWinner ? "text-yellow-600" : "text-gray-600"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {isWinner ? "Victory!" : "Good Fight!"}
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                {isWinner
                  ? "Congratulations! You dominated the quiz battle!"
                  : "Great effort! Keep practicing to improve your skills!"}
              </motion.p>

              {/* Score Display */}
              <motion.div
                className="flex items-center justify-center gap-8 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{results.playerScore}</div>
                  <div className="text-lg text-gray-600 dark:text-gray-300">Your Score</div>
                </div>

                <div className="text-6xl font-bold text-gray-400">VS</div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">{results.opponentScore}</div>
                  <div className="text-lg text-gray-600 dark:text-gray-300">Opponent</div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-600 mb-2">{results.playerCorrect}</div>
              <div className="text-gray-600 dark:text-gray-300">Correct Answers</div>
              <div className="text-sm text-gray-500 mt-1">out of {results.totalQuestions / 2}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-600 mb-2">{accuracy}%</div>
              <div className="text-gray-600 dark:text-gray-300">Accuracy</div>
              <Progress value={accuracy} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-600 mb-2">{isWinner ? "+50" : "+25"}</div>
              <div className="text-gray-600 dark:text-gray-300">XP Earned</div>
              <Badge variant="outline" className="mt-2">
                {isWinner ? "Winner Bonus!" : "Participation"}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <Card className="border-2 border-gray-200 dark:border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <span className="font-medium">Response Speed</span>
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
                    {accuracy > 80 ? "Excellent" : accuracy > 60 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <span className="font-medium">Knowledge Areas</span>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900">
                    {results.playerCorrect > 7 ? "Strong" : results.playerCorrect > 5 ? "Average" : "Developing"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <span className="font-medium">Strategic Thinking</span>
                  <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900">
                    {isWinner ? "Excellent" : "Good"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
        >
          <Button
            onClick={onPlayAgain}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full"
          >
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <RotateCcw className="h-5 w-5" />
              Play Again
            </motion.div>
          </Button>

          <Button onClick={onBackToMenu} variant="outline" size="lg" className="font-bold px-8 py-4 rounded-full">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Home className="h-5 w-5" />
              Back to Menu
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
