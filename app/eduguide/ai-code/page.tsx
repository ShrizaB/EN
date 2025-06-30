import type { Metadata } from "next"
import AICodeChallenge from "@/components/ai-code/ai-code-challenge"

export const metadata: Metadata = {
  title: "AI CODE - Programming Challenges | EduGuide",
  description: "Test your programming skills with AI-powered feedback on your code solutions.",
}

export default function AICodePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI CODE Challenge</h1>
      <p className="text-lg mb-8">
        Solve programming challenges and get AI-powered feedback on your solutions. Progress through three levels of
        difficulty to test your skills!
      </p>

      <AICodeChallenge />
    </div>
  )
}
