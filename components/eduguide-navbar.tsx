"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu,
  X,
  Sun,
  Moon,
  Trophy,
  History,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Brain,
  Briefcase,
  Cpu,
  Shield,
  MapPin,
  Users,
  GraduationCap,
  LineChart,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"

export function EduGuideNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleProfileClick = () => {
    router.push("/profile")
    closeMenu()
  }

  const navLinks = [
    {
      name: "Home",
      href: "/eduguide",
      active: pathname === "/eduguide",
      icon: Cpu,
      color: "text-green-500",
      hoverColor: "hover:text-green-400",
      bgColor: "bg-green-900/20",
    },
    {
      name: "Aptitude Tests",
      href: "/eduguide/aptitude-test",
      active: pathname === "/eduguide/aptitude-test" || pathname?.startsWith("/eduguide/aptitude-test/"),
      icon: Brain,
      color: "text-blue-500",
      hoverColor: "hover:text-blue-400",
      bgColor: "bg-blue-900/20",
    },
    {
      name: "Career Roadmap",
      href: "/eduguide/career-roadmap",
      active: pathname === "/eduguide/career-roadmap",
      icon: MapPin,
      color: "text-teal-500",
      hoverColor: "hover:text-teal-400",
      bgColor: "bg-teal-900/20",
    },
    {
      name: "Interview Practice",
      href: "/interview",
      active: pathname === "/interview",
      icon: Users,
      color: "text-amber-500",
      hoverColor: "hover:text-amber-400",
      bgColor: "bg-amber-900/20",
    },
  ]

  const userLinks = user
    ? [
        {
          name: "Profile",
          href: "/profile",
          active: pathname === "/profile",
          icon: User,
          color: "text-indigo-500",
          hoverColor: "hover:text-indigo-400",
          bgColor: "bg-indigo-900/20",
        },
        {
          name: "History",
          href: "/history",
          active: pathname === "/history",
          icon: History,
          color: "text-purple-500",
          hoverColor: "hover:text-purple-400",
          bgColor: "bg-purple-900/20",
        },
        {
          name: "Achievements",
          href: "/achievements",
          active: pathname === "/achievements",
          icon: Trophy,
          color: "text-orange-500",
          hoverColor: "hover:text-orange-400",
          bgColor: "bg-orange-900/20",
        },
      ]
    : [
        {
          name: "Sign In",
          href: "/signin",
          active: pathname === "/signin",
          icon: LogIn,
          color: "text-sky-500",
          hoverColor: "hover:text-sky-400",
          bgColor: "bg-sky-900/20",
        },
        {
          name: "Sign Up",
          href: "/signup",
          active: pathname === "/signup",
          icon: UserPlus,
          color: "text-emerald-500",
          hoverColor: "hover:text-emerald-400",
          bgColor: "bg-emerald-900/20",
        },
      ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-900/20 bg-black backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/eduguide" className="flex items-center gap-2" onClick={closeMenu}>
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Cpu className="h-5 w-5 text-black" />
            </motion.div>
            <div className="flex items-center">
              <motion.span
                className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                EduGuide
              </motion.span>
              <motion.div
                className="ml-1"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Shield className="h-5 w-5 text-green-400" />
              </motion.div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-4 ml-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${link.hoverColor} rounded-md px-3 py-1.5 ${
                  link.active
                    ? `${link.bgColor} ${link.color} font-bold border border-${link.color.split("-")[1]}-500/30`
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  {link.icon && <link.icon className={`h-4 w-4 ${link.active ? link.color : ""}`} />}
                </motion.div>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-md mr-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                >
                  <motion.div
                    className="w-8 h-8 rounded-md bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-sm font-medium text-black">{user.name?.charAt(0) || "U"}</span>
                  </motion.div>
                  <div className="text-sm font-medium">{user.name || "User"}</div>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2 rounded-md text-red-500 hover:text-red-400 hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-md bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-black">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            onClick={toggleMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black md:hidden">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/eduguide" className="flex items-center gap-2" onClick={closeMenu}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500">
                <Cpu className="h-5 w-5 text-black" />
              </div>
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
                EduGuide
              </span>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
              onClick={toggleMenu}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="container grid gap-4 pb-20 pt-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
            {/* User profile section at the top for mobile */}
            {user && (
              <motion.div
                className="flex items-center gap-4 p-4 bg-gray-900 border border-green-900/30 rounded-md mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 rounded-md bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">{user.name?.charAt(0) || "U"}</span>
                </div>
                <div>
                  <div className="font-medium text-xl text-white">{user.name || "User"}</div>
                  <Button variant="link" className="text-sm text-green-400 p-0 h-auto" onClick={handleProfileClick}>
                    View Profile
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 p-3 rounded-md ${
                      link.active
                        ? `${link.bgColor} ${link.color} border border-${link.color.split("-")[1]}-500/30`
                        : "text-gray-400 hover:bg-gray-800"
                    }`}
                    onClick={closeMenu}
                  >
                    <div className={`w-10 h-10 rounded-md ${link.bgColor} flex items-center justify-center`}>
                      {link.icon && <link.icon className={`h-5 w-5 ${link.color}`} />}
                    </div>
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-4 mt-4">
              <div className="grid grid-cols-1 gap-2">
                {user ? (
                  <>
                    {userLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (navLinks.length + index) * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className={`flex items-center gap-3 p-3 rounded-md ${
                            link.active
                              ? `${link.bgColor} ${link.color} border border-${link.color.split("-")[1]}-500/30`
                              : "text-gray-400 hover:bg-gray-800"
                          }`}
                          onClick={closeMenu}
                        >
                          <div className={`w-10 h-10 rounded-md ${link.bgColor} flex items-center justify-center`}>
                            {link.icon && <link.icon className={`h-5 w-5 ${link.color}`} />}
                          </div>
                          <span className="font-medium">{link.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (navLinks.length + userLinks.length) * 0.05 }}
                    >
                      <button
                        className="flex items-center gap-3 p-3 rounded-md text-red-500 hover:bg-red-900/20 w-full text-left"
                        onClick={() => {
                          logout()
                          closeMenu()
                        }}
                      >
                        <div className="w-10 h-10 rounded-md bg-red-900/20 flex items-center justify-center">
                          <LogOut className="h-5 w-5 text-red-500" />
                        </div>
                        <span className="font-medium">Logout</span>
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {userLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (navLinks.length + index) * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className={`flex items-center gap-3 p-3 rounded-md ${
                            link.active
                              ? `${link.bgColor} ${link.color} border border-${link.color.split("-")[1]}-500/30`
                              : "text-gray-400 hover:bg-gray-800"
                          }`}
                          onClick={closeMenu}
                        >
                          <div className={`w-10 h-10 rounded-md ${link.bgColor} flex items-center justify-center`}>
                            {link.icon && <link.icon className={`h-5 w-5 ${link.color}`} />}
                          </div>
                          <span className="font-medium">{link.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Theme toggle in mobile menu */}
            <motion.div
              className="border-t border-gray-800 pt-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (navLinks.length + userLinks.length + 1) * 0.05 }}
            >
              <button
                className="flex items-center gap-3 p-3 rounded-md text-gray-400 hover:bg-gray-800 w-full text-left"
                onClick={toggleTheme}
              >
                <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center">
                  {mounted && theme === "dark" ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-400" />
                  )}
                </div>
                <span className="font-medium">{mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </motion.div>

            {/* Additional features section */}
            <motion.div
              className="border-t border-gray-800 pt-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (navLinks.length + userLinks.length + 2) * 0.05 }}
            >
              <h3 className="text-sm font-medium text-gray-500 mb-2 px-3">Professional Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Technical Skills", icon: Code, color: "text-blue-500", bg: "bg-blue-900/20" },
                  { name: "Certifications", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-900/20" },
                  { name: "Market Trends", icon: LineChart, color: "text-teal-500", bg: "bg-teal-900/20" },
                  { name: "Job Search", icon: Briefcase, color: "text-amber-500", bg: "bg-amber-900/20" },
                ].map((tool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: (navLinks.length + userLinks.length + 2) * 0.05 + index * 0.05,
                    }}
                  >
                    <button
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-md ${tool.bg} w-full h-24`}
                    >
                      <tool.icon className={`h-8 w-8 ${tool.color}`} />
                      <span className="text-xs font-medium text-gray-300">{tool.name}</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </nav>
        </div>
      )}
    </header>
  )
}
