"use client"

import { useState, useEffect } from "react"
import ArtSidebar from "./components/art-sidebar"
import ArtCanvas from "./components/art-canvas"
import type { Element } from "./components/art-canvas"

type SidebarPosition = "left" | "right" | "top" | "bottom"

const CreativeArtStudio = () => {
  // State
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState("pencil")
  const [zoom, setZoom] = useState(1)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [customColors, setCustomColors] = useState<string[]>([])
  const [showStickers, setShowStickers] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [showShapes, setShowShapes] = useState(false)
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>("left")
  const [clipboard, setClipboard] = useState<Element | null>(null)
  const [rotationAxis, setRotationAxis] = useState<"x" | "y" | "z">("z")
  const [activeTab, setActiveTab] = useState("accessories")
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Save current canvas state to history
  const saveToHistory = (imageData: ImageData) => {
    // If we're not at the end of the history, remove future states
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1))
    }

    // Add current state to history
    setHistory((prev) => [...prev, imageData])
    setHistoryIndex((prev) => prev + 1)
  }

  // Undo function
  const handleUndo = () => {
    if (historyIndex <= 0) return
    setHistoryIndex(historyIndex - 1)
  }

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedElement(null)
  }

  // Add custom color to palette
  const addCustomColor = () => {
    if (customColors.includes(color)) return
    setCustomColors((prev) => [...prev, color])
  }

  // Toggle dark mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  // Handle fullscreen
  const handleFullScreen = () => {
    const fs = document.getElementById("gameScreen") as HTMLElement | null
    const isFullScreen = document.fullscreenElement

    if (isFullScreen) {
      document.exitFullscreen().catch((err) => {
        console.log("Exit fullscreen error:", err)
      })
    } else {
      fs?.requestFullscreen().catch((err) => {
        console.log("Request fullscreen error:", err)
      })
    }
  }

  // Layout based on sidebar position
  const getLayoutClasses = () => {
    switch (sidebarPosition) {
      case "left":
        return "flex flex-col md:flex-row"
      case "right":
        return "flex flex-col md:flex-row-reverse"
      case "top":
        return "flex flex-col"
      case "bottom":
        return "flex flex-col-reverse"
      default:
        return "flex flex-col md:flex-row"
    }
  }

  return (
    <div
      id="gameScreen"
      className={`h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100"} ${getLayoutClasses()}`}
    >
      {/* Sidebar */}
      <ArtSidebar
        theme={theme}
        color={color}
        brushSize={brushSize}
        tool={tool}
        zoom={zoom}
        isSelectionMode={isSelectionMode}
        selectedElement={selectedElement}
        clipboard={clipboard}
        customColors={customColors}
        activeTab={activeTab}
        rotationAxis={rotationAxis}
        sidebarPosition={sidebarPosition}
        historyIndex={historyIndex}
        onToolChange={setTool}
        onColorChange={setColor}
        onBrushSizeChange={setBrushSize}
        onZoomChange={setZoom}
        onSelectionModeToggle={toggleSelectionMode}
        onRotationAxisChange={setRotationAxis}
        onRotateElement={(angle) => {
          /* This would be implemented in the canvas component */
        }}
        onDeleteElement={() => {
          /* This would be implemented in the canvas component */
        }}
        onCopyElement={() => {
          /* This would be implemented in the canvas component */
        }}
        onCutElement={() => {
          /* This would be implemented in the canvas component */
        }}
        onPasteElement={() => {
          /* This would be implemented in the canvas component */
        }}
        onAddCustomColor={addCustomColor}
        onAddSticker={(type) => {
          /* This would be implemented in the canvas component */
        }}
        onUndo={handleUndo}
        onSaveImage={() => {
          /* This would be implemented in the canvas component */
        }}
        onToggleTheme={toggleTheme}
        onChangeSidebarPosition={setSidebarPosition}
        onTabChange={setActiveTab}
        onFullScreen={handleFullScreen}
      />

      {/* Canvas */}
      <ArtCanvas
        color={color}
        brushSize={brushSize}
        tool={tool}
        zoom={zoom}
        theme={theme}
        isSelectionMode={isSelectionMode}
        rotationAxis={rotationAxis}
        onSaveToHistory={saveToHistory}
      />
    </div>
  )
}

export default CreativeArtStudio
