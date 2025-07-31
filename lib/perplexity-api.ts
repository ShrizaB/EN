// Perplexity API service
export class PerplexityAPI {
  private apiKey: string;
  private baseURL: string = 'https://api.perplexity.ai/chat/completions';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.PERPLEXITY_API_KEY || '';
    // Don't throw error in constructor, validate when API is called
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
    searchDomainFilter?: string[];
    searchRecencyFilter?: string;
  }) {
    this.validateApiKey(); // Validate API key before making request
    
    const { 
      model = 'sonar', 
      maxTokens = 4000, 
      temperature = 0.7,
      searchDomainFilter,
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

      // Add search filters if provided
      if (searchDomainFilter && searchDomainFilter.length > 0) {
        requestBody.search_domain_filter = searchDomainFilter;
      }
      
      if (searchRecencyFilter) {
        requestBody.search_recency_filter = searchRecencyFilter;
      }

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(45000) // 45 second timeout
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

  async chatCompletion(messages: Array<{role: string, content: string}>, options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }) {
    this.validateApiKey(); // Validate API key before making request
    
    const { model = 'sonar', maxTokens = 4000, temperature = 0.7 } = options || {};

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Perplexity API Error Response:', errorText);
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      return {
        text: () => data.choices[0]?.message?.content || '',
        response: data,
        choices: data.choices
      };
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw error;
    }
  }
}

// Function to generate learning roadmap with YouTube videos
export async function generateLearningRoadmap(jobRole: string, sector: string) {
  try {
    const perplexity = new PerplexityAPI();
    
    // Check if API key is available
    if (!process.env.PERPLEXITY_API_KEY && !perplexity['apiKey']) {
      console.warn("Perplexity API key not found. Using fallback data.");
      return []; // Return empty array for fallback
    }

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
      searchRecencyFilter: 'year' // Focus on recent content
    });

    const text = result.text();
    
    try {
      // Clean the response to extract JSON
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const roadmapData = JSON.parse(cleanedText);
      
      return roadmapData.roadmap || [];
    } catch (parseError) {
      console.error("Error parsing roadmap data:", parseError);
      console.error("Raw response:", text);
      return [];
    }
  } catch (error) {
    console.error("Error generating learning roadmap:", error);
    return [];
  }
}

// Function to search for specific YouTube videos
export async function searchYouTubeVideos(topic: string, count: number = 5) {
  try {
    const perplexity = new PerplexityAPI();
    
    // Check if API key is available
    if (!process.env.PERPLEXITY_API_KEY && !perplexity['apiKey']) {
      console.warn("Perplexity API key not found. Using fallback data.");
      return []; // Return empty array for fallback
    }

    const prompt = `Find ${count} high-quality YouTube educational videos about "${topic}". 
    
    For each video, provide:
    - Video title
    - YouTube video ID (the part after 'watch?v=' in the URL)
    - Brief description
    - Channel name

    Return as JSON array:
    [
      {
        "title": "Video Title",
        "videoId": "youtube_video_id",
        "description": "Brief description",
        "channel": "Channel Name"
      }
    ]

    Focus on:
    - Educational content
    - Popular videos with good engagement
    - Recent uploads (last 2 years preferred)
    - Comprehensive tutorials
    - Reputable educational channels

    Return ONLY the JSON array without markdown formatting.`;

    const result = await perplexity.generateContent(prompt, {
      model: 'sonar',
      maxTokens: 2000,
      temperature: 0.5,
      searchRecencyFilter: 'year',
      searchDomainFilter: ['youtube.com']
    });

    const text = result.text();
    
    try {
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const videos = JSON.parse(cleanedText);
      
      return Array.isArray(videos) ? videos : [];
    } catch (parseError) {
      console.error("Error parsing video search results:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    return [];
  }
}

// Helper function to create Perplexity API instance safely
export function createPerplexityAPI(): PerplexityAPI | null {
  try {
    return new PerplexityAPI();
  } catch (error) {
    console.warn("Failed to create Perplexity API instance:", error);
    return null;
  }
}
