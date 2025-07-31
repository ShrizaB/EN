"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700'] })

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
    <div className="space-y-6 text-yellow-400">
      <div className="text-center">
        <h2 className={`${orbitron.className} text-3xl font-bold mb-4 text-yellow-400 tracking-wider`}>
          APPLICATION_FORM
        </h2>
        <p className="text-yellow-400/80 tracking-wide">
          INITIALIZE YOUR CREDENTIALS FOR SYSTEM ANALYSIS
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-2 border-yellow-400 rounded-none p-6 bg-black/50">
          <div className="space-y-6">
            <div>
              <Label htmlFor="degree" className={`${orbitron.className} text-yellow-400 font-bold tracking-wider text-sm`}>
                EDUCATION_MODULE
              </Label>
              <Input
                id="degree"
                placeholder="e.g., Bachelor of Computer Science"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="mt-2 border-2 border-yellow-400 rounded-none bg-black text-yellow-400 placeholder:text-yellow-400/50 focus:border-yellow-400 focus:ring-0"
              />
            </div>

            <div>
              <Label htmlFor="skills" className={`${orbitron.className} text-yellow-400 font-bold tracking-wider text-sm`}>
                SKILL_ARRAY
              </Label>
              <div className="flex gap-2 mt-2">
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
                  className="border-2 border-yellow-400 rounded-none bg-black text-yellow-400 placeholder:text-yellow-400/50 focus:border-yellow-400 focus:ring-0"
                />
                <Button 
                  type="button" 
                  onClick={handleAddSkill}
                  className={`${orbitron.className} bg-yellow-400 text-black font-bold tracking-wider border-2 border-yellow-400 rounded-none px-6 hover:bg-yellow-400/90`}
                >
                  ADD
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className={`${orbitron.className} border-2 border-yellow-400 bg-black text-yellow-400 px-3 py-1 rounded-none flex items-center text-sm font-bold tracking-wider`}
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-2 text-yellow-400 hover:text-yellow-200 font-bold"
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
              <Label htmlFor="jobTitle" className={`${orbitron.className} text-yellow-400 font-bold tracking-wider text-sm`}>
                TARGET_POSITION
              </Label>
              <select
                id="jobTitle"
                className={`${orbitron.className} w-full p-3 mt-2 border-2 border-yellow-400 rounded-none bg-black text-yellow-400 font-bold tracking-wider focus:border-yellow-400 focus:ring-0 focus:outline-none`}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              >
                <option value="" className="bg-black text-yellow-400">SELECT_TARGET_ROLE</option>
                {JOB_TITLES.map((title) => (
                  <option key={title} value={title} className="bg-black text-yellow-400">
                    {title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="interviewType" className={`${orbitron.className} text-yellow-400 font-bold tracking-wider text-sm`}>
                PROTOCOL_TYPE
              </Label>
              <div className="flex gap-6 mt-3">
                <label className={`${orbitron.className} flex items-center gap-2 text-yellow-400 font-bold tracking-wider cursor-pointer`}>
                  <input
                    type="radio"
                    name="interviewType"
                    value="technical"
                    checked={interviewType === "technical"}
                    onChange={() => setInterviewType("technical")}
                    className="accent-yellow-400 w-4 h-4"
                  />
                  TECHNICAL
                </label>
                <label className={`${orbitron.className} flex items-center gap-2 text-yellow-400 font-bold tracking-wider cursor-pointer`}>
                  <input
                    type="radio"
                    name="interviewType"
                    value="behavioral"
                    checked={interviewType === "behavioral"}
                    onChange={() => setInterviewType("behavioral")}
                    className="accent-yellow-400 w-4 h-4"
                  />
                  BEHAVIORAL
                </label>
                <label className={`${orbitron.className} flex items-center gap-2 text-yellow-400 font-bold tracking-wider cursor-pointer`}>
                  <input
                    type="radio"
                    name="interviewType"
                    value="both"
                    checked={interviewType === "both"}
                    onChange={() => setInterviewType("both")}
                    className="accent-yellow-400 w-4 h-4"
                  />
                  FULL_SPECTRUM
                </label>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={`${orbitron.className} bg-yellow-400 text-black font-bold tracking-wider border-2 border-yellow-400 rounded-none px-8 py-4 hover:bg-yellow-400/90 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? "PROCESSING..." : "INITIATE_PROTOCOL"}
          </Button>
        </div>
      </form>
      <style jsx global>{`
        input:focus, select:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        select option:checked {
          background-color: #000000 !important;
          color: #facc15 !important;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #facc15 !important;
          background-color: #000000 !important;
          box-shadow: 0 0 0px 1000px #000000 inset !important;
        }
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:hover {
          -webkit-text-fill-color: #facc15 !important;
          background-color: #000000 !important;
          box-shadow: 0 0 0px 1000px #000000 inset !important;
        }
      `}</style>
    </div>
  )
}
