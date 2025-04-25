"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SigninPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the sign-in page
    router.replace("/sign-in")
  }, [router])

  return null
}