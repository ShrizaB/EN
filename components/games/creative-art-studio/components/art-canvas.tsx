"use client"

import type React from "react"
import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react"

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

// Update ArtCanvasProps to accept elements, setElements, baseImageData, setBaseImageData, and onSaveToHistory
interface ArtCanvasProps {
  color: string
  brushSize: number
  tool: string
  zoom: number
  theme: "light" | "dark"
  isSelectionMode: boolean
  rotationAxis: "x" | "y" | "z"
  elements: Element[]
  setElements: (els: Element[]) => void
  baseImageData: ImageData | null
  setBaseImageData: (img: ImageData | null) => void
  onSaveToHistory: (els: Element[], baseImg: ImageData | null) => void
}

// Add a new type for selection rectangle
interface SelectionRect {
  x: number
  y: number
  width: number
  height: number
}

const ArtCanvas = forwardRef<HTMLCanvasElement, ArtCanvasProps>(
  function ArtCanvasWithRef(
    {
      color,
      brushSize,
      tool,
      zoom,
      theme,
      isSelectionMode,
      rotationAxis,
      elements,
      setElements,
      baseImageData,
      setBaseImageData,
      onSaveToHistory,
    }: ArtCanvasProps,
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [selectedElement, setSelectedElement] = useState<string | null>(null)
    const [resizing, setResizing] = useState<ResizeHandle>(false)
    const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null)
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
    const [dragging, setDragging] = useState(false)
    const [selecting, setSelecting] = useState(false)
    // Add a state to store the current canvas image data after each fill
    const [currentPencilId, setCurrentPencilId] = useState<string | null>(null)
    // Add local state for multiSelectedElements
    const [multiSelectedElements, setMultiSelectedElements] = useState<string[]>([])

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
          onSaveToHistory(elements, baseImageData)
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
          handleDelete()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [selectedElement])

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

    // Helper: Draw outline-only shapes
    const drawElement = (element: Element, highlight = false) => {
      if (!ctx) return
      ctx.save()
      ctx.strokeStyle = highlight ? "#2196f3" : element.color
      ctx.lineWidth = highlight ? 2 : element.size
      ctx.setLineDash([])
      if (element.type === "rectangle" || element.type === "square" || element.type === "eraser") {
        const [start, end] = element.points
        const x = start.x
        const y = start.y
        const w = (end?.x ?? x) - x
        const h = (end?.y ?? y) - y
        ctx.strokeRect(x, y, w, h)
      } else if (element.type === "circle") {
        const [start, end] = element.points
        const x = start.x
        const y = start.y
        const r = Math.sqrt(Math.pow((end?.x ?? x) - x, 2) + Math.pow((end?.y ?? y) - y, 2))
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.stroke()
      } else if (element.type === "triangle") {
        const [a, b, c] = element.points
        if (a && b && c) {
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.lineTo(c.x, c.y)
          ctx.closePath()
          ctx.stroke()
        }
      } else if (element.type === "line") {
        const [start, end] = element.points
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
      } else if (element.type === "pencil") {
        ctx.beginPath()
        element.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        })
        ctx.stroke()
      }
      ctx.restore()
    }

    // Update floodFill to save the filled image as baseImageData
    const floodFill = (x: number, y: number, fillColor: string) => {
      if (!ctx || !canvasRef.current) return
      const canvas = canvasRef.current
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const width = imageData.width
      const height = imageData.height
      const data = imageData.data

      // Convert fillColor to [r,g,b]
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0]
      }
      const [fr, fg, fb] = hexToRgb(fillColor)

      // Get target color
      const getColorAt = (x: number, y: number) => {
        const idx = (y * width + x) * 4
        return [data[idx], data[idx + 1], data[idx + 2]]
      }
      const setColorAt = (x: number, y: number, r: number, g: number, b: number) => {
        const idx = (y * width + x) * 4
        data[idx] = r
        data[idx + 1] = g
        data[idx + 2] = b
      }
      const match = (a: number[], b: number[]) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2]

      const target = getColorAt(x, y)
      if (match([fr, fg, fb], target)) return

      const stack = [[x, y]]
      while (stack.length) {
        const [cx, cy] = stack.pop()!
        if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue
        if (!match(getColorAt(cx, cy), target)) continue
        setColorAt(cx, cy, fr, fg, fb)
        stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1])
      }
      ctx.putImageData(imageData, 0, 0)
      setBaseImageData(ctx.getImageData(0, 0, canvas.width, canvas.height))
    }

    // Redraw all elements and selection
    const redrawCanvas = useCallback(() => {
      if (!ctx || !canvasRef.current) return

      const canvas = canvasRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (baseImageData) {
        ctx.putImageData(baseImageData, 0, 0)
      } else {
        ctx.fillStyle = theme === "dark" ? "black" : "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Redraw all elements
      elements.forEach((el) => drawElement(el, el.id === selectedElement || multiSelectedElements.includes(el.id)))

      // Draw selection rectangle
      if (selectionRect) {
        ctx.save()
        ctx.setLineDash([6, 4])
        ctx.strokeStyle = "#2196f3"
        ctx.lineWidth = 1
        ctx.strokeRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height)
        ctx.restore()
      }
    }, [ctx, elements, theme, selectedElement, selectionRect, multiSelectedElements, baseImageData])

    // Mouse events for drawing, selecting, dragging, resizing
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / zoom)
      const y = Math.floor((e.clientY - rect.top) / zoom)
      if (tool === "bucket") {
        floodFill(x, y, color)
        return
      }
      if (tool === "select") {
        // Start region selection
        setSelecting(true)
        setSelectionRect({ x, y, width: 0, height: 0 })
        setSelectedElement(null)
        return
      }
      if (tool === "pencil") {
        setIsDrawing(true)
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2)
        setCurrentPencilId(id)
        setElements([...elements, { id, type: tool, points: [{ x, y }], color, size: brushSize }])
        setSelectedElement(null)
        setMultiSelectedElements([])
        return
      }
      // Only allow drawing for drawing tools
      if (["eraser", "rectangle", "square", "circle", "triangle", "line", "spray"].includes(tool)) {
        setIsDrawing(true)
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2)
        let points = [{ x, y }]
        if (tool === "rectangle" || tool === "square" || tool === "circle" || tool === "line") {
          points = [{ x, y }, { x, y }]
        } else if (tool === "triangle") {
          points = [{ x, y }, { x, y }, { x, y }]
        }
        setElements([...elements, { id, type: tool, points, color, size: brushSize }])
        setSelectedElement(null)
        setMultiSelectedElements([])
      }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left) / zoom
      const y = (e.clientY - rect.top) / zoom
      if (tool === "select" && selecting && selectionRect) {
        // Update selection rectangle
        setSelectionRect({
          ...selectionRect,
          width: x - selectionRect.x,
          height: y - selectionRect.y,
        })
      } else if (isDrawing && tool === "pencil" && currentPencilId) {
        setElements(elements.map((el) => (el.id === currentPencilId ? { ...el, points: [...el.points, { x, y }] } : el)))
      } else if (isDrawing && tool !== "select" && tool !== "bucket") {
        // Update shape endpoint
        setElements(
          elements.map((el, idx) =>
            idx === elements.length - 1
              ? {
                  ...el,
                  points: el.points.map((p, i) => (i === el.points.length - 1 ? { x, y } : p)),
                }
              : el,
          ),
        )
      } else if (dragging && selectedElement && dragOffset) {
        // Drag selected shape
        setElements(
          elements.map((el) =>
            el.id === selectedElement
              ? {
                  ...el,
                  points: el.points.map((p) => ({ x: p.x + x - (dragOffset ? dragOffset.x : 0), y: p.y + y - (dragOffset ? dragOffset.y : 0) })),
                }
              : el,
          ),
        )
        setDragOffset({ x, y })
      }
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (tool === "select" && selecting && selectionRect) {
        // Select all elements within selectionRect
        const rect = {
          x: Math.min(selectionRect.x, selectionRect.x + selectionRect.width),
          y: Math.min(selectionRect.y, selectionRect.y + selectionRect.height),
          width: Math.abs(selectionRect.width),
          height: Math.abs(selectionRect.height),
        }
        const found = elements.filter((el) => {
          // Bounding box check
          const xs = el.points.map((p) => p.x)
          const ys = el.points.map((p) => p.y)
          const minX = Math.min(...xs)
          const maxX = Math.max(...xs)
          const minY = Math.min(...ys)
          const maxY = Math.max(...ys)
          return (
            minX >= rect.x &&
            maxX <= rect.x + rect.width &&
            minY >= rect.y &&
            maxY <= rect.y + rect.height
          )
        })
        if (found.length > 0) {
          setMultiSelectedElements(found.map((el) => el.id))
          setSelectedElement(null)
        } else {
          setMultiSelectedElements([])
          setSelectedElement(null)
        }
        setSelecting(false)
        setSelectionRect(null)
        return
      }
      setIsDrawing(false)
      setCurrentPencilId(null)
      setDragging(false)
      setDragOffset(null)
    }

    // Click to select shape
    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (tool !== "select") return
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left) / zoom
      const y = (e.clientY - rect.top) / zoom
      const found = elements.find((el) => {
        // Simple bounding box check
        const xs = el.points.map((p) => p.x)
        const ys = el.points.map((p) => p.y)
        const minX = Math.min(...xs)
        const maxX = Math.max(...xs)
        const minY = Math.min(...ys)
        const maxY = Math.max(...ys)
        return x >= minX && x <= maxX && y >= minY && y <= maxY
      })
      if (found) {
        setSelectedElement(found.id)
        setMultiSelectedElements([])
        setDragging(true)
        setDragOffset({ x, y })
      } else {
        setSelectedElement(null)
        setMultiSelectedElements([])
      }
    }

    // Delete selected shape
    const handleDelete = () => {
      if (tool !== "select") return
      if (multiSelectedElements.length > 0) {
        setElements(elements.filter((el) => !multiSelectedElements.includes(el.id)))
        setMultiSelectedElements([])
        setSelectedElement(null)
      } else if (selectedElement) {
        setElements(elements.filter((el) => el.id !== selectedElement))
        setSelectedElement(null)
      }
    }

    // Redraw on state changes
    useEffect(() => {
      redrawCanvas()
    }, [elements, theme, selectedElement, selectionRect])

    // Keyboard events for delete
    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Delete") handleDelete()
      }

      window.addEventListener("keydown", onKeyDown)
      return () => {
        window.removeEventListener("keydown", onKeyDown)
      }
    }, [selectedElement])

    useImperativeHandle(ref, () => {
      // Always return a non-null HTMLCanvasElement
      if (canvasRef.current) return canvasRef.current;
      // Fallback: create a dummy canvas if needed
      const dummy = document.createElement('canvas');
      return dummy;
    });

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
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            className={isSelectionMode ? "cursor-pointer" : "cursor-crosshair"}
          />
          {tool === "select" && selectedElement && (
            <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-1 text-sm font-medium">
              <span>Element selected</span>
              <span className="mx-2">•</span>
              <span className="keyboard-shortcut">Del</span> to delete
            </div>
          )}
          {tool === "select" && multiSelectedElements.length > 0 && (
            <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-1 text-sm font-medium">
              <span>{multiSelectedElements.length} elements selected</span>
              <span className="mx-2">•</span>
              <span className="keyboard-shortcut">Del</span> to delete
            </div>
          )}
        </div>
      </div>
    )
  },
)

export default ArtCanvas
