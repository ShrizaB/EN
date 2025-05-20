"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import VinylPlayer from "@/components/vinyl-player"
import './styles.css'
import { HeroSection } from "./hero-section"
import SubjectsSection from "./subjects-section"
import FeaturesSection from "./features-section"
import CtaSection from "./cta-section"

export default function EduPlayPage() {

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-b from-purple-100 to-black/5 dark:from-purple-950 dark:to-black overflow-hidden"
      >
        <HeroSection />
        <SubjectsSection />
        <FeaturesSection />
        <CtaSection />
        {/* <VinylPlayer /> */}
      </div>

    </>
  )

}

// https://www.cleanpng.com/free/iron-man.html   <--- Iron Man
// https://i.postimg.cc/RZGLH2zk/hulk-marvel-rivals-png-by-joaolucasvingaprimos-di6otfx.png  <-- hulk png marvel rivals
// https://www.cleanpng.com/free/spiderman.html <--- Spider Man