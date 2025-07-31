import type { Metadata } from "next"
import ResumeAnalyzer from "@/components/resume-analyzer"

export const metadata: Metadata = {
  title: "AI Resume Analyzer | EduGuide",
  description: "Upload and analyze your resume with AI-powered insights. Get detailed scoring, feedback, and improvement suggestions using advanced machine learning models.",
  keywords: ["resume", "analyzer", "AI", "machine learning", "career", "job application", "feedback", "scoring"],
}

/**
 * AI Resume Analyzer Page Component
 * 
 * This page provides an AI-powered interface for uploading and analyzing resume files.
 * Users can upload various file formats and receive comprehensive analysis with scoring.
 */
export default function ResumeAnalyzerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              AI Resume Analyzer
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Get AI-powered analysis with detailed scoring and professional feedback
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Upload your resume and receive comprehensive analysis using advanced AI models.
              Get detailed scoring, identify strengths and weaknesses, and receive actionable
              improvement suggestions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <ResumeAnalyzer
          maxSizeMB={10}
        />
      </div>
    </div>
  )
}
