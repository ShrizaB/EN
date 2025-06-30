import { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { Vector3 } from "three";

// Type assertions for motion components
const MotionGroup = motion.group as any;
const MotionMesh = motion.mesh as any;

interface AtomVisualizationProps {
  element: {
    id: string;
    name: string;
    symbol: string;
    protons: number;
    neutrons: number;
    electrons: number;
  };
  mode: "bohr" | "orbital";
}

interface ElectronShell {
  shellNumber: number;
  radius: number;
  electrons: number;
}

export function AtomVisualization({ element, mode }: AtomVisualizationProps) {
  function AtomModel({ element, mode }: AtomVisualizationProps) {
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const { camera } = useThree();

    // Calculate electron shell positions based on Bohr model
    const electronShells: ElectronShell[] = [];
    let remainingElectrons = element.electrons;
    let shellNumber = 1;

    while (remainingElectrons > 0) {
      const electronsInShell = Math.min(
        2 * shellNumber * shellNumber,
        remainingElectrons
      );
      electronShells.push({
        shellNumber,
        radius: shellNumber * 1.8, // Increased radius for better separation
        electrons: electronsInShell,
      });
      remainingElectrons -= electronsInShell;
      shellNumber++;
    }

    // Calculate nucleus size based on particle count
    const particleCount = element.protons + element.neutrons;
    const baseNucleusRadius = 1.2; // Base radius
    const nucleusRadius = baseNucleusRadius + Math.log10(Math.max(1, particleCount) / 2);
    
    // Calculate spacing factor for nucleus particles
    const spacingFactor = Math.min(2.5, Math.max(1.5, 2.0 + 0.05 * particleCount));

    // Dynamically adjust camera based on atom size
    useEffect(() => {
      const maxRadius = electronShells.length > 0
        ? Math.max(...electronShells.map((s) => s.radius))
        : 2;
      
      // Use logarithmic scaling for camera distance
      const cameraDistance = maxRadius * 2.8 + 5 + Math.log10(Math.max(1, particleCount));
      camera.position.set(0, 0, cameraDistance);
      camera.lookAt(0, 0, 0);
    }, [element, camera, electronShells, particleCount]);

    const handlePartClick = (part: string) => {
      setSelectedPart(part);
      setShowInfo(true);

      // Adjust camera position based on the clicked part
      if (part === "nucleus") {
        // Position camera closer to the nucleus but far enough to see all particles
        const zoomDistance = nucleusRadius * 2.5 + 4;
        camera.position.set(0, 0, zoomDistance);
      } else if (part.startsWith("electron")) {
        const shellNumber = Number.parseInt(part.split("-")[1]);
        const electronIndex = Number.parseInt(part.split("-")[2]);
        const shell = electronShells[shellNumber - 1];
        const angle = (electronIndex / shell.electrons) * Math.PI * 2;
        
        const position = new Vector3(
          shell.radius * Math.cos(angle),
          shell.radius * Math.sin(angle),
          0
        );
        
        // Position camera relative to the electron
        camera.position.set(
          position.x + 2 * Math.cos(angle),
          position.y + 2 * Math.sin(angle),
          position.z + 3
        );
      }
    };

    const getInfoContent = () => {
      if (!selectedPart) return null;

      if (selectedPart === "nucleus") {
        return (
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-xs">
            <h3 className="font-bold text-lg mb-2">Nucleus</h3>
            <p className="mb-2">The center of the atom containing:</p>
            <ul className="list-disc pl-5 mb-2">
              <li>
                <span className="font-bold text-red-400">
                  {element.protons} protons
                </span>{" "}
                (positive charge)
              </li>
              <li>
                <span className="font-bold text-blue-400">
                  {element.neutrons} neutrons
                </span>{" "}
                (no charge)
              </li>
            </ul>
            <p>
              The nucleus makes up most of the atom's mass but takes up very
              little space!
            </p>
            <button
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
              onClick={() => setShowInfo(false)}
            >
              Close
            </button>
          </div>
        );
      }

      if (selectedPart.startsWith("electron")) {
        const parts = selectedPart.split("-");
        const shellNumber = Number.parseInt(parts[1]);

        return (
          <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-xs">
            <h3 className="font-bold text-lg mb-2">Electron</h3>
            <p className="mb-2">
              Electrons have a negative charge and orbit the nucleus.
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>
                This electron is in{" "}
                <span className="font-bold text-purple-400">
                  shell {shellNumber}
                </span>
              </li>
              <li>
                Shell {shellNumber} can hold up to{" "}
                <span className="font-bold">
                  {2 * shellNumber * shellNumber}
                </span>{" "}
                electrons
              </li>
            </ul>
            <p>
              Electrons determine how atoms bond with other atoms to form
              molecules!
            </p>
            <button
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
              onClick={() => setShowInfo(false)}
            >
              Close
            </button>
          </div>
        );
      }

      return null;
    };

    // Function to distribute particles evenly across a sphere
    const distributePointsOnSphere = (count: number, radius: number) => {
      const points: [number, number, number][] = [];
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const inclination = Math.acos(1 - 2 * t);
        const azimuth = 2 * Math.PI * goldenRatio * i;
        
        const x = radius * Math.sin(inclination) * Math.cos(azimuth);
        const y = radius * Math.sin(inclination) * Math.sin(azimuth);
        const z = radius * Math.cos(inclination);
        
        points.push([x, y, z]);
      }
      
      return points;
    };
    
    // Generate positions for protons and neutrons
    const protonPositions = distributePointsOnSphere(element.protons, nucleusRadius);
    const neutronPositions = distributePointsOnSphere(element.neutrons, nucleusRadius);
    
    // Ensure protons and neutrons don't overlap
    if (element.neutrons > 0 && element.protons > 0) {
      // Offset neutrons slightly to prevent overlap
      for (let i = 0; i < neutronPositions.length; i++) {
        const [x, y, z] = neutronPositions[i];
        const angle = Math.atan2(y, x);
        const offsetDistance = 0.25; // Small offset
        
        neutronPositions[i] = [
          x + offsetDistance * Math.cos(angle),
          y + offsetDistance * Math.sin(angle),
          z + (Math.random() - 0.5) * 0.2
        ];
      }
    }

    return (
      <>
        {/* Nucleus */}
        <MotionGroup
          whileHover={{ scale: 1.05 }}
          onClick={() => handlePartClick("nucleus")}
          animate={{
            rotateY: [0, Math.PI * 2],
            rotateX: [0, Math.PI / 4, 0, -Math.PI / 4, 0],
          }}
          transition={{
            rotateY: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 15, 
              ease: "linear",
            },
            rotateX: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 20,
              ease: "easeInOut",
            }
          }}
        >
          {/* Protons */}
          {protonPositions.map((position, i) => {
            const [x, y, z] = position;
            const orbitRadius = 0.35; // Radius of the orbital motion
            
            return (
              <MotionMesh
                key={`proton-${i}`}
                position={[x * spacingFactor, y * spacingFactor, z * spacingFactor]}
                animate={{
                  x: [
                    x * spacingFactor,
                    x * spacingFactor + orbitRadius * Math.cos(0),
                    x * spacingFactor + orbitRadius * Math.cos(Math.PI),
                    x * spacingFactor + orbitRadius * Math.cos(Math.PI * 2),
                    x * spacingFactor
                  ],
                  y: [
                    y * spacingFactor,
                    y * spacingFactor + orbitRadius * Math.sin(0),
                    y * spacingFactor + orbitRadius * Math.sin(Math.PI),
                    y * spacingFactor + orbitRadius * Math.sin(Math.PI * 2),
                    y * spacingFactor
                  ],
                  z: [
                    z * spacingFactor,
                    z * spacingFactor + orbitRadius,
                    z * spacingFactor,
                    z * spacingFactor - orbitRadius,
                    z * spacingFactor
                  ],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3 + Math.random() * 2,
                  ease: "easeInOut",
                }}
              >
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial
                  color="#ff4444"
                  emissive="#ff2222"
                  emissiveIntensity={0.6}
                  roughness={0.3}
                  metalness={0.2}
                />
              </MotionMesh>
            );
          })}

          {/* Neutrons */}
          {neutronPositions.map((position, i) => {
            const [x, y, z] = position;
            const orbitRadius = 0.35; // Radius of the orbital motion
            
            return (
              <MotionMesh
                key={`neutron-${i}`}
                position={[x * spacingFactor, y * spacingFactor, z * spacingFactor]}
                animate={{
                  x: [
                    x * spacingFactor,
                    x * spacingFactor + orbitRadius * Math.cos(Math.PI / 2),
                    x * spacingFactor + orbitRadius * Math.cos(Math.PI * 1.5),
                    x * spacingFactor + orbitRadius * Math.cos(Math.PI * 2.5),
                    x * spacingFactor
                  ],
                  y: [
                    y * spacingFactor,
                    y * spacingFactor + orbitRadius * Math.sin(Math.PI / 2),
                    y * spacingFactor + orbitRadius * Math.sin(Math.PI * 1.5),
                    y * spacingFactor + orbitRadius * Math.sin(Math.PI * 2.5),
                    y * spacingFactor
                  ],
                  z: [
                    z * spacingFactor,
                    z * spacingFactor - orbitRadius,
                    z * spacingFactor,
                    z * spacingFactor + orbitRadius,
                    z * spacingFactor
                  ],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3 + Math.random() * 2,
                  ease: "easeInOut",
                }}
              >
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial
                  color="#4488ff"
                  emissive="#2266ff"
                  emissiveIntensity={0.6}
                  roughness={0.3}
                  metalness={0.2}
                />
              </MotionMesh>
            );
          })}
        </MotionGroup>

        {/* Electron shells (Bohr mode) */}
        {mode === "bohr" &&
          electronShells.map((shell, shellIndex) => (
            <group key={`shell-${shellIndex}`}>
              {/* Shell orbit path */}
              <MotionMesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[shell.radius - 0.15, shell.radius + 0.15, 64]} />
                <meshStandardMaterial
                  color="#a855f7"
                  transparent
                  opacity={0.7}
                  emissive="#a855f7"
                  emissiveIntensity={0.4}
                />
              </MotionMesh>

              {/* Electrons */}
              {Array.from({ length: shell.electrons }).map((_, electronIndex) => {
                const angle = (electronIndex / shell.electrons) * Math.PI * 2;
                const electronId = `electron-${shellIndex + 1}-${electronIndex}`;
                
                // Calculate orbit speed - outer shells are slower
                const orbitSpeed = 8 + shellIndex * 2;

                return (
                  <MotionGroup
                    key={electronId}
                    animate={{
                      rotateZ: [0, Math.PI * 2],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: orbitSpeed,
                      ease: "linear",
                    }}
                  >
                    <MotionMesh
                      position={[shell.radius, 0, 0]}
                      onClick={() => handlePartClick(electronId)}
                      whileHover={{ scale: 1.5 }}
                      animate={{
                        scale: [1, 1.15, 1],
                        y: [0, 0.3, 0, -0.3, 0],
                        z: [0, 0.3, 0, -0.3, 0]
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                        ease: "easeInOut",
                      }}
                    >
                      <sphereGeometry args={[0.4, 32, 32]} />
                      <meshStandardMaterial
                        color="#ff66cc"
                        emissive="#ff44cc"
                        emissiveIntensity={0.8}
                        roughness={0.3}
                        metalness={0.4}
                      />
                    </MotionMesh>
                  </MotionGroup>
                );
              })}
            </group>
          ))}

        {/* 3D Orbitals (Orbital mode) */}
        {mode === "orbital" &&
          electronShells.map((shell, shellIndex) => {
            if (shellIndex === 0) {
              // s-orbital (spherical)
              return (
                <MotionMesh
                  key={`orbital-${shellIndex}`}
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.5, 0.6, 0.5],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                >
                  <sphereGeometry args={[shell.radius * 0.9, 32, 32]} />
                  <meshStandardMaterial
                    color="#a855f7"
                    transparent
                    opacity={0.5}
                    emissive="#a855f7"
                    emissiveIntensity={0.4}
                  />
                </MotionMesh>
              );
            } else if (shellIndex === 1) {
              // p-orbitals (dumbbell shaped along 3 axes)
              return (
                <group key={`orbital-${shellIndex}`}>
                  {["x", "y", "z"].map((axis, i) => (
                    <MotionMesh
                      key={`p-orbital-${axis}`}
                      rotation={
                        axis === "x"
                          ? [0, 0, Math.PI / 2]
                          : axis === "y"
                          ? [0, 0, 0]
                          : [Math.PI / 2, 0, 0]
                      }
                      animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.5, 0.6, 0.5],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                        delay: i * 0.5,
                        ease: "easeInOut",
                      }}
                    >
                      <capsuleGeometry args={[0.7, shell.radius * 1.6, 24, 36]} />
                      <meshStandardMaterial
                        color={
                          i === 0 ? "#ff66cc" : i === 1 ? "#4488ff" : "#22cc88"
                        }
                        transparent
                        opacity={0.5}
                        emissive={
                          i === 0 ? "#ff44cc" : i === 1 ? "#2266ff" : "#00aa66"
                        }
                        emissiveIntensity={0.4}
                      />
                    </MotionMesh>
                  ))}
                </group>
              );
            } else {
              // d-orbitals (complex shapes, simplified as rotating spheres)
              return (
                <MotionGroup
                  key={`orbital-${shellIndex}`}
                  animate={{
                    rotateY: [0, Math.PI * 2],
                    rotateZ: [0, Math.PI],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 10,
                    ease: "linear",
                  }}
                >
                  {Array.from({ length: 5 }).map((_, i) => {
                    const angle = (i / 5) * Math.PI * 2;
                    return (
                      <MotionMesh
                        key={`d-orbital-${i}`}
                        position={[
                          Math.cos(angle) * shell.radius * 0.9,
                          Math.sin(angle) * shell.radius * 0.9,
                          0,
                        ]}
                        animate={{
                          scale: [1, 1.15, 1],
                          opacity: [0.4, 0.5, 0.4],
                          x: [
                            Math.cos(angle) * shell.radius * 0.9,
                            Math.cos(angle) * shell.radius * 1.1,
                            Math.cos(angle) * shell.radius * 0.9
                          ],
                          y: [
                            Math.sin(angle) * shell.radius * 0.9,
                            Math.sin(angle) * shell.radius * 1.1,
                            Math.sin(angle) * shell.radius * 0.9
                          ],
                          z: [0, 0.5, 0, -0.5, 0]
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 4,
                          delay: i * 0.3,
                          ease: "easeInOut",
                        }}
                      >
                        <sphereGeometry args={[shell.radius * 0.6, 24, 24]} />
                        <meshStandardMaterial
                          color="#ff9944"
                          transparent
                          opacity={0.5}
                          emissive="#ff7722"
                          emissiveIntensity={0.4}
                        />
                      </MotionMesh>
                    );
                  })}
                </MotionGroup>
              );
            }
          })}

        {/* Element symbol in the center */}
        <Text
          position={[0, 0, 0]}
          fontSize={1.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {element.symbol}
        </Text>

        {/* Information popup */}
        {showInfo && (
          <Html position={[0, 0, 0]} center style={{ pointerEvents: "none" }}>
            <div style={{ transform: "translateY(-8rem)", pointerEvents: "auto" }}>
              {getInfoContent()}
            </div>
          </Html>
        )}
      </>
    );
  }

  return (
    <Canvas 
      camera={{ position: [0, 0, 15], fov: 50 }}
      style={{ background: "#111827" }}
    >
      <ambientLight intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={2.5} />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#a855f7" />
      <pointLight position={[5, -8, 3]} intensity={1.2} color="#22cc88" />

      <AtomModel element={element} mode={mode} />

      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={30}
        autoRotate={true}
        autoRotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Canvas>
  );
}