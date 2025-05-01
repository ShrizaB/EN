import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "EduGuide | EduPlay",
  description: "Comprehensive guides for aptitude tests, career roadmaps, and interview preparation.",
}

export default function EduGuidePage() {
  return (
    <main className="flex-1 py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">EduGuide</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guides to help you prepare for aptitude tests, plan your career path, and ace your interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="overflow-hidden border-2 border-blue-500/20 hover:border-blue-500/50 transition-colors">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 pb-8">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Learn & Give Aptitude Test</CardTitle>
              <CardDescription>
                Master aptitude topics and test your knowledge with competitive exam-style mock tests
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Mathematics topics with formulas</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Reasoning topics with examples</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Current affairs mock tests</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Competitive exam preparation</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/eduguide/aptitude-test">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-2 border-green-500/20 hover:border-green-500/50 transition-colors">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 pb-8">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Career Roadmap</CardTitle>
              <CardDescription>
                Explore career paths and get step-by-step guidance to achieve your professional goals
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Personalized career paths</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Industry-specific requirements</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Skill development resources</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Job market insights</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                <Link href="/eduguide/career-roadmap">Explore Careers</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-2 border-amber-500/20 hover:border-amber-500/50 transition-colors">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 pb-8">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle>Give Interview</CardTitle>
              <CardDescription>
                Practice with simulated interviews and get feedback to improve your interview skills
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span>Technical interview questions</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span>Behavioral interview questions</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span>Personalized feedback</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span>Industry-specific preparation</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                <Link href="/interview">Practice Now</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
