"use client"

import { Menu } from "lucide-react"

interface TopNavBarProps {
  onMenuClick: () => void
}

export const TopNavBar = ({ onMenuClick }: TopNavBarProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#0b0b0f] shadow-md z-40 fixed top-0 w-full">
      <button onClick={onMenuClick} className="text-white hover:text-white transition">
        <Menu className="w-6 h-6" />
      </button>
      <span className="text-[18px] uppercase font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-100 via-white to-white animate-pulse">
        ✦ EduPlay ✦
      </span>
    </header>
  )
}
