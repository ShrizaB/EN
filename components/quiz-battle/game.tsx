"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, Target, Brain, Lightbulb, CheckCircle, XCircle, Sword, Shield, Flame } from "lucide-react"
import { QUIZ_BATTLE_TOPICS } from "@/data/quiz-battle-topics"
import { wsService } from "@/lib/websocket-service"

interface QuizBattleGameProps {
  gameData: any
  onGameComplete: (results: any) => void
  user: any
}

export function QuizBattleGame({ gameData, onGameComplete, user }: QuizBattleGameProps) {
  const [gameState, setGameState] = useState<
    "topic-selection" | "waiting-for-opponent" | "answering" | "opponent-turn"
  >("topic-selection")
  const [currentTurn, setCurrentTurn] = useState<"player" | "opponent">("player")
  const [playerScore, setPlayerScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [playerHintsUsed, setPlayerHintsUsed] = useState(0)
  const [topicChoices, setTopicChoices] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [hintUsed, setHintUsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Use hint effect
  useEffect(() => {
    if (hintUsed && gameData?.gameId && currentQuestion?.id) {
      wsService.useHint(gameData.gameId, currentQuestion.id)
    }
  }, [hintUsed, gameData?.gameId, currentQuestion?.id])

  // WebSocket listeners
  useEffect(() => {
    // Store references to the callbacks so we can remove them
    const topicSelectedCallback = (data: { topic: string; question: any }) => {
      setCurrentQuestion(data.question)
      setGameState("answering")
      setTimeLeft(30)
      setHintUsed(false)
    }
    const opponentAnsweredCallback = (data: { correct: boolean; score: number }) => {
      setOpponentScore(data.score)
      // Switch to player's turn to select topic
      setCurrentTurn("player")
      setGameState("topic-selection")
      const shuffled = [...QUIZ_BATTLE_TOPICS].sort(() => 0.5 - Math.random())
      setTopicChoices(shuffled.slice(0, 3))
    }
    const gameCompleteCallback = (results: any) => {
      onGameComplete(results)
    }
    wsService.on("topic_selected", topicSelectedCallback)
    wsService.on("opponent_answered", opponentAnsweredCallback)
    wsService.on("game_complete", gameCompleteCallback)

    return () => {
      wsService.off("topic_selected", topicSelectedCallback)
      wsService.off("opponent_answered", opponentAnsweredCallback)
      wsService.off("game_complete", gameCompleteCallback)
    }
  }, [onGameComplete])

  // Generate random topics for selection
  useEffect(() => {
    const shuffled = [...QUIZ_BATTLE_TOPICS].sort(() => 0.5 - Math.random())
    setTopicChoices(shuffled.slice(0, 3))
  }, [])

  // Timer effect
  useEffect(() => {
    if (gameState === "answering" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === "answering") {
      handleTimeUp()
    }
  }, [timeLeft, gameState])

  const generateQuestion = async (topic: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/quiz-battle/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, difficulty: "medium" }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate question")
      }

      const data = await response.json()
      return data.question
    } catch (error) {
      console.error("Error generating question:", error)
      // Fallback question
      return {
        id: `fallback_${Date.now()}`,
        topic,
        question: `What is a key concept in ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        explanation: "This is a fallback question.",
        hint: "Think about the fundamentals.",
        timeLimit: 30,
        points: 10,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // When a player selects a topic, send to backend
  const handleTopicSelect = async (topic: string) => {
    setIsLoading(true)
    const question = await generateQuestion(topic)
    wsService.send("topic_selected", { gameId: gameData.gameId, topic, question })
    setCurrentQuestion(question)
    setGameState("waiting-for-opponent")
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  // When a player submits an answer, send to backend
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer
    const points = isCorrect ? (hintUsed ? 5 : 10) : 0
    setShowResult(true)
    setPlayerScore((prev) => prev + points)
    wsService.send("answer_submitted", {
      gameId: gameData.gameId,
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      points,
      playerId: user.id,
      timeTaken: 30 - timeLeft,
    })
    setTimeout(() => {
      setShowResult(false)
      setSelectedAnswer(null)
      setQuestionsAnswered((prev) => prev + 1)
      // Wait for backend to relay next turn
    }, 3000)
  }

  const handleUseHint = () => {
    if (playerHintsUsed >= 1) return
    setPlayerHintsUsed((prev) => prev + 1)
    setHintUsed(true)
  }

  const handleTimeUp = () => {
    setShowResult(true)
    setTimeout(() => {
      setShowResult(false)
      setSelectedAnswer(null)
      setQuestionsAnswered((prev) => prev + 1)

      if (questionsAnswered >= 9) {
        onGameComplete({
          playerScore,
          opponentScore,
          totalQuestions: 10,
          winner: playerScore > opponentScore ? "player" : "opponent",
          gameId: gameData.gameId,
        })
      } else {
        setCurrentTurn("opponent")
        setGameState("topic-selection")
        const shuffled = [...QUIZ_BATTLE_TOPICS].sort(() => 0.5 - Math.random())
        setTopicChoices(shuffled.slice(0, 3))
      }
    }, 2000)
  }

  // Listen for relayed events from backend
  useEffect(() => {
    const onTopicSelected = (data: any) => {
      setCurrentQuestion(data.question)
      setGameState("answering")
      setTimeLeft(30)
      setHintUsed(false)
    }
    const onAnswerSubmitted = (data: any) => {
      setOpponentScore((prev) => prev + (data.points || 0))
      setCurrentTurn("player")
      setGameState("topic-selection")
      const shuffled = [...QUIZ_BATTLE_TOPICS].sort(() => 0.5 - Math.random())
      setTopicChoices(shuffled.slice(0, 3))
    }
    wsService.on("topic_selected", onTopicSelected)
    wsService.on("answer_submitted", onAnswerSubmitted)
    return () => {
      wsService.off("topic_selected", onTopicSelected)
      wsService.off("answer_submitted", onAnswerSubmitted)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4">
      {/* Game Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Card className="bg-gray-800/50 border-2 border-red-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {/* Player Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/50">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{user?.name || "You"}</h3>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-lg font-bold text-cyan-400">{playerScore}</span>
                  </div>
                </div>
              </div>

              {/* Game Progress */}
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Battle Progress</div>
                <Progress value={(questionsAnswered / 10) * 100} className="w-48 h-3" />
                <div className="text-sm text-gray-400 mt-2">
                  Question {questionsAnswered + 1} of 10 • Hints: {playerHintsUsed}/1
                </div>
              </div>

              {/* Opponent Info */}
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white text-right">{gameData.opponent.name}</h3>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-lg font-bold text-red-400">{opponentScore}</span>
                    <Trophy className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center border-2 border-red-400/50 shadow-lg shadow-red-500/50">
                  <Sword className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Topic Selection */}
          {gameState === "topic-selection" && (
            <motion.div
              key="topic-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-800/50 border-2 border-purple-500/30 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl mb-4 text-white">
                    {currentTurn === "player" ? "Choose Topic for Your Opponent" : "Opponent is Choosing Your Topic"}
                  </CardTitle>
                  <p className="text-gray-300">
                    {currentTurn === "player"
                      ? "Select 1 topic from the 3 options to challenge your opponent"
                      : "Wait while your opponent selects a topic for you to answer"}
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  {currentTurn === "player" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {topicChoices.map((topic, index) => (
                        <motion.div
                          key={topic}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => handleTopicSelect(topic)}
                            disabled={isLoading}
                            className="w-full h-32 text-lg font-bold bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl border-2 border-purple-400/50 shadow-lg shadow-purple-500/50"
                          >
                            <div className="text-center">
                              <Target className="h-8 w-8 mx-auto mb-2" />
                              {topic}
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <motion.div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Brain className="h-12 w-12 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-4">Opponent is Thinking...</h3>
                      <p className="text-gray-300">They're selecting a topic to challenge you with</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Waiting for Opponent */}
          {gameState === "waiting-for-opponent" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <Card className="bg-gray-800/50 border-2 border-yellow-500/30 backdrop-blur-sm">
                <CardContent className="p-12">
                  <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-6"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Flame className="h-16 w-16 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-4 text-white">Question Sent!</h2>
                  <p className="text-xl text-gray-300">Your opponent is now answering the question...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Question Answering */}
          {gameState === "answering" && currentQuestion && (
            <motion.div
              key="answering"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-800/50 border-2 border-green-500/30 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-lg px-4 py-2 border-green-400 text-green-400">
                      {currentQuestion.topic}
                    </Badge>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-red-400" />
                        <span
                          className={`text-2xl font-bold font-mono ${
                            timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-white"
                          }`}
                        >
                          {timeLeft}s
                        </span>
                      </div>
                      {playerHintsUsed < 1 && (
                        <Button
                          onClick={handleUseHint}
                          variant="outline"
                          size="sm"
                          className="rounded-full border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                        >
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Use Hint
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-center text-white">{currentQuestion.question}</h2>

                  {hintUsed && currentQuestion.hint && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-400" />
                        <span className="font-medium text-yellow-300">Hint:</span>
                      </div>
                      <p className="text-yellow-200 mt-1">{currentQuestion.hint}</p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {currentQuestion.options.map((option: string, index: number) => (
                      <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => handleAnswerSelect(index)}
                          variant={selectedAnswer === index ? "default" : "outline"}
                          className={`w-full h-16 text-lg ${
                            selectedAnswer === index
                              ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-400"
                              : "bg-gray-700/50 hover:bg-gray-600/50 text-white border-gray-600"
                          }`}
                        >
                          <span className="font-bold mr-3 text-cyan-400">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-12 py-3 rounded-full border-2 border-green-400/50 shadow-lg shadow-green-500/50"
                    >
                      Submit Answer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Opponent Turn */}
          {gameState === "opponent-turn" && (
            <motion.div
              key="opponent-turn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Card className="bg-gray-800/50 border-2 border-orange-500/30 backdrop-blur-sm">
                <CardContent className="p-12">
                  <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Brain className="h-16 w-16 text-white" />
                  </motion.div>

                  <h2 className="text-3xl font-bold mb-4 text-white">Opponent's Turn</h2>
                  <p className="text-xl text-gray-300 mb-6">{gameData.opponent.name} is answering your question...</p>

                  <motion.div
                    className="flex justify-center gap-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Answer Result */}
          {showResult && currentQuestion && selectedAnswer !== null && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            >
              <Card className="w-full max-w-md mx-4 bg-gray-800 border-2 border-gray-600">
                <CardContent className="p-8 text-center">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <CheckCircle className="h-24 w-24 text-green-400 mx-auto mb-4" />
                      <h3 className="text-3xl font-bold text-green-400 mb-2">CORRECT!</h3>
                      <p className="text-gray-300 text-lg">+{hintUsed ? 5 : 10} points</p>
                      {currentQuestion.explanation && (
                        <p className="text-sm text-gray-400 mt-4">{currentQuestion.explanation}</p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <XCircle className="h-24 w-24 text-red-400 mx-auto mb-4" />
                      <h3 className="text-3xl font-bold text-red-400 mb-2">INCORRECT!</h3>
                      <p className="text-gray-300 mb-2">
                        Correct answer:{" "}
                        <span className="text-green-400 font-bold">
                          {currentQuestion.options[currentQuestion.correctAnswer]}
                        </span>
                      </p>
                      {currentQuestion.explanation && (
                        <p className="text-sm text-gray-400 mt-4">{currentQuestion.explanation}</p>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
