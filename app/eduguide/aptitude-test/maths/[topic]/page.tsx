"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronRight, BookOpen, Video, PenTool, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateContent } from "@/lib/gemini-api"
import { searchYouTubeVideos, type YouTubeVideo } from "@/lib/youtube-api"
import { generateMockTest, type MockTestQuestion } from "@/lib/mock-test-generator"
import { MockTest } from "@/components/aptitude/mock-test"

// Topic name mapping
const topicNames = {
  "time-and-distance": "Time and Distance",
  percentage: "Percentage",
  "profit-and-loss": "Profit and Loss",
  "ratio-and-proportion": "Ratio and Proportion",
  "square-roots": "Square Roots",
  squares: "Squares",
  "cube-and-cube-root": "Cube and Cube Root",
  multiplication: "Multiplication",
  addition: "Addition",
  simplifications: "Simplifications",
  "decimal-fractions": "Decimal Fractions",
  "surds-and-indices": "Surds and Indices",
  "time-and-work": "Time and Work",
  "pipe-and-cistern": "Pipe and Cistern",
  "simple-interest": "Simple Interest",
  "compound-interest": "Compound Interest",
  "data-interpretation": "Data Interpretation",
  "data-sufficiency": "Data Sufficiency",
  mensuration: "Mensuration",
}

export default function MathTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topic as string
  const topicName = topicNames[topicId as keyof typeof topicNames] || topicId

  const [content, setContent] = useState<string>("")
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [questions, setQuestions] = useState<MockTestQuestion[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [videosLoading, setVideosLoading] = useState<boolean>(true)
  const [questionsLoading, setQuestionsLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("learn")
  const [showTest, setShowTest] = useState<boolean>(false)

  useEffect(() => {
    async function fetchContent() {
      setLoading(true)
      try {
        const prompt = `Create a comprehensive educational content about ${topicName} for competitive exam preparation. Include:
        1. Introduction to ${topicName}
        2. Key formulas and concepts
        3. Step-by-step examples with solutions
        4. Common tricks and shortcuts
        5. Tips for solving problems quickly in exams
        
        Format the content with proper headings, bullet points, and mathematical notations where needed.
        Make it educational and easy to understand for students preparing for competitive exams.`

        const generatedContent = await generateContent(prompt)
        setContent(generatedContent)
      } catch (error) {
        console.error("Error generating content:", error)
        setContent("Failed to load content. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    async function fetchVideos() {
      setVideosLoading(true)
      try {
        const searchQuery = `${topicName} math tutorial for competitive exams`
        const fetchedVideos = await searchYouTubeVideos(searchQuery, 6)
        setVideos(fetchedVideos)
      } catch (error) {
        console.error("Error fetching videos:", error)
        setVideos([])
      } finally {
        setVideosLoading(false)
      }
    }

    async function fetchQuestions() {
      setQuestionsLoading(true)
      try {
        const generatedQuestions = await generateMockTest(topicName, "Mathematics", 20)
        setQuestions(generatedQuestions)
      } catch (error) {
        console.error("Error generating questions:", error)
        setQuestions([])
      } finally {
        setQuestionsLoading(false)
      }
    }

    fetchContent()
    fetchVideos()
    fetchQuestions()
  }, [topicName])

  const handleStartTest = () => {
    setShowTest(true)
  }

  const handleFinishTest = () => {
    setShowTest(false)
    setActiveTab("learn")
  }

  const handleBackFromTest = () => {
    setShowTest(false)
  }

  if (showTest) {
    return (
      <MockTest
        topic={topicName}
        subject="Mathematics"
        questions={questions}
        onFinish={handleFinishTest}
        onBack={handleBackFromTest}
      />
    )
  }

  return (
    <main className="flex-1 py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/eduguide/aptitude-test/maths"
              className="text-sm text-muted-foreground hover:text-primary flex items-center mb-2"
            >
              <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
              Back to Mathematics Topics
            </Link>
            <h1 className="text-4xl font-bold mb-4">{topicName}</h1>
            <p className="text-xl text-muted-foreground">
              Learn the concepts, practice with examples, and test your knowledge with a mock test.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="learn" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learn
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                Mock Test
              </TabsTrigger>
            </TabsList>

            <TabsContent value="learn" className="mt-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Generating content...</p>
                </div>
              ) : (
                <div className="prose prose-blue max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Recommended Videos</h2>
                {videosLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Finding the best videos...</p>
                  </div>
                ) : videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video) => (
                      <div key={video.id} className="bg-card border border-border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-secondary/50 relative group">
                          <img
                            src={video.thumbnailUrl || "/placeholder.svg"}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white text-black hover:bg-white/90"
                              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}
                            >
                              Watch on YouTube
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-1 line-clamp-2">{video.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {video.channelTitle} • {video.duration}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}
                          >
                            Watch Video
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No videos found. Please try again later.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="test" className="mt-6">
              <div className="text-center py-12 space-y-6">
                <h2 className="text-2xl font-bold">Mock Test: {topicName}</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Test your knowledge with a 20-question mock test designed like competitive exams.
                </p>
                <div className="flex flex-col gap-2 max-w-xs mx-auto">
                  <div className="flex justify-between text-sm">
                    <span>Questions: 20</span>
                    <span>Time: 20 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Difficulty: Medium</span>
                    <span>Passing: 60%</span>
                  </div>
                </div>
                {questionsLoading ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Generating questions...</p>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    onClick={handleStartTest}
                  >
                    Start Mock Test
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}