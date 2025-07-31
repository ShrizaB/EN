// Test script for the new Groq-based resume analysis API
const fs = require('fs');
const path = require('path');

// Simple test data - a sample base64 PDF or image
const testData = {
  imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG
  jobType: 'Software Developer'
};

async function testResumeAnalysis() {
  try {
    console.log('🚀 Testing Groq-based resume analysis API...');
    
    const response = await fetch('http://localhost:3001/api/resume-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ API Response received:');
    console.log(JSON.stringify(result, null, 2));

    // Validate response structure
    if (result.score && result.analysis && result.strengths && result.weaknesses && result.improvements) {
      console.log('✅ Response structure is valid');
      console.log(`📊 Overall Score: ${result.score}/100`);
      console.log(`📈 Content Quality: ${result.analysis.contentQuality}`);
      console.log(`🎨 Formatting: ${result.analysis.formatting}`);
      console.log(`🎯 Design Consistency: ${result.analysis.designConsistency}`);
      console.log(`💼 Job Relevance: ${result.analysis.relevance}`);
    } else {
      console.log('⚠️ Response structure is incomplete');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testResumeAnalysis();
}

module.exports = { testResumeAnalysis };
