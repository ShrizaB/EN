/**
 * File validation utilities for the Resume Analyzer
 * 
 * This module provides utility functions for validating file types,
 * sizes, and other properties related to resume file uploads.
 */

/**
 * Supported file types for resume upload
 */
export const SUPPORTED_FILE_TYPES = {
  PDF: {
    extension: '.pdf',
    mimeType: 'application/pdf',
    description: 'PDF Document (.pdf)'
  }
} as const

/**
 * Default configuration for file uploads
 */
export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE_MB: 10,
  MIN_SIZE_BYTES: 1,
  ALLOWED_EXTENSIONS: ['.pdf'],
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/png',
    'image/jpeg'
  ]
} as const

/**
 * Error messages for different validation scenarios
 */
export const VALIDATION_ERRORS = {
  INVALID_EXTENSION: 'Please upload a valid file (.pdf, .docx, .doc, .png, .jpg, .jpeg).',
  INVALID_MIME_TYPE: 'Please upload a valid resume file.',
  FILE_TOO_LARGE: (maxSizeMB: number) => `File is too large. Maximum size is ${maxSizeMB}MB.`,
  FILE_EMPTY: 'File appears to be empty.',
  NO_FILE_SELECTED: 'Please select a file to upload.',
  ANALYSIS_FAILED: 'Failed to analyze resume.',
  NO_CONTENT_FOUND: 'No readable content found in the document.',
  NETWORK_ERROR: 'Network error occurred during analysis.'
} as const

/**
 * Interface for file validation result
 */
export interface FileValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Interface for file information
 */
export interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: number
}

/**
 * Interface for resume analysis result
 */
export interface ResumeAnalysisResult {
  score: number
  analysis: {
    contentQuality: number
    experienceSkills: number
  }
  profile: {
    name: string
    location: string
    phone: string
    email: string
    skills: string[]
    experience: Array<{
      title: string
      company: string
      duration: string
      description: string
    }>
    education: Array<{
      degree: string
      institution: string
      year: string
      details: string
    }>
  }
  summary: string
  improvements: string[]
  missingSkills: string[]
}

/**
 * Interface for analyzed resume data
 */
export interface AnalyzedResumeData {
  fileName: string
  fileSize: string
  fileType: string
  analysisResult: ResumeAnalysisResult
  uploadTimestamp: number
}

/**
 * Validates if a file meets the requirements for resume upload
 * @param file - The file to validate
 * @param maxSizeMB - Maximum allowed file size in MB
 * @returns FileValidationResult object
 */
export function validateResumeFile(file: File, maxSizeMB: number = FILE_UPLOAD_CONFIG.MAX_SIZE_MB): FileValidationResult {
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      error: VALIDATION_ERRORS.NO_FILE_SELECTED
    }
  }

  // Check file extension
  const fileName = file.name.toLowerCase()
  const hasValidExtension = FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.some(ext => 
    fileName.endsWith(ext)
  )
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: VALIDATION_ERRORS.INVALID_EXTENSION
    }
  }

  // Check MIME type
  if (!(FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
    return {
      isValid: false,
      error: VALIDATION_ERRORS.INVALID_MIME_TYPE
    }
  }

  // Check file size (minimum)
  if (file.size <= FILE_UPLOAD_CONFIG.MIN_SIZE_BYTES) {
    return {
      isValid: false,
      error: VALIDATION_ERRORS.FILE_EMPTY
    }
  }

  // Check file size (maximum)
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: VALIDATION_ERRORS.FILE_TOO_LARGE(maxSizeMB)
    }
  }

  return { isValid: true }
}

/**
 * Formats file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Extracts file information from a File object
 * @param file - The file to extract information from
 * @returns FileInfo object
 */
export function getFileInfo(file: File): FileInfo {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  }
}

/**
 * Checks if a file type is supported
 * @param file - The file to check
 * @returns boolean indicating if file type is supported
 */
export function isSupportedFileType(file: File): boolean {
  const fileName = file.name.toLowerCase()
  return FILE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext)) &&
         (FILE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)
}

/**
 * Converts a file to base64 data URL for API transmission
 * @param file - The file to convert
 * @returns Promise<string> - Base64 data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Analyzes resume using the backend API
 * @param file - The resume file to analyze
 * @param jobType - Optional job type for targeted analysis
 * @returns Promise<ResumeAnalysisResult>
 */
export async function analyzeResume(
  file: File, 
  jobType?: string
): Promise<ResumeAnalysisResult> {
  try {
    // Convert file to base64 for API transmission
    const imageData = await fileToBase64(file)

    console.log('Starting resume analysis...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      jobType
    })

    const response = await fetch('/api/resume-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData,
        jobType
      }),
      signal: AbortSignal.timeout(60000) // Increased to 60 seconds to accommodate longer analysis
    })

    if (!response.ok) {
      let errorMessage = 'Failed to analyze resume'
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch (e) {
        // If we can't parse error JSON, use the status text
        errorMessage = `${errorMessage} (${response.status}: ${response.statusText})`
      }
      
      console.error('Resume analysis API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      })
      
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log('Resume analysis completed successfully')
    return result
  } catch (error) {
    console.error('Resume analysis error:', error)
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to analysis service')
    } else if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error(VALIDATION_ERRORS.ANALYSIS_FAILED)
    }
  }
}

/**
 * Gets file type category for display purposes
 * @param file - The file to categorize
 * @returns string - File type category
 */
export function getFileTypeCategory(file: File): string {
  const mimeType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()

  if (mimeType.startsWith('image/')) {
    return 'Image'
  } else if (mimeType === 'application/pdf') {
    return 'PDF'
  } else if (mimeType.includes('word') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return 'Word Document'
  }
  
  return 'Document'
}

/**
 * Checks if file is an image type
 * @param file - The file to check
 * @returns boolean
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Estimates processing time based on file size and type
 * @param file - The file to estimate for
 * @returns number - Estimated seconds
 */
export function estimateProcessingTime(file: File): number {
  const sizeMB = file.size / (1024 * 1024)
  const isImage = isImageFile(file)
  
  // Base processing time
  let estimatedSeconds = 3
  
  // Add time based on file size
  estimatedSeconds += Math.ceil(sizeMB * 2)
  
  // Images generally process faster
  if (isImage) {
    estimatedSeconds *= 0.7
  }
  
  // Cap at reasonable maximum
  return Math.min(estimatedSeconds, 30)
}
