"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Atom, Beaker, FlaskRoundIcon as Flask, ArrowRight, Sparkles, Zap } from "lucide-react"

export default function ChemistryVisualsPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const topics = [
    {
      id: "atom-structure",
      title: "Atom Structure",
      description: "Explore the Bohr Model and 3D Orbitals of atoms",
      icon: Atom,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-300 dark:border-purple-700",
      hoverColor: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
      shadowColor: "shadow-purple-500/20",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      id: "molecular-bonds",
      title: "Molecular Bonds",
      description: "Visualize how atoms bond together to form molecules",
      icon: Zap,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      borderColor: "border-blue-300 dark:border-blue-700",
      hoverColor: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
      shadowColor: "shadow-blue-500/20",
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      id: "chemical-reactions",
      title: "Chemical Reactions",
      description: "Watch chemical reactions happen in 3D space",
      icon: Flask,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-300 dark:border-green-700",
      hoverColor: "group-hover:text-green-600 dark:group-hover:text-green-400",
      shadowColor: "shadow-green-500/20",
      gradient: "from-green-400 to-emerald-500",
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

  // Floating bubbles animation
  const bubbles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 40 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 5,
    color: [
      "rgba(139, 92, 246, 0.2)", // Purple
      "rgba(59, 130, 246, 0.2)", // Blue
      "rgba(236, 72, 153, 0.2)", // Pink
    ][Math.floor(Math.random() * 3)],
  }))

  return (
    <div className="container px-4 py-12 mx-auto relative">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <motion.div
            key={`bubble-${bubble.id}`}
            className="absolute rounded-full"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              background: `radial-gradient(circle at 30% 30%, white, ${bubble.color})`,
              boxShadow: `0 0 10px ${bubble.color.replace("0.2", "0.5")}`,
            }}
            initial={{ scale: 0 }}
            animate={{
              y: [0, -50, -100],
              x: [0, Math.random() * 30 - 15, Math.random() * 60 - 30],
              scale: [0, 1, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: bubble.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block relative">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Chemistry Visualizations
            </h1>
            <motion.div
              className="absolute -top-6 -right-6 text-purple-500"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Beaker className="h-8 w-8" />
            </motion.div>
            <motion.div
              className="absolute -bottom-6 -left-6 text-pink-500"
              animate={{
                rotate: -360,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the fascinating world of chemistry through interactive 3D models and visualizations!
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredCard(topic.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative"
            >
              <Link href={`/eduplay/visuals/chemistry/${topic.id}`}>
                <Card
                  className={`h-full overflow-hidden border-2 ${topic.borderColor} ${topic.shadowColor} hover:shadow-xl transition-all duration-300 group`}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <motion.div
                        className={`w-16 h-16 rounded-full ${topic.bgColor} flex items-center justify-center mr-4`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <topic.icon className={`h-8 w-8 ${topic.color}`} />
                      </motion.div>
                      <h2 className={`text-2xl font-bold ${topic.color}`}>{topic.title}</h2>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">{topic.description}</p>

                    <motion.div
                      className={`mt-4 flex items-center text-sm font-medium ${topic.color}`}
                      animate={hoveredCard === topic.id ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <span>Explore {topic.title}</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </motion.div>
                  </div>

                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${topic.gradient} transition-opacity duration-300 pointer-events-none`}
                  ></div>

                  {/* Animated background particles */}
                  {hoveredCard === topic.id && (
                    <div className="absolute inset-0 pointer-events-none">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute rounded-full ${topic.bgColor}`}
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
    </div>
  )
}
