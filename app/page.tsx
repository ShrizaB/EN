import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EduGuideSection } from "@/components/eduguide-section"

export const metadata: Metadata = {
  title: "EduPlay - Interactive Educational Platform",
  description: "Learn through interactive games, quizzes, and personalized content.",
}

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Learn, Play, and Grow with EduPlay
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  An interactive educational platform that makes learning fun through games, quizzes, and personalized
                  content.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Link href="/subjects">Explore Subjects</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/games">Play Educational Games</Link>
                </Button>
              </div>
            </div>
            <img
              alt="Hero Image"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              src="/placeholder.svg?height=550&width=800"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Everything you need to make learning engaging
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                EduPlay combines interactive learning with gamification to create an engaging educational experience.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M8 18v-1" />
                  <path d="M16 18v-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Interactive Learning</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Engage with interactive content that adapts to your learning style and pace.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                  <circle cx="17" cy="7" r="5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Educational Games</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Learn through play with our collection of educational games designed to reinforce concepts.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Personalized Learning</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Get personalized recommendations and track your progress across different subjects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EduGuide Section */}
      <EduGuideSection />

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-blue-50 dark:bg-blue-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to start learning?</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Join thousands of students who are already learning with EduPlay.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
