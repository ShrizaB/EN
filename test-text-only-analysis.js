// Test the updated text-only resume analysis system
const testResumeData = {
  imageData: 'data:application/pdf;base64,dGVzdA==', // Minimal test data
  jobType: 'Software Developer'
}

// Simulate extracted text content
const extractedContent = {
  text: `John Smith
Senior Software Developer
Email: john.smith@email.com
Phone: (555) 123-4567

SUMMARY
Experienced software developer with 5 years of experience in full-stack development. 
Proficient in JavaScript, Python, React, and Node.js. Led development of e-commerce platform 
that increased company revenue by 25%.

EXPERIENCE
Senior Software Developer - Tech Corp (2021-2024)
- Developed and maintained 3 web applications using React and Node.js
- Improved system performance by 40% through code optimization
- Led team of 4 developers on major project
- Implemented automated testing that reduced bugs by 60%

Software Developer - StartupXYZ (2019-2021)
- Built REST APIs using Python and Django
- Collaborated with design team on user interface improvements
- Participated in code reviews and mentored junior developers

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2015-2019)
GPA: 3.8/4.0

SKILLS
Programming Languages: JavaScript, Python, Java, TypeScript
Frameworks: React, Node.js, Django, Express
Databases: MySQL, PostgreSQL, MongoDB
Tools: Git, Docker, AWS, Jenkins

ACHIEVEMENTS
- Increased application performance by 40%
- Led successful launch of e-commerce platform
- Reduced development time by 30% through automation
- Mentored 5 junior developers`,
  layout: {
    blocks: [],
    entities: [],
    structure: 'document'
  },
  formatting: {
    fonts: [],
    spacing: {},
    alignment: []
  },
  colors: [],
  positions: []
}

// Test the fallback analysis function
async function testTextOnlyAnalysis() {
  console.log('🧪 Testing Text-Only Resume Analysis...\n')
  
  try {
    // Test with a realistic resume for Software Developer position
    const response = await fetch('http://localhost:3000/api/resume-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testResumeData)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    console.log('📊 Analysis Results:')
    console.log('===================')
    console.log(`Overall Score: ${result.score}/100`)
    console.log('\n📈 Component Scores:')
    console.log(`- Content Quality: ${result.analysis?.contentQuality || 0}`)
    console.log(`- Experience Relevance: ${result.analysis?.experienceRelevance || 0}`)
    console.log(`- Skills Alignment: ${result.analysis?.skillsAlignment || 0}`)
    console.log(`- Achievements Impact: ${result.analysis?.achievementsImpact || 0}`)
    
    console.log('\n✅ Strengths:')
    result.strengths?.forEach((strength, index) => {
      console.log(`${index + 1}. ${strength}`)
    })
    
    console.log('\n⚠️ Areas for Improvement:')
    result.weaknesses?.forEach((weakness, index) => {
      console.log(`${index + 1}. ${weakness}`)
    })
    
    console.log('\n🎯 Recommendations:')
    result.improvements?.forEach((improvement, index) => {
      console.log(`${index + 1}. ${improvement}`)
    })
    
    console.log('\n📝 Summary:')
    console.log(result.summary)
    
    // Validate that no visual elements are mentioned
    const allText = JSON.stringify(result).toLowerCase()
    const visualTerms = ['font', 'color', 'design', 'formatting', 'layout', 'visual', 'spacing', 'alignment']
    const foundVisualTerms = visualTerms.filter(term => allText.includes(term))
    
    if (foundVisualTerms.length > 0) {
      console.log('\n❌ WARNING: Visual elements still mentioned:', foundVisualTerms)
    } else {
      console.log('\n✅ SUCCESS: Analysis focuses purely on text content!')
    }
    
    // Check language simplicity
    const complexTerms = ['optimization', 'quantifiable', 'comprehensive', 'proficiency', 'competencies']
    const foundComplexTerms = complexTerms.filter(term => allText.includes(term))
    
    if (foundComplexTerms.length > 0) {
      console.log('⚠️ Note: Some complex terms found:', foundComplexTerms)
    } else {
      console.log('✅ Language is simple and readable!')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testTextOnlyAnalysis()
