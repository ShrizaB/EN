"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { subjectColors } from "@/data/subjects"
import { useState, useEffect } from "react"

interface LearningHistoryChartProps {
  data: any[]
}

export function LearningHistoryChart({ data }: LearningHistoryChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (data && data.length > 0) {
      // Count occurrences of each subject
      const subjectCounts: Record<string, number> = {}

      data.forEach((item) => {
        const subject = item.subject || "general"
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1
      })

      // Convert to chart data format
      const formattedData = Object.entries(subjectCounts).map(([name, value]) => ({
        name,
        value,
      }))

      setChartData(formattedData)
    }
  }, [data])

  // If no data, show a message
  if (!data || data.length === 0 || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <p className="text-muted-foreground text-center">No learning history data available yet.</p>
        <p className="text-muted-foreground text-center text-sm mt-2">
          Complete some learning activities to see your distribution.
        </p>
      </div>
    )
  }

  // Create a config object for the chart
  const chartConfig = chartData.reduce(
    (config, item) => {
      config[item.name] = {
        label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        color: subjectColors[item.name] || "hsl(var(--chart-1))",
      }
      return config
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={subjectColors[entry.name] || `var(--color-${entry.name})`} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
