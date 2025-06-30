"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { FlaskConical, Atom, Microscope, ArrowRight, Sparkles } from "lucide-react"

export default function VisualsPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const subjects = [
    {
      id: "chemistry",
      title: "Chemistry",
      description: "Explore molecules, atoms, and chemical reactions in 3D",
      icon: FlaskConical,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-300 dark:border-purple-700",
      hoverColor: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
      shadowColor: "shadow-purple-500/20",
      gradient: "from-purple-400 to-pink-500",
      topics: ["Atom Structure", "Molecular Bonds", "Chemical Reactions"],
    },
    {
      id: "physics",
      title: "Physics",
      description: "Visualize forces, motion, and energy in interactive 3D models",
      icon: Atom,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      borderColor: "border-blue-300 dark:border-blue-700",
      hoverColor: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      shadowColor: "shadow-blue-500/20",
      gradient: "from-blue-400 to-cyan-500",
      topics: ["Gravity", "Electricity", "Magnetism"],
    },
    {
      id: "biology",
      title: "Biology",
      description: "Discover cells, DNA, and body systems through 3D visualizations",
      icon: Microscope,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-300 dark:border-green-700",
      hoverColor: "group-hover:text-green-600 dark:group-hover:text-green-400",
      shadowColor: "shadow-green-500/20",
      gradient: "from-green-400 to-emerald-500",
      topics: ["Cell Structure", "DNA", "Human Body"],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-block relative">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">Interactive 3D Visuals</h1>
          <motion.div
            className="absolute -top-6 -right-6 text-yellow-500"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          >
            <Sparkles className="h-8 w-8" />
          </motion.div>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore science concepts through amazing 3D visualizations that bring learning to life!
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {subjects.map((subject) => (
          <motion.div
            key={subject.id}
            variants={itemVariants}
            onHoverStart={() => setHoveredCard(subject.id)}
            onHoverEnd={() => setHoveredCard(null)}
            className="relative"
          >
            <Link href={`/eduplay/visuals/${subject.id}`}>
              <Card
                className={`h-full overflow-hidden border-2 ${subject.borderColor} ${subject.shadowColor} hover:shadow-xl transition-all duration-300 group`}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <motion.div
                      className={`w-16 h-16 rounded-full ${subject.bgColor} flex items-center justify-center mr-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <subject.icon className={`h-8 w-8 ${subject.color}`} />
                    </motion.div>
                    <h2 className={`text-2xl font-bold ${subject.color}`}>{subject.title}</h2>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">{subject.description}</p>

                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">Popular Topics:</h3>
                    <ul className="space-y-1">
                      {subject.topics.map((topic, index) => (
                        <li key={index} className="flex items-center">
                          <motion.span
                            animate={hoveredCard === subject.id ? { x: [0, 4, 0] } : {}}
                            transition={{
                              duration: 0.5,
                              repeat: hoveredCard === subject.id ? Number.POSITIVE_INFINITY : 0,
                            }}
                            className="mr-2"
                          >
                            •
                          </motion.span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.div
                    className={`mt-4 flex items-center text-sm font-medium ${subject.color}`}
                    animate={hoveredCard === subject.id ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <span>Explore {subject.title}</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </motion.div>
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r transition-opacity duration-300 pointer-events-none"></div>

                {/* Animated background particles */}
                {hoveredCard === subject.id && (
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute rounded-full ${subject.bgColor}`}
                        style={{
                          width: `${Math.random() * 30 + 10}px`,
                          height: `${Math.random() * 30 + 10}px`,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 0.5, 0],
                          x: [0, Math.random() * 40 - 20],
                          y: [0, Math.random() * 40 - 20],
                        }}
                        transition={{
                          duration: Math.random() * 2 + 1,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: Math.random() * 0.5,
                        }}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
