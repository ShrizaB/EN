export const QUIZ_BATTLE_TOPICS = [
  "Mathematics",
  "English Grammar & Vocabulary",
  "Science",
  "History",
  "Geography",
  "Civics",
  "Computer Science",
  "Environmental Science",
  "General Knowledge",
  "Logical Reasoning",
  "Critical Thinking",
  "Problem Solving",
  "Financial Literacy",
  "Time Management",
  "Emotional Intelligence",
  "Communication Skills",
  "Public Speaking",
  "Digital Literacy & Online Safety",
  "First Aid & Personal Safety",
  "Art & Drawing",
  "Music & Rhythm",
  "Drama & Expression",
  "Creative Writing",
  "Storytelling & Narration",
  "Current Affairs",
  "Cultural Studies",
  "Space & Astronomy",
  "Health & Nutrition",
  "Moral Values & Ethics",
] as const

export type QuizBattleTopic = (typeof QUIZ_BATTLE_TOPICS)[number]

export interface QuizBattleQuestion {
  id: string
  topic: QuizBattleTopic
  question: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  hint?: string
}

export interface GameState {
  gameId: string
  players: {
    id: string
    name: string
    score: number
    hintsUsed: number
  }[]
  currentTurn: string
  currentQuestion: QuizBattleQuestion | null
  questionsAsked: number
  maxQuestions: number
  gameStatus: "waiting" | "topic-selection" | "answering" | "completed"
  topicChoices?: QuizBattleTopic[]
  selectedTopic?: QuizBattleTopic
}
