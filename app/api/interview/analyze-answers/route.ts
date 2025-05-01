import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define the response type from Gemini
type AnalysisJson = {
  technicalScore: number;
  behavioralScore: number;
  overallScore: number;
  technicalFeedback: string[];
  behavioralFeedback: string[];
  technicalImprovements: string;
  behavioralImprovements: string;
  overallAdvice: string;
  questionScores: Record<string, number>;
  bestAnswers: Record<string, string>;
};

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCgYno9IqtTqF3rmxQpsV4gIypk7tWtbD4";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST handler
export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Answers array is required" }, { status: 400 });
    }

    // Separate technical and behavioral
    const technicalQuestions = answers.filter((q: any) => q.isTechnical);
    const behavioralQuestions = answers.filter((q: any) => !q.isTechnical);

    // Make the questions part more structured
    const questionsData = answers.map((q: any) => ({
      id: q.id,
      type: q.isTechnical ? "Technical" : "Behavioral",
      question: q.question,
      answer: q.answer,
    }));

    // Build a very strong prompt
    const prompt = `
You are an expert interview evaluator.

Analyze each question and answer carefully based on correctness, depth, and relevance.

Scoring Criteria:
- 0-5: Completely unrelated answer.
- 6-20: Related but mostly wrong.
- 21-50: Moderately correct but incomplete.
- 51-75: Good but could be improved.
- 76-100: Excellent and complete.

Instructions:
- Score every individual question realistically.
- Suggest the best possible answer for each question (must be specific, not generic).
- Provide technical feedback and improvements separately.
- Provide behavioral feedback and improvements separately.
- Strictly follow the format.

Here are the questions and answers:

${questionsData.map(q => 
  `ID: ${q.id}
Type: ${q.type}
Question: ${q.question}
Answer: ${q.answer}`
).join("\n\n")}

Respond ONLY with a valid JSON object like this:

{
  "technicalScore": 0-100,
  "behavioralScore": 0-100,
  "overallScore": 0-100,
  "technicalFeedback": ["Feedback 1", "Feedback 2", "..."],
  "behavioralFeedback": ["Feedback 1", "Feedback 2", "..."],
  "technicalImprovements": "Suggestions...",
  "behavioralImprovements": "Suggestions...",
  "overallAdvice": "Overall suggestions...",
  "questionScores": {
    "questionId1": 0-100,
    "questionId2": 0-100,
    ...
  },
  "bestAnswers": {
    "questionId1": "Best answer here",
    "questionId2": "Best answer here",
    ...
  }
}
`.trim();

    // Generate content from Gemini
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON properly
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    let analysisJson: AnalysisJson;

    if (jsonMatch) {
      try {
        analysisJson = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error("Error parsing JSON from Gemini response:", e);
        throw new Error("Failed to parse interview analysis JSON from Gemini output.");
      }
    } else {
      console.error("No valid JSON detected in Gemini output.");
      throw new Error("No valid JSON structure found in Gemini response.");
    }

    // Validate best answers
    for (const id of Object.keys(analysisJson.bestAnswers)) {
      const answer = analysisJson.bestAnswers[id];
      if (!answer || answer.trim() === "" || answer.toLowerCase().includes("ideal answer")) {
        throw new Error(`Invalid best answer generated for question ID ${id}`);
      }
    }

    return NextResponse.json(analysisJson);
    
  } catch (error) {
    console.error("Error analyzing answers:", error);
    return NextResponse.json({ error: "Failed to analyze answers properly. Please try again." }, { status: 500 });
  }
}
