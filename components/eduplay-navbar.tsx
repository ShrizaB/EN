"use client"

import { forwardRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  X, Sun, Moon, BookOpen, Trophy, History, User,
  LogOut, LogIn, UserPlus, Video, Home, Brain, Gamepad2, LayoutDashboard, Search, Gamepad, Bot, Atom, Youtube
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
      { name: "Home", href: "/eduplay/home", icon: Home },
      { name: "Dashboard", href: "/eduplay/dashboard", icon: LayoutDashboard },
      { name: "Subjects", href: "/subjects", icon: BookOpen },
      { name: "Quiz", href: "/quiz", icon: Brain },
      { name: "Games", href: "/games", icon: Gamepad2 },
      { name: "Video Search", href: "/video-search", icon: Youtube },
      { name: "Test Your Level", href: "/test-your-level", icon: Trophy },
      { name: "Question Generator", href: "/question-generator", icon: Brain },
      { name: "Search Learn Test", href: "/search-learn-test", icon: Search },
      { name: "Quiz Battle", href: "/eduplay/quiz-battle", icon: Gamepad },
      { name: "Chatbot", href: "/chatbot", icon: Bot },
    { name: "Visuals", href: "/eduplay/visuals", icon: Atom },
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
        {/* Enhanced Backdrop with blur */}
        <div
          className={`fixed inset-0 z-50 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-sm transition-all duration-700 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          onClick={onClose}
        />

        {/* Sidebar */}
        <aside
          ref={ref}
          className={`fixed top-0 left-0 z-[100] h-full w-72 bg-gradient-to-b from-[#0d0d0d] via-[#0a0a0a] to-[#0d0d0d] shadow-2xl border-r border-gray-800 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOpen ? "translate-x-0 sidebar-enter" : "-translate-x-full"}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Header with enhanced styling */}
          <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#0a0a0a] to-[#0f0f0f] border-b border-gray-800 backdrop-blur-sm">
            <Link href="/eduplay/home" className="flex items-center gap-2 group">
              <span className="text-[22px] font-bold tracking-[0.15em] text-white uppercase transition-colors duration-300 font-['Orbitron',_monospace]">
                EduPlay
              </span>
            </Link>
            <div className="flex items-center gap-2">
              {/* Close Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="hover:bg-white/10 hover:rotate-90 transition-all duration-300 rounded-lg"
              >
                <X className="h-5 w-5 text-white hover:text-gray-200 transition-colors duration-200" />
              </Button>
            </div>
          </div>

          <nav className="flex flex-col gap-2 p-4 overflow-y-auto h-[calc(100%-4rem)] scrollbar-none">
            {user && (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#141414] to-[#1a1a1a] rounded-lg mb-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group backdrop-blur-sm">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold text-lg transition-all duration-300 group-hover:scale-105">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a] animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold tracking-wide uppercase text-[15px] mb-1 group-hover:text-gray-200 transition-colors duration-300">{user.name || "User"}</div>
                  <button
                    className="text-xs text-gray-400 hover:text-white hover:underline hover:underline-offset-4 font-semibold transition-all duration-300 flex items-center gap-1 group-hover:translate-x-1"
                    onClick={() => {
                      router.push("/profile")
                      onClose()
                    }}
                  >
                    View Profile 
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation with enhanced animations */}
            <div className="grid gap-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`group flex items-center gap-4 px-4 py-4 rounded-lg text-base font-bold bg-gradient-to-r from-[#141414] to-[#1a1a1a] border border-gray-700 hover:border-gray-600 hover:scale-[1.01] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-600 relative overflow-hidden backdrop-blur-sm ${pathname === link.href || pathname?.startsWith(link.href)
                    ? "text-white border-gray-600 bg-gradient-to-r from-[#1f1f1f] to-[#252525]"
                    : "text-gray-300 hover:text-white"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isOpen ? 'slideInLeft 0.6s ease-out forwards' : 'none'
                  }}
                >
                  <div className="relative">
                    <link.icon className="h-5 w-5 group-hover:scale-110 transition-all duration-300 relative z-10" />
                  </div>
                  <span className="relative z-10 tracking-wide group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  
                  {/* Animated underline */}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-500 group-hover:w-full transition-all duration-300" />
                  
                  {/* Right arrow indicator */}
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-gray-400 rotate-45"></div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Auth/User with enhanced styling */}
            <div className="pt-6 mt-6 border-t border-white/10 grid gap-2">
              <div className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-2 px-2">
                {user ? "Account" : "Get Started"}
              </div>
              {(user ? userLinks : userLinks).map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center gap-4 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#181818] to-[#202020] border border-white/10 text-white/90 hover:border-white/30 hover:scale-[1.02] hover:text-white transition-all duration-400 font-bold text-base backdrop-blur-sm hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] relative overflow-hidden"
                  style={{
                    animationDelay: `${(navLinks.length + index) * 50}ms`,
                    animation: isOpen ? 'slideInLeft 0.6s ease-out forwards' : 'none'
                  }}
                >
                  <link.icon className="h-5 w-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </Link>
              ))}

              {user && (
                <button
                  onClick={() => {
                    logout()
                    onClose()
                  }}
                  className="group flex items-center gap-4 px-4 py-3 rounded-2xl text-white/90 hover:text-white hover:bg-gradient-to-r from-red-900/20 to-red-800/20 hover:border-red-500/30 border border-white/10 transition-all duration-400 w-full text-left font-bold mt-2 backdrop-blur-sm hover:shadow-[0_4px_20px_rgba(239,68,68,0.2)] relative overflow-hidden"
                >
                  <LogOut className="h-5 w-5 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Logout</span>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </button>
              )}
            </div>
          </nav>
        </aside>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
          
          .letter-spacing-wide { 
            letter-spacing: 0.12em; 
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-2px);
            }
          }
          
          /* Hide scrollbar completely */
          .scrollbar-none {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          
          /* Smooth entrance animation for the entire sidebar */
          .sidebar-enter {
            animation: slideInSidebar 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          
          @keyframes slideInSidebar {
            from {
              transform: translateX(-100%);
              opacity: 0.8;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </>
    )
  }
)

EduPlayNavbar.displayName = "EduPlayNavbar"
