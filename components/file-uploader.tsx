"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, ImageIcon, CheckCircle } from "lucide-react"

interface FileUploaderProps {
  onFileProcessed: (questions: string[], answers?: string[]) => void
  maxSizeMB?: number
}

export function FileUploader({ onFileProcessed, maxSizeMB = 5 }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`)
      return
    }

    // Check file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Only image and PDF files are supported.")
      return
    }

    setSelectedFile(file)
    setError(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`)
      return
    }

    // Check file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Only image and PDF files are supported.")
      return
    }

    setSelectedFile(file)
    setError(null)
  }

  const uploadFile = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        return newProgress > 90 ? 90 : newProgress
      })
    }, 300)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/gemini/extract-questions", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process file")
      }

      onFileProcessed(data.questions, data.answers)
    } catch (err: any) {
      setError(err.message || "An error occurred while processing the file.")
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="h-12 w-12 text-muted-foreground" />

    if (selectedFile.type.startsWith("image/")) {
      return <ImageIcon className="h-12 w-12 text-blue-500" />
    } else {
      return <FileText className="h-12 w-12 text-orange-500" />
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
            isUploading ? "opacity-50 pointer-events-none" : ""
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          {getFileIcon()}

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {selectedFile ? `Selected: ${selectedFile.name}` : "Drag and drop a file here, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Supports images and PDFs (max {maxSizeMB}MB)</p>
        </div>

        {isUploading ? (
          <div className="mt-4">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-center mt-2 text-muted-foreground">
              {uploadProgress < 100 ? "Analyzing content..." : "Processing complete!"}
            </p>
          </div>
        ) : selectedFile ? (
          <Button onClick={uploadFile} className="w-full mt-4">
            Generate Questions
          </Button>
        ) : null}

        {uploadProgress === 100 && !isUploading && (
          <div className="flex items-center justify-center mt-4 text-green-500">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Questions generated successfully!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}