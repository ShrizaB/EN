"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle, XCircle, ChevronRight, Award, RefreshCw, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { QuizEngine } from "@/components/quiz-engine"
import { useAuth } from "@/contexts/auth-context"
import { logActivity } from "@/lib/user-service"
import { getTopicLearningHistory, updateLearningHistory } from "@/lib/learning-history-service"
import { GoogleGenerativeAI } from "@google/generative-ai"
import DoctorStrangeLoader from "./DoctorStrangeLoader"

// Initialize the Gemini API
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyDiaCC3dAZS8ZiDU1uF8YfEu9PoWy8YLoA"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

// Add type definition for topicsData
type TopicData = {
  title: string
  description: string
  subject: string
  subjectSlug: string
  subjectColor: string
  level: string
  ageRange: string
}

type TopicsData = {
  [subject: string]: {
    [topic: string]: TopicData
  }
}

// Update the topicsData type
const topicsData: TopicsData = {
  math: {
    counting: {
      title: "Counting & Numbers",
      description: "Learn to count and recognize numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Beginner",
      ageRange: "3-5",
    },
    addition: {
      title: "Addition",
      description: "Master the basics of adding numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Beginner",
      ageRange: "5-7",
    },
    subtraction: {
      title: "Subtraction",
      description: "Learn how to subtract numbers",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Beginner",
      ageRange: "5-7",
    },
    multiplication: {
      title: "Multiplication",
      description: "Multiply numbers and learn times tables",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Intermediate",
      ageRange: "7-9",
    },
    division: {
      title: "Division",
      description: "Understand division concepts",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Intermediate",
      ageRange: "7-9",
    },
    fractions: {
      title: "Fractions",
      description: "Learn about parts of a whole",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Intermediate",
      ageRange: "8-10",
    },
    geometry: {
      title: "Geometry",
      description: "Explore shapes and their properties",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Advanced",
      ageRange: "9-12",
    },
    algebra: {
      title: "Algebra Basics",
      description: " Introduction to algebraic concepts",
      subject: "Mathematics",
      subjectSlug: "math",
      subjectColor: "bg-math",
      level: "Advanced",
      ageRange: "8-10",
    },
  },
  science: {
    animals: {
      title: "Animals & Habitats",
      description: "Learn about different animals and where they live",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "3-6",
    },
    plants: {
      title: "Plants & Growth",
      description: "Discover how plants grow and thrive",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "5-8",
    },
    weather: {
      title: "Weather & Seasons",
      description: "Explore different weather patterns and seasons",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Beginner",
      ageRange: "6-9",
    },
    solar_system: {
      title: "Solar System",
      description: "Learn about planets and space",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Intermediate",
      ageRange: "7-10",
    },
    simple_machines: {
      title: "Simple Machines",
      description: "Discover levers, pulleys, and other simple machines",
      subject: "Science",
      subjectSlug: " science",
      subjectColor: "bg-science",
      level: "Intermediate",
      ageRange: "8-12",
    },
    human_body: {
      title: "Human Body",
      description: "  Learn about the human body systems",
      subject: "Science",
      subjectSlug: " science",
      subjectColor: "bg-science",
      level: "Intermediate",
      ageRange: "8-12",
    },
    chemistry: {
      title: "Chemistry Basics",
      description: "Introduction to basic chemistry concepts",
      subject: "Science",
      subjectSlug: " science",
      subjectColor: "bg-science",
      level: "Advanced",
      ageRange: "9-12",
    },
    ecosystems: {
      title: "Ecosystems",
      description: "Explore different ecosystems and their inhabitants",
      subject: "Science",
      subjectSlug: "science",
      subjectColor: "bg-science",
      level: "Advanced",
      ageRange: "9-12",
    },

  },
  reading: {
    alphabet: {
      title: "Alphabet Recognition",
      description: "Learn letters and their sounds",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "3-5",
    },
    phonics: {
      title: "Phonics",
      description: "Connect letters with their sounds",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "4-6",
    },
    sight_words: {
      title: "Sight Words",
      description: "Learn common words by sight",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Beginner",
      ageRange: "5-7",
    },
    vocabulary: {
      title: "Vocabulary Building",
      description: "Expand your word knowledge",
      subject: "Vocabulary",
      subjectSlug: "vocabulary",
      subjectColor: "bg-vocabulary",
      level: "Intermediate",
      ageRange: "6-9",
    },
    comprehension: {
      title: "Reading Comprehension",
      description: "Understand what you read",
      subject: "Reading",
      subjectSlug: "reading",
      subjectColor: "bg-reading",
      level: "Intermediate",
      ageRange: "7-10",
    },
    grammar: {
      title: "Grammar Basics",
      description: "Learn the rules of language",
      subject: "Grammar",
      subjectSlug: "grammar",
      subjectColor: "bg-grammar",
      level: "Intermediate",
      ageRange: "8-10",
    },

    writing: {
      title: "Creative Writing",
      description: "Express yourself through stories",
      subject: "Writing",
      subjectSlug: "writing",
      subjectColor: "bg-writing",
      level: "Advanced",
      ageRange: "9-12",
    },

    poetry: {
      title: "Poetry",
      description: "Explore rhythm and expression in language",
      subject: "Poetry",
      subjectSlug: "poetry",
      subjectColor: "bg-poetry",
      level: "Advanced",
      ageRange: "10-12",
    },
  },
  coding: {
    basics: {
      title: "Coding Basics",
      description: "Introduction to coding concepts",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "5-7",
    },
    sequences: {
      title: "Sequences",
      description: "Learn about sequences and algorithms",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "6-8",
    },
    loops: {
      title: "Loops",
      description: "Discover how loops work in programming",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "7-9",
    },
    conditionals: {
      title: "Conditionals",
      description: "Learn about if-then statements and logic",
      subject: "Coding",
      subjectSlug: "coding",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "8-10",
    },
    functions: {
      title: "Functions",
      description: "Create and use functions in your code",
      subject: "Functions",
      subjectSlug: "functions",
      subjectColor: "bg-functions",
      level: "Advanced",
      ageRange: "9-11",
    },

    variables: {
      title: "Variables",
      description: "Store and use data in your programs",
      subject: "Variables",
      subjectSlug: "variables",
      subjectColor: "bg-variables",
      level: "Advanced",
      ageRange: "9-11",
    },

    debugging: {
      title: "Debugging",
      description: "Find and fix errors in code",
      subject: "Debugging",
      subjectSlug: "debugging",
      subjectColor: "bg-debugging",
      level: "Advanced",
      ageRange: "10-12",
    },

    game_design: {
      title: "Game Design",
      description: "Build your own simple games with code",
      subject: "Game Design",
      subjectSlug: "game-design",
      subjectColor: "bg-game-design",
      level: "Advanced",
      ageRange: "10-12",
    },

  },
  // New subjects
  music: {
    notes: {
      title: "Musical Notes",
      description: "Learn to read and understand musical notes",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Beginner",
      ageRange: "5-8",
    },
    instruments: {
      title: "Musical Instruments",
      description: "Discover different musical instruments and their sounds",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Beginner",
      ageRange: "4-7",
    },
    rhythm: {
      title: "Rhythm & Beat",
      description: "Understand rhythm patterns and beats in music",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Intermediate",
      ageRange: "6-9",
    },
    composition: {
      title: "Music Composition",
      description: "Learn the basics of creating your own music",
      subject: "Music",
      subjectSlug: "music",
      subjectColor: "bg-music",
      level: "Advanced",
      ageRange: "8-12",
    },
    music_history: {
      title: "Music History",
      description: "Explore different music styles and famous composers",
      subject: "Music History",
      subjectSlug: "music-history",
      subjectColor: "bg-music-history",
      level: "Intermediate",
      ageRange: "7-10",
    },

    singing: {
      title: "Singing Basics",
      description: "Learn proper singing techniques and vocal exercises",
      subject: "Singing",
      subjectSlug: "singing",
      subjectColor: "bg-singing",
      level: "Beginner",
      ageRange: "5-9",
    },

    music_theory: {
      title: "Music Theory",
      description: "Understand the building blocks of music",
      subject: "Music Theory",
      subjectSlug: "music-theory",
      subjectColor: "bg-music-theory",
      level: "Advanced",
      ageRange: "9-12",
    },

    world_music: {
      title: "World Music",
      description: "Discover music from different cultures around the world",
      subject: "World Music",
      subjectSlug: "world-music",
      subjectColor: "bg-world-music",
      level: "Intermediate",
      ageRange: "7-11",
    },

  },
  art: {
    colors: {
      title: "Colors & Mixing",
      description: "Learn about primary colors and how to mix them",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Beginner",
      ageRange: "3-6",
    },
    drawing: {
      title: "Basic Drawing",
      description: "Learn fundamental drawing techniques",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Beginner",
      ageRange: "5-8",
    },
    painting: {
      title: "Painting Techniques",
      description: "Explore different painting styles and methods",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Intermediate",
      ageRange: "7-10",
    },
    art_history: {
      title: "Art History",
      description: "Learn about famous artists and art movements",
      subject: "Art",
      subjectSlug: "art",
      subjectColor: "bg-art",
      level: "Advanced",
      ageRange: "9-12",
    },
    sculpture: {
      title: "Sculpture Basics",
      description: "Create three-dimensional art with various materials",
      subject: "Sculpture",
      subjectSlug: "sculpture",
      subjectColor: "bg-sculpture",
      level: "Intermediate",
      ageRange: "6-9",
    },

    crafts: {
      title: "Arts & Crafts",
      description: "Make fun projects using different materials and techniques",
      subject: "Arts & Crafts",
      subjectSlug: "crafts",
      subjectColor: "bg-crafts",
      level: "Beginner",
      ageRange: "4-7",
    },

    digital_art: {
      title: "Digital Art",
      description: "Create art using digital tools and techniques",
      subject: "Digital Art",
      subjectSlug: "digital-art",
      subjectColor: "bg-digital-art",
      level: "Advanced",
      ageRange: "8-12",
    },

    art_appreciation: {
      title: "Art Appreciation",
      description: "Learn to observe, analyze, and appreciate different artworks",
      subject: "Art Appreciation",
      subjectSlug: "art-appreciation",
      subjectColor: "bg-art-appreciation",
      level: "Intermediate",
      ageRange: "7-11",
    },

  },
  geography: {
    continents: {
      title: "Continents & Oceans",
      description: "Learn about the seven continents and five oceans",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Beginner",
      ageRange: "5-8",
    },
    countries: {
      title: "Countries & Capitals",
      description: "Explore different countries and their capital cities",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Intermediate",
      ageRange: "7-10",
    },
    landforms: {
      title: "Landforms & Features",
      description: "Learn about mountains, rivers, deserts, and other geographical features",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Intermediate",
      ageRange: "8-11",
    },
    climate: {
      title: "Climate Zones",
      description: "Understand different climate types around the world",
      subject: "Geography",
      subjectSlug: "geography",
      subjectColor: "bg-geography",
      level: "Advanced",
      ageRange: "9-12",
    },
    map_skills: {
      title: "Map Skills",
      description: "Learn to read and understand different types of maps",
      subject: "Map Skills",
      subjectSlug: "map-skills",
      subjectColor: "bg-map-skills",
      level: "Beginner",
      ageRange: "6-9",
    },

    cultures: {
      title: "World Cultures",
      description: "Discover traditions, foods, and customs from around the world",
      subject: "World Cultures",
      subjectSlug: "cultures",
      subjectColor: "bg-cultures",
      level: "Intermediate",
      ageRange: "7-10",
    },

    natural_resources: {
      title: "Natural Resources",
      description: "Learn about the Earth's resources and their importance",
      subject: "Natural Resources",
      subjectSlug: "natural-resources",
      subjectColor: "bg-natural-resources",
      level: "Advanced",
      ageRange: "9-12",
    },

    environmental_geography: {
      title: "Environmental Geography",
      description: "Understand how humans interact with and impact the environment",
      subject: "Environmental Geography",
      subjectSlug: "environmental-geography",
      subjectColor: "bg-environmental-geography",
      level: "Advanced",
      ageRange: "10-12",
    },

  },
  logic: {
    patterns: {
      title: "Patterns & Sequences",
      description: "Identify and continue patterns in shapes, numbers, and objects",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Beginner",
      ageRange: "4-7",
    },
    puzzles: {
      title: "Logic Puzzles",
      description: "Solve fun puzzles that develop critical thinking skills",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Intermediate",
      ageRange: "7-10",
    },
    reasoning: {
      title: "Deductive Reasoning",
      description: "Learn to draw conclusions from given information",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Intermediate",
      ageRange: "8-11",
    },
    problem_solving: {
      title: "Problem Solving",
      description: "Develop strategies to solve complex problems",
      subject: "Logic",
      subjectSlug: "logic",
      subjectColor: "bg-logic",
      level: "Advanced",
      ageRange: "9-12",
    },
    brain_teasers: {
      title: "Brain Teasers",
      description: "Challenge your mind with fun and tricky problems",
      subject: "Brain Teasers",
      subjectSlug: "brain-teasers",
      subjectColor: "bg-brain-teasers",
      level: "Intermediate",
      ageRange: "7-10",
    },

    sudoku: {
      title: "Sudoku & Number Puzzles",
      description: "Learn to solve number-based logic puzzles",
      subject: "Sudoku & Number Puzzles",
      subjectSlug: "sudoku",
      subjectColor: "bg-sudoku",
      level: "Advanced",
      ageRange: "9-12",
    },

    critical_thinking: {
      title: "Critical Thinking",
      description: "Analyze information and make reasoned judgments",
      subject: "Critical Thinking",
      subjectSlug: "critical-thinking",
      subjectColor: "bg-critical-thinking",
      level: "Advanced",
      ageRange: "10-12",
    },

    logical_fallacies: {
      title: "Logical Fallacies",
      description: "Identify common errors in reasoning",
      subject: "Logical Fallacies",
      subjectSlug: "logical-fallacies",
      subjectColor: "bg-logical-fallacies",
      level: "Advanced",
      ageRange: "10-12",
    },

  },
  // Programming languages
  c_programming: {
    intro: {
      title: "Introduction to C",
      description: "Learn the basics of C programming language",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    variables: {
      title: "Variables & Data Types",
      description: "Understand different data types and how to use variables in C",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    control_flow: {
      title: "Control Flow",
      description: "Learn about if statements, loops, and switch cases in C",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "11-12",
    },
    functions: {
      title: "Functions",
      description: "Create and use functions in C programs",
      subject: "C Programming",
      subjectSlug: "c_programming",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "11-12",
    },
    arrays: {
      title: "Arrays & Strings",
      description: "Work with collections of data in C",
      subject: "Arrays & Strings",
      subjectSlug: "arrays",
      subjectColor: "bg-arrays",
      level: "Intermediate",
      ageRange: "11-12",
    },

    pointers: {
      title: "Pointers",
      description: "Understand memory addresses and pointers in C",
      subject: "Pointers",
      subjectSlug: "pointers",
      subjectColor: "bg-pointers",
      level: "Advanced",
      ageRange: "12",
    },

    structures: {
      title: "Structures",
      description: "Create custom data types using structures",
      subject: "Structures",
      subjectSlug: "structures",
      subjectColor: "bg-structures",
      level: "Advanced",
      ageRange: "12",
    },

    file_io: {
      title: "File Input/Output",
      description: "Learn to read from and write to files in C",
      subject: "File Input/Output",
      subjectSlug: "file-io",
      subjectColor: "bg-file-io",
      level: "Advanced",
      ageRange: "12",
    },

  },
  python: {
    intro: {
      title: "Introduction to Python",
      description: "Learn the basics of Python programming language",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "9-12",
    },
    variables: {
      title: "Variables & Data Types",
      description: "Understand different data types and how to use variables in Python",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "9-12",
    },
    control_flow: {
      title: "Control Flow",
      description: "Learn about if statements, loops, and conditional expressions in Python",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "10-12",
    },
    functions: {
      title: "Functions & Modules",
      description: "Create and use functions and modules in Python",
      subject: "Python",
      subjectSlug: "python",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "10-12",
    },
    lists: {
      title: "Lists & Dictionaries",
      description: "Work with collections of data in Python",
      subject: "Lists & Dictionaries",
      subjectSlug: "lists",
      subjectColor: "bg-lists",
      level: "Intermediate",
      ageRange: "10-12",
    },

    file_handling: {
      title: "File Handling",
      description: "Learn to read from and write to files in Python",
      subject: "File Handling",
      subjectSlug: "file-handling",
      subjectColor: "bg-file-handling",
      level: "Intermediate",
      ageRange: "11-12",
    },

    error_handling: {
      title: "Error Handling",
      description: "Understand how to handle errors and exceptions in Python",
      subject: "Error Handling",
      subjectSlug: "error-handling",
      subjectColor: "bg-error-handling",
      level: "Advanced",
      ageRange: "11-12",
    },

    simple_games: {
      title: "Simple Games",
      description: "Create fun games using Python",
      subject: "Simple Games",
      subjectSlug: "simple-games",
      subjectColor: "bg-simple-games",
      level: "Advanced",
      ageRange: "11-12",
    },

  },
  java: {
    intro: {
      title: "Introduction to Java",
      description: "Learn the basics of Java programming language",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    variables: {
      title: "Variables & Data Types",
      description: "Understand different data types and how to use variables in Java",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Beginner",
      ageRange: "10-12",
    },
    control_flow: {
      title: "Control Flow",
      description: "Learn about if statements, loops, and switch cases in Java",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Intermediate",
      ageRange: "11-12",
    },
    classes: {
      title: "Classes & Objects",
      description: "Understand object-oriented programming concepts in Java",
      subject: "Java",
      subjectSlug: "java",
      subjectColor: "bg-coding",
      level: "Advanced",
      ageRange: "11-12",
    },
    methods: {
      title: "Methods",
      description: "Create and use methods in Java programs",
      subject: "Methods",
      subjectSlug: "methods",
      subjectColor: "bg-methods",
      level: "Intermediate",
      ageRange: "11-12",
    },

    arrays: {
      title: "Arrays & ArrayLists",
      description: "Work with collections of data in Java",
      subject: "Arrays & ArrayLists",
      subjectSlug: "arrays",
      subjectColor: "bg-arrays",
      level: "Intermediate",
      ageRange: "11-12",
    },

    inheritance: {
      title: "Inheritance & Polymorphism",
      description: "Learn advanced object-oriented programming concepts",
      subject: "Inheritance & Polymorphism",
      subjectSlug: "inheritance",
      subjectColor: "bg-inheritance",
      level: "Advanced",
      ageRange: "12",
    },

    exception_handling: {
      title: "Exception Handling",
      description: "Understand how to handle errors and exceptions in Java",
      subject: "Exception Handling",
      subjectSlug: "exception-handling",
      subjectColor: "bg-exception-handling",
      level: "Advanced",
      ageRange: "12",
    },

  },
  movies: {
    film_history: {
      title: "Film History",
      description: "Learn about the evolution of movies from silent films to modern cinema",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Intermediate",
      ageRange: "8-12",
    },
    genres: {
      title: "Movie Genres",
      description: "Explore different types of movies and their characteristics",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Beginner",
      ageRange: "6-10",
    },
    animation: {
      title: "Animation",
      description: "Discover how animated movies are made and their history",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Beginner",
      ageRange: "5-9",
    },
    storytelling: {
      title: "Storytelling in Film",
      description: "Learn how movies tell stories through visuals and sound",
      subject: "Movies",
      subjectSlug: "movies",
      subjectColor: "bg-primary",
      level: "Intermediate",
      ageRange: "8-12",
    },
    famous_directors: {
      title: "Famous Directors",
      description: "Learn about influential filmmakers and their unique styles",
      subject: "Famous Directors",
      subjectSlug: "famous-directors",
      subjectColor: "bg-famous-directors",
      level: "Advanced",
      ageRange: "10-12",
    },

    film_techniques: {
      title: "Filmmaking Techniques",
      description: "Understand camera angles, shots, and visual storytelling",
      subject: "Filmmaking Techniques",
      subjectSlug: "film-techniques",
      subjectColor: "bg-film-techniques",
      level: "Advanced",
      ageRange: "9-12",
    },

    movie_reviews: {
      title: "Movie Reviews",
      description: "Learn how to analyze and critique films",
      subject: "Movie Reviews",
      subjectSlug: "movie-reviews",
      subjectColor: "bg-movie-reviews",
      level: "Intermediate",
      ageRange: "8-12",
    },

    special_effects: {
      title: "Special Effects",
      description: "Discover how movie magic is created with special effects",
      subject: "Special Effects",
      subjectSlug: "special-effects",
      subjectColor: "bg-special-effects",
      level: "Intermediate",
      ageRange: "7-12",
    },

  },
}

// Update Question interface to make id required
interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  id: string // Make id required
}

// Add type for UserActivity
interface UserActivity {
  type: string
  subject: string
  topic: string
  difficulty?: string
  score?: number
  totalQuestions?: number
  timeSpent?: number
}

interface LearningHistory {
  _id?: string
  userId?: string
  subject: string
  topic: string
  content: string
  lastAccessed?: Date
  visitCount?: number
  accessCount?: number
  progress?: number
  difficulty?: string
}

export default function TopicPage({ params }: { params: { subject: string; topic: string } }) {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [educationalContent, setEducationalContent] = useState("")
  const [previousContent, setPreviousContent] = useState<LearningHistory | null>(null)
  const [readingComplete, setReadingComplete] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeLimit, setTimeLimit] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activityStartTime, setActivityStartTime] = useState<number>(0)
  const [quizStartTime, setQuizStartTime] = useState<number>(0)
  const [visitCount, setVisitCount] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [usingDirectApi, setUsingDirectApi] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())
  const [activeTime, setActiveTime] = useState(0)
  const lastActivityTime = useRef(Date.now())
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    setMounted(true)
    // Start tracking time spent on this page
    setActivityStartTime(Date.now())

    // Log activity when component unmounts
    return () => {
      if (user && activityStartTime > 0) {
        const timeSpent = Math.floor((Date.now() - activityStartTime) / 1000) // Convert to seconds
        logPageActivity("subject", timeSpent)
      }
    }
  }, [])

  // Fix the type checking for topicsData access
  if (
    mounted &&
    (!topicsData[params.subject] ||
      !topicsData[params.subject][params.topic])
  ) {
    notFound()
  }

  // Log activity function
  const logPageActivity = async (type: string, timeSpent: number) => {
    if (!user) return

    try {
      await fetch("/api/user/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          type,
          subject: params.subject,
          topic: params.topic,
          timeSpent,
        }),
      })
    } catch (error) {
      console.error("Error logging activity:", error)
    }
  }

  // Store learning history
  const storeLearningHistory = async (content: string, progress = 0, difficulty = "beginner") => {
    if (!user) return

    try {
      console.log("Storing learning history:", {
        subject: params.subject,
        topic: params.topic,
        progress,
        difficulty,
      })

      await updateLearningHistory(params.subject, params.topic, content, progress, difficulty)
      console.log("Learning history updated successfully")
    } catch (error) {
      console.error("Error storing learning history:", error)
    }
  }

  // Get previous learning history
  const getPreviousLearningHistory = async () => {
    if (!user) return null

    try {
      const history = await getTopicLearningHistory(params.subject, params.topic)
      console.log("Previous learning history:", history)

      if (history) {
        setVisitCount(history.visitCount || 1)
        return history
      }
      return null
    } catch (error) {
      console.error("Error getting learning history:", error)
      return null
    }
  }

  // Generate content directly with Gemini API
  const generateContentDirectly = async (
    title: string,
    subject: string,
    ageRange: string,
    isReturningUser = false,
    previousContent = "",
    visitCount = 0,
  ) => {
    try {
      let prompt = ""

      if (isReturningUser) {
        prompt = `
        Create an educational lesson about "${title}" for ${subject}.
        This is for children aged ${ageRange} who have already studied this topic ${visitCount} times.
        
        Their previous lesson covered:
        ${previousContent}
        
        Write a more advanced lesson that:
        1. Briefly summarizes what they learned before (2-3 lines)
        2. Introduces new, more advanced concepts on the same topic
        3. Provides more complex examples and applications
        4. Uses language appropriate for the age range but assumes prior knowledge
        5. Is about 3-4 paragraphs long (300-500 words)
        
        Format the content with proper paragraphs and make it visually readable.
      `
      } else {
        prompt = `
        Create an educational lesson about "${title}" for ${subject}.
        This is for children aged ${ageRange}.
        
        Write a comprehensive but engaging explanation that:
        1. Introduces the topic in a child-friendly way
        2. Explains key concepts clearly with examples
        3. Uses simple language appropriate for the age range
        4. Includes some interesting facts that children would find engaging
        5. Is about 3-4 paragraphs long (300-500 words)
        
        Format the content with proper paragraphs and make it visually readable.
      `
      }

      const contentResult = await model.generateContent(prompt)
      return contentResult.response.text()
    } catch (error) {
      console.error("Error generating content with direct Gemini API:", error)
      throw error
    }
  }

  // Generate questions directly with Gemini API
  const generateQuestionsDirectly = async (
    title: string,
    subject: string,
    ageRange: string,
    level: string,
    count = 10,
  ): Promise<Question[]> => {
    try {
      const prompt = `
      Create ${count} multiple-choice quiz questions about "${title}" for ${subject}.
      These questions are for children aged ${ageRange} with ${level} level knowledge.
      
      Each question must have:
      - A clear question text
      - Four answer choices
      - The index of the correct answer (0-3)
      - A brief explanation of why the answer is correct
      
      Return ONLY valid JSON formatted like this:
      [
        {
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "correctAnswer": 1,
          "explanation": "2 + 2 equals 4."
        }
      ]
    `

      const questionsResult = await model.generateContent(prompt)
      let responseText = questionsResult.response.text()

      // Fix: Remove unnecessary formatting
      responseText = responseText.replace(/```json|```/g, "").trim()

      // Parse the JSON
      const parsedQuestions: Question[] = JSON.parse(responseText)

      return parsedQuestions
    } catch (error) {
      console.error("Error generating questions with direct Gemini API:", error)
      throw error
    }
  }

  // Generate content with Gemini API through server
  const generateContentWithGemini = async (
    title: string,
    subject: string,
    ageRange: string,
    isReturningUser = false,
    previousContent = "",
    visitCount = 0,
  ) => {
    try {
      // Try direct API first
      if (usingDirectApi) {
        return await generateContentDirectly(title, subject, ageRange, isReturningUser, previousContent, visitCount)
      }

      let prompt = ""

      if (isReturningUser) {
        prompt = `
        Create an educational lesson about "${title}" for ${subject}.
        This is for children aged ${ageRange} who have already studied this topic ${visitCount} times.
        
        Their previous lesson covered:
        ${previousContent}
        
        Write a more advanced lesson that:
        1. Briefly summarizes what they learned before (2-3 lines)
        2. Introduces new, more advanced concepts on the same topic
        3. Provides more complex examples and applications
        4. Uses language appropriate for the age range but assumes prior knowledge
        5. Is about 3-4 paragraphs long (300-500 words)
        
        Format the content with proper paragraphs and make it visually readable.
      `
      } else {
        prompt = `
        Create an educational lesson about "${title}" for ${subject}.
        This is for children aged ${ageRange}.
        
        Write a comprehensive but engaging explanation that:
        1. Introduces the topic in a child-friendly way
        2. Explains key concepts clearly with examples
        3. Uses simple language appropriate for the age range
        4. Includes some interesting facts that children would find engaging
        5. Is about 3-4 paragraphs long (300-500 words)
        
        Format the content with proper paragraphs and make it visually readable.
      `
      }

      // Call Gemini API through server
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        cache: "no-store",
      })

      if (!response.ok) {
        // If server API fails, try direct API
        setUsingDirectApi(true)
        return await generateContentDirectly(title, subject, ageRange, isReturningUser, previousContent, visitCount)
      }

      const data = await response.json()

      // If no content is returned, use default content
      if (!data.content || data.content.trim() === "") {
        return getDefaultContent(title, subject, isReturningUser)
      }

      return data.content
    } catch (error) {
      console.error("Error generating content with Gemini:", error)
      return getDefaultContent(title, subject, isReturningUser)
    }
  }

  // Default content if API fails
  const getDefaultContent = (title: string, subject: string, isReturningUser: boolean) => {
    if (isReturningUser) {
      return `
        Welcome back to our lesson on ${title}!
        
        Last time, we covered the basics of ${title}. You learned about the fundamental concepts and how they apply to everyday situations.
        
        Today, we'll build on that knowledge and explore more advanced concepts. Let's dive deeper into ${title} and discover new examples and applications.
        
        Remember to take your time and enjoy the learning process. If you have any questions, feel free to use our chatbot for additional help!
      `
    } else {
      return `
        Welcome to our lesson on ${title}!
        
        ${title} is an important topic in ${subject} that will help you understand many other concepts. This lesson will introduce you to the key ideas and give you a solid foundation.
        
        We'll start with the basics and then explore some fun examples together. By the end of this lesson, you'll have a good understanding of ${title} and be ready to tackle more complex ideas.
        
        Let's begin our exploration of ${title} together. Remember, learning is an adventure!
      `
    }
  }

  // Generate questions with Gemini API
  const generateQuestionsWithGemini = async (
    title: string,
    subject: string,
    ageRange: string,
    level: string,
    count = 10,
  ): Promise<Question[]> => {
    try {
      // Try direct API first
      if (usingDirectApi) {
        return await generateQuestionsDirectly(title, subject, ageRange, level, count)
      }

      const prompt = `
      Create ${count} multiple-choice quiz questions about "${title}" for ${subject}.
      These questions are for children aged ${ageRange} with ${level} level knowledge.
      
      Each question must have:
      - A clear question text
      - Four answer choices
      - The index of the correct answer (0-3)
      - A brief explanation of why the answer is correct
      
      Return ONLY valid JSON formatted like this:
      [
        {
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "correctAnswer": 1,
          "explanation": "2 + 2 equals 4."
        }
      ]
    `

      // Call Gemini API through server
      const response = await fetch("/api/gemini/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        cache: "no-store",
      })

      if (!response.ok) {
        // If server API fails, try direct API
        setUsingDirectApi(true)
        return await generateQuestionsDirectly(title, subject, ageRange, level, count)
      }

      const data = await response.json()

      if (!data.questions || !Array.isArray(data.questions)) {
        console.error("Invalid questions format:", data)
        throw new Error("Invalid questions format in API response")
      }

      // Ensure questions are in the correct format
      const formattedQuestions = data.questions.map((q: any) => {
        // Make sure correctAnswer is a number
        let correctAnswerIndex =
          typeof q.correctAnswer === "number"
            ? q.correctAnswer
            : q.options.findIndex((opt: string) => opt === q.correctAnswer)

        // If still not found, default to 0
        if (correctAnswerIndex < 0) correctAnswerIndex = 0

        return {
          question: q.question,
          options: Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: correctAnswerIndex,
          explanation: q.explanation || "This is the correct answer.",
        }
      })

      return formattedQuestions
    } catch (error) {
      console.error("Error generating questions with Gemini:", error)

      // Return fallback questions
      return getDefaultQuestions(title, subject)
    }
  }

  // Default questions if API fails
  const getDefaultQuestions = (title: string, subject: string): Question[] => {
    return [
      {
        id: `${subject}-${title}-default-1`,
        question: `What is the main purpose of studying ${title}?`,
        options: ["To pass tests", "To gain practical knowledge", "To memorize facts", "To impress others"],
        correctAnswer: 1,
        explanation:
          "The main purpose of studying any topic is to gain practical knowledge that can be applied in real-world situations.",
      },
      {
        id: `${subject}-${title}-default-2`,
        question: `Which learning approach is most effective for ${title}?`,
        options: [
          "Memorization only",
          "Practice and application",
          "Watching videos only",
          "Reading without taking notes",
        ],
        correctAnswer: 1,
        explanation: "Practice and application help solidify knowledge and develop skills.",
      },
      {
        id: `${subject}-${title}-default-3`,
        question: `How can you improve your understanding of difficult concepts in ${title}?`,
        options: [
          "Give up when it gets hard",
          "Only study what's easy",
          "Break it down into smaller parts",
          "Study for long hours without breaks",
        ],
        correctAnswer: 2,
        explanation: "Breaking down complex concepts into smaller, manageable parts makes them easier to understand.",
      },
      {
        id: `${subject}-${title}-default-4`,
        question: `What is the benefit of taking quizzes while learning about ${title}?`,
        options: ["It wastes time", "It helps reinforce knowledge", "It's only for grades", "It makes learning boring"],
        correctAnswer: 1,
        explanation: "Quizzes help reinforce knowledge through active recall, which strengthens memory.",
      },
      {
        id: `${subject}-${title}-default-5`,
        question: `Why is ${title} an important topic in ${subject}?`,
        options: [
          "It isn't important",
          "It's a fundamental concept",
          "It's only for advanced students",
          "It's only in the curriculum because it's traditional",
        ],
        correctAnswer: 1,
        explanation: `${title} is a fundamental concept in ${subject} that builds the foundation for more advanced topics.`,
      },
      {
        id: `${subject}-${title}-default-6`,
        question: `What should you do if you don't understand something about ${title}?`,
        options: ["Skip it and move on", "Ask for help", "Pretend you understand", "Give up on the subject"],
        correctAnswer: 1,
        explanation: "Asking for help is an important part of the learning process.",
      },
      {
        id: `${subject}-${title}-default-7`,
        question: `How often should you review what you've learned about ${title}?`,
        options: ["Never", "Only before tests", "Regularly, using spaced repetition", "Once a year"],
        correctAnswer: 2,
        explanation: "Regular review using spaced repetition helps move information into long-term memory.",
      },
      {
        id: `${subject}-${title}-default-8`,
        question: `What is the value of making mistakes while learning about ${title}?`,
        options: [
          "There is no value",
          "They show what you need to work on",
          "They prove you're not smart",
          "They waste time",
        ],
        correctAnswer: 1,
        explanation: "Mistakes are valuable feedback that show what areas need more attention.",
      },
      {
        id: `${subject}-${title}-default-9`,
        question: `How can you apply what you learn about ${title} in real life?`,
        options: ["You can't", "By looking for practical applications", "By memorizing facts", "By taking more tests"],
        correctAnswer: 1,
        explanation: "Looking for practical applications helps make learning relevant and useful.",
      },
      {
        id: `${subject}-${title}-default-10`,
        question: `What is the best mindset for learning about ${title}?`,
        options: [
          "Fixed mindset - abilities are fixed",
          "Growth mindset - abilities can develop",
          "Competitive mindset",
          "Perfectionist mindset",
        ],
        correctAnswer: 1,
        explanation: "A growth mindset recognizes that abilities can be developed through dedication and hard work.",
      },
    ]
  }

  // Helper for level color
  const getLevelBg = (level: string) => {
    if (level === 'Beginner') return 'bg-[#60AFFF] text-[#0D0D0D] animate-badge-glow-blue'; // light blue bg, dark text, animated glow
    if (level === 'Intermediate') return 'bg-[#FF6F00] text-white animate-badge-glow-orange'; // orange, animated glow
    if (level === 'Advanced') return 'bg-[#A4FF00] text-[#0D0D0D] animate-badge-glow-green'; // green, animated glow
    return 'bg-[#232323] text-white';
  };

  // Generate educational content and questions
  useEffect(() => {
    if (!mounted) return

    const generateContent = async () => {
      setLoading(true)
      setError(null)

      try {
        const topicData = topicsData[params.subject as keyof typeof topicsData][params.topic as any]

        // Get previous learning history
        const history = await getPreviousLearningHistory()
        setPreviousContent(history)

        // Generate educational content based on previous history
        let content = ""

        const isReturningUser = Boolean(history && typeof history.visitCount === 'number' && history.visitCount > 1)

        if (isReturningUser && history) {
          // User has studied this before, generate content that builds on previous knowledge
          const previousSummary = history.content.substring(0, 300) + "..."

          content = await generateContentWithGemini(
            topicData.title,
            topicData.subject,
            topicData.ageRange,
            true,
            previousSummary,
            history.visitCount
          )
        } else {
          // First time studying this topic
          content = await generateContentWithGemini(
            topicData.title,
            topicData.subject,
            topicData.ageRange,
            false
          )
        }

        // If content is empty, use default content
        if (!content || content.trim() === "") {
          content = getDefaultContent(
            topicData.title,
            topicData.subject,
            isReturningUser
          )
        }

        setEducationalContent(content)

        // Store the content in learning history with 0 progress initially
        await storeLearningHistory(content, 0, topicData.level.toLowerCase())

        // Generate quiz questions
        let generatedQuestions = await generateQuestionsWithGemini(
          topicData.title,
          topicData.subject,
          topicData.ageRange,
          topicData.level,
          10, // Generate 10 questions
        )

        // If no questions were generated, use default questions
        if (!generatedQuestions || generatedQuestions.length === 0) {
          generatedQuestions = getDefaultQuestions(topicData.title, topicData.subject)
        }

        // Ensure we have exactly 10 questions
        if (generatedQuestions.length > 10) {
          generatedQuestions = generatedQuestions.slice(0, 10)
        } else if (generatedQuestions.length < 10) {
          // Fill with default questions if needed
          const defaultQuestions = getDefaultQuestions(topicData.title, topicData.subject)
          generatedQuestions = [...generatedQuestions, ...defaultQuestions.slice(0, 10 - generatedQuestions.length)]
        }

        // Add unique IDs to questions
        const questionsWithIds = generatedQuestions.map((q, index) => ({
          ...q,
          id: `${params.subject}-${params.topic}-${Date.now()}-${index}`,
        }))

        setQuestions(questionsWithIds)

        // Determine appropriate time limit based on difficulty and number of questions
        let recommendedTime = 0
        if (topicData.level === "Beginner") {
          recommendedTime = 300 // 5 minutes for beginners
        } else if (topicData.level === "Intermediate") {
          recommendedTime = 240 // 4 minutes for intermediate
        } else {
          recommendedTime = 180 // 3 minutes for advanced
        }

        setTimeLimit(recommendedTime)
        setTimeRemaining(recommendedTime)
      } catch (err) {
        console.error("Error generating content:", err)
        setError("Failed to generate content. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    generateContent()
  }, [mounted, params.subject, params.topic, user])

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timerActive && timeRemaining === 0) {
      // Time's up
      setTimerActive(false)
    }
  }, [timerActive, timeRemaining])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const startQuiz = () => {
    console.log('startQuiz called'); // DEBUG: Check if this fires on mobile
    setReadingComplete(true)
    setTimerActive(true)
    setQuizStartTime(Date.now())

    // Log activity when starting quiz
    if (user && activityStartTime > 0) {
      const timeSpent = Math.floor((Date.now() - activityStartTime) / 1000) // Convert to seconds
      logPageActivity("reading", timeSpent)
    }
  }

  // Update the handleQuizComplete function to store quiz results properly
  const handleQuizComplete = (score: number, total: number) => {
    setTimerActive(false)
    setQuizCompleted(true)
    setQuizScore(score)

    // Calculate time spent on quiz
    const quizTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000)
    setTimeSpent(quizTimeSpent)

    // Calculate progress percentage
    const progressPercentage = Math.round((score / total) * 100)

    console.log("Quiz completed:", {
      subject: params.subject,
      topic: params.topic,
      score,
      total,
      progressPercentage,
      quizTimeSpent,
    })

    // Update learning history with progress
    storeLearningHistory(
      educationalContent,
      progressPercentage,
      topicsData[params.subject]?.[params.topic]?.level.toLowerCase() || "beginner"
    )

    // Fix the logActivity call
    if (user) {
      logActivity(user.id, {
        type: "quiz",
        subject: params.subject,
        topic: params.topic,
        difficulty: topicsData[params.subject]?.[params.topic]?.level.toLowerCase() || "beginner",
        score: score,
        totalQuestions: total,
        timeSpent: quizTimeSpent,
      } as UserActivity)
        .then(() => {
          console.log("Quiz activity logged successfully")
        })
        .catch((error) => {
          console.error("Error logging quiz activity:", error)
        })
    }
  }

  // Fix the topicData access
  const topicData = topicsData[params.subject]?.[params.topic]

  if (!mounted) {
    return (
      <DoctorStrangeLoader />
    )
  }

  if (loading) {
    return (
      <DoctorStrangeLoader />
    );
  }

  if (error) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <Button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-20 min-h-screen relative overflow-hidden bg-[#0D0D0D] text-white">
      <div className="absolute inset-0 flex w-[390px] items-center h-full">
        <img src="/images/eye-of-agamotto.svg" alt="" className="opacity-30 relative right-8 mt-20 drop-shadow-lg" />
      </div>
      {/* Enhanced animated background with magical portal effect */}
      <div className="absolute inset-0 -z-10 animate-bg-gradient bg-gradient-to-br from-[#181818] via-[#0D0D0D] to-[#181818] opacity-90"></div>
      {/* Glassmorphism overlay for extra depth */}
      <div className="absolute inset-0 -z-10 backdrop-blur-[2.5px] bg-white/2 pointer-events-none" />
      {/* Doctor Strange-inspired magical circles in background */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-10">
        <div className="absolute left-[10%] top-[5%] w-[300px] h-[300px] border-2 border-[#FF6F00] rounded-full animate-rotate-slow shadow-lg shadow-[#FF6F00]/30" />
        <div className="absolute right-[15%] bottom-[10%] w-[250px] h-[250px] border-2 border-[#A4FF00] rounded-full animate-rotate-reverse shadow-lg shadow-[#A4FF00]/30" />
        <div className="absolute left-[50%] top-[40%] w-[400px] h-[400px] border border-[#FF2500] rounded-full animate-pulse-slow shadow-lg shadow-[#FF2500]/30" />
      </div>
      {/* Enhanced animated floating particles with magical energy feel */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {[...Array(18)].map((_, i) => (
          <div key={i} className={`absolute rounded-full bg-[#FF6F00] opacity-10 animate-float-particle shadow-lg`} style={{
            width: `${16 + Math.random() * 24}px`,
            height: `${16 + Math.random() * 24}px`,
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
          }} />
        ))}
        {[...Array(12)].map((_, i) => (
          <div key={`spark-${i}`} className="absolute rounded-full bg-[#FFC107] opacity-20 animate-mystic-spark shadow-md" style={{
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }} />
        ))}
      </div>
      <div className="mb-8">
        <Link
          href={`/subjects/${params.subject}`}
          className="inline-flex text-sm font-semibold text-white hover:text-[#FF6F00] mb-4 transition-colors group no-underline"
        >
          <div className="flex items-center px-2 py-1 cursor-pointer border border-[#232323] rounded-lg w-fit bg-[#181818]/60 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 backdrop-blur-sm">
            <ChevronRight className="mr-1 h-4 w-4 rotate-180 text-[#FF6F00] group-hover:-translate-x-1 transition-transform duration-200 drop-shadow-[0_2px_6px_rgba(255,111,0,0.3)]" />
            <span className="transition-colors font-bold tracking-wide uppercase text-shadow-md">Back to {topicData?.subject}</span>
          </div>
        </Link>
        <div className="relative overflow-hidden rounded-2xl bg-[#18181800] border border-[#232323] p-8 mb-12 animate-fade-in-up hover:shadow-mystical transition-all duration-500 shadow-2xl backdrop-blur-md before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-white/5 before:pointer-events-none before:backdrop-blur-[2px]">
          {/* Mystical energy border effect */}
          <div className="absolute inset-0 -z-1 bg-gradient-to-r from-[#FF6F00]/0 via-[#FF6F00]/10 to-[#FF6F00]/0 opacity-50 animate-border-glow rounded-2xl" />
          <div className="absolute inset-0 flex justify-end items-center h-auto">
            <img
              src="https://i.postimg.cc/1RKCG6q7/pngegg-1.png"
              alt="background"
              className="opacity-40 object-top mt-10 w-[300px] h-auto mr-20 animate-float-slow drop-shadow-2xl"
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${getLevelBg(topicData?.level || '')} animate-appear border-2 border-[#232323] shadow-[0_2px_12px_0_rgba(255,255,255,0.08)] backdrop-blur-sm`}>{topicData?.level}</div>
              <div className="text-xs text-white/70 bg-[#232323] px-2 py-0.5 rounded-full font-semibold animate-fade-in-right border border-[#232323] shadow-sm">Ages {topicData?.ageRange}</div>
              {visitCount > 1 && (
                <div className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#FF6F00]/10 text-[#FF6F00] border border-[#FF6F00]/30 animate-fade-in-right delay-100 shadow-sm">Visit #{visitCount}</div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#fff] tracking-tight uppercase animate-fade-in-up drop-shadow-[0_2px_12px_rgba(255,255,255,0.12)] text-shadow-lg" style={{letterSpacing: '0.08em'}}>{topicData?.title}</h1>
            <p className="text-lg text-white/80 max-w-3xl bg-[#18181800] px-3 py-2 rounded-lg font-medium animate-fade-in-up delay-150" style={{letterSpacing: '0.02em'}}>{topicData?.description}</p>
          </div>
        </div>
        {!readingComplete ? (
          <div className="p-6 rounded-2xl bg-[#181818]/80 border border-[#232323] animate-fade-in-up delay-200 hover:shadow-mystical transition-all duration-500 shadow-xl backdrop-blur-md before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-white/5 before:pointer-events-none before:backdrop-blur-[2px]">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold mb-4 text-white tracking-wide animate-fade-in-up delay-250 relative inline-block drop-shadow-lg text-shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-12 flex items-center justify-center">
                    <img src="/images/time-stone.svg" alt="" className="drop-shadow-lg" />
                  </span>
                  <span className="bg-gradient-to-l from-[#96d09e] via-[#fff] to-[#fff] text-transparent bg-clip-text font-black tracking-wider text-shadow-lg" style={{letterSpacing: '0.09em'}}>Educational Content</span>
                </div>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#16d52f] to-transparent animate-width-expand rounded-full"></span>
              </h2>
              {previousContent && visitCount > 1 && (
                <div className="mb-6 p-4 bg-[#FF6F00]/10 rounded-lg border border-[#FF6F00]/30 animate-fade-in-up delay-300 hover:bg-[#FF6F00]/15 transition-all duration-300 shadow-inner backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-[#FF6F00] mt-0.5 animate-pulse drop-shadow-lg" />
                    <div>
                      <h3 className="font-bold text-white text-shadow-md">Welcome Back!</h3>
                      <p className="text-sm text-white/80 font-semibold">You've studied this topic {visitCount} times before. This lesson builds on your previous knowledge.</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="prose prose-sm prose-invert max-w-none text-white">
                {educationalContent.split("\n\n").map((paragraph, index) => (
                  <p key={index} className={`text-white/90 bg-[#181818] px-3 py-2 rounded-lg mb-2 font-medium animate-fade-in-up shadow-inner backdrop-blur-sm`} style={{ animationDelay: `${300 + (index * 80)}ms`, letterSpacing: '0.01em', textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={startQuiz}
                className="bg-gradient-to-r from-[#FF6F00] to-[#B00020] hover:from-[#B00020] hover:to-[#FF6F00] text-white font-bold px-6 py-2 rounded-lg transition-all duration-200 border-none shadow-lg shadow-[#FF6F00]/20 animate-mystic-glow relative overflow-hidden group focus:scale-105 active:scale-95 ring-2 ring-[#FF6F00]/30 ring-offset-2 ring-offset-[#181818]"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF6F00]/0 via-[#FF6F00]/30 to-[#FF6F00]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative inline-block animate-wiggle font-black tracking-wider text-shadow-lg">I've Read This - Start Quiz</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up delay-200">
            {!quizCompleted ? (
              <>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold text-white animate-fade-in">Timed Quiz: {questions.length} questions</div>
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 text-[#FF6F00] ${timeRemaining < 30 ? 'animate-pulse-fast' : 'animate-pulse'}`} />
                    <div className={`text-sm font-bold ${timeRemaining < 30 ? "text-[#B00020] animate-pulse-text" : "text-white"} animate-fade-in-slow`}>
                      Time Remaining: {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>

                <div className="relative w-full group">
                  <Progress
                    value={(timeRemaining / timeLimit) * 100}
                    className="h-2 rounded-full bg-[#232323] overflow-hidden transition-all duration-300"
                    style={{ backgroundImage: 'linear-gradient(90deg, #60AFFF, #FF6F00, #A4FF00)' }}
                  />
                  {/* Animated stripes overlay with magical energy feel */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none animate-progress-stripes bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0_10px,transparent_10px_20px)] rounded-full" />

                  {/* Magical spark effect on progress bar */}
                  <div className="absolute top-0 bottom-0 pointer-events-none flex items-center">
                    <div className="h-4 w-4 rounded-full bg-[#FF6F00] opacity-0 group-hover:opacity-100 shadow-[0_0_10px_4px_#FF6F00] transition-opacity duration-300"></div>
                  </div>
                </div>

                {timerActive ? (
                  <div className="animate-fade-in-up delay-300">
                    <QuizEngine
                      questions={questions as Question[]}
                      subjectColor="bg-[#FF6F00]"
                      subject={params.subject}
                      topic={params.topic}
                      timeLimit={timeLimit}
                      difficulty={topicData?.level.toLowerCase()}
                      onComplete={handleQuizComplete}
                    />
                  </div>
                ) : timeRemaining === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#181818] border border-[#232323] text-center animate-fade-in-up hover:shadow-mystical transition-all duration-500">
                    <div className="w-16 h-16 rounded-full bg-[#FF6F00]/20 flex items-center justify-center mx-auto mb-4 animate-mystic-pulse">
                      <Clock className="h-8 w-8 text-[#FF6F00]" />
                    </div>
                    <h2 className="text-2xl font-extrabold mb-2 text-white">Time's Up!</h2>
                    <p className="text-white/80 mb-6 font-semibold">
                      You've run out of time for this quiz. Would you like to try again?
                    </p>
                    <Button
                      onClick={() => window.location.reload()}
                      className="bg-gradient-to-r from-[#FF6F00] to-[#B00020] hover:from-[#B00020] hover:to-[#FF6F00] text-white font-bold px-6 py-2 rounded-lg border-none shadow-lg shadow-[#FF6F00]/20 animate-mystic-glow"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="p-8 rounded-2xl bg-[#181818] border border-[#232323] animate-fade-in-up hover:shadow-mystical transition-all duration-500">
                <div className="w-16 h-16 rounded-full bg-[#A4FF00]/10 flex items-center justify-center mx-auto mb-4 animate-mystic-pulse">
                  <Award className="h-8 w-8 text-[#A4FF00]" />
                </div>
                <h3 className="text-2xl font-extrabold mb-2 text-white animate-fade-in-up delay-100">Quiz Completed!</h3>
                <p className="text-xl font-bold mb-1 animate-fade-in-up delay-200">
                  Your Score: <span className="text-[#A4FF00]">{quizScore}</span> out of <span className="text-white">{questions.length}</span>
                </p>
                <p className="text-white/80 mb-6 font-semibold animate-fade-in-up delay-300">Time spent: {formatTime(activeTime)}</p>

                <div className="w-full max-w-xs mx-auto mb-6 animate-fade-in-up delay-400">
                  <div className="relative h-4 rounded-full bg-[#232323] overflow-hidden">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#60AFFF] via-[#FF6F00] to-[#A4FF00] animate-score-fill"
                      style={{ width: `${(quizScore / questions.length) * 100}%` }}
                    ></div>
                    <div className="absolute inset-0 w-full h-full pointer-events-none animate-progress-stripes bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0_10px,transparent_10px_20px)] rounded-full" />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-white font-bold">
                    <span>0</span>
                    <span>{questions.length}</span>
                  </div>
                </div>

                {/* Performance analysis with magical animations */}
                <div className="mb-6 p-4 rounded-lg bg-[#232323]/80 border border-[#232323] animate-fade-in-up delay-500 hover:shadow-mystical transition-all duration-300">
                  <h4 className="font-bold mb-2 text-white relative inline-block">
                    Performance Analysis
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#A4FF00] to-transparent animate-width-expand"></span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 animate-fade-in-up delay-550">
                      <div className="w-8 h-8 rounded-full bg-[#A4FF00]/10 flex items-center justify-center animate-mystic-pulse">
                        <CheckCircle className="h-4 w-4 text-[#A4FF00]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Correct Answers</p>
                        <p className="text-lg font-bold text-[#A4FF00]">{quizScore}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 animate-fade-in-up delay-600">
                      <div className="w-8 h-8 rounded-full bg-[#B00020]/10 flex items-center justify-center animate-mystic-pulse">
                        <XCircle className="h-4 w-4 text-[#B00020]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Incorrect Answers</p>
                        <p className="text-lg font-bold text-[#B00020]">{questions.length - quizScore}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 animate-fade-in-up delay-650">
                      <div className="w-8 h-8 rounded-full bg-[#FF6F00]/10 flex items-center justify-center animate-mystic-pulse">
                        <Clock className="h-4 w-4 text-[#FF6F00]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Time Spent</p>
                        <p className="text-lg font-bold text-white">{formatTime(activeTime)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 animate-fade-in-up delay-700">
                      <div className="w-8 h-8 rounded-full bg-[#A4FF00]/10 flex items-center justify-center animate-mystic-pulse">
                        <Award className="h-4 w-4 text-[#A4FF00]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Accuracy</p>
                        <p className="text-lg font-bold text-white">{Math.round((quizScore / questions.length) * 100)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-800">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentQuestionIndex(0)
                      setSelectedOption(null)
                      setIsAnswerChecked(false)
                      setScore(0)
                      setQuizCompleted(false)
                      setShowExplanation(false)
                      setStartTime(Date.now())
                      setActiveTime(0)
                      lastActivityTime.current = Date.now()

                      // Restart activity tracking
                      if (activityTimerRef.current) {
                        clearInterval(activityTimerRef.current)
                      }
                      activityTimerRef.current = setInterval(() => {
                        const now = Date.now()
                        const idleTime = now - lastActivityTime.current
                        if (idleTime < 60000) {
                          setActiveTime((prev) => prev + 1)
                        }
                      }, 1000)
                    }}
                    className="flex items-center gap-2 bg-transparent border-[#FF6F00] text-[#FF6F00] hover:bg-[#FF6F00]/10 font-bold rounded-lg animate-mystic-glow relative overflow-hidden group"
                  >
                    {/* Magical energy effect on hover */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF6F00]/0 via-[#FF6F00]/20 to-[#FF6F00]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                    <RefreshCw className="h-4 w-4 relative animate-spin-slow" />
                    <span className="relative">Try Again</span>
                  </Button>
                  <Button
                    className="bg-[#B00020] hover:bg-[#FF6F00] text-white font-bold rounded-lg animate-mystic-glow relative overflow-hidden group"
                    onClick={() => (window.location.href = "/subjects")}
                  >
                    {/* Magical energy effect on hover */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#B00020]/0 via-[#B00020]/30 to-[#B00020]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                    <span className="relative">Back to Subjects</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/dashboard")}
                    className="bg-transparent border-[#A4FF00] text-[#A4FF00] hover:bg-[#A4FF00]/10 font-bold rounded-lg animate-mystic-glow relative overflow-hidden group"
                  >
                    {/* Magical energy effect on hover */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#A4FF00]/0 via-[#A4FF00]/20 to-[#A4FF00]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                    <span className="relative">View Dashboard</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Enhanced animation keyframes and new styles */}
      <style jsx>{`
        .text-shadow-md { text-shadow: 0 2px 8px rgba(0,0,0,0.18); }
        .text-shadow-lg { text-shadow: 0 4px 24px rgba(0,0,0,0.22), 0 1px 0 #fff2; }
        .shadow-inner { box-shadow: inset 0 2px 12px 0 rgba(255,255,255,0.04); }
        .backdrop-blur-sm { backdrop-filter: blur(2.5px); }
        .backdrop-blur-md { backdrop-filter: blur(4px); }
        .drop-shadow-lg { filter: drop-shadow(0 4px 16px rgba(0,0,0,0.18)); }
        .drop-shadow-2xl { filter: drop-shadow(0 8px 32px rgba(0,0,0,0.22)); }
        // ... existing keyframes ...
      `}</style>
    </div>
  )
}