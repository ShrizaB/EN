import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading component for the Resume Analyzer page
 * 
 * This component displays skeleton loaders while the page is loading,
 * providing a better user experience during page transitions.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-80 mx-auto bg-white/20" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
            <Skeleton className="h-4 w-80 mx-auto bg-white/20" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto p-6">
          <Card className="w-full">
            <CardHeader>
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Upload Area Skeleton */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="text-center space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-10 w-32 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-80 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="text-center space-y-4">
                <Skeleton className="w-16 h-16 rounded-full mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
