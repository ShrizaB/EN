// Simple test script to verify resume analysis API
const fs = require('fs')
const path = require('path')

async function testResumeAPI() {
  try {
    console.log('Testing Resume Analysis API...')
    
    // Create a simple test image (placeholder)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
    
    const response = await fetch('http://localhost:3001/api/resume-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: testImageBase64,
        jobType: 'Software Engineer'
      })
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const result = await response.json()
      console.log('✅ API Response:', JSON.stringify(result, null, 2))
    } else {
      const errorText = await response.text()
      console.log('❌ API Error:', errorText)
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testResumeAPI()
