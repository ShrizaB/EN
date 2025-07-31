// Test the updated 2-category analysis structure
console.log('🧪 Testing Updated 2-Category Analysis Structure...\n')

// Simulate the updated analysis function
function testUpdatedAnalysis(extractedContent, jobType) {
  const targetJob = jobType || 'General'
  const hasContent = extractedContent.text && extractedContent.text.length > 10
  const contentLength = extractedContent.text?.length || 0
  
  const content = extractedContent.text?.toLowerCase() || ''
  
  // Job-specific keyword analysis
  const jobKeywords = {
    'software': ['developer', 'programming', 'coding', 'software', 'javascript', 'python', 'java', 'react', 'node', 'git'],
    'marketing': ['marketing', 'seo', 'social media', 'campaigns', 'analytics', 'branding', 'digital'],
    'general': ['experience', 'skills', 'education', 'project', 'team', 'management']
  }
  
  const targetJobLower = targetJob.toLowerCase()
  let relevantKeywords = jobKeywords.general
  
  for (const [jobCategory, keywords] of Object.entries(jobKeywords)) {
    if (targetJobLower.includes(jobCategory)) {
      relevantKeywords = keywords
      break
    }
  }
  
  const keywordMatches = relevantKeywords.filter(keyword => content.includes(keyword)).length
  const keywordBonus = Math.min(keywordMatches * 2, 12)
  
  // Content quality analysis
  const hasEducation = content.includes('education') || content.includes('degree') || content.includes('university')
  const hasExperience = content.includes('experience') || content.includes('work') || content.includes('position')
  const hasSkills = content.includes('skills') || content.includes('proficient') || content.includes('expertise')
  const hasAchievements = content.includes('achieved') || content.includes('improved') || content.includes('%')
  const hasNumbers = /\d+/.test(content)
  
  // Updated scoring structure
  let baseScore = 30
  
  if (hasContent) {
    if (contentLength > 1500) baseScore += 30
    else if (contentLength > 1000) baseScore += 25
    else if (contentLength > 500) baseScore += 20
    else if (contentLength > 200) baseScore += 15
    else baseScore += 8
  }
  
  if (hasEducation) baseScore += 5
  if (hasExperience) baseScore += 8
  if (hasSkills) baseScore += 5
  if (hasAchievements) baseScore += 8
  if (hasNumbers) baseScore += 6
  
  baseScore += keywordBonus
  const finalScore = Math.max(25, Math.min(baseScore, 95))
  
  // NEW 2-CATEGORY SYSTEM
  
  // Content Quality (out of 100) - includes writing quality, completeness, job relevance
  let contentQualityScore = 40 // Base content score
  
  if (hasContent) {
    if (contentLength > 1500) contentQualityScore += 35
    else if (contentLength > 1000) contentQualityScore += 30
    else if (contentLength > 500) contentQualityScore += 25
    else if (contentLength > 200) contentQualityScore += 20
    else contentQualityScore += 10
  }
  
  // Add job relevance to content quality
  contentQualityScore += keywordBonus
  
  // Add achievements bonus to content quality
  if (hasAchievements) contentQualityScore += 15
  if (hasNumbers) contentQualityScore += 10
  
  const contentQuality = Math.min(contentQualityScore, 100)
  
  // Experience & Skills (out of 100) - combines experience relevance and skills alignment
  let experienceSkillsScore = 30 // Base score
  
  if (hasExperience) experienceSkillsScore += 25
  if (hasSkills) experienceSkillsScore += 20
  if (hasEducation) experienceSkillsScore += 15
  if (hasAchievements) experienceSkillsScore += 10
  
  const experienceSkills = Math.min(experienceSkillsScore, 100)
  
  return {
    score: finalScore,
    analysis: {
      contentQuality,      // Out of 100
      experienceSkills     // Out of 100
    },
    contentLength,
    keywordMatches,
    breakdown: {
      contentQualityBreakdown: {
        base: 40,
        contentBonus: contentLength > 1500 ? 35 : contentLength > 1000 ? 30 : contentLength > 500 ? 25 : contentLength > 200 ? 20 : 10,
        keywordBonus: keywordBonus,
        achievementsBonus: hasAchievements ? 15 : 0,
        numbersBonus: hasNumbers ? 10 : 0,
        total: contentQualityScore,
        final: contentQuality
      },
      experienceSkillsBreakdown: {
        base: 30,
        experienceBonus: hasExperience ? 25 : 0,
        skillsBonus: hasSkills ? 20 : 0,
        educationBonus: hasEducation ? 15 : 0,
        achievementsBonus: hasAchievements ? 10 : 0,
        total: experienceSkillsScore,
        final: experienceSkills
      }
    }
  }
}

// Test with comprehensive resume
const comprehensiveResume = {
  text: `John Smith - Senior Software Developer
Email: john@email.com | Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software developer with 6 years of experience in full-stack web development. 
Expert in JavaScript, Python, React, and Node.js. Led development team of 8 developers 
on e-commerce platform that generated $5M revenue and improved conversion rate by 35%.

WORK EXPERIENCE
Senior Software Developer | TechCorp Inc. | 2021-2024
• Developed and maintained 5 web applications using React, Node.js, and PostgreSQL
• Improved application performance by 45% through database optimization and caching
• Led team of 8 developers on major project, delivering 3 months ahead of schedule
• Implemented CI/CD pipeline that reduced deployment time by 60%

Software Developer | StartupXYZ | 2019-2021
• Built REST APIs serving 50,000+ daily users using Python and Django
• Increased user engagement by 40% through improved UI/UX implementation
• Reduced bug count by 70% through automated testing and code review processes

EDUCATION
Bachelor of Science in Computer Science | MIT | 2015-2019
GPA: 3.9/4.0 | Dean's List: 6 semesters

TECHNICAL SKILLS
Languages: JavaScript (Expert), Python (Expert), Java, TypeScript
Frontend: React, Vue.js, Angular, HTML5, CSS3
Backend: Node.js, Django, Express.js, Flask
Databases: PostgreSQL, MySQL, MongoDB, Redis
Cloud & Tools: AWS, Docker, Kubernetes, Git, Jenkins

ACHIEVEMENTS
• Led development of platform processing $5M in annual revenue
• Improved system performance by 45% across 8 production applications
• Reduced deployment time by 60% through automation`,
  layout: { blocks: [], entities: [], structure: 'document' },
  formatting: { fonts: [], spacing: {}, alignment: [] },
  colors: [],
  positions: []
}

console.log('📊 Testing Comprehensive Software Developer Resume')
console.log('=' .repeat(55))

const result = testUpdatedAnalysis(comprehensiveResume, 'Software Developer')

console.log(`Overall Score: ${result.score}/100`)
console.log(`Content Length: ${result.contentLength} characters`)
console.log(`Keywords Found: ${result.keywordMatches}`)

console.log('\n📊 NEW 2-CATEGORY ANALYSIS:')
console.log(`📝 Content Quality: ${result.analysis.contentQuality}/100`)
console.log(`💼 Experience & Skills: ${result.analysis.experienceSkills}/100`)

console.log('\n📈 Content Quality Breakdown:')
console.log(`• Base Score: ${result.breakdown.contentQualityBreakdown.base}`)
console.log(`• Content Bonus: +${result.breakdown.contentQualityBreakdown.contentBonus}`)
console.log(`• Keyword Relevance: +${result.breakdown.contentQualityBreakdown.keywordBonus}`)
console.log(`• Achievements: +${result.breakdown.contentQualityBreakdown.achievementsBonus}`)
console.log(`• Numbers/Metrics: +${result.breakdown.contentQualityBreakdown.numbersBonus}`)
console.log(`• Total (before cap): ${result.breakdown.contentQualityBreakdown.total}`)
console.log(`• Final Score: ${result.breakdown.contentQualityBreakdown.final}/100`)

console.log('\n💼 Experience & Skills Breakdown:')
console.log(`• Base Score: ${result.breakdown.experienceSkillsBreakdown.base}`)
console.log(`• Experience: +${result.breakdown.experienceSkillsBreakdown.experienceBonus}`)
console.log(`• Skills: +${result.breakdown.experienceSkillsBreakdown.skillsBonus}`)
console.log(`• Education: +${result.breakdown.experienceSkillsBreakdown.educationBonus}`)
console.log(`• Achievements: +${result.breakdown.experienceSkillsBreakdown.achievementsBonus}`)
console.log(`• Total (before cap): ${result.breakdown.experienceSkillsBreakdown.total}`)
console.log(`• Final Score: ${result.breakdown.experienceSkillsBreakdown.final}/100`)

console.log('\n✅ NEW STRUCTURE BENEFITS:')
console.log('• Only 2 bars instead of 4')
console.log('• Content Quality includes job relevance (out of 100)')
console.log('• Experience & Skills combines both categories (out of 100)')
console.log('• No more blank Formatting & Layout bars')
console.log('• No more blank Design Consistency bars')
console.log('• Scores are out of 100 for each category')

console.log('\n🎯 Frontend Interface Should Show:')
console.log(`• Content Quality: ${result.analysis.contentQuality}/100`)
console.log(`• Experience & Skills: ${result.analysis.experienceSkills}/100`)
console.log('• Overall Score: Based on combination of both categories')
