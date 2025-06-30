import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // Fixed: Changed from "node" to "nodejs" for Next.js compatibility

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "No image field provided" }, { status: 400 });
    }

    // Validate image format (base64 or URL)
    const isBase64 = image.startsWith("data:image/png;base64,");
    const isUrl = /^https?:\/\//.test(image);
    if (!isBase64 && !isUrl) {
      return NextResponse.json({ error: "Image must be a base64 string (data:image/png;base64,...) or a valid URL" }, { 
        status: 400
      });
    }

    // Get API key (prefer OpenAI for vision; fallback to Groq if vision supported)
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;

    // Try Groq first (if vision supported)
    let responseData;
    if (groqApiKey) {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "LLaVA v1.5 7B", // Replace with vision-capable model if available
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this drawing and suggest what to add to improve it. Respond with a JSON object: { analysis: string, suggestion: string }.",
                },
                {
                  type: "image_url",
                  image_url: { url: image },
                },
              ],
            },
          ],
          temperature: 1,
          max_tokens: 1024,
        }),
      });

      if (groqRes.ok) {
        const data = await groqRes.json();
        // Parse JSON string from content (assuming model returns JSON)
        responseData = JSON.parse(data.choices[0].message.content);
      }
    }

    // Fallback to OpenAI if Groq fails or lacks vision
    if (!responseData && openaiApiKey) {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this drawing and suggest what to add to improve it. Respond with a JSON object: { analysis: string, suggestion: string }.",
                },
                {
                  type: "image_url",
                  image_url: { url: image },
                },
              ],
            },
          ],
          temperature: 1,
          max_tokens: 1024,
        }),
      });

      if (!openaiRes.ok) {
        const error = await openaiRes.text();
        console.error("OpenAI API error:", error);
        return NextResponse.json({ error: `OpenAI API error: ${error}` }, { status: openaiRes.status });
      }

      const data = await openaiRes.json();
      // Parse JSON string from content
      responseData = JSON.parse(data.choices[0].message.content);
    }

    if (!responseData) {
      return NextResponse.json({ error: "No valid API key provided or vision not supported" }, { status: 500 });
    }

    // Validate response format
    if (!responseData.analysis || !responseData.suggestion) {
      return NextResponse.json({ error: "Invalid response format from API" }, { status: 500 });
    }

    return NextResponse.json({
      analysis: responseData.analysis,
      suggestion: responseData.suggestion,
    });
  } catch (e) {
    console.error("API route error:", e);
    return NextResponse.json({ error: (e as Error)?.message || "Unknown error" }, { status: 500 });
  }
}