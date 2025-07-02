import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Biology Visuals | EduPlay",
  description: "Interactive 3D visualizations of biology concepts",
}

export default function BiologyVisualsPage() {
  return (
    <div className="container mx-auto py-8 mt-10 ">
      <h1 className="text-3xl font-bold mb-6">Biology Visualizations</h1>
      <p className="text-lg mb-8">
        Explore biology concepts through interactive 3D visualizations. Click on any topic below to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Cell Structure</CardTitle>
            <CardDescription>Explore the 3D structure of plant and animal cells</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-md flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-green-200 dark:bg-green-800 relative">
                <div className="absolute w-8 h-8 rounded-full bg-blue-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute w-4 h-4 rounded-full bg-red-500 top-1/4 right-1/4"></div>
                <div className="absolute w-4 h-4 rounded-full bg-purple-500 bottom-1/4 left-1/4"></div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/eduplay/visuals/biology/cell-structure" className="w-full">
              <Button className="w-full">Explore Cell Structure</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden opacity-60">
          <CardHeader className="pb-2">
            <CardTitle>DNA Structure</CardTitle>
            <CardDescription>Visualize the double helix structure of DNA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-md flex items-center justify-center">
              <div className="w-8 h-40 relative">
                <div className="absolute w-full h-full border-l-2 border-blue-500 transform rotate-12"></div>
                <div className="absolute w-full h-full border-l-2 border-purple-500 transform -rotate-12"></div>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-6 h-1 bg-gray-400 dark:bg-gray-600 left-0"
                    style={{ top: `${i * 12.5}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>

        <Card className="overflow-hidden opacity-60">
          <CardHeader className="pb-2">
            <CardTitle>Human Body Systems</CardTitle>
            <CardDescription>Interactive 3D models of human body systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900 rounded-md flex items-center justify-center">
              <div className="w-16 h-40 bg-red-200 dark:bg-red-800 rounded-t-full relative">
                <div className="absolute w-10 h-10 rounded-full bg-red-300 dark:bg-red-700 top-8 left-1/2 transform -translate-x-1/2"></div>
                <div className="absolute w-8 h-12 bg-red-400 dark:bg-red-600 top-20 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
