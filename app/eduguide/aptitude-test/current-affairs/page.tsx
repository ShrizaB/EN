import type { Metadata } from "next"
import CurrentAffairsClientPage from "./CurrentAffairsClientPage"

export const metadata: Metadata = {
  title: "Current Affairs Mock Tests | EduPlay",
  description: "Test your knowledge of current affairs with our competitive exam-style mock tests.",
}

export default function CurrentAffairsPage() {
  return <CurrentAffairsClientPage />
}