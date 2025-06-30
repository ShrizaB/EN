import { CellVisualization } from "@/components/visuals/cell-visualization"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Cell Structure | Biology Visuals | EduPlay",
  description: "Interactive 3D visualization of plant and animal cell structures",
}

export default function CellStructurePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Cell Structure Visualization</h1>
      <p className="text-lg mb-6">
        Explore the 3D structure of plant and animal cells. Click on different parts to learn more about their
        functions.
      </p>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Interactive Cell Model</CardTitle>
          <CardDescription>
            Toggle between plant and animal cells, rotate the model, and click on organelles to learn more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CellVisualization />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Plant vs. Animal Cells</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">Key Differences:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Cell Wall:</span> Plant cells have a rigid cell wall made of cellulose,
                while animal cells only have a cell membrane.
              </li>
              <li>
                <span className="font-medium">Chloroplasts:</span> Plant cells contain chloroplasts for photosynthesis,
                which are absent in animal cells.
              </li>
              <li>
                <span className="font-medium">Vacuoles:</span> Plant cells have a large central vacuole for water
                storage, while animal cells have smaller, multiple vacuoles.
              </li>
              <li>
                <span className="font-medium">Shape:</span> Plant cells have a fixed, rectangular shape due to the cell
                wall, while animal cells have irregular shapes.
              </li>
              <li>
                <span className="font-medium">Lysosomes:</span> Animal cells typically have more lysosomes than plant
                cells.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Use This Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Switch Cell Types:</span> Use the buttons at the top to toggle between
                plant and animal cells.
              </li>
              <li>
                <span className="font-medium">Rotate:</span> Click and drag to rotate the cell model in 3D space.
              </li>
              <li>
                <span className="font-medium">Zoom:</span> Use the scroll wheel or pinch gesture to zoom in and out, or
                use the zoom slider.
              </li>
              <li>
                <span className="font-medium">Learn About Parts:</span> Click on any part of the cell to see detailed
                information about it.
              </li>
              <li>
                <span className="font-medium">Reset View:</span> Click the "Reset View" button to return to the default
                camera position.
              </li>
              <li>
                <span className="font-medium">Auto-Rotation:</span> Toggle auto-rotation on or off using the button.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cell Structure Facts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Did you know?</span> The cell was first discovered by Robert Hooke in 1665
              when he observed cork under a microscope and saw tiny compartments he called "cells."
            </p>
            <p>
              <span className="font-semibold">Size matters:</span> Most cells are between 1 and 100 micrometers in
              diameter, which is too small to see with the naked eye.
            </p>
            <p>
              <span className="font-semibold">Powerhouse:</span> Mitochondria are often called the "powerhouse of the
              cell" because they produce most of the cell's supply of ATP (adenosine triphosphate), which is used as a
              source of chemical energy.
            </p>
            <p>
              <span className="font-semibold">Cell division:</span> The human body replaces millions of cells every
              second. Over a lifetime, the human body will produce and discard trillions of cells.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
