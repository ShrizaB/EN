import Link from "next/link"
import type { Metadata } from "next"
import { Calculator, Brain, Newspaper } from "lucide-react"

export const metadata: Metadata = {
  title: "Aptitude Test - EduPlay",
  description: "Prepare for competitive exams with our comprehensive aptitude test preparation resources",
}

export default function AptitudeTestPage() {
  return (
    <main className="flex-1 py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Aptitude Test Preparation</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Master aptitude concepts with interactive lessons and practice with mock tests designed like competitive
            exams.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Link href="/eduguide/aptitude-test/maths" className="group">
              <div className="bg-card p-8 rounded-xl shadow-sm border border-border transition-all duration-300 hover:shadow-md hover:border-primary/50 h-full flex flex-col">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Mathematics</h3>
                <p className="text-muted-foreground mb-4">
                  Master mathematical concepts essential for competitive exams including time and distance, percentage,
                  profit and loss, and more.
                </p>
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">18 topics</span> · Includes formulas and examples
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/eduguide/aptitude-test/reasoning" className="group">
              <div className="bg-card p-8 rounded-xl shadow-sm border border-border transition-all duration-300 hover:shadow-md hover:border-primary/50 h-full flex flex-col">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Reasoning</h3>
                <p className="text-muted-foreground mb-4">
                  Develop logical reasoning skills with topics like clock problems, blood relations, coding-decoding,
                  and more.
                </p>
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">21 topics</span> · Includes strategies and examples
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/eduguide/aptitude-test/current-affairs" className="group">
              <div className="bg-card p-8 rounded-xl shadow-sm border border-border transition-all duration-300 hover:shadow-md hover:border-primary/50 h-full flex flex-col">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors">
                  <Newspaper className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Current Affairs</h3>
                <p className="text-muted-foreground mb-4">
                  Test your knowledge of recent events and developments with our regularly updated current affairs mock
                  tests.
                </p>
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Direct mock tests</span> · Updated regularly
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-secondary/20 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Why Prepare with EduGuide?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Comprehensive Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed explanations, formulas, and examples for each topic
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">
                    Curated YouTube videos to help you understand concepts better
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Exam-like Mock Tests</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice with 20-question tests designed like competitive exams
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <span className="font-bold text-primary">4</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Performance Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your progress and identify areas for improvement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}