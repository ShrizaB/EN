"use client"

import { forwardRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  X, Sun, Moon, BookOpen, Trophy, History, User,
  LogOut, LogIn, UserPlus, Video, Home, Brain, Gamepad2, LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const EduPlayNavbar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ isOpen, onClose, onMouseEnter, onMouseLeave }, ref) => {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const { user, logout } = useAuth()
    const router = useRouter()

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

    const navLinks = [
      { name: "Home", href: "/", icon: Home },
      { name: "Dashboard", href: "/eduplay/dashboard", icon: LayoutDashboard },
      { name: "Subjects", href: "/subjects", icon: BookOpen },
      { name: "Quiz", href: "/quiz", icon: Brain },
      { name: "Games", href: "/games", icon: Gamepad2 },
      { name: "Video Search", href: "/video-search", icon: Video },
      { name: "Test Your Level", href: "/test-your-level", icon: Trophy },
      { name: "Question Generator", href: "/question-generator", icon: Brain },
    ]

    const userLinks = user
      ? [
        { name: "Profile", href: "/profile", icon: User },
        { name: "History", href: "/history", icon: History },
        { name: "Achievements", href: "/achievements", icon: Trophy },
      ]
      : [
        { name: "Sign In", href: "/signin", icon: LogIn },
        { name: "Sign Up", href: "/signup", icon: UserPlus },
      ]

    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-50 bg-black/80 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          onClick={onClose}
        />

        {/* Sidebar */}
        <aside
          ref={ref}
          className={`fixed top-0 left-0 z-[100] h-full w-72 bg-black transition-all duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="p-4 flex justify-between items-center bg-black">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-[22px] font-black tracking-widest text-white uppercase letter-spacing-wide">
                ✦ EduPlay ✦
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-[#181818]">
              <X className="h-5 w-5 text-white hover:text-white transition-colors duration-200" />
            </Button>
          </div>

          <nav className="flex flex-col gap-1 p-4 overflow-y-auto h-[calc(100%-4rem)]">
            {user && (
              <div className="flex items-center gap-4 p-4 bg-[#181818] rounded-xl mb-4 transition-all duration-200">
                <div className="w-10 h-10 rounded-full bg-[#232323] flex items-center justify-center text-white font-black text-xl transition-all duration-200 group-hover:shadow-[0_0_12px_2px_#fff]">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="text-white font-bold tracking-wide uppercase text-[15px]">{user.name || "User"}</div>
                  <button
                    className="text-xs text-white hover:underline hover:underline-offset-4 font-semibold transition"
                    onClick={() => {
                      router.push("/profile")
                      onClose()
                    }}
                  >
                    View Profile →
                  </button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-base font-extrabold bg-[#181818] hover:scale-[1.06] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40 relative overflow-hidden ${pathname === link.href || pathname?.startsWith(link.href)
                    ? "text-white"
                    : "text-white/90"
                  }`}
                >
                  <link.icon className="h-5 w-5 group-hover:scale-125 group-hover:text-white transition-transform duration-200" />
                  <span className="relative z-10 tracking-wide">{link.name}</span>
                  <span className="absolute left-0 bottom-0 w-0 h-1.5 bg-white group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </div>

            {/* Auth/User */}
            <div className="pt-4 mt-4 grid gap-1">
              {(user ? userLinks : userLinks).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#181818] text-white/90 hover:scale-[1.04] hover:text-white transition font-extrabold text-base"
                >
                  <link.icon className="h-5 w-5 group-hover:text-white transition-transform duration-200" />
                  <span>{link.name}</span>
                </Link>
              ))}

              {user && (
                <button
                  onClick={() => {
                    logout()
                    onClose()
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:text-white hover:bg-[#181818]/60 transition w-full text-left font-extrabold mt-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </nav>
        </aside>
        <style jsx>{`
          .letter-spacing-wide { letter-spacing: 0.12em; }
        `}</style>
      </>
    )
  }
)

EduPlayNavbar.displayName = "EduPlayNavbar"
