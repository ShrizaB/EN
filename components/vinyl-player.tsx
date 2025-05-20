"use client"

import { useState, useRef, useEffect } from "react"
import { FaPlay, FaPause, FaExclamationTriangle } from "react-icons/fa"

export default function VinylPlayer() {
  const [isPlaying, setIsPlaying] = useState(false) // Start paused to respect autoplay policies
  const [currentSong, setCurrentSong] = useState(1)
  const [audioError, setAudioError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [audioLoaded, setAudioLoaded] = useState(false)

  const audioRef1 = useRef<HTMLAudioElement | null>(null)
  const audioRef2 = useRef<HTMLAudioElement | null>(null)

  const handlePlayError = (error: Error) => {
    console.error("Audio playback error:", error)
    setAudioError(true)
    setErrorMessage(`Playback error: ${error.message}`)
    setIsPlaying(false)
    setIsLoading(false)
  }

  const attemptAutoplay = async () => {
    try {
      if (!audioRef1.current) {
        console.log("Audio ref is not available yet")
        return
      }

      // Increase autoplay chances by starting muted
      audioRef1.current.muted = true
      console.log("Attempting autoplay with muted audio")
      
      await audioRef1.current.play()
      
      // If successful, unmute
      audioRef1.current.muted = false
      setIsPlaying(true)
      console.log("Autoplay successful")
    } catch (error) {
      console.log("Autoplay prevented:", error)
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Create audio elements
    const audio1 = document.createElement("audio")
    const audio2 = document.createElement("audio")

    // Set attributes
    audio1.preload = "auto"
    audio2.preload = "auto"
    audio1.volume = 0.8 // Start slightly lower for better crossfade
    audio2.volume = 0

    // Event handlers
    const handleError = (e: Event) => {
      console.error("Error loading audio:", e)
      setAudioError(true)
      setErrorMessage("Could not load audio files. Please refresh the page.")
      setIsLoading(false)
    }

    const handleCanPlay1 = () => {
      console.log("Audio 1 can play")
      setAudioLoaded(true)
      
      // Only attempt autoplay if not on mobile
      if (!isMobile) {
        attemptAutoplay()
      } else {
        setIsLoading(false)
      }
    }

    const handleCanPlay2 = () => {
      console.log("Audio 2 can play")
    }

    // Set up event listeners
    audio1.addEventListener("error", handleError)
    audio2.addEventListener("error", handleError)
    audio1.addEventListener("canplay", handleCanPlay1)
    audio2.addEventListener("canplay", handleCanPlay2)

    // Handle song transition with crossfade
    audio1.addEventListener("ended", () => {
      if (!audioRef2.current) return

      console.log("Audio 1 ended, crossfading to audio 2")
      
      const fadeDuration = 1500 // 1.5 second crossfade
      const fadeInterval = 50
      const steps = fadeDuration / fadeInterval
      const stepSize = 0.8 / steps // Starting from 0.8 volume

      const fade = setInterval(() => {
        if (audio1.volume > 0) audio1.volume -= stepSize
        if (audioRef2.current!.volume < 0.8) audioRef2.current!.volume += stepSize
        
        if (audio1.volume <= 0) {
          clearInterval(fade)
          audio1.pause()
          setCurrentSong(2)
        }
      }, fadeInterval)

      audioRef2.current.play().catch(handlePlayError)
    })

    // Set audio sources
    audio1.src = "/sounds/marvel-intro.mp3"
    audio2.src = "/sounds/marvel-anthem.mp3"

    // Store refs
    audioRef1.current = audio1
    audioRef2.current = audio2

    // Configure looping
    audio2.loop = true

    // Load audio
    audio1.load()
    audio2.load()

    // Cleanup function
    return () => {
      audio1.pause()
      audio2.pause()
      audio1.removeEventListener("ended", () => {})
      audio1.removeEventListener("error", handleError)
      audio1.removeEventListener("canplay", handleCanPlay1)
      audio2.removeEventListener("error", handleError)
      audio2.removeEventListener("canplay", handleCanPlay2)
    }
  }, [])

  // User interaction handler for unlocking audio
  useEffect(() => {
    let hasInteracted = false

    const handleUserInteraction = () => {
      if (!hasInteracted && !isPlaying && !audioError && audioLoaded) {
        console.log("User interaction detected, attempting playback")
        hasInteracted = true
        
        // Try to play the current song based on state
        if (currentSong === 1 && audioRef1.current) {
          audioRef1.current.play()
            .then(() => setIsPlaying(true))
            .catch(handlePlayError)
        } else if (audioRef2.current) {
          audioRef2.current.play()
            .then(() => setIsPlaying(true))
            .catch(handlePlayError)
        }

        // Remove listeners
        cleanup()
      }
    }

    const cleanup = () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)
    document.addEventListener("keydown", handleUserInteraction)

    return cleanup
  }, [isPlaying, audioError, audioLoaded, currentSong])

  const togglePlayPause = () => {
    if (audioError || isLoading) return

    try {
      if (isPlaying) {
        // Pause current song
        if (currentSong === 1 && audioRef1.current) {
          audioRef1.current.pause()
        } else if (audioRef2.current) {
          audioRef2.current.pause()
        }
        setIsPlaying(false)
      } else {
        // Play current song
        if (currentSong === 1 && audioRef1.current) {
          audioRef1.current.play().catch(handlePlayError)
        } else if (audioRef2.current) {
          audioRef2.current.play().catch(handlePlayError)
        }
        setIsPlaying(true)
      }
    } catch (error) {
      handlePlayError(error as Error)
    }
  }

  return (
    <div className="w-40 h-40 fixed bottom-10 right-12 z-50">
      {/* Vinyl record shadow */}
      <div className="absolute inset-0 rounded-full bg-black/20 blur-xl transform -translate-x-2 translate-y-2"></div>

      {/* Vinyl record */}
      <div
        className={`w-full h-full rounded-full flex items-center justify-center 
          ${isPlaying && !audioError ? "animate-spin-slow" : "transition-all duration-700"}
          shadow-[0_0_30px_rgba(0,0,0,0.7)] border-4 border-black/40
          ${audioError ? "opacity-70" : ""}
        `}
        style={{
          background: `
            linear-gradient(30deg, transparent 40%, rgba(42, 41, 40, 0.85) 40%) no-repeat 100% 0,
            linear-gradient(60deg, rgba(42, 41, 40, 0.85) 60%, transparent 60%) no-repeat 0 100%,
            repeating-radial-gradient(#2a2928 0 3px, #ada9a0 4px, #2a2928 5px)
          `,
          backgroundSize: "50% 100%, 100% 50%, 100% 100%",
        }}
      >
        {/* Vinyl grooves */}
        <div className="absolute inset-0 rounded-full opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/20"
              style={{
                top: `${10 + i * 10}%`,
                left: `${10 + i * 10}%`,
                right: `${10 + i * 10}%`,
                bottom: `${10 + i * 10}%`,
              }}
            />
          ))}
        </div>

        {/* Vinyl center */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 rounded-full border-2 border-[#FF4C4C] opacity-60 animate-pulse" />
          <div className="absolute w-10 h-10 rounded-full border-2 border-[#ff9900c6]" />
          <div className="rounded-full h-8 w-8 bg-[#E2001A] shadow-[0_0_10px_3px_#FF4C4C] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-black/40"></div>
          </div>
        </div>

        {/* Error overlay */}
        {audioError && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <FaExclamationTriangle className="text-yellow-400 text-3xl" />
          </div>
        )}
      </div>

      {/* Play/Pause button */}
      <button
        onClick={togglePlayPause}
        disabled={isLoading || audioError}
        aria-label={isPlaying ? "Pause" : "Play"}
        className={`
          absolute -bottom-2 -left-2
          w-12 h-12 bg-gradient-to-br from-[#FF4C4C] to-[#E2001A] rounded-full 
          flex items-center justify-center text-white text-xl shadow-lg z-20 
          transition-all duration-300 ease-in-out hover:scale-110
          border-2 border-white/20 hover:border-white/40
          ${isPlaying && !audioError ? "animate-pulse-subtle" : ""}
          ${audioError ? "opacity-70" : ""}
          ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : isPlaying ? (
          <FaPause />
        ) : (
          <FaPlay className="ml-1" />
        )}
      </button>

      {/* Stylus arm */}
      <div
        className={`absolute top-[35%] -right-12 w-24 h-[4px] bg-gradient-to-r from-gray-400 to-gray-600 
          border-2 border-black rounded-md origin-right transition-all duration-700 ease-in-out
          shadow-md
          ${isPlaying && !audioError ? "rotate-[15deg]" : "rotate-[60deg]"}
        `}
      >
        <div className="w-3 h-6 bg-gradient-to-b from-black to-gray-800 border border-white/30 absolute left-0 top-[-8px] rounded-sm shadow-md" />
      </div>

      {/* Error message */}
      {audioError && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-3 py-1 rounded-lg text-xs max-w-xs text-center">
          {errorMessage}
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-pulse-subtle {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  )
}