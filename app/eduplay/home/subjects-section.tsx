import React from 'react'
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Head from "next/head"

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
        bgColor: "bg-blue-900/30",
        borderColor: "border-blue-700",
        hoverColor: "group-hover:text-blue-400",
        shadowColor: "shadow-blue-500/20",
        font:"comic-font",
    },
    {
        title: "Science",
        description: "Discover the natural world through engaging educational content.",
        icon: Flask,
        slug: "science",
        color: "text-green-500",
        bgColor: "bg-green-100 bg-green-900/30",
        borderColor: "border-green-700",
        hoverColor: "group-hover:text-green-400",
        shadowColor: "shadow-green-500/20",
        font:"comic-font",
    },
    {
        title: "Reading",
        description: "Build literacy skills with comprehensive reading materials.",
        icon: BookOpen,
        slug: "reading",
        color: "text-pink-500",
        bgColor: "bg-pink-900/30",
        borderColor: "border-pink-700",
        hoverColor: "group-hover:text-pink-400",
        shadowColor: "shadow-pink-500/20",
        font:"comic-font",
    },
    {
        title: "Coding",
        description: "Understand programming concepts with detailed explanations.",
        icon: Code,
        slug: "coding",
        color: "text-yellow-500",
        bgColor: "bg-yellow-900/30",
        borderColor: "border-yellow-700",
        hoverColor: "group-hover:text-yellow-400",
        shadowColor: "shadow-yellow-500/20",
        font:"comic-font",
    },
    {
        title: "Art",
        description: "Explore artistic concepts, techniques, and creative expression.",
        icon: Palette,
        slug: "art",
        color: "text-purple-500",
        bgColor: "bg-purple-900/30",
        borderColor: "border-purple-700",
        hoverColor: "group-hover:text-purple-400",
        shadowColor: "shadow-purple-500/20",
        font:"comic-font",
    },
    {
        title: "Music",
        description: "Learn about rhythm, sounds, and musical concepts.",
        icon: Music,
        slug: "music",
        color: "text-amber-500",
        bgColor: "bg-amber-900/30",
        borderColor: "border-amber-700",
        hoverColor: "group-hover:text-amber-400",
        shadowColor: "shadow-amber-500/20",
        font:"comic-font",
    },
]

const SubjectsSection = () => {

    const [activeSubject, setActiveSubject] = useState<number | null>(null)

    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
            </Head>
            {/* Subjects Section */}
            <section className="py-8 sm:py-10 md:py-12 bg-[#080910] rounded-t-[2rem] md:rounded-t-[3rem] relative z-0">
                {/* Top Shadow */}
                <div className="absolute top-0 left-0 w-full h-14 z-20 pointer-events-none" style={{
                  background: 'linear-gradient(to bottom, #080910 70%, transparent 100%)',
                  borderTopLeftRadius: '2rem',
                  borderTopRightRadius: '2rem',
                }} />
                {/* 1st Background Image */}
                <div className="absolute inset-0 flex items-center h-[600px] md:h-[1200px]">
                    <img
                        src="https://i.postimg.cc/B6HBMtQb/f9d35206492040ef1b424f1fc44e8ffa.png"
                        alt="background"
                        className="opacity-30 w-[250px] md:w-[500px] h-auto mb-40 md:mb-80 ml-4 md:ml-20"
                    />
                </div>
                {/* 2nd Background Image */}
                <div className="w-full absolute flex justify-between ">
                    <img
                        src="https://i.postimg.cc/zDpfzp5P/spider-man-cartoon-web.png"
                        alt=""
                        className="w-[100px] md:w-[200px] absolute right-0 -top-6 md:-top-10 animate-float"
                    />
                </div>

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
                                        className={`bg-transparent rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${subject.borderColor} ${subject.shadowColor} h-full group relative overflow-hidden hover:scale-105 hover:-translate-y-2`}
                                    >
                                        <div className="relative z-10">
                                            <div className="flex items-center mb-3 md:mb-4">
                                                <div
                                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${subject.bgColor} flex items-center justify-center mr-3 md:mr-4 transition-transform duration-500 hover:rotate-[360deg]`}
                                                >
                                                    <subject.icon className={`h-6 w-6 md:h-7 md:w-7 ${subject.color}`} />
                                                </div>
                                            </div>
                                            <h3
                                                className={`text-xl md:text-2xl font-bold mb-1 md:mb-2 ${subject.color} transition-colors duration-300 ${subject.hoverColor} font-[Pacifico] md:font-[inherit]`}
                                            >
                                                {subject.title}
                                            </h3>
                                            <p className={`text-gray-300 font-[Pacifico] md:font-[inherit] text-base md:text-lg ${subject.font}`}>{subject.description}</p>

                                            <div
                                                className={`mt-3 md:mt-4 flex items-center text-sm md:text-base font-medium ${subject.color} transition-colors duration-300 ${subject.hoverColor} ${activeSubject === index ? "animate-pulse-x" : ""
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
            <style jsx global>{`
                @media (max-width: 600px) {
                    .opacity-30.w-\[250px\].md\:w-\[500px\].h-auto.mb-40.md\:mb-80.ml-4.md\:ml-20 {
                        margin-bottom: 60px !important;
                    }
                }
            `}</style>
        </>
    )
}

export default SubjectsSection
