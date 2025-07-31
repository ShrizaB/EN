// Test the text-only fallback analysis directly
console.log('🧪 Testing Text-Only Fallback Analysis Function...\n')

// Simulate the exact extracted content structure
const testExtractedContent = {
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

// Directly test the fallback analysis logic (simulating the function)
function createEnhancedFallbackAnalysis(extractedContent, jobType) {
  const targetJob = jobType || 'General'
  const hasContent = extractedContent.text && extractedContent.text.length > 10
  const contentLength = extractedContent.text?.length || 0
  
  // Analyze content for keywords and structure
  const content = extractedContent.text?.toLowerCase() || ''
  
  // Job-specific keyword analysis
  const jobKeywords = {
    'software': ['developer', 'programming', 'coding', 'software', 'javascript', 'python', 'java', 'react', 'node', 'git'],
    'marketing': ['marketing', 'seo', 'social media', 'campaigns', 'analytics', 'branding', 'digital'],
    'sales': ['sales', 'revenue', 'targets', 'customers', 'negotiation', 'crm', 'leads'],
    'finance': ['financial', 'accounting', 'excel', 'analysis', 'budget', 'audit', 'finance'],
    'design': ['design', 'ui', 'ux', 'photoshop', 'illustrator', 'creative', 'visual'],
    'general': ['experience', 'skills', 'education', 'project', 'team', 'management']
  }
  
  // Find relevant keywords
  const targetJobLower = targetJob.toLowerCase()
  let relevantKeywords = jobKeywords.general
  
  for (const [jobCategory, keywords] of Object.entries(jobKeywords)) {
    if (targetJobLower.includes(jobCategory)) {
      relevantKeywords = keywords
      break
    }
  }
  
  // Count keyword matches
  const keywordMatches = relevantKeywords.filter(keyword => content.includes(keyword)).length
  const keywordScore = Math.min(keywordMatches * 2, 15)
  
  // Content quality analysis - TEXT ONLY
  const hasEducation = content.includes('education') || content.includes('degree') || content.includes('university')
  const hasExperience = content.includes('experience') || content.includes('work') || content.includes('position')
  const hasSkills = content.includes('skills') || content.includes('proficient') || content.includes('expertise')
  const hasAchievements = content.includes('achieved') || content.includes('improved') || content.includes('%')
  const hasNumbers = /\d+/.test(content) // Check for any numbers (years, percentages, etc.)
  
  // Dynamic scoring based on TEXT CONTENT ONLY
  let baseScore = 35
  
  // Content-based scoring
  if (hasContent) {
    if (contentLength > 1000) baseScore += 25 // Comprehensive content
    else if (contentLength > 500) baseScore += 20 // Good content length
    else if (contentLength > 200) baseScore += 15 // Decent content
    else baseScore += 8 // Minimal content
  }
  
  // Text structure-based scoring
  if (hasEducation) baseScore += 5
  if (hasExperience) baseScore += 8
  if (hasSkills) baseScore += 5
  if (hasAchievements) baseScore += 7
  if (hasNumbers) baseScore += 5
  
  // Job relevance scoring
  baseScore += keywordScore
  
  // For consistent testing, remove variance
  const finalScore = Math.max(25, Math.min(baseScore, 92))
  
  // Calculate component scores dynamically - TEXT CONTENT ONLY
  const contentQuality = Math.floor(finalScore * 0.4 * (hasContent ? 1 : 0.3))
  const experienceRelevance = Math.floor(finalScore * 0.3 * (hasExperience ? 1 : 0.4))
  const skillsAlignment = Math.floor(finalScore * 0.2 * (hasSkills ? 1 : 0.3))
  const achievementsImpact = Math.max(1, finalScore - contentQuality - experienceRelevance - skillsAlignment)
  
  // Generate TEXT-ONLY feedback with simple language
  const strengths = []
  const weaknesses = []
  const improvements = []
  
  // Content-based strengths - SIMPLE LANGUAGE
  if (contentLength > 500) {
    strengths.push(`Good amount of detailed information in your resume (${contentLength} words)`)
  } else if (hasContent) {
    strengths.push(`Resume content was successfully read and analyzed`)
  }
  
  if (keywordMatches > 3) {
    strengths.push(`Shows relevant skills and experience for ${targetJob} jobs (found ${keywordMatches} matching keywords)`)
  }
  
  if (hasAchievements) {
    strengths.push('Includes specific results and accomplishments')
  }
  
  if (hasNumbers) {
    strengths.push('Uses numbers and data to show your impact')
  }
  
  if (hasEducation && hasExperience) {
    strengths.push('Covers both education and work experience well')
  }
  
  // Default strengths if none found
  if (strengths.length === 0) {
    strengths.push('Resume file is in a format that can be read by job application systems')
    strengths.push('Document contains readable text content')
  }
  
  // Content-based weaknesses - SIMPLE LANGUAGE
  if (!hasContent || contentLength < 200) {
    weaknesses.push('Resume needs more detailed information about your experience')
  }
  
  if (keywordMatches < 2) {
    weaknesses.push(`Missing important keywords that ${targetJob} employers look for`)
  }
  
  if (!hasAchievements) {
    weaknesses.push('No specific examples of what you accomplished in previous jobs')
  }
  
  if (!hasNumbers) {
    weaknesses.push('Missing numbers and data to show the impact of your work')
  }
  
  if (!hasExperience) {
    weaknesses.push('Work experience section needs more details')
  }
  
  if (!hasSkills) {
    weaknesses.push('Skills section is missing or needs more detail')
  }
  
  // Content-based improvements - SIMPLE, ACTIONABLE LANGUAGE
  if (keywordMatches < 3) {
    improvements.push(`Add more ${targetJob}-specific skills and industry terms`)
  }
  
  if (!hasAchievements || !hasNumbers) {
    improvements.push('Include specific numbers like "increased sales by 20%" or "managed team of 5 people"')
  }
  
  if (contentLength < 400) {
    improvements.push('Add more details about your work experience and responsibilities')
  }
  
  improvements.push('Use action words like "developed," "managed," "improved," and "achieved"')
  
  if (!hasSkills) {
    improvements.push('Add a skills section with both technical and soft skills')
  }
  
  return {
    score: finalScore,
    analysis: {
      contentQuality,
      experienceRelevance,     
      skillsAlignment,
      achievementsImpact
    },
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    improvements: improvements.slice(0, 3),
    summary: `Resume analysis for ${targetJob} position completed. ${hasContent ? `Found ${contentLength} characters of text content` : 'Basic document structure analyzed'}${keywordMatches > 0 ? ` with ${keywordMatches} relevant job keywords` : ''}. ${hasAchievements ? 'Resume includes some accomplishments' : 'Consider adding specific achievements'}. Score of ${finalScore} reflects ${finalScore >= 70 ? 'strong' : finalScore >= 50 ? 'good' : 'developing'} match for ${targetJob} requirements. Focus on adding ${keywordMatches < 3 ? 'more job-specific keywords, ' : ''}specific numbers and results, and detailed work experience.`
  }
}

// Test the analysis
const result = createEnhancedFallbackAnalysis(testExtractedContent, 'Software Developer')

console.log('📊 Analysis Results:')
console.log('===================')
console.log(`Overall Score: ${result.score}/100`)
console.log('\n📈 Component Scores:')
console.log(`- Content Quality: ${result.analysis.contentQuality}`)
console.log(`- Experience Relevance: ${result.analysis.experienceRelevance}`)
console.log(`- Skills Match: ${result.analysis.skillsAlignment}`)
console.log(`- Achievements Impact: ${result.analysis.achievementsImpact}`)

console.log('\n✅ Strengths:')
result.strengths.forEach((strength, index) => {
  console.log(`${index + 1}. ${strength}`)
})

console.log('\n⚠️ Areas for Improvement:')
result.weaknesses.forEach((weakness, index) => {
  console.log(`${index + 1}. ${weakness}`)
})

console.log('\n🎯 Recommendations:')
result.improvements.forEach((improvement, index) => {
  console.log(`${index + 1}. ${improvement}`)
})

console.log('\n📝 Summary:')
console.log(result.summary)

// Validate that no visual design elements are mentioned
const allText = JSON.stringify(result).toLowerCase()
const visualTerms = ['font', 'color', 'design', 'formatting', 'layout', 'visual', 'spacing']
const foundVisualTerms = visualTerms.filter(term => allText.includes(term))

if (foundVisualTerms.length > 0) {
  console.log('\n❌ WARNING: Visual elements still mentioned:', foundVisualTerms)
} else {
  console.log('\n✅ SUCCESS: Analysis focuses purely on text content!')
}

// Check that language is simple and readable
const complexTerms = ['quantifiable', 'comprehensive', 'proficiency', 'competencies', 'optimization']
const foundComplexTerms = complexTerms.filter(term => allText.includes(term))

if (foundComplexTerms.length === 0) {
  console.log('✅ Language is simple and easy to understand!')
} else {
  console.log('⚠️ Some complex terms found:', foundComplexTerms)
}

console.log('\n🎯 Key Improvements Made:')
console.log('• Removed all visual/design feedback')
console.log('• Simplified language for better readability')
console.log('• Focus purely on text content analysis')
console.log('• Made recommendations clear and actionable')
