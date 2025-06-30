import { type NextRequest, NextResponse } from "next/server"

// Helper to map language to Paiza.io language name
function getPaizaLanguage(language: string): string {
  switch (language.toLowerCase()) {
    case "python":
    case "python3":
      return "python3";
    case "javascript":
    case "js":
    case "nodejs":
      return "javascript";
    case "java":
      return "java";
    case "c++":
    case "cpp":
      return "cpp";
    case "c":
      return "c";
    default:
      return "python3";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases } = await request.json()

    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return NextResponse.json({ error: "Code, language, and testCases are required" }, { status: 400 })
    }

    const paizaLanguage = getPaizaLanguage(language)

    // Run each test case using Paiza.io
    const results = []
    let allPassed = true
    let executionTime = 0
    let memoryUsed = 0

    for (const testCase of testCases) {
      // Prepare payload for Paiza.io
      const paizaPayload = {
        source_code: code,
        language: paizaLanguage,
        input: testCase.input || "",
        longpoll: true,
        longpoll_timeout: 20,
        api_key: "guest",
      }
      let paizaResponse, paizaData, errorText = ''
      try {
        paizaResponse = await fetch("https://api.paiza.io/runners/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(paizaPayload as any).toString(),
        })
      } catch (networkError) {
        console.error("Network error calling Paiza.io API:", networkError, { payload: paizaPayload })
        return NextResponse.json(
          { error: "Network error calling Paiza.io API", details: String(networkError) },
          { status: 500 }
        )
      }

      if (!paizaResponse.ok) {
        errorText = await paizaResponse.text()
        console.error("Paiza.io API error:", {
          status: paizaResponse.status,
          statusText: paizaResponse.statusText,
          errorText,
          requestBody: paizaPayload,
        })
        return NextResponse.json(
          { error: "Error executing code (Paiza.io API)", paizaError: errorText, request: paizaPayload },
          { status: 500 }
        )
      }

      try {
        paizaData = await paizaResponse.json()
      } catch (parseError) {
        errorText = await paizaResponse.text()
        console.error("Error parsing Paiza.io response as JSON:", parseError, { rawResponse: errorText })
        return NextResponse.json(
          { error: "Error parsing Paiza.io response as JSON", details: String(parseError), rawResponse: errorText },
          { status: 500 }
        )
      }

      // If Paiza.io returns a finished result, use it; otherwise, poll for the result
      let result = paizaData
      if (result.status !== "completed") {
        // Poll for the result
        for (let i = 0; i < 10; i++) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
          const pollRes = await fetch(`https://api.paiza.io/runners/get_details?api_key=guest&id=${result.id}`)
          result = await pollRes.json()
          if (result.status === "completed") break
        }
      }

      const output = result.stdout ? result.stdout.trim() : ""
      let error = null
      let passed = false

      // Compare output with expected output
      passed = output === testCase.expectedOutput.trim()
      if (!passed) {
        allPassed = false
      }

      // Track execution stats
      if (result.time) {
        executionTime = Math.max(executionTime, Number.parseFloat(result.time))
      }
      if (result.memory) {
        memoryUsed = Math.max(memoryUsed, Number.parseInt(result.memory))
      }

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: output,
        error,
        passed,
      })
    }

    return NextResponse.json({
      passed: allPassed,
      results,
      executionTime,
      memoryUsed: memoryUsed ? `${memoryUsed} KB` : undefined,
    })
  } catch (error) {
    console.error("Error in evaluate route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
