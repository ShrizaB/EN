"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Beaker, Info, RotateCw, Vibrate, Atom, Zap } from "lucide-react"
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
    <div className="container px-6 py-10 mx-auto mt-16 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <div className="text-center mb-10 animate-fadeInUp">
        <div className="inline-block relative">
          <h1 className="text-5xl font-extrabold text-indigo-400 tracking-tight mb-4 relative">
            Molecular Structures
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
          Explore the 3D structure of common molecules, their bond angles, and vibrations!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="h-fit bg-gray-800/80 border-none shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-5 text-indigo-300 flex items-center">
                <Beaker className="mr-2 h-6 w-6 text-indigo-400" /> Select a Molecule
              </h2>

              <div className="space-y-3">
                {Object.entries(molecules).map(([id, molecule]) => (
                  <Button
                    key={id}
                    variant={selectedMolecule === id ? "default" : "outline"}
                    className={`w-full justify-start text-left transition-all duration-300 ${selectedMolecule === id
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-indigo-900/50 hover:text-indigo-300"
                      } rounded-lg py-3`}
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

              <div className="mt-6 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">Visualization Controls</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={showVibration ? "default" : "outline"}
                    className={`transition-all duration-300 ${showVibration
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-indigo-900/50 hover:text-indigo-300"
                      } rounded-lg py-3`}
                    onClick={() => setShowVibration(!showVibration)}
                  >
                    <Vibrate className="mr-2 h-4 w-4" />
                    {showVibration ? "Stop Vibration" : "Show Vibration"}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-indigo-900/50 hover:text-indigo-300 transition-all duration-300 rounded-lg py-3"
                    onClick={() => {
                      const event = new CustomEvent("resetCamera")
                      window.dispatchEvent(event)
                    }}
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    Reset View
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">Molecule Details</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="font-medium text-indigo-300">Formula</div>
                    <div className="text-lg font-mono mt-1">{molecules[selectedMolecule as keyof typeof molecules].formula}</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="font-medium text-indigo-300">Bond Angles</div>
                    <div className="mt-1">{molecules[selectedMolecule as keyof typeof molecules].bondAngles}</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="font-medium text-indigo-300">Description</div>
                    <p className="mt-1 text-gray-300">{molecules[selectedMolecule as keyof typeof molecules].description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="bg-gray-800/80 border-none shadow-xl h-full">
            <CardContent className="p-0 h-[500px] relative">
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-black/70 text-gray-200 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Drag to rotate • Scroll to zoom • Right-click to pan
                </div>
              </div>
              <MoleculeVisualization molecule={selectedMolecule} showVibration={showVibration} />
            </CardContent>
          </Card>

          <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <Card className="bg-gray-800/80 border-none shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-indigo-300">
                  <Info className="mr-2 h-6 w-6 text-indigo-400" />
                  About {molecules[selectedMolecule as keyof typeof molecules].name}
                </h2>

                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-700 rounded-full animate-pulse" style={{ width: `${80 - i * 10}%` }}></div>
                    ))}
                  </div>
                ) : (
                  <Tabs defaultValue="key-points">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-700/50 border border-gray-600 rounded-xs p-1 mb-6">
                      <TabsTrigger
                        value="key-points"
                        className="transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-indigo-300 rounded-xs"
                      >
                        <Zap className="mr-2 h-4 w-4" /> Key Points
                      </TabsTrigger>
                      <TabsTrigger
                        value="fun-facts"
                        className="transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-indigo-300 rounded-xs"
                      >
                        <Atom className="mr-2 h-4 w-4" /> Fun Facts
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="key-points" className="space-y-4">
                      <ul className="space-y-3">
                        {content?.keyPoints.map((point: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start group"
                            style={{
                              animation: `fadeInUp 0.3s ease-out forwards`,
                              animationDelay: `${index * 0.1}s`,
                              opacity: 0
                            }}
                          >
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-600/20 text-indigo-400 rounded-full text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="fun-facts" className="space-y-4">
                      <ul className="space-y-3">
                        {content?.funFacts.map((fact: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start group"
                            style={{
                              animation: `fadeInUp 0.3s ease-out forwards`,
                              animationDelay: `${index * 0.1}s`,
                              opacity: 0
                            }}
                          >
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-purple-600/20 text-purple-400 rounded-full text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-300">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
      </div>
        </div>
    </div>
  </div>
  )
}
