"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface RecentActivitiesProps {
  activities: any[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading activities
    setTimeout(() => {
      setRecentActivities(activities)
      setLoading(false)
    }, 1000)
  }, [activities])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (recentActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent activities found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentActivities.slice(0, 3).map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4 rounded-md border p-3">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.topic}</p>
            <p className="text-sm text-muted-foreground">{activity.subject}</p>
          </div>
          <div className="text-sm text-muted-foreground">{formatTimeAgo(activity.timestamp)}</div>
        </div>
      ))}
    </div>
  )
}

function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}