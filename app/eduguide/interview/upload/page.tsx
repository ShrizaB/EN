"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ResumeUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [jobTitle, setJobTitle] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "application/msword" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Please upload a PDF or Word document")
        setFile(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please upload your resume")
      return
    }

    if (!jobTitle.trim()) {
      setError("Please enter the job title you are applying for")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Read file content
      const fileContent = await readFileAsText(file)

      // Call API to analyze resume and generate questions
      const response = await fetch("/api/interview/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: fileContent,
          jobTitle: jobTitle,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze resume")
      }

      const data = await response.json()

      // Store the questions and resume analysis in session storage
      sessionStorage.setItem("interviewQuestions", JSON.stringify(data.questions))
      sessionStorage.setItem("resumeAnalysis", JSON.stringify(data.resumeAnalysis))

      // Navigate to the questions page
      router.push("/eduguide/interview/questions")
    } catch (err) {
      console.error(err)
      setError("An error occurred while processing your resume. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  return (
    <main className="flex-1 py-12">
      <div className="container max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>Upload your resume to get personalized interview questions</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title You're Applying For</Label>
                <Input
                  id="job-title"
                  placeholder="e.g., Software Engineer, Data Scientist"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume (PDF or Word)</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => document.getElementById("resume")?.click()}
                >
                  <Input
                    id="resume"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    {file ? (
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium">{file.name}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Click to upload or drag and drop your resume</p>
                    )}
                    <p className="text-xs text-gray-400">PDF or Word documents only (max 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Your resume will be analyzed to generate personalized interview questions. We'll also provide feedback
                  on your resume based on the job title you're applying for.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  "Continue to Interview"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}