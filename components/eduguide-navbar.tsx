"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, LogOut, LogIn, UserPlus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { EduGuideSidebar } from "./eduguide-sidebar"
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export function EduGuideNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  return (
    <>
      <EduGuideSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <header className={`fixed top-0 z-20 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur-md ${poppins.className}`}>
        <div className="container flex h-14 items-center justify-between px-6">
          {/* Menu Button - Left */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo - Right */}
          <div className="flex-1 flex justify-end">
            <Link href="/eduguide" className="group flex items-center">
              <span className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400 cyber-font">
                Edu<span className="text-white cyber-font">Guide</span>
              </span>
            </Link>
          </div>
        </div>
      </header>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

        .cyber-font{
          font-family: 'Orbitron', sans-serif;
        }
      `}</style>
    </>
  )
}