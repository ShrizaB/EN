import type { Metadata } from "next"
import { CareerRoadmapForm } from "@/components/career/career-roadmap-form"

export const metadata: Metadata = {
  title: "Career Roadmap | EduGuide | EduPlay",
  description: "Explore career paths and get personalized guidance for your professional journey.",
}

export default function CareerRoadmapPage() {
  return (
    <main className="flex-1 py-12">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Career Roadmap</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the best career path based on your preferences and get personalized guidance for your professional
            journey.
          </p>
        </div>

        <CareerRoadmapForm />
      </div>
    </main>
  )
}
