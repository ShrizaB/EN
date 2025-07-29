"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Eye, 
  Zap, 
  Loader2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react"

// Mermaid instance
let mermaidInstance: any = null

// Load and initialize Mermaid
const loadMermaid = async () => {
  if (mermaidInstance) return mermaidInstance
  
  try {
    if (typeof window === 'undefined') return null
    
    // Check if mermaid is already loaded via CDN
    if ((window as any).mermaid) {
      mermaidInstance = (window as any).mermaid
      mermaidInstance.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#10b981',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#10b981',
          lineColor: '#10b981',
          secondaryColor: '#1f2937',
          tertiaryColor: '#374151',
        }
      })
      return mermaidInstance
    }
    
    // Fallback to dynamic import
    const mermaid = await import('mermaid')
    mermaidInstance = mermaid.default
    mermaidInstance.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#10b981',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#10b981',
        lineColor: '#10b981',
        secondaryColor: '#1f2937',
        tertiaryColor: '#374151',
      }
    })
    return mermaidInstance
  } catch (error) {
    console.error('Failed to load Mermaid:', error)
    return null
  }
}

interface VisualizationPanelProps {
  topic: string
  isOpen: boolean
  onToggle: () => void
}

interface VisualizationData {
  type: 'mermaid' | 'sketchfab'
  content: string
  title: string
  description: string
  mermaidCode?: string
  sketchfabUrl?: string
  sketchfabId?: string
}

export default function VisualizationPanel({ topic, isOpen, onToggle }: VisualizationPanelProps) {
  const [visualization, setVisualization] = useState<VisualizationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const mermaidRef = useRef<HTMLDivElement>(null)

  // Zoom and pan controls
  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel * 1.2, 3)
    setZoomLevel(newZoom)
    updateSVGTransform(newZoom, panPosition)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel * 0.8, 0.5)
    setZoomLevel(newZoom)
    updateSVGTransform(newZoom, panPosition)
  }

  const handleResetView = () => {
    const newZoom = 1
    const newPan = { x: 0, y: 0 }
    setZoomLevel(newZoom)
    setPanPosition(newPan)
    updateSVGTransform(newZoom, newPan)
  }

  const updateSVGTransform = (zoom: number, pan: { x: number, y: number }) => {
    const svgElement = mermaidRef.current?.querySelector('svg')
    if (svgElement) {
      // Get the container bounds to keep content visible
      const container = mermaidRef.current
      const containerRect = container?.getBoundingClientRect()
      const svgRect = svgElement.getBoundingClientRect()
      
      if (containerRect) {
        // Ensure the SVG origin is preserved and transformations are smooth
        svgElement.style.transformOrigin = 'center center'
        svgElement.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        
        // Ensure SVG is properly sized and positioned
        if (zoom < 1) {
          // When zoomed out, center the content
          svgElement.style.minWidth = '100%'
          svgElement.style.minHeight = '100%'
        }
      }
    }
  }

  // Analyze topic and generate visualization
  const generateVisualization = async (searchTopic: string) => {
    if (!searchTopic.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/chatbot/visualize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: searchTopic }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }
      
      setVisualization(data.visualization)
    } catch (err) {
      setError('Failed to generate visualization')
      console.error('Visualization error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate when topic changes
  useEffect(() => {
    if (topic && isOpen) {
      generateVisualization(topic)
    }
  }, [topic, isOpen])

  // Sanitize and validate Mermaid code
  const sanitizeMermaidCode = (code: string): string => {
    if (!code || !code.trim()) {
      throw new Error('Empty Mermaid code')
    }

    // Remove problematic characters and fix common issues
    let sanitized = code
      .trim()
      // Remove any remaining markdown
      .replace(/```mermaid/g, '')
      .replace(/```/g, '')
      .trim()

    // Check if the code is all on one line (common issue from AI generation)
    if (!sanitized.includes('\n') && sanitized.includes('-->')) {
      // Split the single line into proper Mermaid format with newlines
      // First, ensure flowchart TD is on its own line
      sanitized = sanitized.replace(/^flowchart TD\s*/, 'flowchart TD\n    ')
      
      // Add newlines before each node definition and arrow
      sanitized = sanitized
        // Add newline before each arrow connection
        .replace(/\s+([A-Z]\w*)\s*-->/g, '\n    $1 -->')
        // Add newline before conditional arrows
        .replace(/\s+([A-Z]\w*)\s*--\s*([^-]+)\s*-->/g, '\n    $1 -- $2 -->')
        // Clean up any double newlines
        .replace(/\n\s*\n/g, '\n')
    }

    // Now apply other sanitization rules
    sanitized = sanitized
      // Fix quotes in node labels - remove problematic quotes
      .replace(/\[([^\]]*)"([^"]*)"([^\]]*)\]/g, '[$1$2$3]')
      // Remove special characters that cause parsing issues (but keep basic punctuation)
      .replace(/[^\w\s\[\](){}<>|&;:.,!?+=*\-/]/g, ' ')
      // Fix common syntax issues - clean up conditional arrows
      .replace(/--\s*([^-\n]+)\s*-->/g, ' -- $1 -->')
      // Clean up excessive whitespace while preserving structure
      .replace(/[ \t]+/g, ' ')
      // Remove parentheses from labels that cause issues
      .replace(/\[([^\]]*)\(([^)]*)\)([^\]]*)\]/g, '[$1$2$3]')
      // Fix colon issues in labels
      .replace(/\[([^\]:]*):([^\]]*)\]/g, '[$1 $2]')

    // Validate basic Mermaid syntax
    const lines = sanitized.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) {
      throw new Error('No valid Mermaid content')
    }

    // Check if it has a valid diagram type
    const firstLine = lines[0].trim().toLowerCase()
    const validTypes = ['flowchart', 'graph', 'sequencediagram', 'classDiagram', 'stateDiagram', 'journey', 'gantt', 'pie', 'gitgraph']
    
    if (!validTypes.some(type => firstLine.startsWith(type.toLowerCase()))) {
      // If no diagram type, assume it's a flowchart
      sanitized = `flowchart TD\n${sanitized}`
    }

    // Additional validation - ensure nodes have proper format
    const nodeRegex = /([A-Z]\w*)\[([^\]]*)\]/g
    const arrowRegex = /([A-Z]\w*)\s*-->\s*([A-Z]\w*)/g
    
    if (!nodeRegex.test(sanitized) && !arrowRegex.test(sanitized)) {
      // If the diagram seems malformed, create a simple fallback
      const topic = visualization?.title || 'Process'
      sanitized = `flowchart TD
    A[Start: ${topic}] --> B[Processing]
    B --> C[Analysis]
    C --> D[Complete]`
    }

    console.log('Sanitized Mermaid code:', sanitized)
    return sanitized
  }

  // Render Mermaid diagram
  const renderMermaidDiagram = async (mermaidCode: string) => {
    if (!mermaidRef.current) return

    try {
      const mermaid = await loadMermaid()
      if (!mermaid) {
        throw new Error('Mermaid failed to load')
      }
      
      // Clear previous content
      mermaidRef.current.innerHTML = ''
      
      // Generate unique ID for this diagram
      const diagramId = `mermaid-diagram-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Sanitize and validate mermaid code
      let cleanCode: string
      try {
        cleanCode = sanitizeMermaidCode(mermaidCode)
      } catch (sanitizeError) {
        throw new Error(`Invalid Mermaid syntax: ${sanitizeError instanceof Error ? sanitizeError.message : 'Unknown validation error'}`)
      }
      
      console.log('Rendering Mermaid code:', cleanCode) // Debug log
      
      try {
        // Use mermaid.render instead of init for better error handling
        const { svg } = await mermaid.render(diagramId, cleanCode)
        
        // Create container and insert SVG
        const container = document.createElement('div')
        container.className = 'mermaid-diagram w-full'
        container.innerHTML = svg
        
        mermaidRef.current.appendChild(container)
        
        // Style the SVG based on mode
        const svgElement = container.querySelector('svg')
        if (svgElement) {
          // Remove any fixed dimensions
          svgElement.removeAttribute('width')
          svgElement.removeAttribute('height')
          
          if (isFullscreen) {
            // Fullscreen mode: Enable zoom and pan
            svgElement.style.width = 'auto'
            svgElement.style.height = 'auto'
            svgElement.style.maxWidth = 'none'
            svgElement.style.maxHeight = 'none'
            svgElement.style.display = 'block'
            svgElement.style.margin = '0 auto'
            svgElement.style.background = 'transparent'
            svgElement.style.cursor = 'grab'
            svgElement.style.transition = 'transform 0.2s ease'
            
            // Add zoom and pan functionality for fullscreen
            let isDragging = false
            let startX = 0, startY = 0
            
            // Mouse wheel zoom
            const handleWheel = (e: WheelEvent) => {
              e.preventDefault()
              const delta = e.deltaY > 0 ? 0.9 : 1.1
              const newZoom = Math.min(Math.max(zoomLevel * delta, 0.5), 3)
              setZoomLevel(newZoom)
              updateSVGTransform(newZoom, panPosition)
            }
            
            svgElement.addEventListener('wheel', handleWheel)
            
            // Mouse drag pan
            const handleMouseDown = (e: MouseEvent) => {
              isDragging = true
              startX = e.clientX - panPosition.x
              startY = e.clientY - panPosition.y
              svgElement.style.cursor = 'grabbing'
            }
            
            svgElement.addEventListener('mousedown', handleMouseDown)
            
            document.addEventListener('mousemove', (e) => {
              if (!isDragging) return
              const newPan = {
                x: e.clientX - startX,
                y: e.clientY - startY
              }
              setPanPosition(newPan)
              updateSVGTransform(zoomLevel, newPan)
            })
            
            document.addEventListener('mouseup', () => {
              isDragging = false
              svgElement.style.cursor = 'grab'
            })
            
            // Touch support for mobile
            let lastTouchDistance = 0
            svgElement.addEventListener('touchstart', (e) => {
              if (e.touches.length === 2) {
                const touch1 = e.touches[0]
                const touch2 = e.touches[1]
                lastTouchDistance = Math.hypot(
                  touch2.clientX - touch1.clientX,
                  touch2.clientY - touch1.clientY
                )
              }
            })
            
            svgElement.addEventListener('touchmove', (e) => {
              e.preventDefault()
              if (e.touches.length === 2) {
                const touch1 = e.touches[0]
                const touch2 = e.touches[1]
                const currentDistance = Math.hypot(
                  touch2.clientX - touch1.clientX,
                  touch2.clientY - touch1.clientY
                )
                
                if (lastTouchDistance > 0) {
                  const delta = currentDistance / lastTouchDistance
                  const newZoom = Math.min(Math.max(zoomLevel * delta, 0.5), 3)
                  setZoomLevel(newZoom)
                  updateSVGTransform(newZoom, panPosition)
                }
                lastTouchDistance = currentDistance
              }
            })
          } else {
            // Preview mode: Simple responsive layout with scrolling
            svgElement.style.width = 'auto'
            svgElement.style.height = 'auto'
            svgElement.style.maxWidth = 'none'
            svgElement.style.maxHeight = 'none'
            svgElement.style.display = 'block'
            svgElement.style.minWidth = '100%'
            svgElement.style.minHeight = '400px'
            svgElement.style.background = 'transparent'
            svgElement.style.cursor = 'default'
            
            // Ensure the SVG is fully visible and scrollable
            svgElement.style.minHeight = 'auto'
          }
        }
        
      } catch (renderError) {
        console.error('Mermaid render error:', renderError)
        const errorMessage = renderError instanceof Error ? renderError.message : 'Unknown error'
        
        // Try with a fallback simple diagram
        const fallbackCode = `flowchart TD
    A[Start] --> B[Process]
    B --> C[End]`
        
        try {
          const { svg } = await mermaid.render(`${diagramId}-fallback`, fallbackCode)
          const container = document.createElement('div')
          container.className = 'mermaid-diagram w-full h-full flex items-center justify-center'
          container.innerHTML = `
            <div class="text-center">
              <div class="text-yellow-400 text-sm mb-2">Simplified diagram (original had syntax errors)</div>
              ${svg}
            </div>
          `
          mermaidRef.current.appendChild(container)
        } catch (fallbackError) {
          throw new Error(`Diagram rendering failed: ${errorMessage}`)
        }
      }
      
    } catch (error) {
      console.error('Mermaid rendering error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `
          <div class="text-red-400 p-4 bg-red-900/20 rounded border border-red-500/30">
            <div class="font-mono text-sm mb-2">Diagram Rendering Error:</div>
            <div class="text-xs text-red-300 mb-2">${errorMessage}</div>
            <details class="text-xs text-gray-400">
              <summary class="cursor-pointer hover:text-gray-300">Debug Info</summary>
              <pre class="mt-2 p-2 bg-gray-800 rounded text-xs overflow-auto max-h-32">${mermaidCode}</pre>
            </details>
            <div class="mt-3 text-xs text-gray-400">
              The AI may need to generate better Mermaid syntax.
            </div>
          </div>
        `
      }
    }
  }

  // Effect to render Mermaid when visualization changes
  useEffect(() => {
    if (visualization?.type === 'mermaid' && visualization.mermaidCode) {
      // Reset zoom and pan when new visualization loads
      setZoomLevel(1)
      setPanPosition({ x: 0, y: 0 })
      renderMermaidDiagram(visualization.mermaidCode)
    }
    
    // Cleanup function
    return () => {
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = ''
      }
    }
  }, [visualization])

  // Render Mermaid diagram container
  const renderMermaidContainer = () => {
    return (
      <div className={`w-full h-full bg-gray-900 rounded-lg ${isFullscreen ? 'overflow-hidden' : 'overflow-auto'}`}>
        <div 
          ref={mermaidRef}
          className={`mermaid-container ${isFullscreen ? 'h-full w-full overflow-hidden' : 'min-h-[400px] max-h-[80vh] overflow-auto'} p-4`}
          style={{ 
            background: 'transparent',
            position: 'relative',
            // Add scrollbar styling
            scrollbarWidth: 'thin',
            scrollbarColor: '#10b981 transparent'
          }}
        >
          {/* The Mermaid SVG will be rendered here */}
        </div>
        
        {/* Scrolling hints - only show in preview mode */}
        {!isFullscreen && (
          <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">
            Scroll to explore the full diagram
          </div>
        )}
      </div>
    )
  }

  // Render Sketchfab 3D model
  const renderSketchfab3D = (sketchfabId: string, title: string) => {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
        <iframe
          src={`https://sketchfab.com/models/${sketchfabId}/embed?autostart=1&camera=0&preload=1`}
          width="100%"
          height="100%"
          title={title}
          frameBorder="0"
          allowFullScreen
          className="rounded-lg"
        />
        <div className="absolute bottom-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`https://sketchfab.com/3d-models/${sketchfabId}`, '_blank')}
            className="bg-black/50 hover:bg-black/70 text-white"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View on Sketchfab
          </Button>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onToggle} />
        
        {/* Panel */}
        <div className={`
          ${isFullscreen 
            ? 'fixed inset-4 z-50' 
            : 'relative w-96 h-full'
          }
          bg-gradient-to-b from-gray-900 to-black border-l border-green-500/20
          flex flex-col animate-in slide-in-from-right
        `}>
          {/* Header */}
          <div className="p-4 border-b border-green-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-400" />
              <h2 className="text-lg font-bold text-green-400 font-mono tracking-wider">
                VISUALIZE
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-green-400 hover:text-green-300"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-green-400 hover:text-green-300"
              >
                ×
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-green-400">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="font-mono">Analyzing topic...</p>
                <p className="text-sm text-green-400/60 mt-2">
                  Determining visualization type
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-red-400">
                <AlertCircle className="h-12 w-12 mb-4" />
                <p className="font-mono text-center">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => generateVisualization(topic)}
                  className="mt-4 border-green-500/30 text-green-400 hover:border-green-500/50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : visualization ? (
              <div className="h-full flex flex-col">
                {/* Visualization Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">
                    {visualization.title}
                  </h3>
                  <p className="text-sm text-green-400/80 mb-3">
                    {visualization.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className={`
                      px-3 py-1 rounded-full text-xs font-mono
                      ${visualization.type === 'mermaid' 
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
                        : 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      }
                    `}>
                      {visualization.type === 'mermaid' ? 'PROCESS DIAGRAM' : '3D MODEL'}
                    </div>
                    <Zap className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>

                {/* Visualization Content */}
                <div className="flex-1 relative">
                  {visualization.type === 'mermaid' && visualization.mermaidCode ? (
                    <div className="h-full relative">
                      {renderMermaidContainer()}
                      
                      {/* Zoom Controls - Show ONLY in fullscreen mode */}
                      {isFullscreen && (
                        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomIn}
                            className="bg-black/50 hover:bg-black/70 text-green-400 hover:text-green-300 p-2"
                            title="Zoom In"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomOut}
                            className="bg-black/50 hover:bg-black/70 text-green-400 hover:text-green-300 p-2"
                            title="Zoom Out"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetView}
                            className="bg-black/50 hover:bg-black/70 text-green-400 hover:text-green-300 p-2"
                            title="Reset View"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          
                          {/* Zoom indicator */}
                          <div className="bg-black/50 text-green-400 text-xs px-2 py-1 rounded text-center">
                            {Math.round(zoomLevel * 100)}%
                          </div>
                          
                          {/* Help text for interactions */}
                          <div className="bg-black/70 text-gray-300 text-xs px-2 py-1 rounded max-w-[150px] text-center">
                            Scroll: Zoom<br/>
                            Drag: Pan
                          </div>
                        </div>
                      )}
                    </div>
                  ) : visualization.type === 'sketchfab' && visualization.sketchfabId ? (
                    renderSketchfab3D(visualization.sketchfabId, visualization.title)
                  ) : (
                    <div className="flex items-center justify-center h-full text-green-400/60">
                      <p className="font-mono">No visualization available</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-green-400/60">
                <Eye className="h-16 w-16 mb-4 opacity-50" />
                <p className="font-mono text-center">
                  Ask about something to visualize
                </p>
                <p className="text-sm text-center mt-2">
                  Processes, workflows, objects, or concepts
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Initialize Mermaid CDN script
if (typeof window !== 'undefined' && !document.getElementById('mermaid-script')) {
  const script = document.createElement('script')
  script.id = 'mermaid-script'
  script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js'
  script.onload = () => {
    if ((window as any).mermaid) {
      (window as any).mermaid.initialize({ 
        startOnLoad: false, // Important: set to false to prevent auto-initialization
        theme: 'dark',
        themeVariables: {
          primaryColor: '#10b981',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#10b981',
          lineColor: '#10b981',
          secondaryColor: '#1f2937',
          tertiaryColor: '#374151'
        }
      })
    }
  }
  script.onerror = () => {
    console.warn('Failed to load Mermaid from CDN, will fallback to dynamic import')
  }
  document.head.appendChild(script)
}