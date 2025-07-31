import { NextRequest, NextResponse } from 'next/server'

// Perplexity API integration for learning roadmap
class PerplexityAPI {
  private apiKey: string;
  private baseURL: string = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || '';
  }

  private validateApiKey() {
    if (!this.apiKey) {
      throw new Error('Perplexity API key is required. Please set PERPLEXITY_API_KEY environment variable.');
    }
  }

  async generateContent(prompt: string, options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    searchRecencyFilter?: string;
  }) {
    this.validateApiKey();
    
    const { 
      model = 'sonar', 
      maxTokens = 4000, 
      temperature = 0.7,
      searchRecencyFilter
    } = options || {};

    try {
      const requestBody: any = {
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature,
        top_p: 0.9,
        stream: false
      };

      if (searchRecencyFilter) {
        requestBody.search_recency_filter = searchRecencyFilter;
      }

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Perplexity API Error Response:', errorText);
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      return {
        text: () => data.choices[0]?.message?.content || '',
        response: data
      };
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw error;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { jobRole, sector } = await request.json();

    if (!jobRole || !sector) {
      return NextResponse.json(
        { error: 'Job role and sector are required' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.PERPLEXITY_API_KEY) {
      console.warn("Perplexity API key not found. Returning empty roadmap.");
      return NextResponse.json({ roadmap: [] });
    }

    const perplexity = new PerplexityAPI();

    const prompt = `Generate a comprehensive learning roadmap for becoming a ${jobRole} in the ${sector} sector. 
    
    For each step in the roadmap, include:
    1. Step title
    2. Detailed description (2-3 sentences)
    3. Estimated time to complete
    4. Specific YouTube video recommendations with actual video IDs

    Please provide 12-15 learning steps with the following JSON structure:

    {
      "roadmap": [
        {
          "title": "Step Title",
          "description": "Detailed description of what to learn and why it's important",
          "estimatedTime": "2-3 weeks",
          "videoId": "actual_youtube_video_id",
          "videoTitle": "Actual YouTube video title"
        }
      ]
    }

    Requirements:
    - Focus on ${jobRole} skills specifically for ${sector} sector
    - Include fundamental to advanced topics
    - Each step should build upon the previous ones
    - Provide real YouTube video IDs (the part after 'watch?v=' in YouTube URLs)
    - Include popular, high-quality educational videos
    - Cover both technical and practical skills
    - Include project-based learning steps

    Search for actual existing YouTube videos that are:
    - High quality educational content
    - Popular with good ratings
    - Recent (within last 2-3 years preferred)
    - Comprehensive tutorials or courses
    - From reputable channels

    Return ONLY the JSON object without any markdown formatting.`;

    const result = await perplexity.generateContent(prompt, {
      model: 'sonar',
      maxTokens: 4000,
      temperature: 0.7,
      searchRecencyFilter: 'year'
    });

    const text = result.text();
    
    try {
      // Clean the response to extract JSON
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const roadmapData = JSON.parse(cleanedText);
      
      return NextResponse.json({ roadmap: roadmapData.roadmap || [] });
    } catch (parseError) {
      console.error("Error parsing roadmap data:", parseError);
      console.error("Raw response:", text);
      return NextResponse.json({ roadmap: [] });
    }
  } catch (error) {
    console.error("Error generating learning roadmap:", error);
    return NextResponse.json(
      { error: 'Failed to generate learning roadmap', roadmap: [] },
      { status: 500 }
    );
  }
}
