"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-gray-900 relative overflow-hidden flex items-center justify-center">

      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/c6yZDPN1/Ironman-PNG-Photoroom.png"
              alt="Ultron 1"
              className="opacity-90 w-[300px] fixed top-16 left-10 h-auto scale-x-[-1] drop-shadow-[0_0_40px_#eb403460] animate-glow"
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/WpSMBjDJ/Superman-Flying-HD-PNG-Image-Transparent-photo-4-Free-Download-Photoroom.png"
              alt="Ultron 1"
              className="opacity-90 w-[300px] fixed top-16 right-10 h-auto scale-x-[-1] drop-shadow-[0_0_40px_#001a4d] animate-glow"
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-5"></div>
      </div>

      <div className="relative z-10 text-center p-8 max-w-2xl">
        <div className="text-9xl font-black text-gray-700 mb-4">
          404
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          NOT FOUND
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
          The page you're seeking has either been moved or doesn't exist.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            asChild
            variant="outline"
            className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white font-medium py-6 px-8 text-lg transition-colors"
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}