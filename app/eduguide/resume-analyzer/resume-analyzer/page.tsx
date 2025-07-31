import type { Metadata } from "next"
import ResumeAnalyzer from "@/components/resume-analyzer"

export const metadata: Metadata = {
  title: "AI Resume Analyzer | Edunova",
  description: "Upload and analyze your resume with AI-powered insights. Get detailed scoring, feedback, and professional recommendations.",
  keywords: ["resume", "analyzer", "AI", "career analysis", "job application", "professional feedback"],
}

/**
 * Resume Analyzer Page Component
 * 
 * This page provides a user interface for uploading and analyzing resume files.
 * Users can upload .docx files and extract text content for analysis.
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
              Get AI-powered analysis and professional feedback on your resume
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Upload your resume in any format (PDF, Word, or image) and get comprehensive 
              AI analysis with scoring, strengths, weaknesses, and improvement suggestions.
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
