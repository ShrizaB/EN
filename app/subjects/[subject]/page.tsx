"use client"

import Link from "next/link"
import { useRef } from "react"
import { notFound } from "next/navigation"
import './style.css'
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
  Film,
} from "lucide-react"

// This would typically come from a database or API
const subjectsData = {
  math: {
    title: "Mathematics",
    description: "Develop strong math skills through interactive games and puzzles",
    longDescription:
      "Our mathematics curriculum is designed to make numbers fun and engaging. Through interactive games, puzzles, and activities, children develop strong foundational math skills while enjoying the learning process.",
    icon: Calculator,
    color: "text-math",
    bgColor: "bg-math/10",
    buttonColor: "bg-math",
    gradientText: "from-math to-blue-400",
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
        description: "Multiply numbers and learn times tables",
        level: "Intermediate",
        ageRange: "7-9",
        questionsCount: 20,
      },
      {
        id: "division",
        title: "Division",
        description: "Understand division concepts",
        level: "Intermediate",
        ageRange: "7-9",
        questionsCount: 20,
      },
      {
        id: "fractions",
        title: "Fractions",
        description: "Learn about parts of a whole",
        level: "Intermediate",
        ageRange: "8-10",
        questionsCount: 15,
      },
      {
        id: "geometry",
        title: "Geometry",
        description: "Explore shapes and spatial relationships",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 15,
      },
      {
        id: "algebra",
        title: "Algebra Basics",
        description: "Introduction to algebraic concepts",
        level: "Advanced",
        ageRange: "10-12",
        questionsCount: 10,
      },
    ],
  },
  science: {
    title: "Science",
    description: "Explore the natural world through experiments and discoveries",
    longDescription:
      "Our science curriculum encourages curiosity and exploration. Through interactive simulations and engaging activities, children learn about the natural world and develop scientific thinking skills.",
    icon: Flask,
    color: "text-science",
    bgColor: "bg-science/10",
    buttonColor: "bg-science",
    gradientText: "from-science to-green-400",
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
        description: "Discover how plants grow and thrive",
        level: "Beginner",
        ageRange: "5-8",
        questionsCount: 12,
      },
      {
        id: "weather",
        title: "Weather & Seasons",
        description: "Explore different weather patterns and seasons",
        level: "Beginner",
        ageRange: "6-9",
        questionsCount: 15,
      },
      {
        id: "solar_system",
        title: "Solar System",
        description: "Learn about planets and space",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 15,
      },
      {
        id: "simple_machines",
        title: "Simple Machines",
        description: "Discover levers, pulleys, and other simple machines",
        level: "Intermediate",
        ageRange: "8-12",
        questionsCount: 12,
      },
      {
        id: "human_body",
        title: "Human Body",
        description: "Learn about body systems and how they work",
        level: "Intermediate",
        ageRange: "8-12",
        questionsCount: 15,
      },
      {
        id: "chemistry",
        title: "Chemistry Basics",
        description: "Introduction to basic chemistry concepts",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 10,
      },
      {
        id: "ecosystems",
        title: "Ecosystems",
        description: "Understand how living things interact with their environment",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 12,
      },
    ],
  },
  reading: {
    title: "Reading",
    description: "Build literacy skills through interactive stories and activities",
    longDescription:
      "Our reading curriculum helps children develop strong literacy skills through interactive activities, phonics games, and vocabulary-building exercises. Children progress from letter recognition to reading comprehension at their own pace.",
    icon: BookOpen,
    color: "text-reading",
    bgColor: "bg-reading/10",
    buttonColor: "bg-reading",
    gradientText: "from-reading to-pink-400",
    topics: [
      {
        id: "alphabet",
        title: "Alphabet Recognition",
        description: "Learn letters and their sounds",
        level: "Beginner",
        ageRange: "3-5",
        questionsCount: 10,
      },
      {
        id: "phonics",
        title: "Phonics",
        description: "Connect letters with their sounds",
        level: "Beginner",
        ageRange: "4-6",
        questionsCount: 15,
      },
      {
        id: "sight-words",
        title: "Sight Words",
        description: "Learn common words by sight",
        level: "Beginner",
        ageRange: "5-7",
        questionsCount: 20,
      },
      {
        id: "vocabulary",
        title: "Vocabulary Building",
        description: "Expand your word knowledge",
        level: "Intermediate",
        ageRange: "6-9",
        questionsCount: 15,
      },
      {
        id: "comprehension",
        title: "Reading Comprehension",
        description: "Understand what you read",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 10,
      },
      {
        id: "grammar",
        title: "Grammar Basics",
        description: "Learn the rules of language",
        level: "Intermediate",
        ageRange: "8-10",
        questionsCount: 15,
      },
      {
        id: "writing",
        title: "Creative Writing",
        description: "Express yourself through stories",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 8,
      },
      {
        id: "poetry",
        title: "Poetry",
        description: "Explore rhythm and expression in language",
        level: "Advanced",
        ageRange: "10-12",
        questionsCount: 10,
      },
    ],
  },
  coding: {
    title: "Coding",
    description: "Learn programming concepts through fun, interactive challenges",
    longDescription:
      "Our coding curriculum introduces children to programming concepts through visual activities. Children develop computational thinking skills while creating animations, games, and solving puzzles.",
    icon: Code,
    color: "text-coding",
    bgColor: "bg-coding/10",
    buttonColor: "bg-coding",
    gradientText: "from-coding to-yellow-400",
    topics: [
      {
        id: "basics",
        title: "Coding Basics",
        description: "Introduction to coding concepts",
        level: "Beginner",
        ageRange: "5-7",
        questionsCount: 10,
      },
      {
        id: "sequences",
        title: "Sequences",
        description: "Learn about sequences and algorithms",
        level: "Beginner",
        ageRange: "6-8",
        questionsCount: 12,
      },
      {
        id: "loops",
        title: "Loops",
        description: "Discover how loops work in programming",
        level: "Intermediate",
        ageRange: "7-9",
        questionsCount: 15,
      },
      {
        id: "conditionals",
        title: "Conditionals",
        description: "Learn about if-then statements and logic",
        level: "Intermediate",
        ageRange: "8-10",
        questionsCount: 15,
      },
      {
        id: "functions",
        title: "Functions",
        description: "Create and use functions in your code",
        level: "Advanced",
        ageRange: "9-11",
        questionsCount: 12,
      },
      {
        id: "variables",
        title: "Variables",
        description: "Store and use data in your programs",
        level: "Advanced",
        ageRange: "9-11",
        questionsCount: 15,
      },
      {
        id: "debugging",
        title: "Debugging",
        description: "Find and fix errors in code",
        level: "Advanced",
        ageRange: "10-12",
        questionsCount: 10,
      },
      {
        id: "game_design",
        title: "Game Design",
        description: "Build your own simple games with code",
        level: "Advanced",
        ageRange: "10-12",
        questionsCount: 8,
      },
    ],
  },
  // New subjects
  music: {
    title: "Music",
    description: "Discover the world of music through fun and interactive lessons",
    longDescription:
      "Our music curriculum introduces children to the joy of music through engaging activities. From learning notes to understanding rhythm and exploring different instruments, children develop musical appreciation and skills.",
    icon: Music,
    color: "text-music",
    bgColor: "bg-music/10",
    buttonColor: "bg-music",
    gradientText: "from-music to-amber-400",
    topics: [
      {
        id: "notes",
        title: "Musical Notes",
        description: "Learn to read and understand musical notes",
        level: "Beginner",
        ageRange: "5-8",
        questionsCount: 10,
      },
      {
        id: "instruments",
        title: "Musical Instruments",
        description: "Discover different musical instruments and their sounds",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 12,
      },
      {
        id: "rhythm",
        title: "Rhythm & Beat",
        description: "Understand rhythm patterns and beats in music",
        level: "Intermediate",
        ageRange: "6-9",
        questionsCount: 15,
      },
      {
        id: "composition",
        title: "Music Composition",
        description: "Learn the basics of creating your own music",
        level: "Advanced",
        ageRange: "8-12",
        questionsCount: 10,
      },
      {
        id: "music_history",
        title: "Music History",
        description: "Explore different music styles and famous composers",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 12,
      },
      {
        id: "singing",
        title: "Singing Basics",
        description: "Learn proper singing techniques and vocal exercises",
        level: "Beginner",
        ageRange: "5-9",
        questionsCount: 10,
      },
      {
        id: "music_theory",
        title: "Music Theory",
        description: "Understand the building blocks of music",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 15,
      },
      {
        id: "world_music",
        title: "World Music",
        description: "Discover music from different cultures around the world",
        level: "Intermediate",
        ageRange: "7-11",
        questionsCount: 12,
      },
    ],
  },
  art: {
    title: "Art",
    description: "Express creativity through various art forms and techniques",
    longDescription:
      "Our art curriculum encourages creative expression and artistic exploration. Children learn about colors, drawing techniques, famous artists, and different art styles while developing their own unique artistic voice.",
    icon: Palette,
    color: "text-art",
    bgColor: "bg-art/10",
    buttonColor: "bg-art",
    gradientText: "from-art to-purple-400",
    topics: [
      {
        id: "colors",
        title: "Colors & Mixing",
        description: "Learn about primary colors and how to mix them",
        level: "Beginner",
        ageRange: "3-6",
        questionsCount: 10,
      },
      {
        id: "drawing",
        title: "Basic Drawing",
        description: "Learn fundamental drawing techniques",
        level: "Beginner",
        ageRange: "5-8",
        questionsCount: 12,
      },
      {
        id: "painting",
        title: "Painting Techniques",
        description: "Explore different painting styles and methods",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 15,
      },
      {
        id: "art_history",
        title: "Art History",
        description: "Learn about famous artists and art movements",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 12,
      },
      {
        id: "sculpture",
        title: "Sculpture Basics",
        description: "Create three-dimensional art with various materials",
        level: "Intermediate",
        ageRange: "6-9",
        questionsCount: 10,
      },
      {
        id: "crafts",
        title: "Arts & Crafts",
        description: "Make fun projects using different materials and techniques",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 8,
      },
      {
        id: "digital_art",
        title: "Digital Art",
        description: "Create art using digital tools and techniques",
        level: "Advanced",
        ageRange: "8-12",
        questionsCount: 10,
      },
      {
        id: "art-appreciation",
        title: "Art Appreciation",
        description: "Learn to observe, analyze, and appreciate different artworks",
        level: "Intermediate",
        ageRange: "7-11",
        questionsCount: 12,
      },
    ],
  },
  geography: {
    title: "Geography",
    description: "Explore the world's places, people, and environments",
    longDescription:
      "Our geography curriculum takes children on a journey around the world. Through interactive maps, virtual tours, and engaging activities, children learn about different countries, cultures, landforms, and environments.",
    icon: Globe,
    color: "text-geography",
    bgColor: "bg-geography/10",
    buttonColor: "bg-geography",
    gradientText: "from-geography to-teal-400",
    topics: [
      {
        id: "continents",
        title: "Continents & Oceans",
        description: "Learn about the seven continents and five oceans",
        level: "Beginner",
        ageRange: "5-8",
        questionsCount: 10,
      },
      {
        id: "countries",
        title: "Countries & Capitals",
        description: "Explore different countries and their capital cities",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 15,
      },
      {
        id: "landforms",
        title: "Landforms & Features",
        description: "Learn about mountains, rivers, deserts, and other geographical features",
        level: "Intermediate",
        ageRange: "8-11",
        questionsCount: 12,
      },
      {
        id: "climate",
        title: "Climate Zones",
        description: "Understand different climate types around the world",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 10,
      },
      {
        id: "map_skills",
        title: "Map Skills",
        description: "Learn to read and understand different types of maps",
        level: "Beginner",
        ageRange: "6-9",
        questionsCount: 12,
      },
      {
        id: "cultures",
        title: "World Cultures",
        description: "Discover traditions, foods, and customs from around the world",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 15,
      },
      {
        id: "natural_resources",
        title: "Natural Resources",
        description: "Learn about the Earth's resources and their importance",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 10,
      },
      {
        id: "environmental_geography",
        title: "Environmental Geography",
        description: "Understand how humans interact with and impact the environment",
        level: "Advanced",
        ageRange: "10-12",
        questionsCount: 12,
      },
    ],
  },
  logic: {
    title: "Logic",
    description: "Develop critical thinking and problem-solving skills",
    longDescription:
      "Our logic curriculum strengthens critical thinking and problem-solving abilities. Through puzzles, brain teasers, and logical challenges, children learn to analyze information, recognize patterns, and develop reasoning skills.",
    icon: Brain,
    color: "text-logic",
    bgColor: "bg-logic/10",
    buttonColor: "bg-logic",
    gradientText: "from-logic to-indigo-400",
    topics: [
      {
        id: "patterns",
        title: "Patterns & Sequences",
        description: "Identify and continue patterns in shapes, numbers, and objects",
        level: "Beginner",
        ageRange: "4-7",
        questionsCount: 10,
      },
      {
        id: "puzzles",
        title: "Logic Puzzles",
        description: "Solve fun puzzles that develop critical thinking skills",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 15,
      },
      {
        id: "reasoning",
        title: "Deductive Reasoning",
        description: "Learn to draw conclusions from given information",
        level: "Intermediate",
        ageRange: "8-11",
        questionsCount: 12,
      },
      {
        id: "problem_solving",
        title: "Problem Solving",
        description: "Develop strategies to solve complex problems",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 10,
      },
      {
        id: "brain_teasers",
        title: "Brain Teasers",
        description: "Challenge your mind with fun and tricky problems",
        level: "Intermediate",
        ageRange: "7-10",
        questionsCount: 12,
      },
      {
        id: "sudoku",
        title: "Sudoku & Number Puzzles",
        description: "Learn to solve number-based logic puzzles",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 8,
      },
      {
        id: "critical_thinking",
        title: "Critical Thinking",
        description: "Analyze information and make reasoned judgments",
        level: "Advanced",
        ageRange: "10-12",
        questionsCount: 10,
      },
      {
        id: "logical_fallacies",
        title: "Logical Fallacies",
        description: "Identify common errors in reasoning",
        level: "Advanced",
        ageRange: "10-12",
        questionsCount: 12,
      },
    ],
  },
  c_programming: {
    title: "C Programming",
    description: "Learn the fundamentals of C programming language",
    longDescription:
      "Our C programming curriculum introduces children to one of the most influential programming languages. Through step-by-step lessons and interactive examples, children learn the basics of C programming, from variables to functions.",
    icon: Code,
    color: "text-coding",
    bgColor: "bg-coding/10",
    buttonColor: "bg-coding",
    gradientText: "from-coding to-blue-400",
    topics: [
      {
        id: "intro",
        title: "Introduction to C",
        description: "Learn the basics of C programming language",
        level: "Beginner",
        ageRange: "10-12",
        questionsCount: 10,
      },
      {
        id: "variables",
        title: "Variables & Data Types",
        description: "Understand different data types and how to use variables in C",
        level: "Beginner",
        ageRange: "10-12",
        questionsCount: 12,
      },
      {
        id: "control_flow",
        title: "Control Flow",
        description: "Learn about if statements, loops, and switch cases in C",
        level: "Intermediate",
        ageRange: "11-12",
        questionsCount: 15,
      },
      {
        id: "functions",
        title: "Functions",
        description: "Create and use functions in C programs",
        level: "Intermediate",
        ageRange: "11-12",
        questionsCount: 12,
      },
      {
        id: "arrays",
        title: "Arrays & Strings",
        description: "Work with collections of data in C",
        level: "Intermediate",
        ageRange: "11-12",
        questionsCount: 10,
      },
      {
        id: "pointers",
        title: "Pointers",
        description: "Understand memory addresses and pointers in C",
        level: "Advanced",
        ageRange: "12",
        questionsCount: 12,
      },
      {
        id: "structures",
        title: "Structures",
        description: "Create custom data types using structures",
        level: "Advanced",
        ageRange: "12",
        questionsCount: 10,
      },
      {
        id: "file_io",
        title: "File Input/Output",
        description: "Learn to read from and write to files in C",
        level: "Advanced",
        ageRange: "12",
        questionsCount: 8,
      },
    ],
  },
  python: {
    title: "Python",
    description: "Discover Python programming with fun, interactive lessons",
    longDescription:
      "Our Python curriculum makes programming accessible and enjoyable for children. Through hands-on projects and interactive examples, children learn Python's syntax, data structures, and programming concepts while building fun applications.",
    icon: Code,
    color: "text-coding",
    bgColor: "bg-coding/10",
    buttonColor: "bg-coding",
    gradientText: "from-coding to-green-400",
    topics: [
      {
        id: "intro",
        title: "Introduction to Python",
        description: "Learn the basics of Python programming language",
        level: "Beginner",
        ageRange: "9-12",
        questionsCount: 10,
      },
      {
        id: "variables",
        title: "Variables & Data Types",
        description: "Understand different data types and how to use variables in Python",
        level: "Beginner",
        ageRange: "9-12",
        questionsCount: 12,
      },
      {
        id: "control_flow",
        title: "Control Flow",
        description: "Learn about if statements, loops, and conditional expressions in Python",
        level: "Intermediate",
        ageRange: "10-12",
        questionsCount: 15,
      },
      {
        id: "functions",
        title: "Functions & Modules",
        description: "Create and use functions and modules in Python",
        level: "Intermediate",
        ageRange: "10-12",
        questionsCount: 12,
      },
      {
        id: "lists",
        title: "Lists & Dictionaries",
        description: "Work with collections of data in Python",
        level: "Intermediate",
        ageRange: "10-12",
        questionsCount: 10,
      },
      {
        id: "file_handling",
        title: "File Handling",
        description: "Learn to read from and write to files in Python",
        level: "Intermediate",
        ageRange: "11-12",
        questionsCount: 8,
      },
      {
        id: "error_handling",
        title: "Error Handling",
        description: "Understand how to handle errors and exceptions in Python",
        level: "Advanced",
        ageRange: "11-12",
        questionsCount: 10,
      },
      {
        id: "simple_games",
        title: "Simple Games",
        description: "Create fun games using Python",
        level: "Advanced",
        ageRange: "11-12",
        questionsCount: 8,
      },
    ],
  },
  java: {
    title: "Java",
    description: "Explore Java programming concepts and object-oriented design",
    longDescription:
      "Our Java curriculum introduces children to object-oriented programming through the Java language. Through structured lessons and interactive examples, children learn Java syntax, classes, objects, and programming concepts.",
    icon: Code,
    color: "text-coding",
    bgColor: "bg-coding/10",
    buttonColor: "bg-coding",
    gradientText: "from-coding to-orange-400",
    topics: [
      {
        id: "intro",
        title: "Introduction to Java",
        description: "Learn the basics of Java programming language",
        level: "Beginner",
        ageRange: "10-12",
        questionsCount: 10,
      },
      {
        id: "variables",
        title: "Variables & Data Types",
        description: "Understand different data types and how to use variables in Java",
        level: "Beginner",
        ageRange: "10-12",
        questionsCount: 12,
      },
      {
        id: "control_flow",
        title: "Control Flow",
        description: "Learn about if statements, loops, and switch cases in Java",
        level: "Intermediate",
        ageRange: "11-12",
        questionsCount: 15,
      },
      {
        id: "classes",
        title: "Classes & Objects",
        description: "Understand object-oriented programming concepts in Java",
        level: "Advanced",
        ageRange: "11-12",
        questionsCount: 12,
      },
      {
        id: "methods",
        title: "Methods",
        description: "Create and use methods in Java programs",
        level: "Intermediate",
        ageRange: "11-12",
        questionsCount: 10,
      },
      {
        id: "arrays",
        title: "Arrays & ArrayLists",
        description: "Work with collections of data in Java",
        level: "Intermediate",
        ageRange: "11-12",
        questionsCount: 12,
      },
      {
        id: "inheritance",
        title: "Inheritance & Polymorphism",
        description: "Learn advanced object-oriented programming concepts",
        level: "Advanced",
        ageRange: "12",
        questionsCount: 10,
      },
      {
        id: "exception_handling",
        title: "Exception Handling",
        description: "Understand how to handle errors and exceptions in Java",
        level: "Advanced",
        ageRange: "12",
        questionsCount: 8,
      },
    ],
  },
  movies: {
    title: "Movies",
    description: "Explore the world of cinema and filmmaking",
    longDescription:
      "Our movies curriculum introduces children to the magic of cinema. Through engaging lessons and activities, children learn about film genres, famous movies, storytelling techniques, and the basics of filmmaking.",
    icon: Film,
    color: "text-primary",
    bgColor: "bg-primary/10",
    buttonColor: "bg-primary",
    gradientText: "from-primary to-purple-400",
    topics: [
      {
        id: "film-history",
        title: "Film History",
        description: "Learn about the evolution of movies from silent films to modern cinema",
        level: "Intermediate",
        ageRange: "8-12",
        questionsCount: 12,
      },
      {
        id: "genres",
        title: "Movie Genres",
        description: "Explore different types of movies and their characteristics",
        level: "Beginner",
        ageRange: "6-10",
        questionsCount: 10,
      },
      {
        id: "animation",
        title: "Animation",
        description: "Discover how animated movies are made and their history",
        level: "Beginner",
        ageRange: "5-9",
        questionsCount: 10,
      },
      {
        id: "storytelling",
        title: "Storytelling in Film",
        description: "Learn how movies tell stories through visuals and sound",
        level: "Intermediate",
        ageRange: "8-12",
        questionsCount: 15,
      },
      {
        id: "famous_directors",
        title: "Famous Directors",
        description: "Learn about influential filmmakers and their unique styles",
        level: "Advanced",
        ageRange: "10-12",
        questionsCount: 12,
      },
      {
        id: "film_techniques",
        title: "Filmmaking Techniques",
        description: "Understand camera angles, shots, and visual storytelling",
        level: "Advanced",
        ageRange: "9-12",
        questionsCount: 15,
      },
      {
        id: "movie_reviews",
        title: "Movie Reviews",
        description: "Learn how to analyze and critique films",
        level: "Intermediate",
        ageRange: "8-12",
        questionsCount: 10,
      },
      {
        id: "special_effects",
        title: "Special Effects",
        description: "Discover how movie magic is created with special effects",
        level: "Intermediate",
        ageRange: "7-12",
        questionsCount: 12,
      },
    ],
  },
}

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = params.subject;

  if (!subjectsData[subject as keyof typeof subjectsData]) {
    notFound();
  }

  const subjectData = subjectsData[subject as keyof typeof subjectsData];
  const SubjectIcon = subjectData.icon;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
  if (audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current.volume = .15; // Set volume to 20%
    audioRef.current.play();
  }
};


  return (
    <div className="relative bg-gradient-to-bl from-[#0d3c0d] via-black to-[#440303] text-green-100 min-h-screen hulk-particles">
      <img
        src="https://i.postimg.cc/PrbLMy46/Red-Hulk-No-Background.png"
        alt="background"
        className=" absolute bottom-[-80px] left-0 w-[600px] h-auto opacity-70"
      />
      <img
        src="https://i.postimg.cc/X7bsZLxj/f9ad028ac76eb967349c888bfb355495.png"
        alt="background"
        className=" absolute top-20 right-0 w-[600px] h-auto opacity-50 scale-x-[-1]"
      />
      <img
        src="https://i.postimg.cc/RZGLH2zk/hulk-marvel-rivals-png-by-joaolucasvingaprimos-di6otfx.png"
        alt="background"
        className=" absolute bottom-0 right-0 w-[270px] h-auto opacity-100 scale-x-[-1] animate-float"
      />

      <div className="container py-12 md:py-20 relative z-10">
        <Link
          href="/subjects"
          className="inline-flex items-center text-sm font-medium text-green-400 hover:text-green-300 transition-colors mb-8"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Subjects
        </Link>

        {/* Subject header with glowing border and bounce icon */}
        <div className="rounded-xl p-8 mb-12 hulk-glow-box border-green-700 border bg-gradient-to-br from-green-950 to-black transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          <div className="w-20 h-20 rounded-full icon-glow flex items-center justify-center animate-bounce-slow mb-4">
            <SubjectIcon className="h-10 w-10 text-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 hulk-heading">
            {subjectData.title}
          </h1>
          <p className="text-lg text-green-400 max-w-3xl">{subjectData.longDescription}</p>
        </div>

        {/* Learning Topics section */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold hulk-heading text-green-300">Learning Topics</h2>
              <p className="text-green-500">Pick a topic and get smarter the Hulk way!</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-green-400">
              {[
                { label: "Beginner", color: "bg-green-500" },
                { label: "Intermediate", color: "bg-yellow-500" },
                { label: "Advanced", color: "bg-red-500" },
              ].map((level) => (
                <div key={level.label} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${level.color} level-dot animate-pulse`} />
                  <span>{level.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topics grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectData.topics.map((topic) => {
              const levelColor =
                topic.level === "Beginner"
                  ? "bg-green-500"
                  : topic.level === "Intermediate"
                    ? "bg-yellow-500"
                    : "bg-red-500";

              return (
                <Link key={topic.id} href={`/subjects/${subject}/topics/${topic.id}`} className="group">
                  <div
                    className="relative overflow-hidden rounded-xl topic-card p-6 h-full transition-transform duration-300 hover:scale-105 hover:border-green-500 border border-green-800"
                    onMouseEnter={playSound}
                  >
                    <div className="relative z-10 ">
                      <div className="flex justify-between items-start mb-4 ">
                        <h3 className="text-xl font-semibold text-green-200 group-hover:text-green-100 transition-colors">
                          {topic.title}
                        </h3>
                        <div className={`w-2.5 h-2.5 rounded-full ${levelColor} mt-2`} />
                      </div>
                      <p className="text-green-400 mb-4">{topic.description}</p>
                      <div className="flex justify-between items-center text-sm text-green-500">
                        <div>Ages {topic.ageRange}</div>
                        <div>{topic.questionsCount} questions</div>
                      </div>
                      <div className="mt-4 flex items-center text-sm font-medium text-green-300 opacity-0 group-hover:opacity-100 cta-text transition-opacity duration-300">
                        <span>Start Learning</span>
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/sounds/hulk-smash-hover.mp3" 
        preload="auto"
        style={{ display: "none" }}
      />
    </div>
  );
}
