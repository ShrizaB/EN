"use client"

import React, { useState, useEffect } from "react"
import "./venom-loading.css"

export default function ChatbotLoading() {
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 })

  // Custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({
        x: e.clientX,
        y: e.clientY,
      });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="venom-loading-container overflow-x-hidden" style={{overflowX: 'hidden', width: '100vw'}}>
      {/* Custom cursor for loading screen */}
      <style>{`body { overflow-x: hidden !important; }`}</style>
      {/* Custom cursor for loading screen */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "32px",
          height: "32px",
          background: `url('https://i.postimg.cc/Hkn1RWcn/Screenshot-2025-06-29-145137-removebg-preview.png') center/cover no-repeat`,
          backgroundColor: "transparent",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: cursorPos ? `translate3d(${cursorPos.x - 24}px, ${cursorPos.y - 24}px, 0)` : 'translate3d(-9999px, -9999px, 0)',
          willChange: "transform",
          opacity: 1,
        }}
      />
      {/* Dark Symbiotic Background */}
      <div className="symbiotic-background">
        {/* Awakening Text Background */}
        <div className="awakening-background">
          <div className="awakening-text-large">WE</div>
          <div className="awakening-text-large awakening-delay-1">ARE</div>
          <div className="awakening-text-large awakening-delay-2">AWAKENING</div>
        </div>

        {/* Dark Symbiotic Mass */}
        <div className="dark-symbiotic-mass">
          <div className="symbiotic-blob-bg blob-bg-1"></div>
          <div className="symbiotic-blob-bg blob-bg-2"></div>
          <div className="symbiotic-blob-bg blob-bg-3"></div>
          <div className="symbiotic-blob-bg blob-bg-4"></div>
          <div className="symbiotic-blob-bg blob-bg-5"></div>
          <div className="symbiotic-blob-bg blob-bg-6"></div>
        </div>

        {/* Animated Black Tendrils */}
        <svg className="background-tendrils" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg">
          <path
            className="symbiote-tendril dark-tendril-1"
            d="M0,450 Q200,200 400,450 Q600,700 800,450 Q1000,200 1200,450 Q1300,600 1400,450"
          />
          <path 
            className="symbiote-tendril dark-tendril-2" 
            d="M0,300 Q300,600 600,300 Q900,0 1200,300 Q1350,450 1400,300" 
          />
          <path
            className="symbiote-tendril dark-tendril-3"
            d="M0,600 Q250,300 500,600 Q750,900 1000,600 Q1200,400 1400,600"
          />
          <path 
            className="symbiote-tendril dark-tendril-4" 
            d="M0,150 Q350,750 700,150 Q1050,750 1400,150" 
          />
          <path
            className="symbiote-tendril dark-tendril-5"
            d="M0,750 Q300,400 600,750 Q900,400 1200,750 Q1350,600 1400,750"
          />
          <path
            className="symbiote-tendril dark-tendril-6"
            d="M0,100 Q400,500 800,100 Q1200,500 1400,100"
          />
        </svg>

        {/* Dark Symbiotic Particles */}
        <div className="dark-symbiotic-particles">
          <div className="dark-symbiote-particle dark-particle-1"></div>
          <div className="dark-symbiote-particle dark-particle-2"></div>
          <div className="dark-symbiote-particle dark-particle-3"></div>
          <div className="dark-symbiote-particle dark-particle-4"></div>
          <div className="dark-symbiote-particle dark-particle-5"></div>
          <div className="dark-symbiote-particle dark-particle-6"></div>
          <div className="dark-symbiote-particle dark-particle-7"></div>
          <div className="dark-symbiote-particle dark-particle-8"></div>
          <div className="dark-symbiote-particle dark-particle-9"></div>
          <div className="dark-symbiote-particle dark-particle-10"></div>
        </div>

        {/* Enhanced Venom Face with Awakening */}
        <div className="venom-face-awakening">
          <div className="awakening-venom-eye left-eye-awakening"></div>
          <div className="awakening-venom-eye right-eye-awakening"></div>
          <div className="awakening-venom-mouth">
            <div className="awakening-fang fang-awakening-1"></div>
            <div className="awakening-fang fang-awakening-2"></div>
            <div className="awakening-fang fang-awakening-3"></div>
            <div className="awakening-fang fang-awakening-4"></div>
            <div className="awakening-fang fang-awakening-5"></div>
            <div className="awakening-fang fang-awakening-6"></div>
          </div>
        </div>

        {/* Dark Energy Pulses */}
        <div className="dark-energy-pulses">
          <div className="dark-energy-ring dark-ring-1"></div>
          <div className="dark-energy-ring dark-ring-2"></div>
          <div className="dark-energy-ring dark-ring-3"></div>
          <div className="dark-energy-ring dark-ring-4"></div>
        </div>

        {/* Symbiotic Web Pattern */}
        <div className="symbiotic-web">
          <div className="web-strand strand-1"></div>
          <div className="web-strand strand-2"></div>
          <div className="web-strand strand-3"></div>
          <div className="web-strand strand-4"></div>
          <div className="web-strand strand-5"></div>
          <div className="web-strand strand-6"></div>
        </div>
      </div>

      {/* Main Loading Content */}
      <div className="loading-content">
        {/* Dark Symbiotic Spinner - responsive size */}
        <div className="dark-symbiotic-spinner" style={{width: 'clamp(180px, 40vw, 340px)', height: 'clamp(180px, 40vw, 340px)', maxWidth: '90vw', maxHeight: '90vw', margin: '0 auto'}}>
          <div className="dark-spinner-core">
            <div className="dark-core-center"></div>
            <div className="dark-symbiote-arm dark-arm-1"></div>
            <div className="dark-symbiote-arm dark-arm-2"></div>
            <div className="dark-symbiote-arm dark-arm-3"></div>
            <div className="dark-symbiote-arm dark-arm-4"></div>
            <div className="dark-symbiote-arm dark-arm-5"></div>
            <div className="dark-symbiote-arm dark-arm-6"></div>
            <div className="dark-symbiote-arm dark-arm-7"></div>
            <div className="dark-symbiote-arm dark-arm-8"></div>
          </div>
          <div className="dark-spinner-ring dark-outer-ring" style={{width: '100%', height: '100%'}}></div>
          <div className="dark-spinner-ring dark-middle-ring" style={{width: '80%', height: '80%'}}></div>
          <div className="dark-spinner-ring dark-inner-ring" style={{width: '60%', height: '60%'}}></div>
          
          {/* Symbiotic Orb */}
          <div className="symbiotic-orb" style={{width: '40%', height: '40%'}}>
            <div className="orb-core"></div>
            <div className="orb-pulse pulse-1"></div>
            <div className="orb-pulse pulse-2"></div>
            <div className="orb-pulse pulse-3"></div>
          </div>
        </div>

        {/* Enhanced Loading Text */}
        <div className="loading-text">
          {/* Animated Venom Face Image */}
          <div className="venom-face-container">
            <div className="venom-face-wrapper">
              <img 
                src="https://i.postimg.cc/TYvyTgdF/wp8852682-venom-face-wallpapers.jpg" 
                alt="Venom Face" 
                className="venom-face-image"
              />
              {/* Animated Overlay Effects */}
              <div className="venom-face-overlay">
                <div className="energy-pulse pulse-overlay-1"></div>
                <div className="energy-pulse pulse-overlay-2"></div>
                <div className="energy-pulse pulse-overlay-3"></div>
              </div>
              {/* Symbiotic Tendrils around face */}
              <div className="face-tendrils">
                <div className="face-tendril tendril-top-left"></div>
                <div className="face-tendril tendril-top-right"></div>
                <div className="face-tendril tendril-bottom-left"></div>
                <div className="face-tendril tendril-bottom-right"></div>
              </div>
              {/* Glowing Eyes Effect */}
              <div className="glowing-eyes">
                <div className="glow-eye left-glow-eye"></div>
                <div className="glow-eye right-glow-eye"></div>
              </div>
              {/* Particle Emission */}
              <div className="face-particles">
                <div className="face-particle fp-1"></div>
                <div className="face-particle fp-2"></div>
                <div className="face-particle fp-3"></div>
                <div className="face-particle fp-4"></div>
                <div className="face-particle fp-5"></div>
                <div className="face-particle fp-6"></div>
              </div>
              {/* Symbiotic Aura */}
              <div className="symbiotic-aura">
                <div className="aura-ring aura-1"></div>
                <div className="aura-ring aura-2"></div>
                <div className="aura-ring aura-3"></div>
              </div>
            </div>
          </div>
          
          <h2 className="dark-symbiote-title">
            <span className="dark-title-word dark-word-1">WE</span>
            <span className="dark-title-separator">...</span>
            <span className="dark-title-word dark-word-2">ARE</span>
            <span className="dark-title-separator">...</span>
            <span className="dark-title-word dark-word-3">VENOM</span>
          </h2>
          <p className="dark-symbiote-subtitle">
            <span className="typing-effect">The darkness awakens within...</span>
          </p>
          
          {/* Dark Progress Tendrils */}
          <div className="dark-progress-container">
            <div className="dark-progress-tendril dark-tendril-progress-1"></div>
            <div className="dark-progress-tendril dark-tendril-progress-2"></div>
            <div className="dark-progress-tendril dark-tendril-progress-3"></div>
            <div className="dark-progress-tendril dark-tendril-progress-4"></div>
          </div>
          
          {/* Symbiotic Loading Status */}
          <div className="symbiotic-status">
            <span className="status-text">Bonding...</span>
            <div className="status-dots">
              <span className="status-dot dot-1">●</span>
              <span className="status-dot dot-2">●</span>
              <span className="status-dot dot-3">●</span>
            </div>
          </div>
        </div>

        {/* Enhanced Symbiotic Loading Blobs */}
        <div className="dark-loading-blobs">
          <div className="dark-symbiote-blob dark-blob-1"></div>
          <div className="dark-symbiote-blob dark-blob-2"></div>
          <div className="dark-symbiote-blob dark-blob-3"></div>
          <div className="dark-symbiote-blob dark-blob-4"></div>
          <div className="dark-symbiote-blob dark-blob-5"></div>
          <div className="dark-symbiote-blob dark-blob-6"></div>
          <div className="dark-symbiote-blob dark-blob-7"></div>
        </div>
      </div>

      {/* Enhanced Glitch Effect Overlay */}
      <div className="dark-glitch-overlay"></div>
      
      {/* Symbiotic Emergence Effect */}
      <div className="symbiotic-emergence">
        <div className="emergence-wave wave-1"></div>
        <div className="emergence-wave wave-2"></div>
        <div className="emergence-wave wave-3"></div>
      </div>
    </div>
  )
}