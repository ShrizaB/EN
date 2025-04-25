import Link from "next/link"
import type { Metadata } from "next"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Reasoning - Aptitude Test - EduPlay",
  description: "Learn and practice reasoning topics for competitive exams",
}

const reasoningTopics = [
  { id: "clock", name: "Clock" },
  { id: "blood-relation", name: "Blood Relation" },
  { id: "coding-decoding", name: "Coding Decoding" },
  { id: "math-operations", name: "Math Operations" },
  { id: "calendar", name: "Calendar" },
  { id: "jumbling", name: "Jumbling" },
  { id: "analogy", name: "Analogy" },
  { id: "odd-one-out", name: "Odd One Out" },
  { id: "direction-sense", name: "Direction Sense" },
  { id: "number-series", name: "Number Series" },
  { id: "alphabet-series", name: "Alphabet Series" },
  { id: "ranking-test", name: "Ranking Test" },
  { id: "puzzle-test", name: "Puzzle Test" },
  { id: "assumptions", name: "Assumptions" },
  { id: "conclusion", name: "Conclusion" },
  { id: "arguments", name: "Arguments" },
  { id: "course-of-action", name: "Course of Action" },
  { id: "cause-and-effect", name: "Cause and Effect" },
  { id: "syllogism", name: "Syllogism" },
  { id: "matrix", name: "Matrix" },
  { id: "cube-and-cuboid", name: "Cube and Cuboid" },
  { id: "dice", name: "Dice" },
  { id: "decision-making", name: "Decision Making" },
  { id: "non-verbal", name: "Non Verbal" },
]

export default function ReasoningTopicsPage() {
  return (
    <main className="flex-1 py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/eduguide/aptitude-test"
              className="text-sm text-muted-foreground hover:text-primary flex items-center mb-2"
            >
              <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
              Back to Aptitude Test
            </Link>
            <h1 className="text-4xl font-bold mb-4">Reasoning Topics</h1>
            <p className="text-xl text-muted-foreground">
              Develop your logical reasoning skills with these essential topics for competitive exams. Each topic
              includes strategies, examples, and a mock test.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reasoningTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/eduguide/aptitude-test/reasoning/${topic.id}`}
                className="bg-card p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{topic.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}