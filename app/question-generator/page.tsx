"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImportantQuestionsList } from "@/components/important-questions-list"
import { Loader, FileText, ImageIcon, AlertCircle, Upload, RefreshCw } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import "./thor-theme.css"
import { useRef } from "react"

// Lightning effect JavaScript
const initLightning = () => {
  const canvas = document.getElementById('storm-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  let bolts: LightningBolt[] = [];
  let particles: Particle[] = [];
  let timer = 0;
  let nextStrike = Math.random() * 120 + 120;

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    life: number;
    opacity: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = (Math.random() - 0.5) * 3;
      this.radius = Math.random() * 1.5 + 0.5;
      this.life = Math.random() * 50 + 20;
      this.opacity = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life--;
      this.opacity = this.life / 70;
    }

    draw() {
      if (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }
  }

  class LightningBolt {
    startX: number;
    startY: number;
    segments: { x1: number; y1: number; x2: number; y2: number }[];
    life: number;
    maxLife: number;
    opacity: number;

    constructor() {
      this.startX = Math.random() * canvas.width;
      this.startY = 0;
      this.segments = [];
      this.life = Math.random() * 120 + 90;
      this.maxLife = this.life;
      this.opacity = 1;

      let currentX = this.startX;
      let currentY = this.startY;
      let segmentCount = Math.floor(Math.random() * 10 + 15);

      for (let i = 0; i < segmentCount; i++) {
        let nextX = currentX + (Math.random() - 0.5) * 40;
        let nextY = currentY + Math.random() * 20 + 10;
        this.segments.push({ x1: currentX, y1: currentY, x2: nextX, y2: nextY });

        const particleCount = Math.random() < 0.3 ? 0 : 5;
        for (let j = 0; j < particleCount; j++) {
          particles.push(new Particle(
            currentX + Math.random() * (nextX - currentX),
            currentY + Math.random() * (nextY - currentY)
          ));
        }

        currentX = nextX;
        currentY = nextY;
      }
    }

    update() {
      this.life--;
      this.opacity = Math.min(this.life / 100, (this.maxLife - this.life) / 5);
    }

    draw() {
      if (ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = (Math.random() * 1.5 + 1) * this.opacity;
        ctx.shadowColor = '#d4f1ff';
        ctx.shadowBlur = 20;

        ctx.beginPath();
        for (const seg of this.segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bolts = [];
    particles = [];
  }

  function animate() {
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      timer++;
      if (timer >= nextStrike) {
        timer = 0;
        nextStrike = Math.random() * 240 + 180;
        const strikeCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < strikeCount; i++) {
          bolts.push(new LightningBolt());
        }
      }

      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i];
        bolt.update();
        if (bolt.life <= 0) {
          bolts.splice(i, 1);
        } else {
          bolt.draw();
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          p.draw();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', init);
  init();
  animate();
};

export default function QuestionGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [marks, setMarks] = useState(1)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 })

  // Custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({
        x: e.clientX,
        y: e.clientY,
      });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    initLightning();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      handleFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Please upload an image or PDF file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB")
      return
    }

    setUploadedFile(file)
    setError(null)
    setRetryCount(0)

    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }

    analyzeFile(file)
  }

  const analyzeFile = async (file: File) => {
    setIsLoading(true)
    setError(null)
    setQuestions([])
    setAnswers([])

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ")
      const mockQuestions = generateMockQuestions(fileName, marks)
      const mockAnswers = mockQuestions.map((q) => generateMockAnswer(q))
      setQuestions(mockQuestions)
      setAnswers(mockAnswers)
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("marks", String(marks))
        const response = await fetch("/api/gemini/extract-questions", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        if (data.success && data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
          setAnswers(data.answers || [])
        }
      } catch (apiError) {
        console.error("API error (using fallback questions):", apiError)
      }
    } catch (err: any) {
      console.error("Error generating questions:", err)
      setError(err.message || "Failed to generate questions. Please try again with a different file.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (uploadedFile) {
      setRetryCount(0)
      analyzeFile(uploadedFile)
    }
  }

  return (
    <div className="thor-container">

      {/* Custom cursor - always rendered, offscreen if no mouse yet */}
      <div
        className="md:visible invisible"
        ref={cursorRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "22px",
          height: "22px",
          background: `url('https://i.postimg.cc/wMCkrQvQ/Screenshot-2025-07-01-222912-Photoroom.png') center/cover no-repeat`,
          backgroundColor: "transparent",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: cursorPos ? `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)` : 'translate3d(-9999px, -9999px, 0)',
          willChange: "transform",
          opacity: 1,
        }}
      />

      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/Yq5N20bh/pngwing-com-12.png"
              alt="Ultron 1"
              className="opacity-90 w-[300px] fixed top-14 right-10 h-auto scale-x-[-1] drop-shadow-[0_0_40px_#001a4d] animate-glow"
            />
          </div>
        </div>
      </div>
      <canvas id="storm-canvas" className="thor-canvas"></canvas>
      <div className="container py-12">
        <h1 className="thor-heading text-5xl">Asgardian Question Forge</h1>
        <p className="thor-subheading mb-10 text-xl max-w-3xl">
          Wield the power of Stormbreaker! Offer a scroll or rune (photo or PDF), and our Asgardian AI shall forge mighty questions from its essence.
        </p>

        <div className="thor-marks-section mb-10">
          <label className="thor-label block font-medium mb-4">Marks per Question</label>
          <ToggleGroup
            type="single"
            value={String(marks)}
            onValueChange={(value) => setMarks(Number(value))}
            className="thor-toggle-group"
          >
            {[1, 2, 3, 4, 5].map((mark) => (
              <ToggleGroupItem
                key={mark}
                value={String(mark)}
                className="thor-toggle-item"
                aria-label={`Select ${mark} mark${mark > 1 ? 's' : ''} per question`}
              >
                <span className="thor-toggle-text">{mark}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <Card className="thor-card">
              <CardHeader>
                <CardTitle className="thor-card-title">Offer Your Runes</CardTitle>
                <CardDescription className="thor-card-description">Present a photo or PDF scroll to the Asgardian forge</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="thor-upload-area rounded-xl p-8 text-center cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-md thor-upload-icon">
                      <Upload className="h-8 w-8 text-thor-secondary" />
                    </div>
                    <div>
                      <p className="thor-upload-text text-base font-medium">Drag your runes here or</p>
                      <Button
                        variant="link"
                        className="thor-upload-button p-0 h-auto text-base text-thor-secondary hover:text-thor-accent"
                      >
                        summon them by clicking
                      </Button>
                    </div>
                    <p className="thor-upload-info text-sm text-thor-light/60">
                      Runes accepted: JPG, PNG, GIF, PDF (max 5MB)
                    </p>
                  </div>
                </div>

                {uploadedFile && (
                  <div className="mt-6">
                    <p className="thor-file-info text-base font-medium flex items-center gap-3 mb-3">
                      {uploadedFile.type.includes("pdf") ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <ImageIcon className="h-5 w-5" />
                      )}
                      {uploadedFile.name}
                    </p>

                    {filePreview && (
                      <div className="mt-3 border rounded-xl overflow-hidden thor-file-preview">
                        <img
                          src={filePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-auto max-h-[250px] object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="thor-error text-base mt-6 p-4 rounded-xl flex gap-3">
                    <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Asgardian Warning:</p>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {uploadedFile && !isLoading && (
                  <Button onClick={handleRetry} className="thor-button w-full mt-6" variant="outline">
                    <RefreshCw className="h-5 w-5 mr-3" />
                    Forge Again
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="thor-card h-full">
              <CardHeader>
                <CardTitle className="thor-card-title">Forged Questions</CardTitle>
                <CardDescription className="thor-card-description">
                  The mightiest questions crafted from your runes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <img src="https://i.postimg.cc/pT8rZfwH/stormbreaker-thor-Photoroom.png" className="h-40 w-40 stormbreaker-spin thor-loading mb-6" />
                    <p className="thor-loading-text text-thor-secondary font-medium text-lg">
                      Forging questions with Asgardian might...
                    </p>
                  </div>
                )}
                {questions.length > 0 ? (
                  <ImportantQuestionsList questions={questions} answers={answers} />
                ) : (
                  <div className="thor-empty-state text-center py-12 text-thor-light/80">
                    <p>Offer a rune to behold questions forged here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Update generateMockQuestions to accept marks
function generateMockQuestions(fileName: string, marks: number = 1): string[] {
  const topics = fileName.split(/\s+/).filter((word) => word.length > 3)
  const subjectTopics = topics.length > 1 ? topics : ["science", "math", "history", "literature", "geography"]
  if (marks === 1) return [
    `What is ${subjectTopics[0]}?`,
    `Define ${subjectTopics[0]}.`,
    `List one fact about ${subjectTopics[0]}.`,
    `Name a key term in ${subjectTopics[0]}.`,
    `State a property of ${subjectTopics[0]}.`,
  ]
  if (marks === 2) return [
    `Explain the concept of ${subjectTopics[0]}.`,
    `Give two examples of ${subjectTopics[0]}.`,
    `What are two uses of ${subjectTopics[0]}?`,
    `Describe a feature of ${subjectTopics[0]}.`,
    `List two facts about ${subjectTopics[0]}.`,
  ]
  if (marks === 3) return [
    `Describe the process of ${subjectTopics[0]}.`,
    `Summarize the main idea of ${subjectTopics[0]}.`,
    `What is the importance of ${subjectTopics[0]}?`,
    `How does ${subjectTopics[0]} relate to ${subjectTopics[1] || "other topics"}?`,
    `List three characteristics of ${subjectTopics[0]}.`,
  ]
  if (marks === 4) return [
    `Compare and contrast ${subjectTopics[0]} and ${subjectTopics[1] || "another topic"}.`,
    `Discuss the advantages and disadvantages of ${subjectTopics[0]}.`,
    `Explain why ${subjectTopics[0]} is important.`,
    `Analyze the impact of ${subjectTopics[0]} on ${subjectTopics[1] || "society"}.`,
    `Describe four features of ${subjectTopics[0]}.`,
  ]
  if (marks === 5) return [
    `Critically evaluate ${subjectTopics[0]}.`,
    `Discuss in detail the significance of ${subjectTopics[0]}.`,
    `How would you solve a complex problem in ${subjectTopics[0]}?`,
    `Debate the pros and cons of ${subjectTopics[0]}.`,
    `Explain with examples the applications of ${subjectTopics[0]}.`,
  ]
  // fallback
  return [
    `What are the key concepts of ${subjectTopics[0] || "this topic"}?`,
    `How does ${subjectTopics[0] || "this subject"} relate to ${subjectTopics[1] || "other fields"}?`,
    `Why is ${subjectTopics[0] || "this topic"} important in modern education?`,
    `What are the practical applications of ${subjectTopics[0] || "these concepts"}?`,
    `How has our understanding of ${subjectTopics[0] || "this subject"} evolved over time?`,
    `What are the main challenges in learning ${subjectTopics[0] || "this material"}?`,
    `Can you explain the difference between ${subjectTopics[0] || "concept A"} and ${subjectTopics[1] || "concept B"}?`,
    `What examples illustrate the principles of ${subjectTopics[0] || "this topic"}?`,
    `How would you summarize the core ideas presented in this material?`,
    `What further research questions emerge from studying ${subjectTopics[0] || "this topic"}?`,
  ]
}

// Helper function to generate mock answers
function generateMockAnswer(question: string): string {
  if (question.startsWith("What are the key concepts")) {
    return "The key concepts include fundamental principles that form the foundation of this subject. These concepts are essential for understanding more complex ideas and applications in the field."
  } else if (question.startsWith("How does")) {
    return "This subject connects with other fields through shared methodologies and overlapping areas of study. These interdisciplinary connections enhance our understanding and lead to new insights."
  } else if (question.startsWith("Why is")) {
    return "This topic is crucial in modern education because it develops critical thinking skills and provides knowledge that's applicable to real-world situations and future careers."
  } else if (question.includes("practical applications")) {
    return "Practical applications include various real-world uses in industry, research, and everyday life. These applications demonstrate the relevance and importance of mastering these concepts."
  } else if (question.includes("evolved over time")) {
    return "Our understanding has evolved significantly through research, technological advances, and changing paradigms. This evolution reflects how knowledge builds upon previous discoveries."
  } else if (question.includes("main challenges")) {
    return "The main challenges include conceptual complexity, prerequisite knowledge requirements, and misconceptions that may interfere with learning. Addressing these challenges is key to mastery."
  } else if (question.includes("difference between")) {
    return "The key distinction lies in their fundamental properties, applications, and theoretical foundations. Understanding these differences helps clarify how each concept functions in different contexts."
  } else if (question.includes("examples illustrate")) {
    return "Illustrative examples include case studies and demonstrations that show these principles in action. These examples help bridge theoretical understanding with practical application."
  } else if (question.includes("summarize")) {
    return "The core ideas center around fundamental principles that form the foundation of this subject. These principles are interconnected and build upon each other to create a comprehensive framework."
  } else if (question.includes("further research")) {
    return "Emerging research questions include unexplored areas, unresolved problems, and potential innovations. These questions point to future directions for advancing knowledge in this field."
  } else {
    return "This question addresses an important aspect of the material. The answer involves understanding the underlying principles and their applications in various contexts."
  }
}