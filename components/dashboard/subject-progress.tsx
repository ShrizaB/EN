"use client"

import { Progress } from "@/components/ui/progress"
import { subjects } from "@/data/subjects"
import { useState, useEffect } from "react"

export function SubjectProgress() {
  // This is a placeholder component that shows progress bars for each subject
  // In a real app, you would fetch actual progress data from your API
  const [subjectProgress, setSubjectProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    // Simulate loading progress data
    const progress: Record<string, number> = {}
    subjects.forEach((subject) => {
      // Generate random progress between 0-100 for demo purposes
      progress[subject.id] = Math.floor(Math.random() * 100)
    })

    setSubjectProgress(progress)
  }, [])

  return (
    <div className="space-y-4">
      {subjects.slice(0, 5).map((subject) => (
        <div key={subject.id} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{subject.name}</span>
            <span className="text-sm text-muted-foreground">{subjectProgress[subject.id] || 0}%</span>
          </div>
          <Progress value={subjectProgress[subject.id] || 0} className="h-2" />
        </div>
      ))}
    </div>
  )
}