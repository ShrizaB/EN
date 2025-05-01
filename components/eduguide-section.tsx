import Link from "next/link"
import { BookOpen, MapPin, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function EduGuideSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-blue-950">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">EduGuide</h2>
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
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Link href="/eduguide/aptitude-test">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
            <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 pb-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <CardTitle>Career Roadmap</CardTitle>
              <CardDescription>
                Explore career paths and get step-by-step guidance to achieve your professional goals
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span>Personalized career paths</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span>Industry-specific requirements</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span>Skill development resources</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span>Job market insights</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link href="#">Coming Soon</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
            <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 pb-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <CardTitle>Give Interview</CardTitle>
              <CardDescription>
                Practice with simulated interviews and get feedback to improve your interview skills
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span>Mock interview simulations</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span>Common interview questions</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span>Personalized feedback</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span>Industry-specific preparation</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link href="#">Coming Soon</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/eduguide">
              Explore All EduGuide Features
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
