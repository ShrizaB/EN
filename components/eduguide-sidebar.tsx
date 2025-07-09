"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Trophy,
  History,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Brain,
  Home,
  MapPin,
  Users,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"

interface EduGuideSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function EduGuideSidebar({ isOpen, setIsOpen }: EduGuideSidebarProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const handleProfileClick = () => {
    router.push("/profile")
    closeSidebar()
  }

  const navLinks = [
    {
      name: "Home",
      href: "/eduguide",
      active: pathname === "/eduguide",
      icon: Home,
      color: "text-green-400",
      hoverColor: "hover:text-green-300",
      bgColor: "bg-green-900/30",
    },
    {
      name: "Aptitude Tests",
      href: "/eduguide/aptitude-test",
      active: pathname === "/eduguide/aptitude-test" || pathname?.startsWith("/eduguide/aptitude-test/"),
      icon: Brain,
      color: "text-blue-400",
      hoverColor: "hover:text-blue-300",
      bgColor: "bg-blue-900/30",
    },
    {
      name: "Career Roadmap",
      href: "/eduguide/career-roadmap",
      active: pathname === "/eduguide/career-roadmap",
      icon: MapPin,
      color: "text-teal-400",
      hoverColor: "hover:text-teal-300",
      bgColor: "bg-teal-900/30",
    },
    {
      name: "Interview Practice",
      href: "/interview",
      active: pathname === "/interview",
      icon: Users,
      color: "text-amber-400",
      hoverColor: "hover:text-amber-300",
      bgColor: "bg-amber-900/30",
    },
    {
      name: "AI Code Challenge",
      href: "/eduguide/ai-code",
      active: pathname === "/eduguide/ai-code",
      icon: Code,
      color: "text-fuchsia-400",
      hoverColor: "hover:text-fuchsia-300",
      bgColor: "bg-fuchsia-900/30",
    },
  ]

  const userLinks = user
    ? [
      {
        name: "Profile",
        href: "/profile",
        active: pathname === "/profile",
        icon: User,
        color: "text-indigo-400",
        hoverColor: "hover:text-indigo-300",
        bgColor: "bg-indigo-900/30",
      },
      {
        name: "History",
        href: "/history",
        active: pathname === "/history",
        icon: History,
        color: "text-purple-400",
        hoverColor: "hover:text-purple-300",
        bgColor: "bg-purple-900/30",
      },
      {
        name: "Achievements",
        href: "/achievements",
        active: pathname === "/achievements",
        icon: Trophy,
        color: "text-orange-400",
        hoverColor: "hover:text-orange-300",
        bgColor: "bg-orange-900/30",
      },
    ]
    : [
      {
        name: "Sign In",
        href: "/signin",
        active: pathname === "/signin",
        icon: LogIn,
        color: "text-sky-400",
        hoverColor: "hover:text-sky-300",
        bgColor: "bg-sky-900/30",
      },
      {
        name: "Sign Up",
        href: "/signup",
        active: pathname === "/signup",
        icon: UserPlus,
        color: "text-emerald-400",
        hoverColor: "hover:text-emerald-300",
        bgColor: "bg-emerald-900/30",
      },
    ]

  return (
    <>
      {/* Sidebar Trigger Area */}
      <div
        className="fixed left-0 top-0 h-screen w-4 z-40 hover:w-8 transition-all duration-400"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />

      {/* Cyber Grid Background */}
      <div className={`fixed top-0 left-0 h-screen w-64 z-20 ${isOpen ? 'block' : 'hidden'}`}>
        {/* Hide scrollbar for all browsers */}
        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div className="absolute inset-0 bg-black/95"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)'
            ].join(','),
            backgroundSize: '30px 30px',
            opacity: 0.3
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 70%)',
              'linear-gradient(135deg, rgba(0, 255, 136, 0.02) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 255, 136, 0.02) 100%)'
            ].join(',')
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent"></div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-30 bg-black/95 backdrop-blur-sm transition-all duration-300 ease-in-out 
          ${isOpen ? 'w-64' : 'w-0 overflow-hidden'} 
          ${isHovering ? 'w-72' : ''}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="h-full overflow-y-auto no-scrollbar">
          {/* Animated Cyber Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-[pulse_3s_infinite]"></div>

          <div className="flex items-center justify-between p-4 border-b border-green-400/20 relative">
            {/* Cyber Glow Effect */}
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-green-400/0 via-green-400/40 to-green-400/0 blur-sm"></div>

            <Link href="/eduguide" className="flex items-center gap-2 group" onClick={closeSidebar}>
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400 cyber-font">
                Edu<span className="text-white cyber-font">Guide</span>
              </span>
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-md text-gray-400 hover:text-green-400 hover:bg-green-400/10 border border-transparent hover:border-green-400/30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          </div>

          {/* User profile section */}
          {user && (
            <div className="p-4 border-b border-green-400/20 relative overflow-hidden">
              {/* Matrix rain background effect */}
              <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute inset-0 bg-[url('/images/matrix-rain.gif')] bg-cover"></div>
              </div>

              {/* Neon glow border */}
              <div className="absolute inset-0 border-2 border-transparent">
                <div className="absolute -inset-1  rounded-md blur-[2px]"></div>
                <div className="absolute -inset-1 border border-green-400/50 rounded-md pointer-events-none"></div>
              </div>

              {/* Holographic scan lines */}
              <div className="absolute inset-0 bg-[url('/images/scanlines.png')] opacity-20 pointer-events-none"></div>

              {/* Main content */}
              <div className="relative z-10 flex items-center gap-4">
                {/* Avatar with cyber glow */}
                <div className="relative">
                  {/* Avatar core */}
                  <div className="w-14 h-14 rounded-md bg-black border-2 border-green-400 flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.5)]">
                    <span className="text-2xl font-bold text-green-400">{user.name?.charAt(0) || "U"}</span>
                  </div>

                  {/* Animated rings */}
                  <div className="absolute -inset-2 rounded-md border-2 border-green-400/50 pointer-events-none animate-[spin_6s_linear_infinite]"></div>
                  <div className="absolute -inset-3 rounded-md border border-green-400/30 pointer-events-none animate-[spin_8s_linear_infinite_reverse]"></div>

                  {/* Pulsing dot */}
                  <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80] animate-pulse"></div>
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  {/* Username with text scroll effect */}
                  <div className="font-mono font-medium text-white text-lg truncate relative group">
                    <span className="inline-block group-hover:translate-x-1 transition-transform duration-500">
                      {user.name || "User"}
                    </span>
                  </div>

                  {/* Profile link with terminal cursor effect */}
                  <Link
                    href="/profile"
                    className="flex items-center mt-1 group"
                    onClick={closeSidebar}
                  >
                    <span className="font-mono text-xs text-green-400 relative overflow-hidden inline-block">
                      <span className="inline-block transition-all duration-300 group-hover:translate-x-1">
                        ACCESS_PROFILE
                      </span>
                    </span>
                    <svg
                      className="ml-1 w-4 h-4 text-green-400 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Status indicator */}
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80] animate-pulse"></div>
                  <div className="absolute -inset-2 rounded-full bg-green-400/20 animate-ping opacity-75"></div>
                </div>
              </div>

              {/* Animated connection lines */}
              <div className="absolute left-16 bottom-0 h-4 w-px bg-green-400"></div>
              <div className="absolute left-16 bottom-0 w-4 h-px bg-green-400"></div>

              {/* Digital noise effect */}
              <div className="absolute inset-0 bg-[url('/images/digital-noise.gif')] opacity-5 pointer-events-none"></div>
            </div>
          )}

          {/* Main Navigation Links */}
          <nav className="p-4 space-y-1 relative">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-all relative overflow-hidden group
                  ${link.active
                    ? `${link.bgColor} ${link.color} font-bold border border-green-400/30`
                    : `text-gray-400 hover:bg-gray-900/50 ${link.hoverColor}`
                  }`}
                onClick={closeSidebar}
              >
                <div className="relative z-10 flex items-center">
                  <link.icon className={`h-5 w-5 ${link.active ? link.color : "text-gray-400 group-hover:" + link.color}`} />
                  <span className="ml-2">{link.name}</span>
                </div>
                {link.active && (
                  <>
                    <div className="absolute inset-0 bg-green-400/10 border border-green-400/30 rounded-md"></div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  </>
                )}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${link.active ? link.bgColor : 'bg-transparent'}`}></div>
              </Link>
            ))}
          </nav>

          {/* User Links */}
          <div className="p-4 border-t border-green-400/20 space-y-1 relative">
            {userLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-all relative overflow-hidden group
                  ${link.active
                    ? `${link.bgColor} ${link.color} font-bold border border-green-400/30`
                    : `text-gray-400 hover:bg-gray-900/50 ${link.hoverColor}`
                  }`}
                onClick={closeSidebar}
              >
                <div className="relative z-10 flex items-center">
                  <link.icon className={`h-5 w-5 ${link.active ? link.color : "text-gray-400 group-hover:" + link.color}`} />
                  <span className="ml-2">{link.name}</span>
                </div>
                {link.active && (
                  <>
                    <div className="absolute inset-0 bg-green-400/10 border border-green-400/30 rounded-md"></div>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  </>
                )}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${link.active ? link.bgColor : 'bg-transparent'}`}></div>
              </Link>
            ))}

            {user && (
              <button
                className="flex items-center gap-3 p-3 rounded-md text-sm font-medium text-red-400 hover:bg-red-900/30 w-full group relative overflow-hidden"
                onClick={() => {
                  logout()
                  closeSidebar()
                }}
              >
                <div className="relative z-10 flex items-center">
                  <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                  <span className="ml-2">Logout</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
          </div>

          {/* Cyber Footer Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent z-10"></div>
        </div>
      </aside>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

        .cyber-font{
          font-family: 'Orbitron', sans-serif;
        }
      `}</style>
    </>
  )
}