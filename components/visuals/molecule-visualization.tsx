"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import * as THREE from "three";

// Define molecule data structures
interface Atom {
  element: string;
  position: [number, number, number];
  color: string;
}

interface Bond {
  start: number;
  end: number;
  double?: boolean;
}

interface BondAngle {
  atoms: number[];
  angle: string;
  position: [number, number, number];
}

interface Molecule {
  atoms: Atom[];
  bonds: Bond[];
  bondAngles: BondAngle[];
}

interface MoleculeStructures {
  [key: string]: Molecule;
}

const moleculeStructures: MoleculeStructures = {
  water: {
    atoms: [
      { element: "O", position: [0, 0, 0], color: "#FF5252" },
      { element: "H", position: [-0.8, 0.6, 0], color: "#FFFFFF" },
      { element: "H", position: [0.8, 0.6, 0], color: "#FFFFFF" },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
    ],
    bondAngles: [{ atoms: [1, 0, 2], angle: "104.5°", position: [0, 0.3, 0] }],
  },
  carbonDioxide: {
    atoms: [
      { element: "C", position: [0, 0, 0], color: "#424242" },
      { element: "O", position: [-1.2, 0, 0], color: "#FF5252" },
      { element: "O", position: [1.2, 0, 0], color: "#FF5252" },
    ],
    bonds: [
      { start: 0, end: 1, double: true },
      { start: 0, end: 2, double: true },
    ],
    bondAngles: [{ atoms: [1, 0, 2], angle: "180°", position: [0, 0.5, 0] }],
  },
  methane: {
    atoms: [
      { element: "C", position: [0, 0, 0], color: "#424242" },
      { element: "H", position: [0.6, 0.6, 0.6], color: "#FFFFFF" },
      { element: "H", position: [-0.6, 0.6, -0.6], color: "#FFFFFF" },
      { element: "H", position: [0.6, -0.6, -0.6], color: "#FFFFFF" },
      { element: "H", position: [-0.6, -0.6, 0.6], color: "#FFFFFF" },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
      { start: 0, end: 3 },
      { start: 0, end: 4 },
    ],
    bondAngles: [{ atoms: [1, 0, 2], angle: "109.5°", position: [0, 0.8, 0] }],
  },
  ammonia: {
    atoms: [
      { element: "N", position: [0, 0, 0], color: "#3F51B5" },
      { element: "H", position: [0.6, 0.6, 0], color: "#FFFFFF" },
      { element: "H", position: [-0.6, 0.6, 0], color: "#FFFFFF" },
      { element: "H", position: [0, 0.6, -0.6], color: "#FFFFFF" },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 0, end: 2 },
      { start: 0, end: 3 },
    ],
    bondAngles: [{ atoms: [1, 0, 2], angle: "107°", position: [0, 0.8, 0] }],
  },
  ethanol: {
    atoms: [
      { element: "C", position: [-0.8, 0, 0], color: "#424242" },
      { element: "C", position: [0.8, 0, 0], color: "#424242" },
      { element: "O", position: [1.8, 0.8, 0], color: "#FF5252" },
      { element: "H", position: [-1.2, 0.8, 0.4], color: "#FFFFFF" },
      { element: "H", position: [-1.2, -0.8, 0.4], color: "#FFFFFF" },
      { element: "H", position: [-1.2, 0, -0.8], color: "#FFFFFF" },
      { element: "H", position: [0.4, 0.8, 0.4], color: "#FFFFFF" },
      { element: "H", position: [0.4, -0.8, 0.4], color: "#FFFFFF" },
      { element: "H", position: [2.4, 0.4, 0], color: "#FFFFFF" },
    ],
    bonds: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 0, end: 3 },
      { start: 0, end: 4 },
      { start: 0, end: 5 },
      { start: 1, end: 6 },
      { start: 1, end: 7 },
      { start: 2, end: 8 },
    ],
    bondAngles: [{ atoms: [0, 1, 2], angle: "109°", position: [0.8, 0.4, 0] }],
  },
};

// Atom component
interface AtomProps {
  element: string;
  position: [number, number, number];
  color: string;
  radius?: number;
  selected: boolean;
  onClick: (element: string) => void;
  showVibration: boolean;
}

function Atom({ element, position, color, radius = 0.4, selected, onClick, showVibration }: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clickPosition, setClickPosition] = useState<[number, number, number]>([0, 0, 0]);

  // Vibration effect
  useFrame((state) => {
    if (meshRef.current && showVibration) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.set(
        position[0] + Math.sin(t * 10) * 0.03,
        position[1] + Math.sin(t * 10 + 1) * 0.03,
        position[2] + Math.sin(t * 10 + 2) * 0.03
      );
    } else if (meshRef.current) {
      meshRef.current.position.set(position[0], position[1], position[2]);
    }
  });

  // Adjust radius based on element
  const getRadius = (): number => {
    switch (element) {
      case "H":
        return 0.25;
      case "O":
      case "C":
      case "N":
        return 0.4;
      default:
        return radius;
    }
  };

  return (
    <group>
      <motion.mesh
        ref={meshRef}
        position={position}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          const point = e.intersections[0]?.point;
          if (point) {
            setClickPosition([point.x, point.y, point.z]);
          }
          onClick(element);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        animate={{
          scale: selected ? 1.2 : hovered ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        <sphereGeometry args={[getRadius(), 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.2}
          emissive={hovered || selected ? color : "#000000"}
          emissiveIntensity={hovered ? 0.3 : selected ? 0.5 : 0}
        />
      </motion.mesh>

      <Text
        position={[position[0], position[1] + getRadius() + 0.15, position[2]]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {element}
      </Text>

      {selected && clickPosition && (
        <mesh position={clickPosition}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </group>
  );
}

// Bond component
interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  double?: boolean;
  color?: string;
  showVibration: boolean;
}

function Bond({ start, end, double = false, color = "#FFFFFF", showVibration }: BondProps) {
  const bondRef = useRef<THREE.Group>(null);
  const midPoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  // Calculate direction vector
  const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);

  // Calculate length
  const length = direction.length();

  // Normalize direction vector
  direction.normalize();

  // Calculate rotation
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  // Vibration effect
  useFrame((state) => {
    if (bondRef.current && showVibration) {
      const t = state.clock.getElapsedTime();
      bondRef.current.position.set(
        midPoint[0] + Math.sin(t * 10) * 0.01,
        midPoint[1] + Math.sin(t * 10 + 1) * 0.01,
        midPoint[2] + Math.sin(t * 10 + 2) * 0.01
      );
    } else if (bondRef.current) {
      bondRef.current.position.set(midPoint[0], midPoint[1], midPoint[2]);
    }
  });

  return (
    <group ref={bondRef} position={midPoint} quaternion={quaternion}>
      {double ? (
        <>
          <mesh position={[0.07, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, length * 0.8, 8]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
          <mesh position={[-0.07, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, length * 0.8, 8]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
        </>
      ) : (
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, length * 0.8, 8]} />
          <meshStandardMaterial color={color} roughness={0.3} />
        </mesh>
      )}
    </group>
  );
}

// Bond angle component
interface BondAngleProps {
  atoms: number[];
  angle: string;
  position: [number, number, number];
}

function BondAngle({ atoms, angle, position }: BondAngleProps) {
  return (
    <Text
      position={position}
      fontSize={0.2}
      color="#FFD700"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#000000"
    >
      {angle}
    </Text>
  );
}

// Scene setup
interface MoleculeSceneProps {
  molecule: string;
  showVibration: boolean;
}

function MoleculeScene({ molecule, showVibration }: MoleculeSceneProps) {
  const [selectedAtom, setSelectedAtom] = useState<number | null>(null);
  const { camera } = useThree();
  const structure = moleculeStructures[molecule];

  // Reset camera position when molecule changes
  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    setSelectedAtom(null);
  }, [molecule, camera]);

  // Listen for reset camera event
  useEffect(() => {
    const handleResetCamera = () => {
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
    };

    window.addEventListener("resetCamera", handleResetCamera);
    return () => {
      window.removeEventListener("resetCamera", handleResetCamera);
    };
  }, [camera]);

  return (
    <group>
      {/* Atoms */}
      {structure.atoms.map((atom: Atom, index: number) => (
        <Atom
          key={`atom-${index}`}
          element={atom.element}
          position={atom.position}
          color={atom.color}
          selected={selectedAtom === index}
          onClick={() => setSelectedAtom(selectedAtom === index ? null : index)}
          showVibration={showVibration}
        />
      ))}

      {/* Bonds */}
      {structure.bonds.map((bond: Bond, index: number) => (
        <Bond
          key={`bond-${index}`}
          start={structure.atoms[bond.start].position}
          end={structure.atoms[bond.end].position}
          double={bond.double}
          showVibration={showVibration}
        />
      ))}

      {/* Bond Angles */}
      {structure.bondAngles.map((bondAngle: BondAngle, index: number) => (
        <BondAngle
          key={`angle-${index}`}
          atoms={bondAngle.atoms}
          angle={bondAngle.angle}
          position={bondAngle.position}
        />
      ))}

      {/* Information about selected atom */}
      {selectedAtom !== null && (
        <group position={[0, -1.5, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {`${structure.atoms[selectedAtom].element} - ${getAtomInfo(structure.atoms[selectedAtom].element)}`}
          </Text>
        </group>
      )}
    </group>
  );
}

// Helper function to get atom information
function getAtomInfo(element: string): string {
  const atomInfo: Record<string, string> = {
    H: "Hydrogen (1 proton, 0 neutrons, 1 electron)",
    C: "Carbon (6 protons, 6 neutrons, 6 electrons)",
    O: "Oxygen (8 protons, 8 neutrons, 8 electrons)",
    N: "Nitrogen (7 protons, 7 neutrons, 7 electrons)",
  };

  return atomInfo[element] || element;
}

// Main component
interface MoleculeVisualizationProps {
  molecule: string;
  showVibration: boolean;
}

export default function MoleculeVisualization({ molecule, showVibration }: MoleculeVisualizationProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <MoleculeScene molecule={molecule} showVibration={showVibration} />

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={10} />
    </Canvas>
  );
}