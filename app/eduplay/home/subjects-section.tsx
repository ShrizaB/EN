import React from 'react'
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

import {
    BookOpen,
    Gamepad2,
    Rocket,
    ArrowRight,
    Calculator,
    Code,
    Music,
    Palette,
    FlaskRoundIcon as Flask,
    Sparkles,
    Award,
    Lightbulb,
    Heart,
    Sun,
    Cloud,
    ChevronRight,
} from "lucide-react"

const subjects = [
    {
        title: "Mathematics",
        description: "Learn about numbers, counting, and problem-solving with interactive lessons.",
        icon: Calculator,
        slug: "math",
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        borderColor: "border-blue-300 dark:border-blue-700",
        hoverColor: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
        shadowColor: "shadow-blue-500/20",
        font:"comic-font",
    },
    {
        title: "Science",
        description: "Discover the natural world through engaging educational content.",
        icon: Flask,
        slug: "science",
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        borderColor: "border-green-300 dark:border-green-700",
        hoverColor: "group-hover:text-green-600 dark:group-hover:text-green-400",
        shadowColor: "shadow-green-500/20",
        font:"comic-font",
    },
    {
        title: "Reading",
        description: "Build literacy skills with comprehensive reading materials.",
        icon: BookOpen,
        slug: "reading",
        color: "text-pink-500",
        bgColor: "bg-pink-100 dark:bg-pink-900/30",
        borderColor: "border-pink-300 dark:border-pink-700",
        hoverColor: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
        shadowColor: "shadow-pink-500/20",
        font:"comic-font",
    },
    {
        title: "Coding",
        description: "Understand programming concepts with detailed explanations.",
        icon: Code,
        slug: "coding",
        color: "text-yellow-500",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        borderColor: "border-yellow-300 dark:border-yellow-700",
        hoverColor: "group-hover:text-yellow-600 dark:group-hover:text-yellow-400",
        shadowColor: "shadow-yellow-500/20",
        font:"comic-font",
    },
    {
        title: "Art",
        description: "Explore artistic concepts, techniques, and creative expression.",
        icon: Palette,
        slug: "art",
        color: "text-purple-500",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        borderColor: "border-purple-300 dark:border-purple-700",
        hoverColor: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
        shadowColor: "shadow-purple-500/20",
        font:"comic-font",
    },
    {
        title: "Music",
        description: "Learn about rhythm, sounds, and musical concepts.",
        icon: Music,
        slug: "music",
        color: "text-amber-500",
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        borderColor: "border-amber-300 dark:border-amber-700",
        hoverColor: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
        shadowColor: "shadow-amber-500/20",
        font:"comic-font",
    },
]

const SubjectsSection = () => {

    const [activeSubject, setActiveSubject] = useState<number | null>(null)

    return (
        <>
            {/* Subjects Section */}
            <section className="py-12 bg-[#080910] rounded-t-[3rem] relative z-0">
                {/* Background Image with overlay */}
                <div className="absolute inset-0 flex items-center h-[1200px]">
                    <img
                        src="https://i.postimg.cc/B6HBMtQb/f9d35206492040ef1b424f1fc44e8ffa.png"
                        alt="background"
                        className="opacity-30 w-[500px] h-auto mb-80 ml-20"
                    />
                </div>
                {/* Characters */}
                <div className="w-full absolute flex justify-between ">
                    <img
                        src="https://i.postimg.cc/zDpfzp5P/spider-man-cartoon-web.png"
                        alt=""
                        className="w-[200px] absolute right-0 -top-10 animate-float   "
                    />
                </div>

                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#0a070e] dark:to-transparent"></div>
                <div className="container px-4 md:px-6 pt-10">
                    <div className="text-center mb-12">
                        <div className="relative inline-block animate-fade-in">
                            <h2 className="text-3xl font-bold mb-4 text-white">
                                <span className="text-brightRed"> Explore </span>
                                Fun
                                <span className="text-brightRed"> Subjects </span>
                            </h2>
                            <p className="text-lg max-w-2xl mx-auto text-[#a08eb6] ">
                                Dive into exciting subjects with interactive lessons, games, and quizzes!
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {subjects.map((subject, index) => (
                            <div
                                key={subject.slug}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onMouseEnter={() => setActiveSubject(index)}
                                onMouseLeave={() => setActiveSubject(null)}
                            >
                                <Link href={`/subjects/${subject.slug}`}>
                                    <div
                                        className={`bg-transparent rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${subject.borderColor} ${subject.shadowColor} h-full group relative overflow-hidden hover:scale-105 hover:-translate-y-2`}
                                    >
                                        <div className="relative z-10">
                                            <div className="flex items-center mb-4">
                                                <div
                                                    className={`w-12 h-12 rounded-full ${subject.bgColor} flex items-center justify-center mr-4 transition-transform duration-500 hover:rotate-[360deg]`}
                                                >
                                                    <subject.icon className={`h-7 w-7 ${subject.color}`} />
                                                </div>
                                            </div>
                                            <h3
                                                className={`text-2xl font-bold mb-2 ${subject.color} transition-colors duration-300 ${subject.hoverColor}`}
                                            >
                                                {subject.title}
                                            </h3>
                                            <p className={`text-gray-600 dark:text-gray-300 ${subject.font}`}>{subject.description}</p>

                                            <div
                                                className={`mt-4 flex items-center text-sm font-medium ${subject.color} transition-colors duration-300 ${subject.hoverColor} ${activeSubject === index ? "animate-pulse-x" : ""
                                                    }`}
                                            >
                                                <span>Start Learning</span>
                                                <ArrowRight className={`ml-1 h-4 w-4`} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default SubjectsSection
