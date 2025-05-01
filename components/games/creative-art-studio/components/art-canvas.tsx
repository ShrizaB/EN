"use client"

import type React from "react"
import { useRef, useState, useEffect, useCallback } from "react"

export type Element = {
  id: string
  type: string
  points: { x: number; y: number }[]
  color: string
  size: number
  width?: number
  height?: number
  rotation?: {
    x: number
    y: number
    z: number
  }
}

export type ResizeHandle =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "rotation"
  | false

interface ArtCanvasProps {
  color: string
  brushSize: number
  tool: string
  zoom: number
  theme: "light" | "dark"
  isSelectionMode: boolean
  rotationAxis: "x" | "y" | "z"
  onSaveToHistory: (imageData: ImageData) => void
}

const ArtCanvas = ({
  color,
  brushSize,
  tool,
  zoom,
  theme,
  isSelectionMode,
  rotationAxis,
  onSaveToHistory,
}: ArtCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [elements, setElements] = useState<Element[]>([])
  const [resizing, setResizing] = useState<ResizeHandle>(false)
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 })
  const [clipboard, setClipboard] = useState<Element | null>(null)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size based on container
    const updateCanvasSize = () => {
      if (canvas && containerRef.current) {
        const container = containerRef.current
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        // Set canvas size based on container dimensions
        canvas.width = Math.min(1200, containerWidth - 40)
        canvas.height = Math.min(800, containerHeight - 40)

        // Redraw canvas after resize
        if (ctx) {
          ctx.fillStyle = theme === "dark" ? "black" : "white"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          redrawCanvas()
        }
      }
    }

    // Initial size
    updateCanvasSize()

    // Add resize listener
    window.addEventListener("resize", updateCanvasSize)

    // Get context
    const context = canvas.getContext("2d")
    if (context) {
      context.lineCap = "round"
      context.lineJoin = "round"
      context.strokeStyle = color
      context.lineWidth = brushSize
      setCtx(context)

      // Initialize with white background
      context.fillStyle = theme === "dark" ? "black" : "white"
      context.fillRect(0, 0, canvas.width, canvas.height)

      // Save initial state to history
      if (canvas) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        onSaveToHistory(imageData)
      }
    }

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [])

  // Update canvas background when theme changes
  useEffect(() => {
    if (!ctx || !canvasRef.current) return

    // Save current image data
    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Clear canvas with new background color
    ctx.fillStyle = theme === "dark" ? "black" : "white"
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Put image data back
    ctx.putImageData(imageData, 0, 0)

    // Redraw all elements
    redrawCanvas()
  }, [theme])

  // Update context when color or brush size changes
  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
    }
  }, [color, brushSize, ctx])

  // Add keyboard event listener for delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedElement !== null) {
        deleteSelectedElement()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedElement])

  // Add keyboard shortcut handlers for copy, cut, paste
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedElement !== null) {
        // Delete key
        if (e.key === "Delete") {
          deleteSelectedElement()
        }

        // Copy (Ctrl+C or Cmd+C)
        if ((e.ctrlKey || e.metaKey) && e.key === "c") {
          e.preventDefault()
          copySelectedElement()
        }

        // Cut (Ctrl+X or Cmd+X)
        if ((e.ctrlKey || e.metaKey) && e.key === "x") {
          e.preventDefault()
          cutSelectedElement()
        }

        // Paste (Ctrl+V or Cmd+V)
        if ((e.ctrlKey || e.metaKey) && e.key === "v" && clipboard) {
          e.preventDefault()
          pasteElement()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedElement, clipboard])

  // Add a useEffect to handle auto-deselection after 5 seconds of inactivity
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (selectedElement !== null) {
      timer = setTimeout(() => {
        // Only clear the selection, don't modify the elements
        setSelectedElement(null)
        // Just redraw the canvas to remove selection handles
        if (ctx && canvasRef.current) {
          redrawCanvas()
        }
      }, 5000) // Changed to 5 seconds
    }

    // Clear the timer when component unmounts or selection changes
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [selectedElement])

  // Redraw all elements on canvas
  const redrawCanvas = useCallback(() => {
    if (!ctx || !canvasRef.current) return

    const canvas = canvasRef.current

    // Clear canvas
    ctx.fillStyle = theme === "dark" ? "black" : "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Redraw all elements
    elements.forEach((element) => {
      drawElement(element)
    })
  }, [ctx, elements, theme])

  // Draw a single element
  const drawElement = (element: Element) => {
    if (!ctx) return

    ctx.save()
    ctx.strokeStyle = element.color
    ctx.fillStyle = element.color
    ctx.lineWidth = element.size

    // Apply rotation if available
    if (element.rotation) {
      const centerX = element.points.reduce((sum, p) => sum + p.x, 0) / element.points.length
      const centerY = element.points.reduce((sum, p) => sum + p.y, 0) / element.points.length

      ctx.translate(centerX, centerY)
      ctx.rotate((element.rotation.z * Math.PI) / 180)

      // For 3D-like effect with X and Y rotation
      if (element.rotation.x !== 0) {
        ctx.scale(1, Math.cos((element.rotation.x * Math.PI) / 180))
      }

      if (element.rotation.y !== 0) {
        ctx.scale(Math.cos((element.rotation.y * Math.PI) / 180), 1)
      }

      ctx.translate(-centerX, -centerY)
    }

    // Draw based on element type
    if (element.type === "pencil" || element.type === "eraser" || element.type === "spray") {
      if (element.points.length < 2) return

      ctx.beginPath()
      ctx.moveTo(element.points[0].x, element.points[0].y)

      for (let i = 1; i < element.points.length; i++) {
        ctx.lineTo(element.points[i].x, element.points[i].y)
      }

      ctx.stroke()
    } else if (element.type === "square" || element.type === "rectangle") {
      if (element.points.length < 2) return

      const width = element.width || Math.abs(element.points[1].x - element.points[0].x)
      const height = element.height || Math.abs(element.points[2].y - element.points[1].y)

      ctx.beginPath()
      ctx.rect(element.points[0].x, element.points[0].y, width, height)
      ctx.stroke()
    } else if (element.type === "circle") {
      if (element.points.length < 1) return

      const radius = element.width ? element.width / 2 : 30

      ctx.beginPath()
      ctx.arc(element.points[0].x, element.points[0].y, radius, 0, Math.PI * 2)
      ctx.stroke()
    } else if (element.type === "triangle") {
      if (element.points.length < 3) return

      ctx.beginPath()
      ctx.moveTo(element.points[0].x, element.points[0].y)
      ctx.lineTo(element.points[1].x, element.points[1].y)
      ctx.lineTo(element.points[2].x, element.points[2].y)
      ctx.closePath()
      ctx.stroke()
    } else if (element.type === "star") {
      if (element.points.length < 1) return

      const size = element.width || 50
      drawStar(element.points[0].x, element.points[0].y, 5, size, size / 2)
    } else if (element.type === "heart") {
      if (element.points.length < 1) return

      const size = element.width || 50
      drawHeart(element.points[0].x, element.points[0].y, size)
    } else if (element.type === "flower") {
      if (element.points.length < 1) return

      const size = element.width || 50
      drawFlower(element.points[0].x, element.points[0].y, size)
    } else if (element.type === "rainbow") {
      if (element.points.length < 1) return

      const size = element.width || 100
      drawRainbow(element.points[0].x, element.points[0].y, size)
    } else if (element.type === "line") {
      if (element.points.length < 2) return

      ctx.beginPath()
      ctx.moveTo(element.points[0].x, element.points[0].y)
      ctx.lineTo(element.points[1].x, element.points[1].y)
      ctx.stroke()
    } else if (element.type === "bendableLine") {
      if (element.points.length < 3) return

      ctx.beginPath()
      ctx.moveTo(element.points[0].x, element.points[0].y)
      ctx.quadraticCurveTo(element.points[2].x, element.points[2].y, element.points[1].x, element.points[1].y)
      ctx.stroke()
    }

    // Draw selection handles if element is selected
    if (selectedElement === element.id) {
      drawSelectionHandles(element)
    }

    ctx.restore()
  }

  // Draw heart shape
  const drawHeart = (x: number, y: number, size: number) => {
    if (!ctx) return

    const width = size
    const height = size

    ctx.beginPath()
    ctx.moveTo(x, y + height / 4)

    // Left curve
    ctx.bezierCurveTo(x - width / 2, y - height / 2, x - width, y + height / 4, x, y + height)

    // Right curve
    ctx.bezierCurveTo(x + width, y + height / 4, x + width / 2, y - height / 2, x, y + height / 4)

    ctx.stroke()
  }

  // Draw flower shape
  const drawFlower = (x: number, y: number, size: number) => {
    if (!ctx) return

    const petalSize = size / 2
    const numPetals = 6

    // Draw petals
    for (let i = 0; i < numPetals; i++) {
      const angle = (i * 2 * Math.PI) / numPetals
      const petalX = x + Math.cos(angle) * petalSize
      const petalY = y + Math.sin(angle) * petalSize

      ctx.beginPath()
      ctx.ellipse((x + petalX) / 2, (y + petalY) / 2, petalSize / 2, petalSize / 4, angle, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Draw center
    ctx.beginPath()
    ctx.arc(x, y, size / 6, 0, 2 * Math.PI)
    ctx.stroke()
  }

  // Draw rainbow shape
  const drawRainbow = (x: number, y: number, size: number) => {
    if (!ctx) return

    const numArcs = 5
    const arcWidth = size / numArcs

    for (let i = 0; i < numArcs; i++) {
      ctx.beginPath()
      ctx.arc(x, y + size / 2, size - i * arcWidth, Math.PI, 0, true)
      ctx.stroke()
    }
  }

  // Draw selection handles for the selected element
  const drawSelectionHandles = (element: Element) => {
    if (!ctx) return

    // Calculate bounding box
    let minX = Number.POSITIVE_INFINITY,
      minY = Number.POSITIVE_INFINITY,
      maxX = Number.NEGATIVE_INFINITY,
      maxY = Number.NEGATIVE_INFINITY

    element.points.forEach((point) => {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    })

    // For circle and other centered elements, adjust bounding box
    if (
      element.type === "circle" ||
      element.type === "star" ||
      element.type === "heart" ||
      element.type === "flower" ||
      element.type === "rainbow"
    ) {
      const radius = element.width ? element.width / 2 : 30
      minX = element.points[0].x - radius
      minY = element.points[0].y - radius
      maxX = element.points[0].x + radius
      maxY = element.points[0].y + radius
    }

    const width = maxX - minX
    const height = maxY - minY

    // Draw bounding box with improved styling
    ctx.strokeStyle = "#00AAFF"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(minX, minY, width, height)
    ctx.setLineDash([])

    // Draw resize handles with improved styling
    const handleSize = 12
    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2

    // Helper function to draw a handle with border
    const drawHandle = (x: number, y: number, cursorClass: string) => {
      ctx.beginPath()
      ctx.arc(x, y, handleSize / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    // Corner handles
    drawHandle(minX, minY, "cursor-nwse-resize") // Top-left
    drawHandle(maxX, minY, "cursor-nesw-resize") // Top-right
    drawHandle(minX, maxY, "cursor-nesw-resize") // Bottom-left
    drawHandle(maxX, maxY, "cursor-nwse-resize") // Bottom-right

    // Middle handles
    drawHandle(minX + width / 2, minY, "cursor-ns-resize") // Top
    drawHandle(minX + width / 2, maxY, "cursor-ns-resize") // Bottom
    drawHandle(minX, minY + height / 2, "cursor-ew-resize") // Left
    drawHandle(maxX, minY + height / 2, "cursor-ew-resize") // Right

    // Rotation handle with improved styling
    ctx.beginPath()
    ctx.moveTo(minX + width / 2, minY - 5)
    ctx.lineTo(minX + width / 2, minY - 20)
    ctx.stroke()

    ctx.fillStyle = "#00AAFF"
    drawHandle(minX + width / 2, minY - 20, "cursor-grab")
  }

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    if (isSelectionMode) {
      // Check if clicking on a resize handle of the selected element
      if (selectedElement !== null) {
        const element = elements.find((el) => el.id === selectedElement)
        if (element) {
          const isOnHandle = checkIfOnResizeHandle(element, x, y)
          if (isOnHandle) {
            setResizing(isOnHandle)
            setResizeStartPos({ x, y })
            return
          }
        }
      }

      // Try to select an element
      const clickedElement = findElementAt(x, y)

      if (clickedElement) {
        setSelectedElement(clickedElement.id)
        setDragStart({ x, y })
        // The timer will be reset automatically when selectedElement changes
      } else {
        // Deselect when clicking on empty canvas area
        setSelectedElement(null)
        redrawCanvas()
      }
      return
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)

    // Create a new element based on the tool
    let newElement: Element | null = null

    if (tool === "pencil" || tool === "eraser" || tool === "spray") {
      newElement = {
        id: generateId(),
        type: tool,
        points: [{ x, y }],
        color: tool === "eraser" ? (theme === "dark" ? "black" : "white") : color,
        size: brushSize,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (tool === "square") {
      newElement = {
        id: generateId(),
        type: "square",
        points: [
          { x, y },
          { x: x + 50, y },
          { x: x + 50, y: y + 50 },
          { x, y: y + 50 },
        ],
        color: color,
        size: brushSize,
        width: 50,
        height: 50,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (tool === "rectangle") {
      newElement = {
        id: generateId(),
        type: "rectangle",
        points: [
          { x, y },
          { x: x + 80, y },
          { x: x + 80, y: y + 50 },
          { x, y: y + 50 },
        ],
        color: color,
        size: brushSize,
        width: 80,
        height: 50,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (tool === "circle") {
      newElement = {
        id: generateId(),
        type: "circle",
        points: [{ x, y }],
        color: color,
        size: brushSize,
        width: 60,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (tool === "triangle") {
      newElement = {
        id: generateId(),
        type: "triangle",
        points: [
          { x, y: y - 50 },
          { x: x + 50, y: y + 50 },
          { x: x - 50, y: y + 50 },
        ],
        color: color,
        size: brushSize,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (tool === "star") {
      newElement = {
        id: generateId(),
        type: "star",
        points: [{ x, y }],
        color: color,
        size: brushSize,
        width: 60,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (tool === "line") {
      newElement = {
        id: generateId(),
        type: "line",
        points: [
          { x, y },
          { x: x + 50, y: y + 50 },
        ],
        color: color,
        size: brushSize,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (tool === "bendableLine") {
      newElement = {
        id: generateId(),
        type: "bendableLine",
        points: [
          { x, y },
          { x: x + 50, y: y + 50 },
          { x: x + 25, y: y - 25 }, // Control point
        ],
        color: color,
        size: brushSize,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (tool === "bucket") {
      fillArea(x, y)
      return
    }

    if (newElement) {
      setElements((prev) => [...prev, newElement!])
      drawElement(newElement)
    }
  }

  // Find element at position
  const findElementAt = (x: number, y: number) => {
    // Check in reverse order (top elements first)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i]

      if (element.type === "circle") {
        const radius = element.width ? element.width / 2 : 30
        const distance = Math.sqrt(Math.pow(x - element.points[0].x, 2) + Math.pow(y - element.points[0].y, 2))
        if (distance <= radius + 5) return element
      } else if (element.type === "square" || element.type === "rectangle") {
        const minX = Math.min(...element.points.map((p) => p.x))
        const maxX = Math.max(...element.points.map((p) => p.x))
        const minY = Math.min(...element.points.map((p) => p.y))
        const maxY = Math.max(...element.points.map((p) => p.y))

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) return element
      } else if (element.type === "triangle") {
        // Simple triangle hit test
        const [p1, p2, p3] = element.points

        // Check if point is inside triangle using barycentric coordinates
        const area = 0.5 * Math.abs(p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y))

        const s = (1 / (2 * area)) * (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * x + (p1.x - p3.x) * y)
        const t = (1 / (2 * area)) * (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * x + (p2.x - p1.x) * y)

        if (s >= 0 && t >= 0 && 1 - s - t >= 0) return element
      } else if (
        element.type === "star" ||
        element.type === "heart" ||
        element.type === "flower" ||
        element.type === "rainbow"
      ) {
        // Approximate with center and radius
        const distance = Math.sqrt(Math.pow(x - element.points[0].x, 2) + Math.pow(y - element.points[0].y, 2))
        const radius = element.width ? element.width / 2 : 50
        if (distance <= radius) return element
      } else if (element.type === "pencil" || element.type === "eraser" || element.type === "spray") {
        // Check if point is near any line segment
        for (let j = 1; j < element.points.length; j++) {
          const p1 = element.points[j - 1]
          const p2 = element.points[j]

          const distance = distanceToLineSegment(p1.x, p1.y, p2.x, p2.y, x, y)
          if (distance < element.size + 5) return element
        }
      } else if (element.type === "line") {
        const distance = distanceToLineSegment(
          element.points[0].x,
          element.points[0].y,
          element.points[1].x,
          element.points[1].y,
          x,
          y,
        )
        if (distance < element.size + 5) return element
      } else if (element.type === "bendableLine") {
        // Approximate the curve with line segments
        const steps = 10
        for (let j = 0; j < steps; j++) {
          const t1 = j / steps
          const t2 = (j + 1) / steps

          const p1 = quadraticBezierPoint(element.points[0], element.points[2], element.points[1], t1)
          const p2 = quadraticBezierPoint(element.points[0], element.points[2], element.points[1], t2)

          const distance = distanceToLineSegment(p1.x, p1.y, p2.x, p2.y, x, y)
          if (distance < element.size + 5) return element
        }
      }
    }

    return null
  }

  // Calculate point on quadratic bezier curve
  const quadraticBezierPoint = (
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    t: number,
  ) => {
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y
    return { x, y }
  }

  // Calculate distance from point to line segment
  const distanceToLineSegment = (x1: number, y1: number, x2: number, y2: number, x: number, y: number) => {
    const A = x - x1
    const B = y - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1

    if (lenSq !== 0) param = dot / lenSq

    let xx, yy

    if (param < 0) {
      xx = x1
      yy = y1
    } else if (param > 1) {
      xx = x2
      yy = y2
    } else {
      xx = x1 + param * C
      yy = y1 + param * D
    }

    const dx = x - xx
    const dy = y - yy

    return Math.sqrt(dx * dx + dy * dy)
  }

  // Check if point is on resize handle
  const checkIfOnResizeHandle = (element: Element, x: number, y: number): ResizeHandle => {
    // Calculate bounding box
    let minX = Number.POSITIVE_INFINITY,
      minY = Number.POSITIVE_INFINITY,
      maxX = Number.NEGATIVE_INFINITY,
      maxY = Number.NEGATIVE_INFINITY

    element.points.forEach((point) => {
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)
    })

    // For circle and other centered elements, adjust bounding box
    if (
      element.type === "circle" ||
      element.type === "star" ||
      element.type === "heart" ||
      element.type === "flower" ||
      element.type === "rainbow"
    ) {
      const radius = element.width ? element.width / 2 : 30
      minX = element.points[0].x - radius
      minY = element.points[0].y - radius
      maxX = element.points[0].x + radius
      maxY = element.points[0].y + radius
    }

    const width = maxX - minX
    const height = maxY - minY
    const handleSize = 14 // Larger handle size for easier grabbing

    // Helper function to check if point is near a handle position
    const isNearPoint = (px: number, py: number) => {
      return Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2)) <= handleSize / 2
    }

    // Check corner handles
    if (isNearPoint(minX, minY)) return "top-left"
    if (isNearPoint(maxX, minY)) return "top-right"
    if (isNearPoint(minX, maxY)) return "bottom-left"
    if (isNearPoint(maxX, maxY)) return "bottom-right"

    // Check middle handles
    if (isNearPoint(minX + width / 2, minY)) return "top"
    if (isNearPoint(minX + width / 2, maxY)) return "bottom"
    if (isNearPoint(minX, minY + height / 2)) return "left"
    if (isNearPoint(maxX, minY + height / 2)) return "right"

    // Check rotation handle
    if (isNearPoint(minX + width / 2, minY - 20)) {
      return "rotation"
    }

    return false
  }

  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    if (isSelectionMode) {
      if (resizing && selectedElement !== null) {
        // Handle resizing
        const element = elements.find((el) => el.id === selectedElement)
        if (!element) return

        // Calculate the movement delta
        const dx = x - resizeStartPos.x
        const dy = y - resizeStartPos.y

        if (resizing === "rotation") {
          // Handle rotation
          const centerX = element.points.reduce((sum, p) => sum + p.x, 0) / element.points.length
          const centerY = element.points.reduce((sum, p) => sum + p.y, 0) / element.points.length

          // Calculate angle
          const angle1 = Math.atan2(resizeStartPos.y - centerY, resizeStartPos.x - centerX)
          const angle2 = Math.atan2(y - centerY, x - centerX)
          const angleDiff = (angle2 - angle1) * (180 / Math.PI)

          // Update element rotation
          setElements((prev) =>
            prev.map((el) => {
              if (el.id === selectedElement) {
                return {
                  ...el,
                  rotation: {
                    ...el.rotation!,
                    [rotationAxis]: el.rotation![rotationAxis] + angleDiff,
                  },
                }
              }
              return el
            }),
          )

          // Update start position for next frame
          setResizeStartPos({ x, y })
        } else {
          // Get the current element's bounding box
          let minX = Number.POSITIVE_INFINITY,
            minY = Number.POSITIVE_INFINITY,
            maxX = Number.NEGATIVE_INFINITY,
            maxY = Number.NEGATIVE_INFINITY

          element.points.forEach((point) => {
            minX = Math.min(minX, point.x)
            minY = Math.min(minY, point.y)
            maxX = Math.max(maxX, point.x)
            maxY = Math.max(maxY, point.y)
          })

          // For circle and other centered elements, adjust bounding box
          if (
            element.type === "circle" ||
            element.type === "star" ||
            element.type === "heart" ||
            element.type === "flower" ||
            element.type === "rainbow"
          ) {
            const radius = element.width ? element.width / 2 : 30
            minX = element.points[0].x - radius
            minY = element.points[0].y - radius
            maxX = element.points[0].x + radius
            maxY = element.points[0].y + radius
          }

          const width = maxX - minX
          const height = maxY - minY

          // Calculate new dimensions and position based on which handle is being dragged
          let newWidth = width
          let newHeight = height
          let newX = minX
          let newY = minY

          // Apply changes based on which handle is being dragged
          switch (resizing) {
            case "top-left":
              newX = minX + dx
              newY = minY + dy
              newWidth = width - dx
              newHeight = height - dy
              break
            case "top-right":
              newY = minY + dy
              newWidth = width + dx
              newHeight = height - dy
              break
            case "bottom-left":
              newX = minX + dx
              newWidth = width - dx
              newHeight = height + dy
              break
            case "bottom-right":
              newWidth = width + dx
              newHeight = height + dy
              break
            case "top":
              newY = minY + dy
              newHeight = height - dy
              break
            case "right":
              newWidth = width + dx
              break
            case "bottom":
              newHeight = height + dy
              break
            case "left":
              newX = minX + dx
              newWidth = width - dx
              break
          }

          // Ensure minimum size
          if (newWidth < 10) {
            if (resizing.includes("left")) {
              newX = maxX - 10
            }
            newWidth = 10
          }

          if (newHeight < 10) {
            if (resizing.includes("top")) {
              newY = maxY - 10
            }
            newHeight = 10
          }

          // Update the element with new dimensions
          setElements((prev) =>
            prev.map((el) => {
              if (el.id === selectedElement) {
                if (el.type === "square" || el.type === "rectangle") {
                  return {
                    ...el,
                    width: newWidth,
                    height: newHeight,
                    points: [
                      { x: newX, y: newY },
                      { x: newX + newWidth, y: newY },
                      { x: newX + newWidth, y: newY + newHeight },
                      { x: newX, y: newY + newHeight },
                    ],
                  }
                } else if (
                  el.type === "circle" ||
                  el.type === "star" ||
                  el.type === "heart" ||
                  el.type === "flower" ||
                  el.type === "rainbow"
                ) {
                  // For centered elements, adjust the size and maintain center position
                  const centerX = el.points[0].x
                  const centerY = el.points[0].y

                  // Use the larger dimension for uniform scaling
                  const newSize = Math.max(newWidth, newHeight)

                  return {
                    ...el,
                    width: newSize,
                  }
                } else if (el.type === "triangle") {
                  // For triangle, scale all points relative to the bounding box
                  const scaleX = newWidth / width
                  const scaleY = newHeight / height

                  return {
                    ...el,
                    points: el.points.map((p) => ({
                      x: newX + (p.x - minX) * scaleX,
                      y: newY + (p.y - minY) * scaleY,
                    })),
                  }
                } else if (el.type === "line" || el.type === "bendableLine") {
                  // For lines, scale the endpoints
                  const scaleX = newWidth / width
                  const scaleY = newHeight / height

                  return {
                    ...el,
                    points: el.points.map((p) => ({
                      x: newX + (p.x - minX) * scaleX,
                      y: newY + (p.y - minY) * scaleY,
                    })),
                  }
                } else {
                  // For other elements like pencil strokes
                  const scaleX = newWidth / width
                  const scaleY = newHeight / height

                  return {
                    ...el,
                    points: el.points.map((p) => ({
                      x: newX + (p.x - minX) * scaleX,
                      y: newY + (p.y - minY) * scaleY,
                    })),
                  }
                }
              }
              return el
            }),
          )

          // Update start position for next frame
          setResizeStartPos({ x, y })
        }

        redrawCanvas()
        return
      }

      // Handle dragging selected element
      if (dragStart && selectedElement !== null) {
        const dx = x - dragStart.x
        const dy = y - dragStart.y

        setElements((prev) =>
          prev.map((el) => {
            if (el.id === selectedElement) {
              return {
                ...el,
                points: el.points.map((p) => ({
                  x: p.x + dx,
                  y: p.y + dy,
                })),
              }
            }
            return el
          }),
        )

        setDragStart({ x, y })
        redrawCanvas()
      }

      return
    }

    if (!isDrawing) return

    if (tool === "pencil") {
      ctx.lineTo(x, y)
      ctx.stroke()

      // Add point to current element
      setElements((prev) => {
        const newElements = [...prev]
        const currentElement = newElements[newElements.length - 1]
        if (currentElement && currentElement.type === "pencil") {
          currentElement.points.push({ x, y })
        }
        return newElements
      })
    } else if (tool === "eraser") {
      ctx.save()
      ctx.strokeStyle = theme === "dark" ? "black" : "white"
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.restore()

      // Add point to current element
      setElements((prev) => {
        const newElements = [...prev]
        const currentElement = newElements[newElements.length - 1]
        if (currentElement && currentElement.type === "eraser") {
          currentElement.points.push({ x, y })
        }
        return newElements
      })
    } else if (tool === "spray") {
      for (let i = 0; i < 20; i++) {
        const offsetX = (Math.random() - 0.5) * brushSize * 2
        const offsetY = (Math.random() - 0.5) * brushSize * 2
        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)

        if (distance < brushSize) {
          ctx.beginPath()
          ctx.fillStyle = color
          ctx.arc(x + offsetX, y + offsetY, 1, 0, Math.PI * 2)
          ctx.fill()

          // Add spray points
          setElements((prev) => {
            const newElements = [...prev]
            const currentElement = newElements[newElements.length - 1]
            if (currentElement && currentElement.type === "spray") {
              currentElement.points.push({ x: x + offsetX, y: y + offsetY })
            }
            return newElements
          })
        }
      }
    }
  }

  // Stop drawing
  const stopDrawing = () => {
    if (!ctx || !canvasRef.current) return

    ctx.closePath()
    setIsDrawing(false)

    if (resizing) {
      setResizing(false)
    }

    if (dragStart) {
      setDragStart(null)
    }

    if (canvasRef.current) {
      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
      onSaveToHistory(imageData)
    }
  }

  // Fill area with color (bucket tool)
  const fillArea = (startX: number, startY: number) => {
    if (!ctx || !canvasRef.current) return

    const canvas = canvasRef.current
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Get the color at the clicked position
    const targetColor = getColorAtPixel(imageData, Math.floor(startX), Math.floor(startY))
    const fillColor = hexToRgb(color)

    if (!fillColor) return

    // Don't fill if clicking on the same color
    if (colorsMatch(targetColor, fillColor)) return

    // Flood fill algorithm
    const pixelsToCheck = [{ x: Math.floor(startX), y: Math.floor(startY) }]
    const width = canvas.width
    const height = canvas.height

    while (pixelsToCheck.length > 0) {
      const { x, y } = pixelsToCheck.pop()!
      const currentIndex = (y * width + x) * 4

      // Skip if out of bounds or not matching target color
      if (x < 0 || y < 0 || x >= width || y >= height) continue
      if (
        !colorsMatch(
          [data[currentIndex], data[currentIndex + 1], data[currentIndex + 2], data[currentIndex + 3]],
          targetColor,
        )
      )
        continue

      // Fill the pixel
      data[currentIndex] = fillColor[0]
      data[currentIndex + 1] = fillColor[1]
      data[currentIndex + 2] = fillColor[2]
      data[currentIndex + 3] = 255

      // Add adjacent pixels to check
      pixelsToCheck.push({ x: x + 1, y })
      pixelsToCheck.push({ x: x - 1, y })
      pixelsToCheck.push({ x, y: y + 1 })
      pixelsToCheck.push({ x, y: y - 1 })
    }

    ctx.putImageData(imageData, 0, 0)

    if (canvasRef.current) {
      const newImageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
      onSaveToHistory(newImageData)
    }
  }

  // Helper function to get color at pixel
  const getColorAtPixel = (imageData: ImageData, x: number, y: number) => {
    const index = (y * imageData.width + x) * 4
    return [imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]]
  }

  // Helper function to compare colors
  const colorsMatch = (a: number[], b: number[]) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3]
  }

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
      : null
  }

  // Draw a star
  const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    if (!ctx) return

    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }

    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.stroke()
  }

  // Delete selected element
  const deleteSelectedElement = () => {
    if (selectedElement === null) return

    setElements((prev) => prev.filter((el) => el.id !== selectedElement))
    setSelectedElement(null)
    redrawCanvas()
  }

  // Copy selected element
  const copySelectedElement = () => {
    if (selectedElement === null) return

    const element = elements.find((el) => el.id === selectedElement)
    if (element) {
      setClipboard({ ...element })
    }
  }

  // Cut selected element
  const cutSelectedElement = () => {
    if (selectedElement === null) return

    const element = elements.find((el) => el.id === selectedElement)
    if (element) {
      setClipboard({ ...element })
      deleteSelectedElement()
    }
  }

  // Paste element
  const pasteElement = () => {
    if (!clipboard || !canvasRef.current) return

    const newElement = {
      ...clipboard,
      id: generateId(),
      points: clipboard.points.map((p) => ({
        x: p.x + 20, // Offset a bit to make it visible
        y: p.y + 20,
      })),
    }

    setElements((prev) => [...prev, newElement])
    setSelectedElement(newElement.id)
    redrawCanvas()
  }

  // Add sticker to canvas
  const addSticker = (stickerType: string) => {
    if (!ctx || !canvasRef.current) return

    const canvas = canvasRef.current
    const centerX = canvas.width / 2 / zoom
    const centerY = canvas.height / 2 / zoom

    let newElement: Element | null = null

    if (stickerType === "heart") {
      // Create heart element
      newElement = {
        id: generateId(),
        type: "heart",
        points: [{ x: centerX, y: centerY }],
        color: color,
        size: brushSize,
        width: 100,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (stickerType === "flower") {
      // Create flower element
      newElement = {
        id: generateId(),
        type: "flower",
        points: [{ x: centerX, y: centerY }],
        color: color,
        size: brushSize,
        width: 60,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (stickerType === "star") {
      // Create star element
      newElement = {
        id: generateId(),
        type: "star",
        points: [{ x: centerX, y: centerY }],
        color: color,
        size: brushSize,
        width: 100,
        rotation: { x: 0, y: 0, z: 0 },
      }
    } else if (stickerType === "rainbow") {
      // Create rainbow element
      newElement = {
        id: generateId(),
        type: "rainbow",
        points: [{ x: centerX, y: centerY }],
        color: color,
        size: brushSize,
        width: 200,
        rotation: { x: 0, y: 0, z: 0 },
      }
    }

    if (newElement) {
      setElements((prev) => [...prev, newElement!])
      redrawCanvas()
    }
  }

  // Get cursor class based on current tool
  const getCursorClass = () => {
    if (isSelectionMode) return "cursor-pointer"
    switch (tool) {
      case "pencil":
        return "cursor-pencil"
      case "eraser":
        return "cursor-eraser"
      case "bucket":
        return "cursor-bucket"
      default:
        return "cursor-crosshair"
    }
  }

  // Add a visual indicator when hovering over selectable elements
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelectionMode || isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    // Check if hovering over an element
    const hoveredElement = findElementAt(x, y)

    // Change cursor based on what's under it
    if (hoveredElement) {
      canvas.style.cursor = "pointer"
    } else {
      canvas.style.cursor = "default"
    }
  }

  return (
    <div
      ref={containerRef}
      className={`flex-1 p-4 flex items-center justify-center overflow-auto ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      <div
        className={`relative ${theme === "dark" ? "bg-black" : "bg-white"} shadow-xl rounded-lg overflow-hidden`}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          transition: "transform 0.2s ease",
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={(e) => {
            draw(e)
            handleMouseMove(e)
          }}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={`${getCursorClass()} touch-none`}
        />
        {selectedElement !== null && (
          <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-1 text-sm font-medium">
            <span>Element selected</span>
            <span className="mx-2">•</span>
            <span className="keyboard-shortcut">Del</span> to delete
            <span className="mx-2">•</span>
            <span className="keyboard-shortcut">Ctrl+C</span> to copy
            <span className="mx-2">•</span>
            <span className="keyboard-shortcut">Ctrl+X</span> to cut
            {clipboard && (
              <>
                <span className="mx-2">•</span>
                <span className="keyboard-shortcut">Ctrl+V</span> to paste
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtCanvas
