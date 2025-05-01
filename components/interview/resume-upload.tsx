"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface ResumeUploadProps {
  onComplete: (text: string, analysis: any) => void
}

export default function ResumeUpload({ onComplete }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value)
  }

  const handleUpload = async () => {
    if (!file && !resumeText) {
      toast({
        title: "Error",
        description: "Please upload a file or enter your resume text",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      let text = resumeText

      if (file) {
        // If it's a PDF or DOCX, we'd need to extract text
        // For now, we'll just read it as text for simplicity
        text = await file.text()
      }

      setIsUploading(false)
      setIsAnalyzing(true)

      // Call API to analyze resume
      const response = await fetch("/api/interview/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText: text }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze resume")
      }

      const analysis = await response.json()

      setIsAnalyzing(false)
      onComplete(text, analysis)
    } catch (error) {
      setIsUploading(false)
      setIsAnalyzing(false)
      toast({
        title: "Error",
        description: "Failed to process resume. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Upload your resume or paste the text below to begin the interview process
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="resume-file">Upload Resume File</Label>
            <Input
              id="resume-file"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX, TXT</p>
          </div>

          <div className="text-center my-4">
            <span className="text-gray-500">OR</span>
          </div>

          <div>
            <Label htmlFor="resume-text">Paste Resume Text</Label>
            <Textarea
              id="resume-text"
              placeholder="Paste your resume text here..."
              className="mt-1 h-64"
              value={resumeText}
              onChange={handleTextChange}
            />
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Button
          onClick={handleUpload}
          disabled={isUploading || isAnalyzing || (!file && !resumeText)}
          className="w-full md:w-auto"
        >
          {isUploading ? "Uploading..." : isAnalyzing ? "Analyzing Resume..." : "Continue to Interview"}
        </Button>
      </div>
    </div>
  )
}
