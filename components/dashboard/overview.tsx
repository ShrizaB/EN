"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"

interface OverviewProps {
  learningHistory: any[]
}

export function Overview({ learningHistory }: OverviewProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Aggregate total learning time per month
    const monthlyData: Record<string, number> = {}

    learningHistory.forEach((item) => {
      const date = new Date(item.timestamp)
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + (item.timeSpent || 0)
    })

    // Convert to chart data format
    const formattedData = Object.entries(monthlyData).map(([name, value]) => ({
      name,
      total: Math.round(value / 60), // Convert seconds to minutes
    }))

    setChartData(formattedData)
  }, [learningHistory])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}