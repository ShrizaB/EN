"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Beaker, Info, RotateCw, Vibrate } from "lucide-react"
// Update the import path for MoleculeVisualization
import MoleculeVisualization from "@/components/visuals/molecule-visualization"

export default function MolecularStructuresPage() {
  const [selectedMolecule, setSelectedMolecule] = useState("water")
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<any>(null)
  const [showVibration, setShowVibration] = useState(false)

  // Molecule data
  const molecules = {
    water: {
      name: "Water (H₂O)",
      formula: "H₂O",
      description:
        "Water is essential for all known forms of life. It has a bent structure with a bond angle of 104.5°.",
      bondAngles: "H-O-H: 104.5°",
      atoms: [
        { element: "O", count: 1, color: "#FF5252" },
        { element: "H", count: 2, color: "#FFFFFF" },
      ],
    },
    carbonDioxide: {
      name: "Carbon Dioxide (CO₂)",
      formula: "CO₂",
      description: "Carbon dioxide is a colorless gas vital for plant photosynthesis. It has a linear structure.",
      bondAngles: "O-C-O: 180°",
      atoms: [
        { element: "C", count: 1, color: "#424242" },
        { element: "O", count: 2, color: "#FF5252" },
      ],
    },
    methane: {
      name: "Methane (CH₄)",
      formula: "CH₄",
      description: "Methane is the simplest hydrocarbon and a potent greenhouse gas. It has a tetrahedral structure.",
      bondAngles: "H-C-H: 109.5°",
      atoms: [
        { element: "C", count: 1, color: "#424242" },
        { element: "H", count: 4, color: "#FFFFFF" },
      ],
    },
    ammonia: {
      name: "Ammonia (NH₃)",
      formula: "NH₃",
      description: "Ammonia is a compound of nitrogen and hydrogen. It has a trigonal pyramidal structure.",
      bondAngles: "H-N-H: 107°",
      atoms: [
        { element: "N", count: 1, color: "#3F51B5" },
        { element: "H", count: 3, color: "#FFFFFF" },
      ],
    },
    ethanol: {
      name: "Ethanol (C₂H₅OH)",
      formula: "C₂H₅OH",
      description: "Ethanol is the alcohol found in alcoholic beverages. It has a complex 3D structure.",
      bondAngles: "Various bond angles",
      atoms: [
        { element: "C", count: 2, color: "#424242" },
        { element: "H", count: 6, color: "#FFFFFF" },
        { element: "O", count: 1, color: "#FF5252" },
      ],
    },
  }

  // Simulated content fetch (in a real app, this would come from Gemini API)
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // This would be replaced with actual Gemini API call
      const moleculeInfo = {
        water: {
          keyPoints: [
            "Water molecules have a bent shape due to the oxygen atom's electron pairs.",
            "The H-O-H bond angle is approximately 104.5°.",
            "Water's unique properties come from hydrogen bonding between molecules.",
            "Water is a polar molecule, with the oxygen side having a partial negative charge.",
          ],
          funFacts: [
            "Water is the only natural substance found in all three states (solid, liquid, gas) on Earth.",
            "Hot water can freeze faster than cold water under certain conditions (Mpemba effect).",
            "Water has unusually high surface tension, allowing some insects to walk on it.",
          ],
        },
        carbonDioxide: {
          keyPoints: [
            "CO₂ has a linear structure with the carbon atom in the center.",
            "The O=C=O bond angle is 180°.",
            "Carbon dioxide is nonpolar despite having polar bonds because the dipoles cancel out.",
            "CO₂ forms a weak acid (carbonic acid) when dissolved in water.",
          ],
          funFacts: [
            "CO₂ is what makes soda fizzy!",
            "Plants use CO₂ during photosynthesis to create oxygen and glucose.",
            "Solid CO₂ is known as 'dry ice' and sublimates directly from solid to gas.",
          ],
        },
        methane: {
          keyPoints: [
            "Methane has a tetrahedral structure with the carbon atom at the center.",
            "All H-C-H bond angles are 109.5°.",
            "Methane is nonpolar and has symmetric electron distribution.",
            "It's the simplest alkane and the main component of natural gas.",
          ],
          funFacts: [
            "Methane is a greenhouse gas about 25 times more potent than CO₂.",
            "Bacteria that produce methane are called methanogens.",
            "Methane can form ice-like structures called methane clathrates in deep ocean sediments.",
          ],
        },
        ammonia: {
          keyPoints: [
            "Ammonia has a trigonal pyramidal structure with nitrogen at the apex.",
            "The H-N-H bond angle is approximately 107°.",
            "Ammonia is a polar molecule with the nitrogen having a partial negative charge.",
            "It can form hydrogen bonds, giving it a higher boiling point than expected.",
          ],
          funFacts: [
            "Ammonia has a distinctive strong smell.",
            "It's commonly used in cleaning products and fertilizers.",
            "Liquid ammonia can be used as a refrigerant.",
          ],
        },
        ethanol: {
          keyPoints: [
            "Ethanol consists of an ethyl group linked to a hydroxyl group.",
            "The C-C-O bond angle is approximately 109°.",
            "The hydroxyl group makes ethanol polar and able to form hydrogen bonds.",
            "Ethanol is miscible with water due to its ability to form hydrogen bonds.",
          ],
          funFacts: [
            "Ethanol is the type of alcohol found in alcoholic beverages.",
            "It can be produced by fermentation of sugars by yeasts.",
            "Ethanol is used as a biofuel and solvent in many industries.",
          ],
        },
      }

      setContent(moleculeInfo[selectedMolecule as keyof typeof moleculeInfo])
      setIsLoading(false)
    }

    fetchContent()
  }, [selectedMolecule])

  return (
    <div className="container px-4 py-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Molecular Structures
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore the 3D structure of common molecules, their bond angles, and vibrations!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="p-6 h-full">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Beaker className="mr-2 h-6 w-6 text-blue-500" />
              Select a Molecule
            </h2>

            <div className="space-y-3">
              {Object.entries(molecules).map(([id, molecule]) => (
                <Button
                  key={id}
                  variant={selectedMolecule === id ? "default" : "outline"}
                  className={`w-full justify-start text-left ${
                    selectedMolecule === id ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""
                  }`}
                  onClick={() => {
                    setSelectedMolecule(id)
                    setShowVibration(false)
                  }}
                >
                  <div>
                    <div className="font-bold">{molecule.name}</div>
                    <div className="text-xs opacity-80">
                      {molecule.atoms.map((atom) => (
                        <span key={atom.element} className="mr-2">
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-1"
                            style={{ backgroundColor: atom.color }}
                          ></span>
                          {atom.element}: {atom.count}
                        </span>
                      ))}
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Visualization Controls</h3>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowVibration(!showVibration)}>
                  <Vibrate className="mr-2 h-4 w-4" />
                  {showVibration ? "Stop Vibration" : "Show Vibration"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // This would trigger a reset of the camera in the 3D component
                    const event = new CustomEvent("resetCamera")
                    window.dispatchEvent(event)
                  }}
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  Reset View
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Molecule Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Formula:</span>{" "}
                  {molecules[selectedMolecule as keyof typeof molecules].formula}
                </div>
                <div>
                  <span className="font-medium">Bond Angles:</span>{" "}
                  {molecules[selectedMolecule as keyof typeof molecules].bondAngles}
                </div>
                <div>
                  <span className="font-medium">Description:</span>{" "}
                  {molecules[selectedMolecule as keyof typeof molecules].description}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card className="overflow-hidden h-[500px] relative">
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                Drag to rotate • Scroll to zoom
              </div>
            </div>
            <MoleculeVisualization molecule={selectedMolecule} showVibration={showVibration} />
          </Card>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Info className="mr-2 h-6 w-6 text-purple-500" />
                About {molecules[selectedMolecule as keyof typeof molecules].name}
              </h2>

              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6"></div>
                </div>
              ) : (
                <Tabs defaultValue="key-points">
                  <TabsList className="mb-4">
                    <TabsTrigger value="key-points">Key Points</TabsTrigger>
                    <TabsTrigger value="fun-facts">Fun Facts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="key-points" className="space-y-4">
                    <ul className="list-disc pl-5 space-y-2">
                      {content?.keyPoints.map((point: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {point}
                        </motion.li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="fun-facts" className="space-y-4">
                    <ul className="list-disc pl-5 space-y-2">
                      {content?.funFacts.map((fact: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {fact}
                        </motion.li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
