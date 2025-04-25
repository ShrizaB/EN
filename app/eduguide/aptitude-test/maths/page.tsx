import Link from "next/link"
import type { Metadata } from "next"
import { ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Mathematics - Aptitude Test - EduPlay",
  description: "Learn and practice mathematics topics for competitive exams",
}

const mathsTopics = [
  { id: "time-and-distance", name: "Time and Distance" },
  { id: "percentage", name: "Percentage" },
  { id: "profit-and-loss", name: "Profit and Loss" },
  { id: "ratio-and-proportion", name: "Ratio and Proportion" },
  { id: "square-roots", name: "Square Roots" },
  { id: "squares", name: "Squares" },
  { id: "cube-and-cube-root", name: "Cube and Cube Root" },
  { id: "multiplication", name: "Multiplication" },
  { id: "addition", name: "Addition" },
  { id: "simplifications", name: "Simplifications" },
  { id: "decimal-fractions", name: "Decimal Fractions" },
  { id: "surds-and-indices", name: "Surds and Indices" },
  { id: "time-and-work", name: "Time and Work" },
  { id: "pipe-and-cistern", name: "Pipe and Cistern" },
  { id: "simple-interest", name: "Simple Interest" },
  { id: "compound-interest", name: "Compound Interest" },
  { id: "data-interpretation", name: "Data Interpretation" },
  { id: "data-sufficiency", name: "Data Sufficiency" },
  { id: "mensuration", name: "Mensuration" },
]

export default function MathsTopicsPage() {
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
            <h1 className="text-4xl font-bold mb-4">Mathematics Topics</h1>
            <p className="text-xl text-muted-foreground">
              Master these essential mathematics topics for competitive exams. Each topic includes formulas, examples,
              and a mock test.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mathsTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/eduguide/aptitude-test/maths/${topic.id}`}
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