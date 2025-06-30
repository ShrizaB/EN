"use client"

import { useState } from "react"
import { ChemicalReactionVisualization } from "@/components/visuals/chemical-reaction-visualization"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
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

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6 flex items-center">
        <Link href="/eduplay/visuals/chemistry">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Chemistry
          </Button>
        </Link>
      </div>

      <div className="animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Chemical Reactions</h1>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
          Explore how atoms rearrange to form new substances during chemical reactions. Watch as bonds break and form in
          these interactive 3D visualizations.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <Tabs
            defaultValue={chemicalReactions[0].id}
            onValueChange={(value) => {
              const reaction = chemicalReactions.find((r) => r.id === value)
              if (reaction) setSelectedReaction(reaction)
            }}
          >
            <TabsList className="mb-6 grid grid-cols-1 md:grid-cols-3">
              {chemicalReactions.map((reaction) => (
                <TabsTrigger key={reaction.id} value={reaction.id}>
                  {reaction.name.split("(")[0].trim()}
                </TabsTrigger>
              ))}
            </TabsList>

            {chemicalReactions.map((reaction) => (
              <TabsContent key={reaction.id} value={reaction.id} className="mt-0">
                <ChemicalReactionVisualization reaction={reaction} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">About {selectedReaction.name.split("(")[0].trim()}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Reaction Details</h3>
              <p className="mb-4">{selectedReaction.description}</p>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-center">
                <span className="font-mono text-lg">{selectedReaction.name.split("(")[1].replace(")", "")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Energy Change</h3>
              <div
                className={`p-4 rounded-md ${selectedReaction.energyChange > 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"} mb-2`}
              >
                <p className="font-semibold">
                  {selectedReaction.energyChange > 0 ? "Endothermic Reaction" : "Exothermic Reaction"}
                </p>
                <p className="text-sm">
                  {selectedReaction.energyChange > 0
                    ? "Energy is absorbed from the surroundings"
                    : "Energy is released to the surroundings"}
                </p>
              </div>
              <p className="text-center font-mono">ΔH = {selectedReaction.energyChange} kJ/mol</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}