import type { Metadata } from "next"
import Link from "next/link"
import { FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Interview Preparation | EduPlay",
  description: "Practice with simulated interviews and get feedback to improve your interview skills",
}

export default function InterviewPage() {
  return (
    <main className="flex-1 py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Interview Preparation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your resume, practice with simulated interviews, and get personalized feedback to improve your
            interview skills.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Our AI-powered interview simulator helps you prepare for real interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium mb-2">1. Upload Resume</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your resume so we can tailor questions to your experience and skills
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium mb-2">2. Answer Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Respond to 20 interview questions (10 technical, 10 analytical) based on your resume
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium mb-2">3. Get Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Receive detailed feedback on your answers and suggestions to improve your resume
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ready to Practice?</CardTitle>
            <CardDescription>Start your interview simulation now to improve your skills</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our AI will analyze your resume and generate personalized interview questions based on your experience,
              skills, and the position you're targeting. You'll answer 20 questions in total - 10 technical questions
              related to your field and 10 analytical questions to assess your problem-solving abilities.
            </p>
            <p>
              After completing the interview, you'll receive detailed feedback on your performance, including strengths,
              areas for improvement, and suggestions to enhance your resume.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              <Link href="/eduguide/interview/upload">Start Interview Simulation</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}