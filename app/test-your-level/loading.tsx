"use client"

import { useEffect, useRef } from 'react'

export default function Loading() {
  // Audio reference for Moon Knight theme
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio when component mounts
  useEffect(() => {
    // Initialize audio element for Moon Knight theme
    const audio = new Audio('sounds/moon-knight-theme.mp3')
    audio.loop = true
    audio.volume = 0.3
    audio.preload = 'auto'
    
    // Handle audio loading errors gracefully
    audio.addEventListener('error', () => {
      console.warn('Could not load Moon Knight theme music')
    })
    
    audioRef.current = audio

    // Start playing Moon Knight theme music during loading
    if (audioRef.current) {
      console.log('Starting Moon Knight theme music...')
      audioRef.current.currentTime = 0
      // Force play the audio
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio started successfully!')
          })
          .catch(error => {
            console.log("Audio autoplay prevented:", error)
            // Create a user interaction listener to start audio
            const startAudioOnInteraction = () => {
              if (audioRef.current) {
                console.log('Attempting to play audio on user interaction...')
                audioRef.current.play()
                  .then(() => console.log('Audio started after user interaction!'))
                  .catch(err => console.error('Failed to start audio:', err))
              }
              // Remove listeners after first attempt
              document.removeEventListener('click', startAudioOnInteraction)
              document.removeEventListener('keydown', startAudioOnInteraction)
              document.removeEventListener('touchstart', startAudioOnInteraction)
            }
            
            // Add multiple event listeners for user interaction
            document.addEventListener('click', startAudioOnInteraction, { once: true })
            document.addEventListener('keydown', startAudioOnInteraction, { once: true })
            document.addEventListener('touchstart', startAudioOnInteraction, { once: true })
          })
      }
    } else {
      console.warn('Audio ref is not available')
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Add custom CSS animations
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'moon-knight-loading-styles'
    style.textContent = `
      /* Hide default cursor in loading screen too */
      .moon-knight-loading-container *, 
      .moon-knight-loading-container *::before, 
      .moon-knight-loading-container *::after {
        cursor: none !important;
      }
      
      /* Override any pointer states in loading */
      .moon-knight-loading-container *:hover,
      .moon-knight-loading-container *:focus,
      .moon-knight-loading-container *:active {
        cursor: none !important;
      }
      
      /* Moon Knight Loading Styles */
      .moon-knight-loading-container {
        background: linear-gradient(135deg, 
          #0a0a0a 0%, 
          #1a1a1a 25%, 
          #2a2a2a 50%, 
          #1a1a1a 75%, 
          #0a0a0a 100%);
        min-height: 100vh;
        position: relative;
        overflow: hidden;
      }
      
      .moon-knight-loading-bg {
        position: absolute;
        inset: 0;
        background-image: 
          radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.1) 0%, transparent 50%),
          linear-gradient(45deg, transparent 48%, rgba(255, 215, 0, 0.05) 50%, transparent 52%);
        animation: bg-shift 8s ease-in-out infinite alternate;
      }
      
      @keyframes bg-shift {
        0% { opacity: 0.3; transform: scale(1) rotate(0deg); }
        100% { opacity: 0.6; transform: scale(1.1) rotate(2deg); }
      }
      
      /* Crescent Blades Loading Animation */
      .crescent-blade-container {
        position: absolute;
        width: 500px;
        height: 500px;
        top: 50%;
        left: 50%;
        transform-origin: center;
        transition: all 2s ease-out;
        z-index: 15;
      }
      
      .crescent-blade-1 {
        transform: translate(-50%, -50%);
        animation: blade-rotate-and-slide-right 7s ease-out forwards;
      }
      
      .crescent-blade-2 {
        transform: translate(-50%, -50%) scaleX(-1);
        animation: blade-rotate-and-slide-left 7s ease-out forwards;
        opacity: 0.95;
      }
      
      .crescent-blade-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 80px rgba(255, 140, 0, 0.6));
      }
      
      /* Cloud Reveal Effect */
      .cloud-reveal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;
        background: radial-gradient(ellipse, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0.4) 20%, rgba(255, 215, 0, 0.2) 40%, rgba(255, 215, 0, 0.1) 60%, transparent 80%);
        border-radius: 50%;
        animation: cloud-reveal-expand 4s ease-out 4.5s forwards;
        opacity: 0;
        z-index: 10;
        box-shadow: 0 0 150px rgba(255, 215, 0, 0.5), inset 0 0 100px rgba(255, 215, 0, 0.2);
      }
      
      /* Loading Text Reveal */
      .loading-text-reveal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        animation: loading-text-appear 3s ease-out 7s forwards;
        z-index: 5;
        text-align: center;
      }
      
      .loading-title {
        font-size: 3rem;
        font-weight: 900;
        background: linear-gradient(45deg, #FFD700, #FFA500, #FF8C00, #FFD700);
        background-size: 400% 400%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 60px rgba(255, 215, 0, 0.8);
        margin-bottom: 1.5rem;
        animation: text-gradient-flow 3s ease-in-out infinite, text-glow-pulse 4s ease-in-out infinite;
        filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
      }
      
      .loading-subtitle {
        font-size: 1.4rem;
        font-weight: 600;
        color: #E6E6FA;
        text-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3);
        animation: text-mystical-glow 2.5s ease-in-out infinite alternate;
        letter-spacing: 2px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
      }
      
      @keyframes loading-text-appear {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0) rotateX(90deg) rotateY(180deg);
        }
        20% {
          opacity: 0.2;
          transform: translate(-50%, -50%) scale(0.3) rotateX(60deg) rotateY(120deg);
        }
        40% {
          opacity: 0.5;
          transform: translate(-50%, -50%) scale(0.6) rotateX(30deg) rotateY(60deg);
        }
        60% {
          opacity: 0.7;
          transform: translate(-50%, -50%) scale(0.8) rotateX(15deg) rotateY(30deg);
        }
        80% {
          opacity: 0.9;
          transform: translate(-50%, -50%) scale(1.1) rotateX(-5deg) rotateY(-10deg);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1) rotateX(0deg) rotateY(0deg);
        }
      }
      
      @keyframes text-gradient-flow {
        0%, 100% { 
          background-position: 0% 50%;
        }
        50% { 
          background-position: 100% 50%;
        }
      }
      
      @keyframes text-glow-pulse {
        0%, 100% { 
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 40px rgba(255, 165, 0, 0.4));
          transform: scale(1);
        }
        50% { 
          filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 80px rgba(255, 165, 0, 0.6)) drop-shadow(0 0 120px rgba(255, 140, 0, 0.3));
          transform: scale(1.02);
        }
      }
      
      @keyframes text-mystical-glow {
        0% { 
          opacity: 0.8;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3);
          transform: translateY(0px);
        }
        100% { 
          opacity: 1;
          text-shadow: 0 0 50px rgba(255, 215, 0, 0.8), 0 0 100px rgba(255, 215, 0, 0.5), 0 0 150px rgba(255, 140, 0, 0.3);
          transform: translateY(-3px);
        }
      }
      
      /* Mystical Loading Orbs */
      .mystical-loading-orbs {
        position: fixed;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 15px;
        z-index: 20;
      }
      
      .loading-orb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: radial-gradient(circle, #FFD700, #FFA500);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4);
        animation: orb-pulse 1.5s ease-in-out infinite;
      }
      
      .loading-orb:nth-child(1) { animation-delay: 0s; }
      .loading-orb:nth-child(2) { animation-delay: 0.2s; }
      .loading-orb:nth-child(3) { animation-delay: 0.4s; }
      .loading-orb:nth-child(4) { animation-delay: 0.6s; }
      .loading-orb:nth-child(5) { animation-delay: 0.8s; }
      
      @keyframes orb-pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.6;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4);
        }
        50% {
          transform: scale(1.5);
          opacity: 1;
          box-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 60px rgba(255, 215, 0, 0.6), 0 0 90px rgba(255, 140, 0, 0.3);
        }
      }
      
      @keyframes blade-rotate-and-slide-right {
        0% { 
          transform: translate(-50%, -50%) rotate(0deg) scale(1);
          opacity: 1;
        }
        20% { 
          transform: translate(-50%, -50%) rotate(72deg) scale(1.1);
          opacity: 1;
        }
        40% { 
          transform: translate(-50%, -50%) rotate(144deg) scale(1.3);
          opacity: 0.95;
        }
        60% { 
          transform: translate(-50%, -50%) rotate(216deg) scale(1.6);
          opacity: 0.9;
        }
        70% { 
          transform: translate(-10%, -50%) rotate(288deg) scale(1.8);
          opacity: 0.8;
        }
        85% { 
          transform: translate(100%, -50%) rotate(340deg) scale(2.2);
          opacity: 0.4;
        }
        100% { 
          transform: translate(200%, -50%) rotate(360deg) scale(2.5);
          opacity: 0.1;
        }
      }
      
      @keyframes blade-rotate-and-slide-left {
        0% { 
          transform: translate(-50%, -50%) scaleX(-1) rotate(0deg) scale(1);
          opacity: 0.95;
        }
        20% { 
          transform: translate(-50%, -50%) scaleX(-1) rotate(72deg) scale(1.1);
          opacity: 0.9;
        }
        40% { 
          transform: translate(-50%, -50%) scaleX(-1) rotate(144deg) scale(1.3);
          opacity: 0.85;
        }
        60% { 
          transform: translate(-50%, -50%) scaleX(-1) rotate(216deg) scale(1.6);
          opacity: 0.8;
        }
        70% { 
          transform: translate(-110%, -50%) scaleX(-1) rotate(288deg) scale(1.8);
          opacity: 0.6;
        }
        85% { 
          transform: translate(-200%, -50%) scaleX(-1) rotate(340deg) scale(2.2);
          opacity: 0.3;
        }
        100% { 
          transform: translate(-300%, -50%) scaleX(-1) rotate(360deg) scale(2.5);
          opacity: 0.1;
        }
      }
      
      @keyframes cloud-reveal-expand {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0);
        }
        15% {
          opacity: 0.4;
          transform: translate(-50%, -50%) scale(1);
        }
        30% {
          opacity: 0.7;
          transform: translate(-50%, -50%) scale(3);
        }
        50% {
          opacity: 0.9;
          transform: translate(-50%, -50%) scale(6);
        }
        70% {
          opacity: 0.6;
          transform: translate(-50%, -50%) scale(12);
        }
        85% {
          opacity: 0.3;
          transform: translate(-50%, -50%) scale(18);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(25);
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      const existingStyle = document.getElementById('moon-knight-loading-styles')
      if (existingStyle && existingStyle.parentNode) {
        existingStyle.parentNode.removeChild(existingStyle)
      }
    }
  }, [])

  return (
    <div className="moon-knight-loading-container">
      <div className="moon-knight-loading-bg"></div>
      <div className="container py-12 flex items-center justify-center min-h-[100vh] relative z-10 overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full h-full">
          {/* Crescent Blades Loading Animation */}
          <div className="relative mb-8 w-full h-96 flex items-center justify-center">
            {/* First Crescent Blade - Rotating Clockwise then sliding right */}
            <div className="crescent-blade-container crescent-blade-1">
              <img
                src="https://i.postimg.cc/N06XbzFs/Crescent-Blades-Moon-Knight-PNG.png"
                alt="Crescent Blade"
                className="crescent-blade-image"
              />
            </div>
            
            {/* Second Crescent Blade - Rotating Counter-Clockwise then sliding left */}
            <div className="crescent-blade-container crescent-blade-2">
              <img
                src="https://i.postimg.cc/N06XbzFs/Crescent-Blades-Moon-Knight-PNG.png"
                alt="Crescent Blade"
                className="crescent-blade-image"
              />
            </div>
            
            {/* Cloud Reveal Effect */}
            <div className="cloud-reveal"></div>
            
            {/* Loading Text Reveal */}
            <div className="loading-text-reveal">
              <div className="loading-title">
                Preparing Assessment
              </div>
              <div className="loading-subtitle">
                The shadows gather knowledge
              </div>
            </div>
          </div>
          
          {/* Mystical Loading Orbs */}
          <div className="mystical-loading-orbs">
            <div className="loading-orb"></div>
            <div className="loading-orb"></div>
            <div className="loading-orb"></div>
            <div className="loading-orb"></div>
            <div className="loading-orb"></div>
          </div>
        </div>
      </div>
    </div>
  )
}