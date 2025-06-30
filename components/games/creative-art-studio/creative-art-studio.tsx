"use client"

import { useRef, useState, useEffect } from "react"
import ArtSidebar from "./components/art-sidebar"
import ArtCanvas from "./components/art-canvas"
import type { Element } from "./components/art-canvas"
import { toast } from "@/hooks/use-toast"

type SidebarPosition = "left" | "right" | "top" | "bottom"

const CreativeArtStudio = () => {
  // State
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState("pencil")
  const [zoom, setZoom] = useState(1)
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
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  // Undo/redo history for elements and baseImageData
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [elements, setElements] = useState<Element[]>([])
  const [baseImageData, setBaseImageData] = useState<any>(null)
  const canvasRef = useRef<any>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Save current state to history
  const saveToHistory = (els: Element[], baseImg: any) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ elements: JSON.parse(JSON.stringify(els)), baseImageData: baseImg })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Undo function
  const handleUndo = () => {
    if (historyIndex <= 0) return
    const prev = history[historyIndex - 1]
    setElements(prev.elements)
    setBaseImageData(prev.baseImageData)
    setHistoryIndex(historyIndex - 1)
  }

  // When elements or baseImageData change, save to history
  useEffect(() => {
    if (elements.length === 0 && !baseImageData) return
    saveToHistory(elements, baseImageData)
    // eslint-disable-next-line
  }, [elements, baseImageData])

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

  // Analyse handler
  const handleAnalyse = async () => {
    setIsAnalysing(true)
    setAnalysis(null)
    setSuggestion(null)
    try {
      // Get canvas image as data URL
      const canvas = canvasRef.current?.getCanvas?.() || document.querySelector("canvas")
      if (!canvas) throw new Error("Canvas not found")
      const image = canvas.toDataURL("image/png")
      const res = await fetch("/api/groq-analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalysis(data.analysis)
      setSuggestion(data.suggestion)
      toast({
        title: "Art Analysis",
        description: (
          <div>
            <div><b>Analysis:</b> {data.analysis}</div>
            <div className="mt-1"><b>Suggestion:</b> {data.suggestion}</div>
          </div>
        ),
        duration: 10000,
        variant: "default",
      })
    } catch (e: any) {
      setAnalysis("Analysis failed: " + e.message)
      toast({
        title: "Art Analysis Failed",
        description: e.message,
        duration: 8000,
        variant: "destructive",
      })
    } finally {
      setIsAnalysing(false)
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
        onAnalyse={handleAnalyse}
        isAnalysing={isAnalysing}
        analysis={analysis}
        suggestion={suggestion}
      />

      {/* Canvas */}
      <ArtCanvas
        ref={canvasRef}
        color={color}
        brushSize={brushSize}
        tool={tool}
        zoom={zoom}
        theme={theme}
        isSelectionMode={isSelectionMode}
        rotationAxis={rotationAxis}
        elements={elements}
        setElements={setElements}
        baseImageData={baseImageData}
        setBaseImageData={setBaseImageData}
        onSaveToHistory={saveToHistory}
      />
    </div>
  )
}

export default CreativeArtStudio
