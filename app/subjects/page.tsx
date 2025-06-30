'use client';

import Link from "next/link";
import SpiderWebBackground from "./spider-man-web-bg";
import {
  ArrowRight,
  BookOpen,
  Code,
  FlaskRoundIcon as Flask,
  Calculator,
  Music,
  Palette,
  Globe,
  Brain,
  Film,
  Images,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import './subject.css';
import { useEffect, useState } from 'react';

const subjects = [
  {
    title: "Mathematics",
    description: "Learn about numbers, counting, and problem-solving.",
    icon: Calculator,
    slug: "math",
  },
  {
    title: "Science",
    description: "Discover the natural world with engaging content.",
    icon: Flask,
    slug: "science",
  },
  {
    title: "Reading",
    description: "Build literacy skills with rich reading materials.",
    icon: BookOpen,
    slug: "reading",
  },
  {
    title: "Coding",
    description: "Understand programming with clear explanations.",
    icon: Code,
    slug: "coding",
  },
  {
    title: "Art",
    description: "Explore creative techniques and visual expression.",
    icon: Palette,
    slug: "art",
  },
  {
    title: "Music",
    description: "Learn about rhythm, sounds, and music.",
    icon: Music,
    slug: "music",
  },
  {
    title: "Geography",
    description: "Study countries, cultures, and landscapes.",
    icon: Globe,
    slug: "geography",
  },
  {
    title: "Logic",
    description: "Sharpen your reasoning and problem-solving skills.",
    icon: Brain,
    slug: "logic",
  },
  {
    title: "C Programming",
    description: "Study the C programming language fundamentals.",
    icon: Code,
    slug: "c_programming",
  },
  {
    title: "Python",
    description: "Master Python with hands-on examples.",
    icon: Code,
    slug: "python",
  },
  {
    title: "Java",
    description: "Dive into Java and OOP design concepts.",
    icon: Code,
    slug: "java",
  },
  {
    title: "Movies",
    description: "Explore filmmaking and cinematic worlds.",
    icon: Film,
    slug: "movies",
  },
];


export default function SubjectsPage() {
  return (
    <>
      <div className="relative bg-gray-950 text-white min-h-screen overflow-hidden visible font-sans">
        <SpiderWebBackground />

        {/* Background Image with overlay */}
        <div className="absolute inset-0 flex h-auto w-auto">
          <img
            src="https://i.postimg.cc/GhVCVwxJ/iron-spider-png-4-by-dhv123-dfgk034.png"
            alt="background"
            className="opacity-90 w-[500px] h-auto mb-80 fixed top-10 left-0 z-10"
          />
        </div>

        <div className="container py-12 md:py-20 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-amber-600/40 to-rose-600/40 border border-amber-500/30 text-amber-300 text-sm font-bold shadow-md shadow-amber-800/20">
              <BookOpen className="h-4 w-4 mr-1" />
              Knowledge Universe
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600 mt-4 mb-4 tracking-tight font-marvel">
              EXPLORE OUR SUBJECTS
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Assemble your knowledge across disciplines. Each subject features lessons and interactive quizzes to test your understanding.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {subjects.map((subject, index) => (
              <Link
                key={index}
                href={`/subjects/${subject.slug}`}
                className="group relative block rounded-xl p-6 bg-gradient-to-br from-gray-900/80 to-gray-950 border border-amber-600/30 shadow-md shadow-amber-900/20 overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-rose-700/30 hover:border-rose-500/40 main-cont"
              >
                <div className="absolute inset-0 flex justify-center items-center h-auto logo-bg-spider">
                  <img
                    src="https://i.postimg.cc/wBmjcfQ8/bedd6ea8aa453b0af921ca2b2dbb106f.png"
                    alt="background"
                    className="opacity-20 ml-60 w-[800px] h-auto"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-rose-600/10 to-rose-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600/20 to-rose-600/30 border border-amber-500/30 flex items-center justify-center mb-4 shadow-inner shadow-amber-900/10">
                    <subject.icon className="text-amber-300 h-6 w-6 transition-transform icon" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-amber-50 transition-colors font-marvel tracking-wide">
                    {subject.title}
                  </h3>
                  <p className="text-gray-300 flex-grow">{subject.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>LEARN {subject.title.toUpperCase()}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-xl bg-gradient-to-br from-gray-900 via-rose-900/40 to-gray-900 p-8 border border-amber-600/30 shadow-inner shadow-rose-900/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1 text-amber-400 font-bold">
                  <Brain className="h-5 w-5" />
                  READY FOR A CHALLENGE?
                </div>
                <h2 className="text-2xl font-bold mb-1 text-amber-100 font-marvel">TEST YOUR KNOWLEDGE</h2>
                <p className="text-gray-300">Prove your mastery by taking our interactive quizzes.</p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold rounded-lg shadow-lg shadow-amber-900/20 transition-all"
              >
                <Link href="/quiz" className="flex items-center">
                  <span>GO TO QUIZZES</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
