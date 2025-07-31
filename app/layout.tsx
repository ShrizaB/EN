"use client"  // needed for useState/useEffect

import React, { useEffect, useState, useRef } from "react"
import { Inter, JetBrains_Mono, Orbitron, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"
import { EduPlayNavbar } from "@/components/eduplay-navbar"
import { EduGuideNavbar } from "@/components/eduguide-navbar"
import { TopNavBar } from "@/components/TopNavBar"
import { usePathname } from "next/navigation"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 50 && !isSidebarOpen) {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
        setIsSidebarOpen(true)
      }
    }
    const sidebar = sidebarRef.current
    const handleMouseLeave = () => {
      hoverTimeoutRef.current = setTimeout(() => setIsSidebarOpen(false), 300)
    }

    window.addEventListener("mousemove", handleMouseMove)
    if (sidebar) sidebar.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (sidebar) sidebar.removeEventListener("mouseleave", handleMouseLeave)
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [isSidebarOpen])

  return (
    <html lang="en" suppressHydrationWarning>
                  <body
        className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} ${poppins.variable}`}>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              {/* Show EduGuide navbar for eduguide and interview routes */}
              {(pathname.startsWith("/eduguide") || pathname.startsWith("/interview")) && (
                <EduGuideNavbar />
              )}
              
              {/* Show EduPlay navbar for other routes (except home) */}
              {pathname !== "/" && !pathname.startsWith("/eduguide") && !pathname.startsWith("/interview") && (
                <>
                  <TopNavBar onMenuClick={() => setIsSidebarOpen(true)} />
                  <EduPlayNavbar
                    ref={sidebarRef}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
                    }}
                    onMouseLeave={() => {
                      hoverTimeoutRef.current = setTimeout(() => setIsSidebarOpen(false), 300)
                    }}
                  />
                </>
              )}
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
