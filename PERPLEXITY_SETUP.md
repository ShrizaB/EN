# Perplexity API Setup

## Overview
The Perplexity API integration provides AI-powered learning roadmaps with real YouTube video recommendations for career development paths.

## Configuration

### Environment Variables
Add the following to your `.env.local` file:

```bash
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

### Getting Your API Key
1. Visit [Perplexity AI API Settings](https://www.perplexity.ai/settings/api)
2. Sign up for an account if you don't have one
3. Generate a new API key
4. Copy the key and add it to your `.env.local` file

## Usage

### API Endpoint
- **URL**: `/api/perplexity/learning-roadmap`
- **Method**: POST
- **Body**: 
  ```json
  {
    "jobRole": "Full Stack Developer",
    "sector": "Technology"
  }
  ```

### Response Format
```json
{
  "roadmap": [
    {
      "title": "Step Title",
      "description": "Step description",
      "estimatedTime": "2-3 weeks",
      "videoId": "youtube_video_id",
      "videoTitle": "YouTube Video Title"
    }
  ]
}
```

## Features
- Generates 12-15 personalized learning steps
- Includes real YouTube video recommendations
- Focuses on recent, high-quality educational content
- Provides estimated timeframes for each step
- Adapts content based on job role and sector

## Fallback Behavior
If the API key is not configured or the service is unavailable, the application will:
- Log a warning message
- Return an empty roadmap array
- Fall back to static mock data where applicable

## Error Handling
The API route includes comprehensive error handling:
- Validates required parameters
- Handles API key validation
- Provides graceful fallbacks
- Logs detailed error information for debugging