// Test script to check Perplexity API functionality
const testPerplexityAPI = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/career/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobRole: 'Software Engineer',
        sector: 'private'
      })
    });

    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.roleRoadmap && data.roleRoadmap.length > 0) {
      console.log('✅ Role roadmap with videos found:', data.roleRoadmap.length, 'steps');
      data.roleRoadmap.forEach((step, index) => {
        console.log(`${index + 1}. ${step.title} - ${step.estimatedTime}`);
        if (step.videoId) {
          console.log(`   📺 Video: https://www.youtube.com/watch?v=${step.videoId}`);
        }
      });
    } else {
      console.log('❌ No role roadmap found in response');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testPerplexityAPI();
