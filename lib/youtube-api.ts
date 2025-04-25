// YouTube API service to fetch videos based on search query

export interface YouTubeVideo {
    id: string
    title: string
    channelTitle: string
    thumbnailUrl: string
    publishedAt: string
    duration: string
  }
  
  export async function searchYouTubeVideos(query: string, maxResults = 6): Promise<YouTubeVideo[]> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  
      if (!apiKey) {
        console.error("YouTube API key is not defined")
        return []
      }
  
      // First, search for videos
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query,
        )}&maxResults=${maxResults}&type=video&relevanceLanguage=en&key=${apiKey}`,
      )
  
      if (!searchResponse.ok) {
        throw new Error(`YouTube API search error: ${searchResponse.statusText}`)
      }
  
      const searchData = await searchResponse.json()
  
      // Extract video IDs for content details request (to get duration)
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",")
  
      // Get video details including duration
      const videoDetailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${apiKey}`,
      )
  
      if (!videoDetailsResponse.ok) {
        throw new Error(`YouTube API video details error: ${videoDetailsResponse.statusText}`)
      }
  
      const videoDetailsData = await videoDetailsResponse.json()
  
      // Map the search results with video details
      return searchData.items.map((item: any, index: number) => {
        const videoDetails = videoDetailsData.items[index]
        const duration = videoDetails ? formatDuration(videoDetails.contentDetails.duration) : "Unknown"
  
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
          duration: duration,
        }
      })
    } catch (error) {
      console.error("Error fetching YouTube videos:", error)
      return []
    }
  }
  
  // Format ISO 8601 duration to readable format (PT1H30M15S -> 1:30:15)
  function formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  
    if (!match) return "Unknown"
  
    const hours = match[1] ? Number.parseInt(match[1]) : 0
    const minutes = match[2] ? Number.parseInt(match[2]) : 0
    const seconds = match[3] ? Number.parseInt(match[3]) : 0
  
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }
  }