"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CareerRoadmapResults } from "./career-roadmap-results"

export function CareerRoadmapForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [formData, setFormData] = useState({
    sector: "private",
    jobRole: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/career/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze career path")
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error analyzing career path:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (results) {
    return <CareerRoadmapResults results={results} onReset={() => setResults(null)} />
  }

  return (
    <Card className="border-2 border-green-500/20">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Tell us about your career preferences</h2>
            <p className="text-muted-foreground">
              We'll analyze your preferences and provide personalized career guidance.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="jobRole" className="text-base">
                What job role are you interested in?
              </Label>
              <Input
                id="jobRole"
                placeholder="e.g. Software Engineer, Data Scientist, Marketing Manager"
                className="mt-1.5"
                value={formData.jobRole}
                onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base">Which sector do you prefer?</Label>
              <RadioGroup
                value={formData.sector}
                onValueChange={(value) => setFormData({ ...formData, sector: value })}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="government" id="government" />
                  <Label htmlFor="government" className="font-normal">
                    Government Sector
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="font-normal">
                    Private Sector
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="font-normal">
                    Both / No Preference
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Generate Career Roadmap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
