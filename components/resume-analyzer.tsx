"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Star,
  TrendingUp,
  Target,
  Eye,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  validateResumeFile, 
  formatFileSize, 
  analyzeResume,
  getFileTypeCategory,
  estimateProcessingTime,
  VALIDATION_ERRORS,
  type ResumeAnalysisResult,
  type AnalyzedResumeData
} from "@/lib/resume-utils"

/**
 * Props interface for the ResumeAnalyzer component
 */
interface ResumeAnalyzerProps {
  /** Optional callback when resume analysis is completed */
  onAnalysisComplete?: (result: ResumeAnalysisResult) => void
  /** Maximum file size in MB (default: 10MB) */
  maxSizeMB?: number
  /** Custom CSS classes */
  className?: string
}

/**
 * Enum for analysis states
 */
enum AnalysisState {
  IDLE = "idle",
  UPLOADING = "uploading",
  ANALYZING = "analyzing",
  SUCCESS = "success",
  ERROR = "error"
}

/**
 * Resume Analyzer Component
 * 
 * A comprehensive component that allows users to upload resume files
 * and get AI-powered analysis using Hugging Face models. Features include
 * drag-and-drop upload, file validation, AI analysis, and detailed scoring.
 */
const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  onAnalysisComplete,
  maxSizeMB = 10,
  className
}) => {
  // State management
  const [analysisState, setAnalysisState] = useState<AnalysisState>(AnalysisState.IDLE)
  const [analyzedData, setAnalyzedData] = useState<AnalyzedResumeData | null>(null)
  const [error, setError] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [jobType, setJobType] = useState<string>("")
  const [estimatedTime, setEstimatedTime] = useState<number>(0)
  
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Analyzes the uploaded resume file using Hugging Face API
   * @param file - The resume file to analyze
   */
  const analyzeResumeFile = async (file: File): Promise<void> => {
    setAnalysisState(AnalysisState.UPLOADING)
    setError("")
    setProgress(10)

    let progressInterval: NodeJS.Timeout | null = null
    let timeoutId: NodeJS.Timeout | null = null

    try {
      // Estimate processing time
      const timeEstimate = estimateProcessingTime(file)
      setEstimatedTime(timeEstimate)

      setAnalysisState(AnalysisState.ANALYZING)
      setProgress(30)

      // Simulate progress updates during analysis
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) return prev + 5
          return prev
        })
      }, 2000)

      // Set a maximum timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        throw new Error('Analysis timeout: Please try again with a different file or check your connection')
      }, 45000) // 45 second timeout

      // Call the analysis API
      const analysisResult = await analyzeResume(file, jobType || undefined)
      
      // Clear timers on success
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      
      setProgress(100)

      // Prepare analyzed data
      const analyzedData: AnalyzedResumeData = {
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: getFileTypeCategory(file),
        analysisResult,
        uploadTimestamp: Date.now()
      }

      setAnalyzedData(analyzedData)
      setAnalysisState(AnalysisState.SUCCESS)
      
      // Call optional callback
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult)
      }

      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000)

    } catch (err) {
      // Clear all timers on error
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      
      console.error("Error analyzing resume:", err)
      
      // Provide more specific error messages based on error type
      let errorMessage = "Failed to analyze resume. Please try again."
      
      if (err instanceof Error) {
        if (err.message.includes('timeout') || err.message.includes('Timeout')) {
          errorMessage = "Analysis timed out. Please try with a smaller file or check your internet connection."
        } else if (err.message.includes('Network error')) {
          errorMessage = "Network error: Please check your connection and try again."
        } else if (err.message.includes('API key')) {
          errorMessage = "Service configuration error. Please contact support."
        } else if (err.message.includes('file format')) {
          errorMessage = "Unsupported file format. Please use PDF files only."
        } else if (err.message.includes('too large')) {
          errorMessage = `File too large. Please use files smaller than ${maxSizeMB}MB.`
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      setAnalysisState(AnalysisState.ERROR)
      setProgress(0)
    }
  }

  /**
   * Handles file input change event
   * @param event - File input change event
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateResumeFile(file, maxSizeMB)
    if (validation.isValid) {
      await analyzeResumeFile(file)
    } else {
      setError(validation.error || "File validation failed")
      setAnalysisState(AnalysisState.ERROR)
    }
  }

  /**
   * Handles drag over event for drag-and-drop functionality
   * @param event - Drag event
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(true)
  }

  /**
   * Handles drag leave event
   * @param event - Drag event
   */
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
  }

  /**
   * Handles file drop event
   * @param event - Drop event
   */
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>): Promise<void> => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)

    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const validation = validateResumeFile(file, maxSizeMB)
      if (validation.isValid) {
        await analyzeResumeFile(file)
      } else {
        setError(validation.error || "File validation failed")
        setAnalysisState(AnalysisState.ERROR)
      }
    }
  }

  /**
   * Resets the component to initial state
   */
  const resetAnalyzer = (): void => {
    setAnalysisState(AnalysisState.IDLE)
    setAnalyzedData(null)
    setError("")
    setProgress(0)
    setJobType("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  /**
   * Triggers file input click
   */
  const triggerFileInput = (): void => {
    fileInputRef.current?.click()
  }

  /**
   * Gets score color based on value
   */
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600" 
    return "text-red-600"
  }

  /**
   * Gets score badge variant based on value
   */
  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto p-6", className)}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            AI Resume Analyzer
          </CardTitle>
          <CardDescription>
            Upload your resume and get AI-powered analysis with scoring and improvement suggestions.
            Supported formats: PDF only (Max: {maxSizeMB}MB)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Job Type Input */}
          {analysisState === AnalysisState.IDLE && (
            <div className="space-y-2">
              <Label htmlFor="jobType">Target Job Type (Optional)</Label>
              <Input
                id="jobType"
                type="text"
                placeholder="e.g., Software Engineer, Marketing Manager, Data Scientist"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="max-w-md"
              />
              <p className="text-sm text-muted-foreground">
                Specify the job type for more targeted analysis and recommendations
              </p>
            </div>
          )}

          {/* File Upload Area */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200",
              isDragOver 
                ? "border-primary bg-primary/5" 
                : analysisState === AnalysisState.SUCCESS 
                  ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                  : analysisState === AnalysisState.ERROR
                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                    : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={analysisState === AnalysisState.UPLOADING || analysisState === AnalysisState.ANALYZING}
            />

            {/* Upload UI based on state */}
            {analysisState === AnalysisState.UPLOADING || analysisState === AnalysisState.ANALYZING ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div>
                  <p className="text-lg font-medium">
                    {analysisState === AnalysisState.UPLOADING ? "Uploading resume..." : "Analyzing with AI..."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analysisState === AnalysisState.ANALYZING && (
                      <span className="flex items-center gap-1 justify-center">
                        <Clock className="h-4 w-4" />
                        Estimated time: {estimatedTime}s
                      </span>
                    )}
                  </p>
                </div>
                {progress > 0 && (
                  <div className="w-full max-w-md">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-center mt-1 text-muted-foreground">{progress}%</p>
                  </div>
                )}
              </div>
            ) : analysisState === AnalysisState.SUCCESS ? (
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <div>
                  <p className="text-lg font-medium text-green-700 dark:text-green-400">
                    Analysis Complete!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analyzedData?.fileName} • {analyzedData?.fileSize} • {analyzedData?.fileType}
                  </p>
                </div>
                <Button onClick={resetAnalyzer} variant="outline" size="sm">
                  Analyze Another Resume
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Upload your resume</p>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, Word documents, or images supported
                  </p>
                </div>
                <Button onClick={triggerFileInput} className="mt-2">
                  Choose File
                </Button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && analysisState === AnalysisState.ERROR && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAnalyzer}
                  className="h-auto p-1 hover:bg-destructive/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Analysis Results Display */}
          {analyzedData && analysisState === AnalysisState.SUCCESS && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Overall Score
                    </div>
                    <Badge 
                      variant={getScoreBadgeVariant(analyzedData.analysisResult.score)}
                      className="text-lg px-3 py-1"
                    >
                      {analyzedData.analysisResult.score}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={analyzedData.analysisResult.score} 
                    className="h-3 mb-4" 
                  />
                  <p className="text-sm text-muted-foreground">
                    {analyzedData.analysisResult.summary}
                  </p>
                </CardContent>
              </Card>

              {/* Detailed Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Detailed Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Content Quality</span>
                        <span className="text-sm font-bold">{analyzedData.analysisResult.analysis.contentQuality}/70</span>
                      </div>
                      <Progress value={(analyzedData.analysisResult.analysis.contentQuality / 70) * 100} className="h-3 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Writing quality, clarity, grammar, completeness, and job relevance
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Experience & Skills</span>
                        <span className="text-sm font-bold">{analyzedData.analysisResult.analysis.experienceSkills}/30</span>
                      </div>
                      <Progress value={(analyzedData.analysisResult.analysis.experienceSkills / 30) * 100} className="h-3 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Relevant experience, technical skills, and achievements
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Personal Details</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="text-sm">{analyzedData.analysisResult.profile?.name || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Location</label>
                          <p className="text-sm">{analyzedData.analysisResult.profile?.location || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Phone</label>
                          <p className="text-sm">{analyzedData.analysisResult.profile?.phone || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="text-sm">{analyzedData.analysisResult.profile?.email || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {analyzedData.analysisResult.profile?.skills?.length > 0 ? (
                          analyzedData.analysisResult.profile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No skills information extracted</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Work Experience</h3>
                    {analyzedData.analysisResult.profile?.experience?.length > 0 ? (
                      <div className="space-y-4">
                        {analyzedData.analysisResult.profile.experience.map((exp, index) => (
                          <div key={index} className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{exp.title}</h4>
                              <span className="text-sm text-muted-foreground">{exp.duration}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{exp.company}</p>
                            <p className="text-sm">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No work experience information extracted</p>
                    )}
                  </div>

                  {/* Education Section */}
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Education</h3>
                    {analyzedData.analysisResult.profile?.education?.length > 0 ? (
                      <div className="space-y-4">
                        {analyzedData.analysisResult.profile.education.map((edu, index) => (
                          <div key={index} className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{edu.degree}</h4>
                              <span className="text-sm text-muted-foreground">{edu.year}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{edu.institution}</p>
                            <p className="text-sm">{edu.details}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No education information extracted</p>
                    )}
                  </div>

                  {/* Improvements Section */}
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">💡 Improvement Suggestions</h3>
                    {analyzedData.analysisResult.improvements?.length > 0 ? (
                      <div className="space-y-2">
                        {analyzedData.analysisResult.improvements.map((improvement, index) => (
                          <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                            <p className="text-sm">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No specific improvement suggestions available</p>
                    )}
                  </div>

                  {/* Missing Skills Section */}
                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">🎯 Recommended Skills to Add</h3>
                    {analyzedData.analysisResult.missingSkills?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analyzedData.analysisResult.missingSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-orange-300 text-orange-700 bg-orange-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No specific skill recommendations available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ResumeAnalyzer
