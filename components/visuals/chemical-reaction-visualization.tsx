"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Vector3, type Group, Mesh } from "three"

// Define molecule types for our reactions
interface Atom {
  element: string
  color: string
  position: [number, number, number]
  size: number
}

interface Molecule {
  id: string
  name: string
  atoms: Atom[]
  bonds: [number, number][]
}

interface ChemicalReaction {
  id: string
  name: string
  description: string
  reactants: Molecule[]
  products: Molecule[]
  energyChange: number // positive for endothermic, negative for exothermic
}

interface ChemicalReactionVisualizationProps {
  reaction: ChemicalReaction
}

export function ChemicalReactionVisualization({ reaction }: ChemicalReactionVisualizationProps) {
  const [reactionProgress, setReactionProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null)

  // Auto-play the reaction
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setReactionProgress((prev) => {
        const newValue = prev + 0.005
        if (newValue >= 1) {
          setIsPlaying(false)
          return 1
        }
        return newValue
      })
    }, 16)

    return () => clearInterval(interval)
  }, [isPlaying])

  const resetReaction = () => {
    setReactionProgress(0)
    setIsPlaying(false)
  }

  const playReaction = () => {
    if (reactionProgress >= 1) {
      resetReaction()
    }
    setIsPlaying(true)
  }

  const pauseReaction = () => {
    setIsPlaying(false)
  }

  return (
    <div className="w-full h-[600px] relative">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />

        <ReactionScene reaction={reaction} progress={reactionProgress} onMoleculeSelect={setSelectedMolecule} />

        <OrbitControls enablePan={true} minDistance={5} maxDistance={30} autoRotate={false} />
      </Canvas>

      {/* Controls overlay */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-4 px-4">
        <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{reaction.name}</h3>
            <Button variant="outline" size="sm" onClick={() => setShowInfo(!showInfo)}>
              {showInfo ? "Hide Info" : "Show Info"}
            </Button>
          </div>

          {showInfo && (
            <div className="mb-4 text-sm">
              <p>{reaction.description}</p>
              <p className="mt-2">
                Energy change:
                <span className={reaction.energyChange > 0 ? "text-red-500 ml-1" : "text-green-500 ml-1"}>
                  {reaction.energyChange > 0 ? "Endothermic" : "Exothermic"}
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <Button size="sm" onClick={reactionProgress < 1 ? playReaction : resetReaction} className="w-24">
              {reactionProgress >= 1 ? "Reset" : isPlaying ? "Playing..." : "Play"}
            </Button>

            {isPlaying && (
              <Button size="sm" variant="outline" onClick={pauseReaction}>
                Pause
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm">Reactants</span>
            <Slider
              value={[reactionProgress * 100]}
              onValueChange={(value) => {
                setReactionProgress(value[0] / 100)
              }}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm">Products</span>
          </div>
        </div>
      </div>

      {/* Selected molecule info */}
      {selectedMolecule && (
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg max-w-xs">
          <h4 className="font-medium">{selectedMolecule}</h4>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={() => setSelectedMolecule(null)}
          >
            ✕
          </Button>
        </div>
      )}
    </div>
  )
}

function ReactionScene({
  reaction,
  progress,
  onMoleculeSelect,
}: {
  reaction: ChemicalReaction
  progress: number
  onMoleculeSelect: (name: string | null) => void
}) {
  // Calculate positions based on progress
  const startX = -6
  const endX = 6
  const midX = 0

  // Position molecules based on reaction progress
  const getMoleculePosition = (isReactant: boolean, index: number, totalCount: number) => {
    const spacing = 3
    const offset = ((totalCount - 1) * spacing) / 2

    if (progress < 0.4) {
      // Initial state - reactants on left, products on right
      if (isReactant) {
        return new Vector3(startX, index * spacing - offset, 0)
      } else {
        return new Vector3(endX, index * spacing - offset, 0)
      }
    } else if (progress < 0.6) {
      // Transition state - all molecules move to center
      if (isReactant) {
        const t = (progress - 0.4) / 0.2
        return new Vector3(startX + (midX - startX) * t, index * spacing - offset, 0)
      } else {
        const t = (progress - 0.4) / 0.2
        return new Vector3(endX + (midX - endX) * t, index * spacing - offset, 0)
      }
    } else {
      // Final state - reactants disappear, products move to left
      if (isReactant) {
        return new Vector3(midX, index * spacing - offset, 0)
      } else {
        const t = (progress - 0.6) / 0.4
        return new Vector3(midX + (startX - midX) * t, index * spacing - offset, 0)
      }
    }
  }

  // Calculate opacity based on progress
  const getOpacity = (isReactant: boolean) => {
    if (isReactant) {
      return progress < 0.6 ? 1 - (progress / 0.6) * 0.8 : 0.2
    } else {
      return progress < 0.4 ? 0.2 : 0.2 + ((progress - 0.4) / 0.6) * 0.8
    }
  }

  return (
    <>
      {/* Reaction arrow */}
      <group position={[0, 0, -1]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[8, 0.5]} />
          <meshBasicMaterial color="#64748b" transparent opacity={0.5} />
        </mesh>
        <mesh position={[3, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <planeGeometry args={[1.5, 0.5]} />
          <meshBasicMaterial color="#64748b" transparent opacity={0.5} />
        </mesh>
        <mesh position={[3, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[1.5, 0.5]} />
          <meshBasicMaterial color="#64748b" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Energy indicator */}
      <group position={[0, -4, 0]}>
        <Text position={[0, 1, 0]} fontSize={0.5} color="#64748b" anchorX="center" anchorY="middle">
          {reaction.energyChange > 0 ? "Energy Absorbed" : "Energy Released"}
        </Text>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[6, 0.3]} />
          <meshBasicMaterial color={reaction.energyChange > 0 ? "#ef4444" : "#10b981"} transparent opacity={0.7} />
        </mesh>
        {reaction.energyChange > 0 ? (
          <group position={[0, 0.5, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[1, 0.3]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.7} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <planeGeometry args={[1, 0.3]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.7} />
            </mesh>
          </group>
        ) : (
          <group position={[0, -0.5, 0]}>
            <mesh rotation={[0, 0, (-3 * Math.PI) / 4]}>
              <planeGeometry args={[1, 0.3]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.7} />
            </mesh>
            <mesh rotation={[0, 0, (3 * Math.PI) / 4]}>
              <planeGeometry args={[1, 0.3]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.7} />
            </mesh>
          </group>
        )}
      </group>

      {/* Reactants */}
      {reaction.reactants.map((molecule, index) => (
        <MoleculeModel
          key={`reactant-${molecule.id}`}
          molecule={molecule}
          position={getMoleculePosition(true, index, reaction.reactants.length)}
          opacity={getOpacity(true)}
          onClick={() => onMoleculeSelect(molecule.name)}
        />
      ))}

      {/* Products */}
      {reaction.products.map((molecule, index) => (
        <MoleculeModel
          key={`product-${molecule.id}`}
          molecule={molecule}
          position={getMoleculePosition(false, index, reaction.products.length)}
          opacity={getOpacity(false)}
          onClick={() => onMoleculeSelect(molecule.name)}
        />
      ))}

      {/* Reaction energy visualization */}
      {progress > 0.4 && progress < 0.6 && (
        <EnergyParticles
          position={[0, 0, 0]}
          isExothermic={reaction.energyChange < 0}
          intensity={Math.abs(reaction.energyChange)}
        />
      )}
    </>
  )
}

function MoleculeModel({
  molecule,
  position,
  opacity = 1,
  onClick,
}: {
  molecule: Molecule
  position: Vector3
  opacity?: number
  onClick: () => void
}) {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group
      position={position}
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {/* Molecule name */}
      <Text position={[0, -2, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        {molecule.name}
      </Text>

      {/* Atoms */}
      {molecule.atoms.map((atom, index) => (
        <mesh key={`atom-${index}`} position={atom.position}>
          <sphereGeometry args={[atom.size, 32, 32]} />
          <meshStandardMaterial
            color={atom.color}
            transparent
            opacity={opacity}
            emissive={atom.color}
            emissiveIntensity={0.2}
          />
          <Text position={[0, 0, atom.size + 0.2]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
            {atom.element}
          </Text>
        </mesh>
      ))}

      {/* Bonds */}
      {molecule.bonds.map(([atomIndex1, atomIndex2], bondIndex) => {
        const atom1 = molecule.atoms[atomIndex1]
        const atom2 = molecule.atoms[atomIndex2]

        // Calculate bond position and rotation
        const start = new Vector3(...atom1.position)
        const end = new Vector3(...atom2.position)
        const mid = new Vector3().addVectors(start, end).multiplyScalar(0.5)

        // Calculate bond length
        const length = start.distanceTo(end) - (atom1.size + atom2.size) * 0.8

        // Calculate rotation to align with the two atoms
        const direction = new Vector3().subVectors(end, start).normalize()
        const quaternion = new Vector3(0, 0, 1).cross(direction)
        const w = 1 + new Vector3(0, 0, 1).dot(direction)
        const rotation = [quaternion.x, quaternion.y, quaternion.z, w]

        return (
          <mesh key={`bond-${bondIndex}`} position={mid} quaternion={rotation as any}>
            <cylinderGeometry args={[0.1, 0.1, length, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={opacity * 0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

function EnergyParticles({
  position,
  isExothermic,
  intensity,
}: {
  position: [number, number, number]
  isExothermic: boolean
  intensity: number
}) {
  const particleCount = Math.floor(intensity * 20)
  const particles = Array.from({ length: particleCount }).map((_, i) => ({
    id: i,
    speed: Math.random() * 0.05 + 0.02,
    angle: Math.random() * Math.PI * 2,
    elevation: Math.random() * Math.PI - Math.PI / 2,
    size: Math.random() * 0.2 + 0.1,
    offset: Math.random() * Math.PI * 2,
  }))

  return (
    <group position={position}>
      {particles.map((particle) => {
        const meshRef = useRef<Mesh>(null)

        useFrame(({ clock }) => {
          if (meshRef.current) {
            const t = (clock.getElapsedTime() + particle.offset) % 2
            const progress = t / 2 // 0 to 1 over 2 seconds
            const scale = progress < 0.5 ? progress * 2 : (1 - progress) * 2 // 0 -> 1 -> 0

            meshRef.current.scale.setScalar(scale)
            meshRef.current.position.set(
              Math.cos(particle.angle) * Math.cos(particle.elevation) * 5 * progress,
              Math.sin(particle.elevation) * 5 * progress,
              Math.sin(particle.angle) * Math.cos(particle.elevation) * 5 * progress
            )
          }
        })

        return (
          <mesh key={`energy-particle-${particle.id}`} ref={meshRef}>
            <sphereGeometry args={[particle.size, 8, 8]} />
            <meshBasicMaterial color={isExothermic ? "#10b981" : "#ef4444"} transparent opacity={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}