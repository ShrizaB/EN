"use client"

import { useState, useEffect } from "react"
import { ChemicalReactionVisualization } from "@/components/visuals/chemical-reaction-visualization"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Beaker, Info, Zap, Activity } from "lucide-react"
import Link from "next/link"

// Define our chemical reactions
const chemicalReactions = [
  {
    id: "water-formation",
    name: "Water Formation (H₂ + O₂ → H₂O)",
    description:
      "Hydrogen gas reacts with oxygen gas to form water. This is a highly exothermic reaction, releasing a large amount of energy in the form of heat and light.",
    reactants: [
      {
        id: "hydrogen",
        name: "Hydrogen (H₂)",
        atoms: [
          { element: "H", color: "#ffffff", position: [-0.5, 0, 0] as [number, number, number], size: 0.4 },
          { element: "H", color: "#ffffff", position: [0.5, 0, 0] as [number, number, number], size: 0.4 },
        ],
        bonds: [[0, 1] as [number, number]],
      },
      {
        id: "oxygen",
        name: "Oxygen (O₂)",
        atoms: [
          { element: "O", color: "#ff0000", position: [-0.6, 0, 0] as [number, number, number], size: 0.5 },
          { element: "O", color: "#ff0000", position: [0.6, 0, 0] as [number, number, number], size: 0.5 },
        ],
        bonds: [[0, 1] as [number, number]],
      },
    ],
    products: [
      {
        id: "water",
        name: "Water (H₂O)",
        atoms: [
          { element: "O", color: "#ff0000", position: [0, 0, 0] as [number, number, number], size: 0.5 },
          { element: "H", color: "#ffffff", position: [-0.8, 0.5, 0] as [number, number, number], size: 0.4 },
          { element: "H", color: "#ffffff", position: [0.8, 0.5, 0] as [number, number, number], size: 0.4 },
        ],
        bonds: [[0, 1] as [number, number], [0, 2] as [number, number]],
      },
    ],
    energyChange: -286, // kJ/mol, negative means exothermic
  },
  {
    id: "methane-combustion",
    name: "Methane Combustion (CH₄ + 2O₂ → CO₂ + 2H₂O)",
    description:
      "Methane gas reacts with oxygen to produce carbon dioxide and water. This is the main reaction that occurs when natural gas burns in air.",
    reactants: [
      {
        id: "methane",
        name: "Methane (CH₄)",
        atoms: [
          { element: "C", color: "#808080", position: [0, 0, 0] as [number, number, number], size: 0.5 },
          { element: "H", color: "#ffffff", position: [0.8, 0.8, 0] as [number, number, number], size: 0.4 },
          { element: "H", color: "#ffffff", position: [-0.8, 0.8, 0] as [number, number, number], size: 0.4 },
          { element: "H", color: "#ffffff", position: [0, -0.8, 0.8] as [number, number, number], size: 0.4 },
          { element: "H", color: "#ffffff", position: [0, -0.8, -0.8] as [number, number, number], size: 0.4 },
        ],
        bonds: [
          [0, 1] as [number, number],
          [0, 2] as [number, number],
          [0, 3] as [number, number],
          [0, 4] as [number, number],
        ],
      },
      {
        id: "oxygen-1",
        name: "Oxygen (O₂)",
        atoms: [
          { element: "O", color: "#ff0000", position: [-0.6, 0, 0] as [number, number, number], size: 0.5 },
          { element: "O", color: "#ff0000", position: [0.6, 0, 0] as [number, number, number], size: 0.5 },
        ],
        bonds: [[0, 1] as [number, number]],
      },
    ],
    products: [
      {
        id: "carbon-dioxide",
        name: "Carbon Dioxide (CO₂)",
        atoms: [
          { element: "C", color: "#808080", position: [0, 0, 0] as [number, number, number], size: 0.5 },
          { element: "O", color: "#ff0000", position: [-1, 0, 0] as [number, number, number], size: 0.5 },
          { element: "O", color: "#ff0000", position: [1, 0, 0] as [number, number, number], size: 0.5 },
        ],
        bonds: [[0, 1] as [number, number], [0, 2] as [number, number]],
      },
      {
        id: "water-1",
        name: "Water (H₂O)",
        atoms: [
          { element: "O", color: "#ff0000", position: [0, 0, 0] as [number, number, number], size: 0.5 },
          { element: "H", color: "#ffffff", position: [-0.8, 0.5, 0] as [number, number, number], size: 0.4 },
          { element: "H", color: "#ffffff", position: [0.8, 0.5, 0] as [number, number, number], size: 0.4 },
        ],
        bonds: [[0, 1] as [number, number], [0, 2] as [number, number]],
      },
    ],
    energyChange: -890, // kJ/mol, negative means exothermic
  },
  {
    id: "photosynthesis",
    name: "Photosynthesis (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂)",
    description:
      "Plants convert carbon dioxide and water into glucose and oxygen using energy from sunlight. This is an endothermic reaction that stores solar energy in chemical bonds.",
    reactants: [
      {
        id: "carbon-dioxide",
        name: "Carbon Dioxide (CO₂)",
        atoms: [
          { element: "C", color: "#808080", position: [0, 0, 0] as [number, number, number], size: 0.5 },
          { element: "O", color: "#ff0000", position: [-1, 0, 0] as [number, number, number], size: 0.5 },
          { element: "O", color: "#ff0000", position: [1, 0, 0] as [number, number, number], size: 0.5 },
        ],
        bonds: [[0, 1] as [number, number], [0, 2] as [number, number]],
      },
      {
        id: "water",
        name: "Water (H₂O)",
        atoms: [
          { element: "O", color: "#ff0000", position: [0, 0, 0] as [number, number, number], size: 0.5 },
          { element: "H", color: "#ffffff", position: [-0.8, 0.5, 0] as [number, number, number], size: 0.4 },
          { element: "H", color: "#ffffff", position: [0.8, 0.5, 0] as [number, number, number], size: 0.4 },
        ],
        bonds: [[0, 1] as [number, number], [0, 2] as [number, number]],
      },
    ],
    products: [
      {
        id: "glucose",
        name: "Glucose (C₆H₁₂O₆)",
        atoms: [
          // Simplified representation of glucose
          { element: "C", color: "#808080", position: [0, 0, 0] as [number, number, number], size: 0.5 },
          { element: "C", color: "#808080", position: [1, 0, 0] as [number, number, number], size: 0.5 },
          { element: "C", color: "#808080", position: [0, 1, 0] as [number, number, number], size: 0.5 },
          { element: "O", color: "#ff0000", position: [0.5, 0.5, 0] as [number, number, number], size: 0.5 },
          { element: "O", color: "#ff0000", position: [-0.5, 0.5, 0] as [number, number, number], size: 0.5 },
          { element: "H", color: "#ffffff", position: [1.5, 0.5, 0] as [number, number, number], size: 0.4 },
        ],
        bonds: [
          [0, 1] as [number, number],
          [0, 2] as [number, number],
          [1, 3] as [number, number],
          [2, 4] as [number, number],
          [1, 5] as [number, number],
        ],
      },
      {
        id: "oxygen",
        name: "Oxygen (O₂)",
        atoms: [
          { element: "O", color: "#ff0000", position: [-0.6, 0, 0] as [number, number, number], size: 0.5 },
          { element: "O", color: "#ff0000", position: [0.6, 0, 0] as [number, number, number], size: 0.5 },
        ],
        bonds: [[0, 1] as [number, number]],
      },
    ],
    energyChange: 2870, // kJ/mol, positive means endothermic
  },
]

export default function ChemicalReactionsPage() {
  const [selectedReaction, setSelectedReaction] = useState(chemicalReactions[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading content
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [selectedReaction])

  return (
    <div className="container px-6 py-10 mx-auto mt-16 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <div className="text-center mb-10 animate-fadeInUp">
        <div className="inline-block relative">
          <h1 className="text-5xl font-extrabold text-indigo-400 tracking-tight mb-4 relative">
            Chemical Reactions
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
          Explore how atoms rearrange to form new substances during chemical reactions. Watch as bonds break and form in these interactive 3D visualizations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="h-fit bg-gray-800/80 border-none shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-5 text-indigo-300 flex items-center">
                <Beaker className="mr-2 h-6 w-6 text-indigo-400" /> Select a Reaction
              </h2>

              <div className="space-y-3">
                {chemicalReactions.map((reaction) => (
                  <Button
                    key={reaction.id}
                    variant={selectedReaction.id === reaction.id ? "default" : "outline"}
                    className={`w-full justify-start text-left transition-all duration-300 ${
                      selectedReaction.id === reaction.id
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-indigo-900/50 hover:text-indigo-300"
                    } rounded-lg py-3`}
                    onClick={() => setSelectedReaction(reaction)}
                  >
                    <div>
                      <div className="font-bold">{reaction.name.split("(")[0].trim()}</div>
                      <div className="text-xs opacity-80">
                        {reaction.name.split("(")[1].replace(")", "")}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-gray-300">Reaction Details</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="font-medium text-indigo-300">Type</div>
                    <div className="mt-1">
                      {selectedReaction.energyChange > 0 ? "Endothermic" : "Exothermic"} Reaction
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="font-medium text-indigo-300">Energy Change</div>
                    <div className="mt-1">
                      ΔH = {selectedReaction.energyChange} kJ/mol
                    </div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="font-medium text-indigo-300">Description</div>
                    <p className="mt-1 text-gray-300">{selectedReaction.description}</p>
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
              <ChemicalReactionVisualization reaction={selectedReaction} />
            </CardContent>
          </Card>

          <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <Card className="bg-gray-800/80 border-none shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-indigo-300">
                  <Info className="mr-2 h-6 w-6 text-indigo-400" />
                  About {selectedReaction.name.split("(")[0].trim()}
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
                        value="energy"
                        className="transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-indigo-300 rounded-xs"
                      >
                        <Activity className="mr-2 h-4 w-4" /> Energy Analysis
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="key-points" className="space-y-4">
                      <ul className="space-y-3">
                        {selectedReaction.description.split('. ').filter(Boolean).map((point, index) => (
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
                            <span className="text-gray-300">{point.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="energy" className="space-y-4">
                      <div className="space-y-3">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Activity className="h-5 w-5 mr-2 text-indigo-400" />
                            <h3 className="text-lg font-semibold text-indigo-300">Energy Change</h3>
                          </div>
                          <p className="text-gray-300">
                            This reaction is <span className="font-semibold">
                              {selectedReaction.energyChange > 0 ? 'endothermic' : 'exothermic'}
                            </span>, meaning it 
                            {selectedReaction.energyChange > 0 
                              ? 'absorbs energy from its surroundings. ' 
                              : 'releases energy to its surroundings. '}
                            The enthalpy change (ΔH) is:
                          </p>
                          <div className="mt-3 text-center">
                            <div className="inline-block px-4 py-2 bg-gray-800 rounded-lg">
                              <span className="text-2xl font-mono">
                                ΔH = {selectedReaction.energyChange} kJ/mol
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
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