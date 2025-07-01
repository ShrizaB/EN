"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code,
  FlaskRoundIcon as Flask,
  Calculator,
  Music,
  Palette,
  Globe,
  Brain,
} from "lucide-react"
import "./quiz-subject.css"
import { useState, useEffect } from "react"

// This would typically come from a database or API
const subjectsData = {
  math: {
    title: "Mathematics",
    description: "Develop strong math skills through interactive games and puzzles",
    longDescription:
      "Our mathematics curriculum is designed to make numbers fun and engaging. Through interactive quizzes, puzzles, and activities, children develop strong foundational math skills while enjoying the learning process.",
    icon: Calculator,
    color: "text-harley-blood",
    bgColor: "bg-harley-blood/10",
    buttonColor: "bg-harley-blood",
    gradientText: "from-harley-blood to-black",
    topics: [
      {
        id: "counting",
        title: "Counting & Numbers",
        description: "Learn to count and recognize numbers",
        level: "Beginner",
        ageRange: "3-5",
        questionsCount: 10,
      },
      {
        id: "addition",
        title: "Addition",
        description: "Master the basics of adding numbers",
        level: "Beginner",
        ageRange: "5-7",
        questionsCount: 15,
      },
      {
        id: "subtraction",
        title: "Subtraction",
        description: "Learn how to subtract numbers",
        level: "Beginner",
        ageRange: "5-7",
        questionsCount: 15,
      },
      {
        id: "multiplication",
        title: "Multiplication",
        description: "Understand multiplication concepts",
        level: "Intermediate",
        ageRange: "7-9",
        questionsCount: 12,
      },
      {
        id: "division",
        title: "Division",
        description: "Learn how to divide numbers",
        level: "Intermediate",
        ageRange: "7-9",
        questionsCount: 12,
      },
      {
        id: "fractions",
        title: "Fractions",
        description: "Understand parts of a whole",
        level: "Advanced",
        ageRange: "8-10",
        questionsCount: 10,
      },
    ],
  },
  science: {
    title: "Science",
    description: "Explore the natural world through engaging science activities",
    longDescription:
      "Our science curriculum encourages curiosity and exploration. Through interactive quizzes and experiments, children learn about the natural world, scientific principles, and develop critical thinking skills.",
    icon: Flask,
    color: "text-harley-blood",
    bgColor: "bg-harley-blood/10",
    buttonColor: "bg-harley-blood",
    gradientText: "from-harley-blood to-black",
    topics: [
      {
        id: "animals",
        title: "Animals & Habitats",
        description: "Learn about different animals and where they live",
        level: "Beginner",
        ageRange: "3-6",
        questionsCount: 10,
      },
      {
        id: "plants",
        title: "Plants & Growth",
        description: "Discover how plants grow and change",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 10,
      },
      {
        id: "weather",
        title: "Weather & Seasons",
        description: "Learn about different weather patterns and seasons",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 10,
      },
      {
        id: "human-body",
        title: "Human Body",
        description: "Explore the amazing human body and how it works",
        level: "Intermediate",
        ageRange: "6-9",
        questionsCount: 12,
      },
      {
        id: "space",
        title: "Space & Planets",
        description: "Journey through our solar system and beyond",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 12,
      },
      {
        id: "simple-machines",
        title: "Simple Machines",
        description: "Learn about levers, pulleys, and other simple machines",
        level: "Advanced",
        ageRange: "8-11",
        questionsCount: 10,
      },
    ],
  },
  reading: {
    title: "Reading",
    description: "Enhance reading comprehension and vocabulary skills",
    longDescription:
      "Our reading curriculum helps children develop strong literacy skills. Through engaging quizzes and activities, children improve their vocabulary, comprehension, and develop a love for reading.",
    icon: BookOpen,
    color: "text-harley-blood",
    bgColor: "bg-harley-blood/10",
    buttonColor: "bg-harley-blood",
    gradientText: "from-harley-blood to-black",
    topics: [
      {
        id: "alphabet",
        title: "Alphabet Recognition",
        description: "Learn to recognize and sound out letters",
        level: "Beginner",
        ageRange: "3-5",
        questionsCount: 10,
      },
      {
        id: "phonics",
        title: "Phonics & Word Sounds",
        description: "Connect letters with their sounds",
        level: "Beginner",
        ageRange: "4-6",
        questionsCount: 12,
      },
      {
        id: "sight-words",
        title: "Sight Words",
        description: "Learn common words by sight",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 15,
      },
      {
        id: "vocabulary",
        title: "Vocabulary Building",
        description: "Expand your word knowledge",
        level: "Intermediate",
        ageRange: "6-9",
        questionsCount: 12,
      },
      {
        id: "comprehension",
        title: "Reading Comprehension",
        description: "Understand and analyze what you read",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "grammar",
        title: "Grammar & Punctuation",
        description: "Learn the rules of language",
        level: "Advanced",
        ageRange: "8-11",
        questionsCount: 12,
      },
    ],
  },
  coding: {
    title: "Coding",
    description: "Learn programming concepts through fun coding challenges",
    longDescription:
      "Our coding curriculum introduces children to the world of programming. Through interactive quizzes and challenges, children learn computational thinking, problem-solving, and basic coding concepts.",
    icon: Code,
    color: "text-harley-blood",
    bgColor: "bg-harley-blood/10",
    buttonColor: "bg-harley-blood",
    gradientText: "from-harley-blood to-black",
    topics: [
      {
        id: "basics",
        title: "Coding Basics",
        description: "Learn fundamental coding concepts",
        level: "Beginner",
        ageRange: "5-8",
        questionsCount: 10,
      },
      {
        id: "sequences",
        title: "Sequences & Algorithms",
        description: "Create step-by-step instructions",
        level: "Beginner",
        ageRange: "6-9",
        questionsCount: 12,
      },
      {
        id: "loops",
        title: "Loops & Repetition",
        description: "Learn how to repeat actions efficiently",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "conditionals",
        title: "Conditionals & Logic",
        description: "Make decisions in your code",
        level: "Intermediate",
        ageRange: "8-11",
        questionsCount: 12,
      },
      {
        id: "functions",
        title: "Functions & Procedures",
        description: "Create reusable blocks of code",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 10,
      },
      {
        id: "debugging",
        title: "Debugging & Problem Solving",
        description: "Find and fix errors in code",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 10,
      },
    ],
  },
  music: {
    title: "Music",
    description: "Discover musical concepts and test your knowledge",
    longDescription:
      "Our music curriculum introduces children to the wonderful world of music. Through interactive quizzes, children learn about musical instruments, notes, rhythms, and famous composers.",
    icon: Music,
    color: "text-harley-blood",
    bgColor: "bg-harley-blood/10",
    buttonColor: "bg-harley-blood",
    gradientText: "from-harley-blood to-black",
    topics: [
      {
        id: "instruments",
        title: "Musical Instruments",
        description: "Learn about different musical instruments",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 10,
      },
      {
        id: "notes",
        title: "Notes & Rhythms",
        description: "Understand basic musical notation",
        level: "Beginner",
        ageRange: "5-8",
        questionsCount: 12,
      },
      {
        id: "composers",
        title: "Famous Composers",
        description: "Learn about classical music composers",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "genres",
        title: "Music Genres",
        description: "Explore different styles of music",
        level: "Intermediate",
        ageRange: "8-11",
        questionsCount: 12,
      },
    ],
  },
  art: {
    title: "Art",
    description: "Explore art history and creative concepts",
    longDescription:
      "Our art curriculum encourages creativity and appreciation for visual arts. Through interactive quizzes, children learn about famous artists, art styles, colors, and artistic techniques.",
    icon: Palette,
    color: "text-harley-blood",
    bgColor: "bg-harley-blood/10",
    buttonColor: "bg-harley-blood",
    gradientText: "from-harley-blood to-black",
    topics: [
      {
        id: "colors",
        title: "Colors & Mixing",
        description: "Learn about primary and secondary colors",
        level: "Beginner",
        ageRange: "3-6",
        questionsCount: 10,
      },
      {
        id: "artists",
        title: "Famous Artists",
        description: "Discover well-known artists and their work",
        level: "Intermediate",
        ageRange: "6-9",
        questionsCount: 12,
      },
      {
        id: "styles",
        title: "Art Styles",
        description: "Explore different artistic movements",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "techniques",
        title: "Art Techniques",
        description: "Learn about different ways to create art",
        level: "Advanced",
        ageRange: "8-11",
        questionsCount: 12,
      },
    ],
  },
  geography: {
    title: "Geography",
    description: "Learn about countries, cultures, and natural features",
    longDescription:
      "Our geography curriculum helps children understand the world around them. Through interactive quizzes, children learn about countries, continents, landforms, and different cultures.",
    icon: Globe,
    color: "text-harley-blood",
    bgColor: "bg-harley-blood/10",
    buttonColor: "bg-harley-blood",
    gradientText: "from-harley-blood to-black",
    topics: [
      {
        id: "continents",
        title: "Continents & Oceans",
        description: "Learn about the major landmasses and bodies of water",
        level: "Beginner",
        ageRange: "5-8",
        questionsCount: 10,
      },
      {
        id: "countries",
        title: "Countries & Capitals",
        description: "Discover countries and their capital cities",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 15,
      },
      {
        id: "landforms",
        title: "Landforms & Features",
        description: "Explore mountains, rivers, deserts, and more",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 12,
      },
      {
        id: "cultures",
        title: "World Cultures",
        description: "Learn about different cultures around the world",
        level: "Advanced",
        ageRange: "8-11",
        questionsCount: 10,
      },
    ],
  },
  history: {
    title: "History",
    description: "Discover important historical events and figures",
    longDescription:
      "Our history curriculum brings the past to life. Through interactive quizzes, children learn about important historical events, influential figures, and how the past has shaped our present.",
    icon: Brain,
    color: "text-harley-blood",
    bgColor: "bg-harley-blood/10",
    buttonColor: "bg-harley-blood",
    gradientText: "from-harley-blood to-black",
    topics: [
      {
        id: "ancient",
        title: "Ancient Civilizations",
        description: "Explore early human societies and achievements",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 12,
      },
      {
        id: "explorers",
        title: "Famous Explorers",
        description: "Learn about people who discovered new lands",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "inventions",
        title: "Important Inventions",
        description: "Discover inventions that changed the world",
        level: "Intermediate",
        ageRange: "8-11",
        questionsCount: 12,
      },
      {
        id: "leaders",
        title: "Historical Leaders",
        description: "Learn about influential people throughout history",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 10,
      },
    ],
  },
}

export default function QuizSubjectPage({ params }: { params: { subject: string } }) {
  const subject = params.subject

  // Check if the subject exists in our data
  if (!subjectsData[subject as keyof typeof subjectsData]) {
    notFound()
  }

  const subjectData = subjectsData[subject as keyof typeof subjectsData]
  const SubjectIcon = subjectData.icon
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverAngle, setHoverAngle] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Center the bat image on the cursor for a more natural feel
      setCursorPos({ x: e.clientX - 30, y: e.clientY - 20 }); // 60x40 image, center
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Only apply transform for position and mirroring, no rotation or animation
  const batTransform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) scaleX(-1)`;
  const batTransition = "none";

  return (
    <div
      className="min-h-screen bg-harley-void text-white harley-ultra-dark-bg"
      style={{ cursor: "none" }}
    >
      {/* Custom PNG cursor */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "60px",
          height: "40px",
          background: "url('https://i.postimg.cc/DzdQ3bH2/Baseball-Bat-PNG-Background.png') center/contain no-repeat",
          pointerEvents: "none",
          zIndex: 99999,
          transform: batTransform,
          transition: batTransition,
        }}
        id="custom-bat-cursor"
        className="md:visible invisible"
      />
      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/854XM5jG/Daco-196740.png"
              alt="Joker"
              className="opacity-80 w-[270px] fixed top-16 right-5 scale-x-[-1] h-auto"
            />
          </div>
        </div>
      </div>
      <div className="harley-graffiti-overlay">
        <div className="harley-diamond-grid-backdrop">
          <div className="container py-12 md:py-20 relative z-10">
            <div className="mb-8 harley-entrance-left">
              <Link
                href="/quiz"
                className="inline-flex items-center text-sm font-black text-harley-gunmetal hover:text-harley-neon-pink mb-4 transition-all duration-500 harley-anarchic-link group"
              >
                <ArrowLeft className="mr-1 h-4 w-4 harley-icon-electric group-hover:harley-spark-effect" />
                <span>BACK TO QUIZZES</span>
              </Link>

              <div className="relative overflow-hidden bg-gradient-to-br from-harley-void/98 to-harley-gunmetal/30 border border-harley-gunmetal/40 p-8 mb-12 harley-hero-container harley-metal-scratches">
                <div className="harley-diamond-grid-fine absolute inset-0 opacity-8"></div>
                <div className="harley-electric-crackle absolute inset-0"></div>
                <div className="harley-particle-field absolute inset-0"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div
                    className={`w-20 h-20 ${subjectData.bgColor} flex items-center justify-center shrink-0 harley-icon-vault border border-harley-gunmetal/60 backdrop-blur-sm harley-neon-pulse`}
                  >
                    <SubjectIcon className={`h-10 w-10 harley-icon-chaos`} />
                  </div>
                  <div>
                    <h1
                      className={`text-3xl md:text-4xl font-black mb-4 harley-title-chaos bg-gradient-to-r ${subjectData.gradientText} bg-clip-text text-transparent harley-slash-dynamic`}
                    >
                      {subjectData.title.toUpperCase()} QUIZZES
                    </h1>
                    <p className="text-lg text-[#ffbbec] max-w-3xl font-bold leading-relaxed harley-text-distressed">
                      {subjectData.longDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 harley-entrance-right">
                  <div>
                    <h2 className="text-2xl font-black text-white harley-title-chaos harley-slash-dynamic">
                      QUIZ TOPICS
                    </h2>
                    <p className="text-harley-gunmetal font-bold harley-anarchic-subtitle">CHOOSE YOUR BATTLEFIELD</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-black">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-harley-electric-blue harley-neon-electric border border-white harley-level-indicator"></div>
                      <span className="text-white harley-level-text">BEGINNER</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-harley-neon-pink harley-neon-pink-glow border border-white harley-level-indicator"></div>
                      <span className="text-white harley-level-text">INTERMEDIATE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-harley-blood harley-neon-blood border border-white harley-level-indicator"></div>
                      <span className="text-white harley-level-text">ADVANCED</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjectData.topics.map((topic, index) => {
                    const levelColor =
                      topic.level === "Beginner"
                        ? "bg-harley-electric-blue harley-neon-electric border border-white"
                        : topic.level === "Intermediate"
                          ? "bg-harley-neon-pink harley-neon-pink-glow border border-white"
                          : "bg-harley-blood harley-neon-blood border border-white"

                    return (
                      <Link key={topic.id} href={`/quiz/${subject}/topics/${topic.id}`} className="group">
                        <div
                          className={`harley-topic-vault harley-card-entrance-${index % 3} relative overflow-hidden bg-gradient-to-br from-harley-void/95 to-harley-gunmetal/20 border border-harley-gunmetal/50 p-6 h-full harley-metal-scratches`}
                        >
                          <div className="harley-diamond-grid-micro absolute inset-0 opacity-5"></div>
                          <div className="harley-card-electric-field absolute inset-0"></div>
                          <div className="harley-card-particle-sparks absolute inset-0"></div>
                          <div className="harley-card-glitch-overlay absolute inset-0"></div>

                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-black group-hover:text-harley-neon-pink transition-all duration-500 harley-card-title harley-slash-micro text-white">
                                {topic.title.toUpperCase()}
                              </h3>
                              <div className={`w-3 h-3 ${levelColor} mt-2 harley-level-indicator`}></div>
                            </div>
                            <p className="mb-4 font-bold leading-relaxed harley-text-distressed text-white">
                              {topic.description}
                            </p>
                            <div className="flex justify-between items-center text-sm text-white font-black harley-info-text">
                              <div>AGES {topic.ageRange}</div>
                              <div className="text-harley-neon-pink">{topic.questionsCount} QUESTIONS</div>
                            </div>
                            <div className="mt-4 flex items-center text-sm font-black text-harley-neon-pink opacity-0 group-hover:opacity-100 transition-all duration-500 harley-cta-text">
                              <span className="harley-glitch-text-micro text-white">TAKE QUIZ</span>
                              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-2 transition-transform duration-500 harley-arrow-electric" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Remove pointer cursor from all interactive elements */}
      <style>{`
        html, body, * {
          cursor: none !important;
        }
        html, body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  )
}
