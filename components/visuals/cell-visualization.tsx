"use client"

import { useState, useRef, Suspense, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  Html,
  Environment,
  Bounds,
  useBounds,
  PerspectiveCamera,
  Sphere,
  Cylinder,
  Torus,
  Instances,
  Instance,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { Vector3, type Group, Mesh, Color, MeshStandardMaterial } from "three"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Define cell part interfaces
interface CellPart {
  id: string
  name: string
  description: string
  color: string
  position: [number, number, number]
  scale: [number, number, number]
  rotation?: [number, number, number]
  type: "animal" | "plant" | "both"
  function: string
  animationFn?: (mesh: Group | Mesh, time: number) => void
}

// Define cell parts data
const cellParts: CellPart[] = [
  {
    id: "nucleus",
    name: "Nucleus",
    description: "The control center of the cell containing genetic material (DNA).",
    color: "#3b82f6", // blue
    position: [0, 0, 0],
    scale: [1.5, 1.5, 1.5],
    type: "both",
    function: "Controls cell activities and contains genetic information (DNA)",
    animationFn: (mesh, time) => {
      mesh.scale.x = 1.5 + Math.sin(time * 0.5) * 0.05
      mesh.scale.y = 1.5 + Math.sin(time * 0.5) * 0.05
      mesh.scale.z = 1.5 + Math.sin(time * 0.5) * 0.05
    },
  },
  {
    id: "mitochondria",
    name: "Mitochondria",
    description: "The powerhouse of the cell, producing energy through cellular respiration.",
    color: "#ef4444", // red
    position: [2, 1, 1],
    scale: [1.2, 0.6, 0.6],
    rotation: [0, 0, Math.PI / 3],
    type: "both",
    function: "Produces energy (ATP) through cellular respiration",
    animationFn: (mesh, time) => {
      mesh.scale.x = 1.2 + Math.sin(time * 2) * 0.1
      mesh.position.x = 2 + Math.sin(time * 0.5) * 0.1
    },
  },
  {
    id: "mitochondria2",
    name: "Mitochondria",
    description: "The powerhouse of the cell, producing energy through cellular respiration.",
    color: "#ef4444", // red
    position: [-1.5, -1.5, 1.5],
    scale: [1, 0.5, 0.5],
    rotation: [0, 0, Math.PI / 5],
    type: "both",
    function: "Produces energy (ATP) through cellular respiration",
    animationFn: (mesh, time) => {
      mesh.scale.x = 1 + Math.sin(time * 2 + 1) * 0.1
      mesh.position.y = -1.5 + Math.sin(time * 0.5 + 1) * 0.1
    },
  },
  {
    id: "endoplasmic-reticulum",
    name: "Endoplasmic Reticulum",
    description: "A network of membranes involved in protein and lipid synthesis.",
    color: "#f59e0b", // amber
    position: [1, -1, 0],
    scale: [2, 0.4, 0.8],
    rotation: [0, Math.PI / 6, 0],
    type: "both",
    function: "Synthesizes proteins and lipids; transports materials within the cell",
    animationFn: (mesh, time) => {
      mesh.rotation.z = Math.PI / 6 + Math.sin(time * 0.3) * 0.05
    },
  },
  {
    id: "golgi-apparatus",
    name: "Golgi Apparatus",
    description: "Processes and packages proteins for secretion or use within the cell.",
    color: "#10b981", // emerald
    position: [-2, 0.5, 0],
    scale: [1.2, 0.8, 0.4],
    type: "both",
    function: "Modifies, sorts, and packages proteins for secretion or use within the cell",
    animationFn: (mesh, time) => {
      mesh.rotation.y = Math.sin(time * 0.2) * 0.1
    },
  },
  {
    id: "lysosome",
    name: "Lysosome",
    description: "Digestive organelle containing enzymes that break down waste materials and cellular debris.",
    color: "#6366f1", // indigo
    position: [0, -2, 0],
    scale: [0.6, 0.6, 0.6],
    type: "animal",
    function: "Contains digestive enzymes to break down waste and cellular debris",
    animationFn: (mesh, time) => {
      mesh.scale.x = 0.6 + Math.sin(time * 1.5) * 0.05
      mesh.scale.y = 0.6 + Math.sin(time * 1.5) * 0.05
      mesh.scale.z = 0.6 + Math.sin(time * 1.5) * 0.05
    },
  },
  {
    id: "chloroplast",
    name: "Chloroplast",
    description: "Organelle that conducts photosynthesis in plant cells.",
    color: "#22c55e", // green
    position: [2, -2, 0],
    scale: [1, 0.6, 0.4],
    type: "plant",
    function: "Conducts photosynthesis, converting light energy to chemical energy",
    animationFn: (mesh, time) => {
      mesh.rotation.z = Math.sin(time * 0.5) * 0.2
      const color = new Color("#22c55e").lerp(new Color("#4ade80"), (Math.sin(time * 2) + 1) / 2)
      if (mesh instanceof Mesh && mesh.material instanceof MeshStandardMaterial) {
        mesh.material.color = color
      }
    },
  },
  {
    id: "chloroplast2",
    name: "Chloroplast",
    description: "Organelle that conducts photosynthesis in plant cells.",
    color: "#22c55e", // green
    position: [-2, -2, 0],
    scale: [1, 0.6, 0.4],
    rotation: [0, 0, Math.PI / 4],
    type: "plant",
    function: "Conducts photosynthesis, converting light energy to chemical energy",
    animationFn: (mesh, time) => {
      mesh.rotation.z = Math.PI / 4 + Math.sin(time * 0.5 + 1) * 0.2
      const color = new Color("#22c55e").lerp(new Color("#4ade80"), (Math.sin(time * 2 + 1) + 1) / 2)
      if (mesh instanceof Mesh && mesh.material instanceof MeshStandardMaterial) {
        mesh.material.color = color
      }
    },
  },
  {
    id: "vacuole",
    name: "Vacuole",
    description: "Large storage sac in plant cells for water, nutrients, and waste.",
    color: "#0ea5e9", // sky blue
    position: [0, 1, -1],
    scale: [2, 2, 1],
    type: "plant",
    function: "Stores water, nutrients, and waste; maintains cell turgor pressure",
    animationFn: (mesh, time) => {
      mesh.scale.x = 2 + Math.sin(time * 0.3) * 0.1
      mesh.scale.y = 2 + Math.sin(time * 0.3) * 0.1
    },
  },
  {
    id: "cell-wall",
    name: "Cell Wall",
    description: "Rigid outer layer that provides structure and protection for plant cells.",
    color: "#a3e635", // lime
    position: [0, 0, 0],
    scale: [5.2, 5.2, 5.2],
    type: "plant",
    function: "Provides structural support and protection for the plant cell",
    animationFn: (mesh, time) => {
      // No animation for cell wall
    },
  },
  {
    id: "cell-membrane",
    name: "Cell Membrane",
    description: "Selectively permeable barrier that controls what enters and exits the cell.",
    color: "#ec4899", // pink
    position: [0, 0, 0],
    scale: [5, 5, 5],
    type: "both",
    function: "Controls what enters and exits the cell; provides protection",
    animationFn: (mesh, time) => {
      mesh.scale.x = 5 + Math.sin(time * 0.2) * 0.05
      mesh.scale.y = 5 + Math.sin(time * 0.2) * 0.05
      mesh.scale.z = 5 + Math.sin(time * 0.2) * 0.05
    },
  },
  {
    id: "ribosome",
    name: "Ribosomes",
    description: "Small organelles that synthesize proteins.",
    color: "#8b5cf6", // violet
    position: [1.5, 0, 2],
    scale: [0.3, 0.3, 0.3],
    type: "both",
    function: "Synthesizes proteins according to instructions from DNA/RNA",
    animationFn: (mesh, time) => {
      mesh.rotation.y = time * 0.5
    },
  },
  {
    id: "ribosome2",
    name: "Ribosomes",
    description: "Small organelles that synthesize proteins.",
    color: "#8b5cf6", // violet
    position: [-1, 2, 1],
    scale: [0.3, 0.3, 0.3],
    type: "both",
    function: "Synthesizes proteins according to instructions from DNA/RNA",
    animationFn: (mesh, time) => {
      mesh.rotation.y = time * 0.5 + 1
    },
  },
  {
    id: "ribosome3",
    name: "Ribosomes",
    description: "Small organelles that synthesize proteins.",
    color: "#8b5cf6", // violet
    position: [-1.5, -0.5, 2],
    scale: [0.3, 0.3, 0.3],
    type: "both",
    function: "Synthesizes proteins according to instructions from DNA/RNA",
    animationFn: (mesh, time) => {
      mesh.rotation.y = time * 0.5 + 2
    },
  },
]

// Cell part component
function CellPart({
  part,
  onClick,
  isHighlighted,
  isActive,
}: {
  part: CellPart
  onClick: () => void
  isHighlighted: boolean
  isActive: boolean
}) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current && part.animationFn && isActive) {
      part.animationFn(groupRef.current, state.clock.getElapsedTime())
    }
  })

  // Determine the geometry based on the part
  const getGeometry = () => {
    switch (part.id) {
      case "nucleus":
        return <Sphere args={[1, 32, 32]} />
      case "mitochondria":
      case "mitochondria2":
        return <Cylinder args={[0.5, 0.5, 2, 16]} />
      case "endoplasmic-reticulum":
        return (
          <group>
            <Cylinder args={[0.3, 0.3, 2, 16]} position={[0, 0, 0]} />
            <Cylinder args={[0.3, 0.3, 1.5, 16]} position={[0.5, 0.3, 0]} rotation={[0, 0, Math.PI / 4]} />
            <Cylinder args={[0.3, 0.3, 1.2, 16]} position={[-0.5, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]} />
          </group>
        )
      case "golgi-apparatus":
        return (
          <group>
            {[...Array(5)].map((_, i) => (
              <Torus
                key={i}
                args={[0.5 - i * 0.05, 0.1, 16, 32]}
                position={[0, i * 0.2 - 0.4, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              />
            ))}
          </group>
        )
      case "lysosome":
        return <Sphere args={[1, 16, 16]} />
      case "chloroplast":
      case "chloroplast2":
        return <Cylinder args={[0.5, 0.5, 1.5, 16]} />
      case "vacuole":
        return <Sphere args={[1, 24, 24]} />
      case "cell-wall":
        return <Sphere args={[1, 32, 32]} />
      case "cell-membrane":
        return <Sphere args={[1, 32, 32]} />
      case "ribosome":
      case "ribosome2":
      case "ribosome3":
        return <Sphere args={[1, 16, 16]} />
      default:
        return <Sphere args={[1, 16, 16]} />
    }
  }

  return (
    <group
      ref={groupRef}
      position={new Vector3(...part.position)}
      scale={new Vector3(...part.scale)}
      rotation={part.rotation ? part.rotation : [0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {getGeometry()}
      <meshStandardMaterial
        color={part.color}
        transparent
        opacity={isHighlighted ? 1 : 0.8}
        emissive={part.color}
        emissiveIntensity={isHighlighted ? 0.5 : 0.1}
      />
    </group>
  )
}

// Cytoplasm component (small particles floating in the cell)
function Cytoplasm({ cellType }: { cellType: "animal" | "plant" }) {
  const count = 100
  const particlePositions = useRef<Vector3[]>([])
  const particleSpeeds = useRef<number[]>([])

  // Initialize particle positions and speeds
  useEffect(() => {
    particlePositions.current = []
    particleSpeeds.current = []

    for (let i = 0; i < count; i++) {
      // Keep particles within cell boundary (smaller for animal cells)
      const radius = cellType === "animal" ? 4 : 4.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = Math.random() * radius

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      particlePositions.current.push(new Vector3(x, y, z))
      particleSpeeds.current.push(0.2 + Math.random() * 0.3)
    }
  }, [cellType])

  return (
    <Instances limit={count}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#94a3b8" transparent opacity={0.6} />

      {particlePositions.current.map((pos, i) => (
        <CytoplasmParticle key={i} position={pos} speed={particleSpeeds.current[i]} cellType={cellType} />
      ))}
    </Instances>
  )
}

// Individual cytoplasm particle
function CytoplasmParticle({
  position,
  speed,
  cellType,
}: {
  position: Vector3
  speed: number
  cellType: "animal" | "plant"
}) {
  const ref = useRef<any>()
  const radius = cellType === "animal" ? 4 : 4.5

  useFrame((state) => {
    if (!ref.current) return

    // Move in a random direction
    const time = state.clock.getElapsedTime()
    const x = position.x + Math.sin(time * speed) * 0.1
    const y = position.y + Math.cos(time * speed * 1.1) * 0.1
    const z = position.z + Math.sin(time * speed * 0.9) * 0.1

    // Keep within cell boundary
    const dist = Math.sqrt(x * x + y * y + z * z)
    if (dist < radius) {
      ref.current.position.set(x, y, z)
    }
  })

  return <Instance ref={ref} position={position} />
}

// Scene setup component
function CellScene({
  cellType,
  selectedPart,
  setSelectedPart,
}: {
  cellType: "animal" | "plant"
  selectedPart: string | null
  setSelectedPart: (id: string | null) => void
}) {
  const bounds = useBounds()

  // Filter parts based on cell type
  const visibleParts = cellParts.filter((part) => part.type === "both" || part.type === cellType)

  return (
    <Bounds fit clip observe margin={1.2}>
      <group position={[0, 0, 0]}>
        {/* Cell parts */}
        {visibleParts.map((part) => (
          <CellPart
            key={part.id}
            part={part}
            onClick={() => setSelectedPart(part.id)}
            isHighlighted={selectedPart === part.id}
            isActive={true}
          />
        ))}

        {/* Cytoplasm particles */}
        <Cytoplasm cellType={cellType} />

        {/* Labels for parts when selected */}
        {visibleParts.map((part) => (
          <Html
            key={`label-${part.id}`}
            position={[
              part.position[0] * (part.scale[0] / 1.5) * 1.2,
              part.position[1] * (part.scale[1] / 1.5) * 1.2,
              part.position[2] * (part.scale[2] / 1.5) * 1.2,
            ]}
            style={{
              display: selectedPart === part.id ? "block" : "none",
              transform: "translate3d(-50%, -50%, 0)",
              pointerEvents: "none",
            }}
          >
            <div className="bg-black/70 text-white px-2 py-1 rounded text-sm whitespace-nowrap">{part.name}</div>
          </Html>
        ))}
      </group>
    </Bounds>
  )
}

// Main component
export function CellVisualization() {
  const [cellType, setCellType] = useState<"animal" | "plant">("animal")
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(100)

  // Get selected part data
  const selectedPartData = selectedPart ? cellParts.find((part) => part.id === selectedPart) : null

  // Handle zoom
  const handleZoom = (value: number[]) => {
    setZoomLevel(value[0])
  }

  // Reset view
  const handleResetView = () => {
    setSelectedPart(null)
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-4">
          <Button
            variant={cellType === "animal" ? "default" : "outline"}
            onClick={() => setCellType("animal")}
            className="relative"
          >
            Animal Cell
            {cellType === "animal" && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">✓</Badge>
            )}
          </Button>
          <Button
            variant={cellType === "plant" ? "default" : "outline"}
            onClick={() => setCellType("plant")}
            className="relative"
          >
            Plant Cell
            {cellType === "plant" && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">✓</Badge>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setAutoRotate(!autoRotate)}>
            {autoRotate ? "Pause Rotation" : "Auto Rotate"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetView}>
            Reset View
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm">Zoom:</span>
          <div className="w-32">
            <Slider defaultValue={[100]} min={50} max={150} step={1} value={[zoomLevel]} onValueChange={handleZoom} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-4 flex-grow">
        {/* 3D Visualization */}
        <div className="w-full md:w-2/3 h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50 / (zoomLevel / 100)} />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />

              <CellScene cellType={cellType} selectedPart={selectedPart} setSelectedPart={setSelectedPart} />

              <OrbitControls
                enabled={true}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
              />

              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* Information Panel */}
        <div className="w-full md:w-1/3">
          <Card className="h-full">
            <CardContent className="p-4 h-full overflow-auto">
              {selectedPartData ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{selectedPartData.name}</h3>
                    <Badge
                      variant={
                        selectedPartData.type === "both"
                          ? "default"
                          : selectedPartData.type === "animal"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {selectedPartData.type === "both"
                        ? "Both Cells"
                        : selectedPartData.type === "animal"
                          ? "Animal Cell"
                          : "Plant Cell"}
                    </Badge>
                  </div>

                  <div className="w-full h-12 rounded-md" style={{ backgroundColor: selectedPartData.color }} />

                  <div>
                    <h4 className="font-semibold mb-1">Description:</h4>
                    <p>{selectedPartData.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Function:</h4>
                    <p>{selectedPartData.function}</p>
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => setSelectedPart(null)}>
                    Close
                  </Button>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      {cellType === "animal" ? "Animal Cell" : "Plant Cell"} Structure
                    </h3>

                    <p className="mb-4">
                      {cellType === "animal"
                        ? "Animal cells are typical of the eukaryotic cell type, enclosed by a plasma membrane and containing a membrane-bound nucleus and organelles."
                        : "Plant cells have special features like a cell wall, chloroplasts for photosynthesis, and a large central vacuole for water storage."}
                    </p>

                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {cellParts
                          .filter((part) => part.type === "both" || part.type === cellType)
                          .filter((part, index, self) => index === self.findIndex((p) => p.name === part.name))
                          .map((part) => (
                            <li
                              key={part.id}
                              className="cursor-pointer hover:text-blue-500"
                              onClick={() => setSelectedPart(part.id)}
                            >
                              {part.name}
                            </li>
                          ))}
                      </ul>
                    </div>

                    {cellType === "plant" && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md mb-4">
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">
                          Plant Cell Special Features:
                        </h4>
                        <p className="text-sm">
                          Plant cells have a rigid cell wall, chloroplasts for photosynthesis, and a large central
                          vacuole.
                        </p>
                      </div>
                    )}

                    {cellType === "animal" && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                          Animal Cell Special Features:
                        </h4>
                        <p className="text-sm">
                          Animal cells have lysosomes for digestion and can change shape as they lack a rigid cell wall.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Click on any part of the cell to learn more about it.
                    </p>
                    <Progress value={cellType === "animal" ? 50 : 100} className="h-1" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}