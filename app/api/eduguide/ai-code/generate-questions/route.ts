import { type NextRequest, NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";
const GROQ_MODEL = "llama3-70b-8192";

export interface ProgrammingQuestion {
  id: number
  title: string
  description: string
  constraints?: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
  hints?: string[]
  difficulty: "easy" | "medium" | "hard"
  language: string
  starterCode?: string
  solution?: string
}

export async function GET(request: NextRequest) {
  try {
    // Get difficulty and language from query params
    const searchParams = request.nextUrl.searchParams
    const difficulty = searchParams.get("difficulty")
    const language = searchParams.get("language") || "python"

    // Generate questions based on difficulty
    if (difficulty) {
      // Generate a single question of the specified difficulty
      const question = await generateQuestion(difficulty as "easy" | "medium" | "hard", language, 1)
      return NextResponse.json(question)
    } else {
      // Generate all three questions (easy, medium, hard)
      const [easyQuestion, mediumQuestion, hardQuestion] = await Promise.all([
        generateQuestion("easy", language, 1),
        generateQuestion("medium", language, 2),
        generateQuestion("hard", language, 3),
      ])

      return NextResponse.json([easyQuestion, mediumQuestion, hardQuestion])
    }
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({ error: "Failed to generate programming questions" }, { status: 500 })
  }
}

// Remove Gemini code and use Groq API only
async function generateQuestion(
  difficulty: "easy" | "medium" | "hard",
  language: string,
  id: number,
): Promise<ProgrammingQuestion> {
  // Add a random seed to the prompt to ensure unique questions
  const randomSeed = Math.random().toString(36).slice(2) + Date.now();
  const prompt = `
    [SEED: ${randomSeed}]
    Generate a ${difficulty} level programming problem in ${language}.
    The problem should be appropriate for a student learning programming and should test their algorithmic thinking.
    ${
      difficulty === "easy"
        ? "This should be a very basic problem that tests fundamental programming concepts like variables, conditionals, or simple loops."
        : difficulty === "medium"
          ? "This should be a problem that requires some algorithmic thinking, like working with arrays/lists, basic data structures, or simple algorithms."
          : "This should be a challenging problem that requires advanced algorithmic thinking, like dynamic programming, graph algorithms, or complex data structures."
    }
    Format your response as a valid JSON object with the following structure:
    {
      "title": "Problem title",
      "description": "Detailed problem description with HTML formatting",
      "constraints": "Any constraints on input/output (HTML formatted)",
      "examples": [
        {
          "input": "Example input as a string",
          "output": "Expected output as a string",
          "explanation": "Explanation of the example"
        }
      ],
      "testCases": [
        {
          "input": "Test case input as a string",
          "expectedOutput": "Expected output as a string"
        }
      ],
      "hints": ["Hint 1", "Hint 2"],
      "starterCode": "Starter code template",
      "solution": "Complete solution code"
    }
    For the description, use HTML formatting with <p>, <ul>, <li>, <code> tags for better readability.
    Include at least 3 examples with explanations.
    Include at least 5 test cases (including edge cases).
    Make sure the starterCode includes the function signature and any necessary imports or main function for testing.
    Make sure the solution is correct and efficient.
    For ${language}, ensure the code follows best practices and conventions.
    Ensure the response contains only the JSON object, without any code fences or markdown formatting, and no extra text.
  `;

  // Try to call Groq API with retries
  let lastError: Error | null = null;
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to call Groq API...`);
      
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: "You are an expert programming question generator." },
            { role: "user", content: prompt },
          ],
          max_tokens: 2048,
          temperature: 1.0,
        }),
      })

      if (!groqRes.ok) {
        const errorText = await groqRes.text();
        console.error(`Groq API error (attempt ${attempt}):`, errorText);
        
        // If it's a rate limit or temporary error, wait and retry
        if (groqRes.status === 429 || groqRes.status >= 500) {
          if (attempt < maxRetries) {
            console.log(`Retrying in ${attempt * 2} seconds...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 2000));
            continue;
          }
        }
        
        throw new Error(`Groq API error (${groqRes.status}): ${errorText}`);
      }

      const groqData = await groqRes.json()
      let text = groqData.choices?.[0]?.message?.content || ""

      console.log("Raw Groq response:", text.substring(0, 200) + "...");

      // More aggressive cleaning of the response
      text = text.trim();
      
      // Remove any markdown code blocks
      text = text.replace(/```json\n?|\n?```|```\n?/g, "").trim();
      
      // Remove any leading/trailing text that isn't JSON
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        console.error("No valid JSON object found in response:", text);
        throw new Error("No valid JSON object found in Groq response");
      }
      
      text = text.substring(jsonStart, jsonEnd + 1);
      
      // Fix common JSON issues
      text = text.replace(/([,{\s])'(\w+)'\s*:/g, '$1"$2":'); // property names with single quotes
      text = text.replace(/:\s*'([^'\\]*(\\.[^'\\]*)*)'/g, ': "$1"'); // string values with single quotes, handling escaped quotes
      text = text.replace(/,\s*([}\]])/g, '$1'); // trailing commas
      text = text.replace(/\n\s*/g, ' '); // normalize whitespace
      
      // Fix escaped quotes within strings more carefully
      text = text.replace(/"([^"]*)\\"([^"]*)"(?=[,\s]*[}\]])/g, '"$1\\\\"$2"');
      
      // Fix unescaped newlines and tabs in strings
      text = text.replace(/:\s*"([^"]*\n[^"]*)"(?=[,\s]*[}\]])/g, (match: string, content: string) => {
        return `: "${content.replace(/\n/g, '\\n').replace(/\t/g, '\\t')}"`;
      });

      console.log("Cleaned text:", text.substring(0, 200) + "...");

      let questionData;
      try {
        questionData = JSON.parse(text);
      } catch (err) {
        console.error("JSON Parse Error:", err);
        console.error("Cleaned text:", text);
        console.error("Original response:", groqData.choices?.[0]?.message?.content);
        
        // Try to fix more JSON issues and parse again
        try {
          // Remove any remaining invalid characters
          text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, ""); // control characters
          text = text.replace(/,(\s*[}\]])/g, '$1'); // trailing commas again
          
          // Try to fix broken string values
          text = text.replace(/"([^"]*)"([^"]*)"([^",}]*)/g, '"$1\\"$2\\"$3"');
          
          // Fix any remaining quote issues
          text = text.replace(/([:{,\s])"([^"]*)"([^"]*)"([^"]*)"([^",}]*)/g, '$1"$2\\"$3\\"$4$5"');
          
          console.log("Second attempt cleaned text:", text.substring(0, 200) + "...");
          questionData = JSON.parse(text);
        } catch (secondErr) {
          console.error("Second JSON Parse Error:", secondErr);
          throw new Error(`Failed to parse JSON after cleaning: ${text.substring(0, 200)}...`);
        }
      }

      // Validate the parsed data
      if (!isValidQuestionData(questionData)) {
        throw new Error("Invalid question data structure")
      }

      return {
        id,
        difficulty,
        language,
        ...questionData,
      }
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        console.log(`Waiting ${attempt * 2} seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
      }
    }
  }

  // If all retries failed, return a fallback question
  console.log("All Groq API attempts failed, using fallback question");
  return createFallbackQuestion(difficulty, language, id);
}

// Create a fallback programming question when API is unavailable
function createFallbackQuestion(
  difficulty: "easy" | "medium" | "hard",
  language: string,
  id: number,
): ProgrammingQuestion {
  const fallbackQuestions: Record<string, Record<string, Partial<ProgrammingQuestion>>> = {
    python: {
      easy: {
        title: "Sum of Two Numbers",
        description: "<p>Write a function that takes two numbers as input and returns their sum.</p><p>This is a basic arithmetic problem to test your understanding of functions and basic operations.</p>",
        constraints: "<p>Both numbers will be integers between -1000 and 1000.</p>",
        examples: [
          { input: "5, 3", output: "8", explanation: "5 + 3 = 8" },
          { input: "10, -2", output: "8", explanation: "10 + (-2) = 8" },
          { input: "0, 0", output: "0", explanation: "0 + 0 = 0" }
        ],
        testCases: [
          { input: "5, 3", expectedOutput: "8" },
          { input: "10, -2", expectedOutput: "8" },
          { input: "0, 0", expectedOutput: "0" },
          { input: "-5, 5", expectedOutput: "0" },
          { input: "100, 200", expectedOutput: "300" }
        ],
        hints: ["Use the + operator to add two numbers", "Remember to return the result"],
        starterCode: "def add_numbers(a, b):\n    # Write your code here\n    pass",
        solution: "def add_numbers(a, b):\n    return a + b"
      },
      medium: {
        title: "Find Maximum in Array",
        description: "<p>Write a function that finds the maximum number in an array of integers.</p><p>You should iterate through the array and keep track of the largest number seen so far.</p>",
        constraints: "<p>The array will contain at least 1 element and at most 1000 elements.</p>",
        examples: [
          { input: "[1, 3, 2, 8, 5]", output: "8", explanation: "8 is the largest number in the array" },
          { input: "[-1, -5, -2]", output: "-1", explanation: "-1 is the largest among negative numbers" },
          { input: "[42]", output: "42", explanation: "Single element array returns that element" }
        ],
        testCases: [
          { input: "[1, 3, 2, 8, 5]", expectedOutput: "8" },
          { input: "[-1, -5, -2]", expectedOutput: "-1" },
          { input: "[42]", expectedOutput: "42" },
          { input: "[0, 0, 0]", expectedOutput: "0" },
          { input: "[100, 50, 75, 25]", expectedOutput: "100" }
        ],
        hints: ["Initialize a variable to track the maximum", "Compare each element with the current maximum"],
        starterCode: "def find_max(arr):\n    # Write your code here\n    pass",
        solution: "def find_max(arr):\n    max_val = arr[0]\n    for num in arr:\n        if num > max_val:\n            max_val = num\n    return max_val"
      },
      hard: {
        title: "Fibonacci Sequence",
        description: "<p>Write a function that returns the nth number in the Fibonacci sequence.</p><p>The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the two preceding ones.</p>",
        constraints: "<p>n will be a non-negative integer less than 50.</p>",
        examples: [
          { input: "0", output: "0", explanation: "The 0th Fibonacci number is 0" },
          { input: "1", output: "1", explanation: "The 1st Fibonacci number is 1" },
          { input: "6", output: "8", explanation: "The 6th Fibonacci number is 8 (0,1,1,2,3,5,8)" }
        ],
        testCases: [
          { input: "0", expectedOutput: "0" },
          { input: "1", expectedOutput: "1" },
          { input: "6", expectedOutput: "8" },
          { input: "10", expectedOutput: "55" },
          { input: "15", expectedOutput: "610" }
        ],
        hints: ["Use dynamic programming to avoid recalculating values", "Consider iterative approach for better performance"],
        starterCode: "def fibonacci(n):\n    # Write your code here\n    pass",
        solution: "def fibonacci(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b"
      }
    }
  };

  const languageQuestions = fallbackQuestions[language] || fallbackQuestions.python;
  const questionTemplate = languageQuestions[difficulty] || languageQuestions.easy;

  return {
    id,
    difficulty,
    language,
    title: questionTemplate.title!,
    description: questionTemplate.description!,
    constraints: questionTemplate.constraints,
    examples: questionTemplate.examples!,
    testCases: questionTemplate.testCases!,
    hints: questionTemplate.hints,
    starterCode: questionTemplate.starterCode,
    solution: questionTemplate.solution,
  };
}

// Helper function to validate the structure of the parsed question data
function isValidQuestionData(data: any): data is Omit<ProgrammingQuestion, "id" | "difficulty" | "language"> {
  return (
    data &&
    typeof data.title === "string" &&
    typeof data.description === "string" &&
    (typeof data.constraints === "string" || data.constraints === undefined) &&
    Array.isArray(data.examples) &&
    data.examples.length >= 3 &&
    data.examples.every(
      (ex: any) =>
        typeof ex.input === "string" &&
        typeof ex.output === "string" &&
        (typeof ex.explanation === "string" || ex.explanation === undefined),
    ) &&
    Array.isArray(data.testCases) &&
    data.testCases.length >= 5 &&
    data.testCases.every(
      (tc: any) => typeof tc.input === "string" && typeof tc.expectedOutput === "string",
    ) &&
    (Array.isArray(data.hints) || data.hints === undefined) &&
    (typeof data.starterCode === "string" || data.starterCode === undefined) &&
    (typeof data.solution === "string" || data.solution === undefined)
  )
}