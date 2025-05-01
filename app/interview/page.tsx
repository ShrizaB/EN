import type { Metadata } from "next"
import InterviewProcess from "@/components/interview/interview-process"

export const metadata: Metadata = {
  title: "Interview Process | EduPlay",
  description: "Upload your resume and complete the interview process to get personalized feedback",
}

export default function InterviewPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Interview Process</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-2xl mx-auto">
        Upload your resume and answer interview questions to receive personalized feedback on your strengths and areas
        for improvement.
      </p>
      <InterviewProcess />
    </div>
  )
}
