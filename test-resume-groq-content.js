// Enhanced test script with a sample resume text
const testDataWithContent = {
  // A sample PDF data URL format with resume content
  imageData: 'data:application/pdf;base64,' + Buffer.from(`
%PDF-1.4 Sample Resume Content
John Doe
Software Developer
john.doe@email.com | (555) 123-4567 | LinkedIn: /in/johndoe

EXPERIENCE
Senior Software Developer | Tech Corp | 2021-2024
• Developed 15+ web applications using React and Node.js
• Improved application performance by 40% through optimization
• Led team of 5 developers on major projects
• Implemented CI/CD pipelines reducing deployment time by 60%

Software Developer | StartupXYZ | 2019-2021  
• Built RESTful APIs serving 100k+ daily requests
• Reduced bug reports by 35% through comprehensive testing
• Collaborated with cross-functional teams on product features

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2015-2019
GPA: 3.7/4.0

SKILLS
• Programming: JavaScript, Python, Java, TypeScript
• Frameworks: React, Node.js, Express, Django
• Databases: PostgreSQL, MongoDB, Redis
• Tools: Git, Docker, AWS, Jenkins

PROJECTS
E-commerce Platform (2023)
• Built full-stack web application handling 10k+ transactions
• Integrated payment processing with 99.9% uptime
• Used React frontend with Node.js backend
  `).toString('base64'),
  jobType: 'Software Developer'
};

async function testResumeAnalysisWithContent() {
  try {
    console.log('🚀 Testing Groq-based resume analysis with sample content...');
    
    const response = await fetch('http://localhost:3001/api/resume-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testDataWithContent)
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
      
      console.log('\n🔍 Analysis Details:');
      console.log('Strengths:', result.strengths);
      console.log('Weaknesses:', result.weaknesses);
      console.log('Improvements:', result.improvements);
    } else {
      console.log('⚠️ Response structure is incomplete');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testResumeAnalysisWithContent();
}

module.exports = { testResumeAnalysisWithContent };
