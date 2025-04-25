export const subjectColors: Record<string, string> = {
    math: "#4C51BF", // Indigo
    science: "#38A169", // Green
    reading: "#E53E3E", // Red
    coding: "#805AD5", // Purple
    art: "#F6AD55", // Orange
    music: "#F687B3", // Pink
    geography: "#4299E1", // Blue
    logic: "#B794F4", // Light Purple
    history: "#F6E05E", // Yellow
    general: "#718096", // Gray
    movies: "#6B46C1", // Purple
  }
  
  export const subjects = [
    {
      id: "math",
      name: "Math",
      description: "Learn mathematics concepts from basic to advanced",
      longDescription:
        "Explore the world of numbers, shapes, and patterns. Our math curriculum covers arithmetic, algebra, geometry, calculus, and more. Develop problem-solving skills and logical thinking through interactive lessons and challenging exercises.",
      icon: "Calculator",
      color: "#4C51BF",
      topics: [
        "Addition and Subtraction",
        "Multiplication and Division",
        "Fractions and Decimals",
        "Algebra",
        "Geometry",
        "Trigonometry",
        "Calculus",
        "Statistics",
        "Probability",
      ],
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      id: "science",
      name: "Science",
      description: "Discover the wonders of the natural world",
      longDescription:
        "Explore the natural world through scientific inquiry. Our science curriculum covers physics, chemistry, biology, astronomy, and earth science. Conduct virtual experiments, analyze data, and understand the fundamental principles that govern our universe.",
      icon: "Flask",
      color: "#38A169",
      topics: [
        "Physics",
        "Chemistry",
        "Biology",
        "Astronomy",
        "Earth Science",
        "Ecology",
        "Genetics",
        "Human Body",
        "Scientific Method",
      ],
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "reading",
      name: "Reading",
      description: "Improve literacy and language comprehension",
      longDescription:
        "Enhance your reading skills and language comprehension. Our reading curriculum focuses on phonics, vocabulary, grammar, comprehension, and literature analysis. Explore different genres, analyze texts, and develop critical thinking skills through engaging reading activities.",
      icon: "BookOpen",
      color: "#E53E3E",
      topics: [
        "Phonics",
        "Vocabulary",
        "Grammar",
        "Comprehension",
        "Literature",
        "Poetry",
        "Fiction",
        "Non-fiction",
        "Critical Analysis",
      ],
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    {
      id: "coding",
      name: "Coding",
      description: "Learn programming and computational thinking",
      longDescription:
        "Develop programming skills and computational thinking. Our coding curriculum introduces you to various programming languages, algorithms, data structures, and software development principles. Build projects, solve coding challenges, and create your own applications.",
      icon: "Code",
      color: "#805AD5",
      topics: [
        "HTML & CSS",
        "JavaScript",
        "Python",
        "Algorithms",
        "Data Structures",
        "Web Development",
        "App Development",
        "Game Development",
        "Artificial Intelligence",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
    {
      id: "art",
      name: "Art",
      description: "Express creativity through various art forms",
      longDescription:
        "Express your creativity through various art forms. Our art curriculum covers drawing, painting, sculpture, design, and art history. Learn different techniques, explore various styles, and develop your artistic skills through guided projects and creative exercises.",
      icon: "Palette",
      color: "#F6AD55",
      topics: [
        "Drawing",
        "Painting",
        "Sculpture",
        "Design",
        "Art History",
        "Color Theory",
        "Perspective",
        "Digital Art",
        "Mixed Media",
      ],
      buttonColor: "bg-orange-500 hover:bg-orange-600",
    },
    {
      id: "music",
      name: "Music",
      description: "Explore rhythm, melody, and musical expression",
      longDescription:
        "Discover the world of music through rhythm, melody, and musical expression. Our music curriculum covers music theory, instrument basics, composition, and music history. Learn to read music, understand different genres, and develop your musical abilities.",
      icon: "Music",
      color: "#F687B3",
      topics: [
        "Music Theory",
        "Rhythm",
        "Melody",
        "Harmony",
        "Instruments",
        "Composition",
        "Music History",
        "Genres",
        "Performance",
      ],
      buttonColor: "bg-pink-500 hover:bg-pink-600",
    },
    {
      id: "geography",
      name: "Geography",
      description: "Learn about places, people, and cultures",
      longDescription:
        "Explore the world's places, people, and cultures. Our geography curriculum covers physical geography, human geography, cartography, and environmental studies. Learn about different countries, landforms, climate patterns, and cultural diversity across the globe.",
      icon: "Globe",
      color: "#4299E1",
      topics: [
        "Maps and Navigation",
        "Continents and Oceans",
        "Countries and Capitals",
        "Landforms",
        "Climate",
        "Natural Resources",
        "Population",
        "Cultural Geography",
        "Environmental Issues",
      ],
      buttonColor: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "logic",
      name: "Logic",
      description: "Develop critical thinking and reasoning skills",
      longDescription:
        "Sharpen your critical thinking and reasoning skills. Our logic curriculum focuses on problem-solving, puzzles, logical reasoning, and strategic thinking. Tackle challenging problems, analyze arguments, and develop a structured approach to solving complex issues.",
      icon: "Lightbulb",
      color: "#B794F4",
      topics: [
        "Problem Solving",
        "Puzzles",
        "Logical Reasoning",
        "Strategic Thinking",
        "Critical Analysis",
        "Deductive Reasoning",
        "Inductive Reasoning",
        "Fallacies",
        "Decision Making",
      ],
      buttonColor: "bg-purple-400 hover:bg-purple-500",
    },
    {
      id: "history",
      name: "History",
      description: "Explore past events and their impact on the world",
      longDescription:
        "Journey through time and explore past events and their impact on the world. Our history curriculum covers ancient civilizations, medieval times, modern history, and contemporary events. Analyze historical sources, understand different perspectives, and learn how the past shapes our present.",
      icon: "Clock",
      color: "#F6E05E",
      topics: [
        "Ancient Civilizations",
        "Medieval Times",
        "Renaissance",
        "Industrial Revolution",
        "World Wars",
        "Civil Rights",
        "Political History",
        "Cultural History",
        "Historical Analysis",
      ],
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      id: "movies",
      name: "Movies",
      description: "Explore the art and history of cinema",
      longDescription:
        "Dive into the fascinating world of cinema and film. Our movies curriculum covers film history, genres, techniques, analysis, and the impact of movies on society and culture. Learn about iconic directors, groundbreaking films, and the evolution of storytelling through the lens of a camera.",
      icon: "Film",
      color: "#6B46C1",
      topics: [
        "Film History",
        "Movie Genres",
        "Cinematography",
        "Film Analysis",
        "Directors and Auteurs",
        "Screenwriting",
        "Visual Effects",
        "Sound Design",
        "Film Criticism",
      ],
      buttonColor: "bg-purple-700 hover:bg-purple-800",
    },
  ]