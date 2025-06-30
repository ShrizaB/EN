"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface JobApplicationFormProps {
  onComplete: (data: { degree: string; skills: string[]; jobTitle: string; interviewType: "technical" | "behavioral" | "both" }) => void
}

// Sample job titles for dropdown
const JOB_TITLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "Product Manager",
  "QA Engineer",
  "Mobile Developer",
  "Machine Learning Engineer",
]

export default function JobApplicationForm({ onComplete }: JobApplicationFormProps) {
  const [degree, setDegree] = useState("")
  const [skillsInput, setSkillsInput] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [jobTitle, setJobTitle] = useState("")
  const [interviewType, setInterviewType] = useState<"technical" | "behavioral" | "both">("technical")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleAddSkill = () => {
    if (skillsInput.trim() !== "" && !skills.includes(skillsInput.trim())) {
      setSkills([...skills, skillsInput.trim()])
      setSkillsInput("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!degree.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your degree",
        variant: "destructive",
      })
      return
    }

    if (skills.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one skill",
        variant: "destructive",
      })
      return
    }

    if (!jobTitle) {
      toast({
        title: "Missing Information",
        description: "Please select a job title",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    setTimeout(() => {
      onComplete({
        degree,
        skills,
        jobTitle,
        interviewType,
      })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Job Application</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please provide your information to generate personalized interview questions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="degree">Your Degree/Education</Label>
              <Input
                id="degree"
                placeholder="e.g., Bachelor of Computer Science"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="skills">Your Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  placeholder="e.g., JavaScript"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="jobTitle">Job Title You're Applying For</Label>
              <select
                id="jobTitle"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              >
                <option value="">Select a job title</option>
                {JOB_TITLES.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="interviewType">Interview Type</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interviewType"
                    value="technical"
                    checked={interviewType === "technical"}
                    onChange={() => setInterviewType("technical")}
                  />
                  Technical
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interviewType"
                    value="behavioral"
                    checked={interviewType === "behavioral"}
                    onChange={() => setInterviewType("behavioral")}
                  />
                  Behavioural
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="interviewType"
                    value="both"
                    checked={interviewType === "both"}
                    onChange={() => setInterviewType("both")}
                  />
                  Both
                </label>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Continue to Interview"}
          </Button>
        </div>
      </form>
    </div>
  )
}
