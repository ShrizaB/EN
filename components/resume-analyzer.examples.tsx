/**
 * Example usage and testing for AI Resume Analyzer component
 * 
 * This file demonstrates how to use the ResumeAnalyzer component
 * in different scenarios and configurations with AI-powered analysis.
 */

import React from "react"
import ResumeAnalyzer from "@/components/resume-analyzer"
import type { ResumeAnalysisResult } from "@/lib/resume-utils"

/**
 * Basic usage example
 */
export function BasicResumeAnalyzer() {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Basic AI Resume Analyzer</h2>
      <ResumeAnalyzer />
    </div>
  )
}

/**
 * Advanced usage with custom configuration and callbacks
 */
export function AdvancedResumeAnalyzer() {
  const handleAnalysisComplete = (result: ResumeAnalysisResult) => {
    console.log("Resume analysis completed!")
    console.log("Overall score:", result.score)
    console.log("Content quality:", result.analysis.contentQuality)
    console.log("Strengths:", result.strengths)
    console.log("Improvements:", result.improvements)
    
    // Example: Send analytics data
    // analytics.track("resume_analyzed", {
    //   score: result.score,
    //   content_quality: result.analysis.contentQuality,
    //   formatting_score: result.analysis.formatting,
    //   user_id: getCurrentUserId()
    // })
    
    // Example: Save results to database
    // saveAnalysisResult(result)
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Advanced AI Resume Analyzer</h2>
      <ResumeAnalyzer 
        maxSizeMB={15}
        onAnalysisComplete={handleAnalysisComplete}
        className="border-2 border-dashed border-blue-300 bg-blue-50/30"
      />
    </div>
  )
}

/**
 * Compact version for smaller spaces
 */
export function CompactResumeAnalyzer() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h3 className="text-lg font-semibold mb-4">Quick Resume Analysis</h3>
      <ResumeAnalyzer 
        maxSizeMB={5}
        className="scale-90"
      />
    </div>
  )
}

/**
 * Example with custom styling and branding
 */
export function StyledResumeAnalyzer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Professional AI Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600">
            Get AI-powered insights and professional feedback on your resume
          </p>
        </div>
        
        <ResumeAnalyzer 
          maxSizeMB={20}
          onAnalysisComplete={(result) => {
            // Custom handling with detailed logging
            const analysis = {
              timestamp: new Date().toISOString(),
              score: result.score,
              breakdown: result.analysis,
              feedback_points: result.strengths.length + result.weaknesses.length,
              improvement_suggestions: result.improvements.length
            }
            console.log("Detailed analysis:", analysis)
          }}
          className="shadow-2xl"
        />
      </div>
    </div>
  )
}

/**
 * Integration example with dashboard/analytics
 */
export function DashboardIntegratedAnalyzer() {
  const [analysisHistory, setAnalysisHistory] = React.useState<ResumeAnalysisResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [averageScore, setAverageScore] = React.useState<number>(0)

  const handleNewAnalysis = (result: ResumeAnalysisResult) => {
    setAnalysisHistory(prev => {
      const newHistory = [result, ...prev.slice(0, 4)] // Keep last 5 analyses
      const avgScore = newHistory.reduce((sum, r) => sum + r.score, 0) / newHistory.length
      setAverageScore(Math.round(avgScore))
      return newHistory
    })
    setIsAnalyzing(false)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Analyses Completed</h3>
          <p className="text-3xl font-bold text-blue-600">{analysisHistory.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-green-600">{averageScore}/100</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Status</h3>
          <p className="text-lg">{isAnalyzing ? "Analyzing..." : "Ready"}</p>
        </div>
      </div>

      <ResumeAnalyzer 
        onAnalysisComplete={handleNewAnalysis}
        maxSizeMB={10}
      />

      {analysisHistory.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Analysis History</h3>
          <div className="space-y-3">
            {analysisHistory.map((result, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Analysis #{analysisHistory.length - index}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Score: {result.score}/100</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.score >= 80 ? 'bg-green-100 text-green-800' :
                    result.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : 'Needs Work'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Testing scenarios for development and QA
 */
export const aiTestScenarios = {
  // Test with different file formats
  pdfResume: "Test with PDF resume files",
  wordResume: "Test with .docx/.doc files", 
  imageResume: "Test with PNG/JPG image resumes",
  largeFiles: "Test with files near the size limit",
  
  // Test with different content types
  techResume: "Test with technical/software engineering resumes",
  marketingResume: "Test with marketing/business resumes",
  academicCV: "Test with academic CVs and research profiles",
  creativePortfolio: "Test with creative/design portfolios",
  
  // Test job targeting
  specificJobTypes: "Test with various job type specifications",
  genericAnalysis: "Test without job type (general analysis)",
  
  // Test AI response scenarios
  highScoreResume: "Test with well-formatted professional resume",
  poorScoreResume: "Test with unformatted or incomplete resume",
  apiErrors: "Test handling of API failures",
  networkTimeout: "Test network timeout scenarios",
  
  // Test edge cases
  emptyFiles: "Test with empty or corrupted files",
  nonEnglishResumes: "Test with non-English resume content",
  unconventionalFormats: "Test with creative/unconventional layouts"
}

/**
 * Performance and load testing utilities
 */
export const performanceTests = {
  simultaneousUploads: "Test multiple file uploads simultaneously",
  largeFileProcessing: "Test processing time for large files",
  apiResponseTime: "Measure average API response times",
  memoryUsage: "Monitor component memory usage",
  mobilePerformance: "Test performance on mobile devices"
}

export default {
  BasicResumeAnalyzer,
  AdvancedResumeAnalyzer,
  CompactResumeAnalyzer,
  StyledResumeAnalyzer,
  DashboardIntegratedAnalyzer,
  aiTestScenarios,
  performanceTests
}
