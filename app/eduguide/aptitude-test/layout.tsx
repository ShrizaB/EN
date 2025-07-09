import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aptitude Test - EduPlay",
  description: "Prepare for competitive exams with our comprehensive aptitude test preparation resources",
}

export default function AptitudeTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
