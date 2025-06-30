"use client"

import { Menu } from "lucide-react"
import Link from "next/link"

interface TopNavBarProps {
  onMenuClick: () => void
}

export const TopNavBar = ({ onMenuClick }: TopNavBarProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#0b0b0f] shadow-md z-40 fixed top-0 w-full">
      <button onClick={onMenuClick} className="text-white hover:text-white transition">
        <Menu className="w-6 h-6" />
      </button>
      <Link href="/eduplay/home" className="flex items-center gap-2 group">
        <span className="text-[22px] font-bold tracking-[0.15em] text-white uppercase transition-colors duration-300 font-['Orbitron',_monospace]">
          EduPlay
        </span>
      </Link>
    </header>
  )
}
