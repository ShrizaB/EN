"use client"

import { useEffect, useState } from "react"
import "./ultron-loading.css"

export default function Loading() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 2000)
    return () => clearTimeout(timeout)
  }, [])

  if (!show) return null

  return (
    <div className="ultron-loader-screen">
      <div className="ultron-bg-circuit" />
      <div className="ultron-bg-scanlines" />
      <div className="ultron-pulse-glow" />

      <div className="ultron-loader">
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
      </div>

      <p className="ultron-text">Activating Ultron Protocol...</p>
    </div>
  )
}
