"use client"
import {
  Circle,
  Copy,
  Eraser,
  ImageIcon,
  LayoutPanelLeftIcon as LayoutLeft,
  Maximize,
  Minimize,
  Minus,
  Moon,
  PaintBucket,
  Pencil,
  RectangleHorizontal,
  RotateCcw,
  RotateCw,
  Save,
  Scissors,
  Shapes,
  SprayCanIcon as Spray,
  Square,
  Star,
  Trash2,
  Triangle,
  Wand,
  LayoutPanelTopIcon,
  Sun,
  Fullscreen,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type SidebarPosition = "left" | "right" | "top" | "bottom"

interface ArtSidebarProps {
  theme: "light" | "dark"
  color: string
  brushSize: number
  tool: string
  zoom: number
  isSelectionMode: boolean
  selectedElement: string | null
  clipboard: any | null
  customColors: string[]
  activeTab: string
  rotationAxis: "x" | "y" | "z"
  sidebarPosition: SidebarPosition
  historyIndex: number
  onToolChange: (tool: string) => void
  onColorChange: (color: string) => void
  onBrushSizeChange: (size: number) => void
  onZoomChange: (zoom: number) => void
  onSelectionModeToggle: () => void
  onRotationAxisChange: (axis: "x" | "y" | "z") => void
  onRotateElement: (angle: number) => void
  onDeleteElement: () => void
  onCopyElement: () => void
  onCutElement: () => void
  onPasteElement: () => void
  onAddCustomColor: () => void
  onAddSticker: (type: string) => void
  onUndo: () => void
  onSaveImage: () => void
  onToggleTheme: () => void
  onChangeSidebarPosition: (position: SidebarPosition) => void
  onTabChange: (tab: string) => void
  onFullScreen: () => void
}

const ArtSidebar = ({
  theme,
  color,
  brushSize,
  tool,
  zoom,
  isSelectionMode,
  selectedElement,
  clipboard,
  customColors,
  activeTab,
  rotationAxis,
  sidebarPosition,
  historyIndex,
  onToolChange,
  onColorChange,
  onBrushSizeChange,
  onZoomChange,
  onSelectionModeToggle,
  onRotationAxisChange,
  onRotateElement,
  onDeleteElement,
  onCopyElement,
  onCutElement,
  onPasteElement,
  onAddCustomColor,
  onAddSticker,
  onUndo,
  onSaveImage,
  onToggleTheme,
  onChangeSidebarPosition,
  onTabChange,
  onFullScreen,
}: ArtSidebarProps) => {
  // Predefined colors
  const colorPalette = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#800000",
    "#008080",
    "#000080",
    "#FFC0CB",
  ]

  // Helper function to determine text color based on background color
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16)
    const g = Number.parseInt(hexColor.slice(3, 5), 16)
    const b = Number.parseInt(hexColor.slice(5, 7), 16)

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return black or white based on luminance
    return luminance > 0.5 ? "#000000" : "#ffffff"
  }

  // Render selection tools
  const renderSelectionTools = () => {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
        <h3 className="font-bold text-md mb-2">Selection Tools</h3>
        <div className="grid grid-cols-3 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onDeleteElement}
                  className="transition-all hover:scale-105 hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Delete <span className="keyboard-shortcut">Del</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onCopyElement}
                  className="transition-all hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-900"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Copy <span className="keyboard-shortcut">Ctrl+C</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onCutElement}
                  className="transition-all hover:scale-105 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                >
                  <Scissors className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Cut <span className="keyboard-shortcut">Ctrl+X</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {clipboard && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onPasteElement}
                    className="transition-all hover:scale-105 hover:bg-green-100 dark:hover:bg-green-900"
                  >
                    <Shapes className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Paste <span className="keyboard-shortcut">Ctrl+V</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <h3 className="font-bold text-md mt-3 mb-2">Rotation</h3>
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant={rotationAxis === "x" ? "default" : "outline"}
            size="sm"
            onClick={() => onRotationAxisChange("x")}
            className="transition-all hover:scale-105"
          >
            X
          </Button>
          <Button
            variant={rotationAxis === "y" ? "default" : "outline"}
            size="sm"
            onClick={() => onRotationAxisChange("y")}
            className="transition-all hover:scale-105"
          >
            Y
          </Button>
          <Button
            variant={rotationAxis === "z" ? "default" : "outline"}
            size="sm"
            onClick={() => onRotationAxisChange("z")}
            className="transition-all hover:scale-105"
          >
            Z
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRotateElement(15)}
            className="transition-all hover:scale-105"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } shadow-lg rounded-lg flex flex-col ${
        sidebarPosition === "top" || sidebarPosition === "bottom" ? "w-full h-auto max-h-64" : "w-72 h-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex space-x-2">
          <TooltipProvider>
            <button className="bg-black h-8 w-8 flex justify-center items-center rounded-sm">
              <Fullscreen className="h-5 text-white" onClick={onFullScreen} />
            </button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onChangeSidebarPosition("left")}>
                  <LayoutLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to Left</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onChangeSidebarPosition("right")}>
                  <LayoutLeft className="h-4 w-4 rotate-180" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to Right</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onChangeSidebarPosition("top")}>
                  <LayoutPanelTopIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to Top</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onChangeSidebarPosition("bottom")}>
                  <LayoutPanelTopIcon className="h-4 w-4 rotate-180" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to Bottom</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div
        className={`flex-1 p-4 overflow-auto ${sidebarPosition === "top" || sidebarPosition === "bottom" ? "flex" : ""}`}
      >
        <Tabs
          defaultValue="accessories"
          className={sidebarPosition === "top" || sidebarPosition === "bottom" ? "w-full" : ""}
          value={activeTab}
          onValueChange={onTabChange}
        >
          <TabsList className="bg-[#f1f1f1] grid w-full gap-3 grid-cols-2 mb-4 justify-start">
            <TabsTrigger className="w-full text-left text-[12px]" value="accessories">
              Accessories
            </TabsTrigger>
            <TabsTrigger className="w-full text-left text-[12px]" value="shapes">
              Shapes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accessories" className="space-y-4">
            <div className="bg-[#f1f1f1] p-3 rounded-lg">
              <h3 className="font-bold text-md mb-2">Drawing Tools</h3>
              <div className="grid grid-cols-3 gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "pencil" ? "default" : "outline"}
                        size="icon"
                        className={`transition-all hover:scale-105 ${tool === "pencil" ? "bg-purple-600 text-white" : "bg-black text-white"}`}
                        onClick={() => {
                          onToolChange("pencil")
                          onSelectionModeToggle()
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Pencil</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "eraser" ? "default" : "outline"}
                        size="icon"
                        className={`transition-all hover:scale-105 ${tool === "eraser" ? "bg-purple-600 text-white" : "bg-black text-white"}`}
                        onClick={() => {
                          onToolChange("eraser")
                          onSelectionModeToggle()
                        }}
                      >
                        <Eraser className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Eraser</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "bucket" ? "default" : "outline"}
                        size="icon"
                        className="bg-black text-white transition-all hover:scale-105"
                        onClick={() => {
                          onToolChange("bucket")
                          onSelectionModeToggle()
                        }}
                      >
                        <PaintBucket className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fill</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "spray" ? "default" : "outline"}
                        size="icon"
                        className="bg-black text-white transition-all hover:scale-105"
                        onClick={() => {
                          onToolChange("spray")
                          onSelectionModeToggle()
                        }}
                      >
                        <Spray className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Spray</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isSelectionMode ? "default" : "outline"}
                        size="icon"
                        className="bg-black text-white transition-all hover:scale-105"
                        onClick={onSelectionModeToggle}
                      >
                        <Shapes className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Select</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {isSelectionMode && selectedElement !== null && renderSelectionTools()}

            <div className="bg-[#f1f1f1] p-3 rounded-lg border border-white">
              <h3 className="font-bold text-md mb-2 text-black">Brush Size: {brushSize}px</h3>
              <Slider
                value={[brushSize]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => onBrushSizeChange(value[0])}
                className="
                my-2
               [&_[role=slider]]:bg-white
               [&_[role=slider]]:border-2
                [&_[role=slider]]:border-black
               [&_[role=slider]]:w-5
               [&_[role=slider]]:h-5
               [&_[role=slider]]:rounded-full
               [&_[role=slider]]:focus:outline-none
                [&_[role=slider]]:focus:ring-2
               [&_[role=slider]]:focus:ring-white
               [&_[data-part=track]]:bg-black
                [&_[data-part=track]]:border
               [&_[data-part=track]]:border-black
               [&_[data-part=track]]:h-2
                [&_[data-part=range]]:bg-white
               [&_[data-part=range]]:h-2
             "
              />
            </div>

            <div className="bg-[#f1f1f1] p-3 rounded-lg">
              <h3 className="font-bold text-md mb-2">Zoom: {Math.round(zoom * 100)}%</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
                  className="transition-all hover:scale-105"
                >
                  <Minimize className="bg-black text-white h-4 w-4" />
                </Button>
                <Slider
                  value={[zoom]}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => onZoomChange(value[0])}
                  className="
                my-2
               [&_[role=slider]]:bg-white
               [&_[role=slider]]:border-2
                [&_[role=slider]]:border-black
               [&_[role=slider]]:w-5
               [&_[role=slider]]:h-5
               [&_[role=slider]]:rounded-full
               [&_[role=slider]]:focus:outline-none
                [&_[role=slider]]:focus:ring-2
               [&_[role=slider]]:focus:ring-white
               [&_[data-part=track]]:bg-black
                [&_[data-part=track]]:border
               [&_[data-part=track]]:border-black
               [&_[data-part=track]]:h-2
                [&_[data-part=range]]:bg-white
               [&_[data-part=range]]:h-2
             "
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
                  className="transition-all hover:scale-105"
                >
                  <Maximize className="bg-black text-white h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-[#f1f1f1] p-3 rounded-lg">
              <h3 className="font-bold text-md mb-2">Colors</h3>
              <div className="grid grid-cols-5 gap-2">
                {colorPalette.map((c, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                      color === c ? "border-blue-500 shadow-md" : "border-gray-200",
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => onColorChange(c)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-[#f1f1f1] p-3 rounded-lg">
              <h3 className="font-bold text-md mb-2">Custom Colors</h3>
              <div className="grid grid-cols-5 gap-2">
                {customColors.map((c, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                      color === c ? "border-blue-500 shadow-md" : "border-gray-200",
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => onColorChange(c)}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-10 h-10 cursor-pointer rounded-md border-0"
                />
                <span className="text-sm font-mono">{color}</span>
                <Button size="sm" onClick={onAddCustomColor} className="transition-all hover:scale-105">
                  Add
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shapes" className="space-y-4">
            <div className="bg-[#f1f1f1] p-3 rounded-lg">
              <h3 className="font-bold text-md mb-2">Basic Shapes</h3>
              <div className="grid grid-cols-3 gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "square" ? "default" : "outline"}
                        size="icon"
                        className="transition-all hover:scale-105"
                        onClick={() => {
                          onToolChange("square")
                          onSelectionModeToggle()
                        }}
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Square</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "rectangle" ? "default" : "outline"}
                        size="icon"
                        className="transition-all hover:scale-105"
                        onClick={() => {
                          onToolChange("rectangle")
                          onSelectionModeToggle()
                        }}
                      >
                        <RectangleHorizontal className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rectangle</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "circle" ? "default" : "outline"}
                        size="icon"
                        className="transition-all hover:scale-105"
                        onClick={() => {
                          onToolChange("circle")
                          onSelectionModeToggle()
                        }}
                      >
                        <Circle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Circle</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "triangle" ? "default" : "outline"}
                        size="icon"
                        className="transition-all hover:scale-105"
                        onClick={() => {
                          onToolChange("triangle")
                          onSelectionModeToggle()
                        }}
                      >
                        <Triangle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Triangle</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "star" ? "default" : "outline"}
                        size="icon"
                        className="transition-all hover:scale-105"
                        onClick={() => {
                          onToolChange("star")
                          onSelectionModeToggle()
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Star</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "line" ? "default" : "outline"}
                        size="icon"
                        className="transition-all hover:scale-105"
                        onClick={() => {
                          onToolChange("line")
                          onSelectionModeToggle()
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Line</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={tool === "bendableLine" ? "default" : "outline"}
                        size="icon"
                        className="transition-all hover:scale-105"
                        onClick={() => {
                          onToolChange("bendableLine")
                          onSelectionModeToggle()
                        }}
                      >
                        <Wand className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Bendable Line</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="font-bold text-md mb-2">Templates</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto py-2 transition-all hover:scale-105">
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-4 w-4 mb-1" />
                    <span className="text-xs">Color by Number</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-2 transition-all hover:scale-105">
                  <div className="flex flex-col items-center">
                    <Shapes className="h-4 w-4 mb-1" />
                    <span className="text-xs">Symmetry Drawing</span>
                  </div>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={historyIndex <= 0}
            className="bg-black text-white transition-all hover:scale-105"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveImage}
            className="bg-black text-white transition-all hover:scale-105"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleTheme}
            className="bg-black text-white transition-all hover:scale-105"
          >
            {theme === "light" ? <Moon className="h-4 w-4 mr-1" /> : <Sun className="h-4 w-4 mr-1" />}
            {theme === "light" ? "Dark" : "Light"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ArtSidebar
