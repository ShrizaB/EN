import type React from "react"
import { EduGuideNavbar } from "@/components/eduguide-navbar"

export default function EduGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <EduGuideNavbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
