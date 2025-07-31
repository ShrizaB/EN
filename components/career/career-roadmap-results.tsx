"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"
import { ArrowLeft, Award, Briefcase, Building, DollarSign, Download, GraduationCap, MapPin, Youtube } from 'lucide-react'
import { generateCareerData, generateCareerPath } from '@/lib/gemini-api'
import './career-roadmap-results.css'

interface CareerRoadmapResultsProps {
  results: any
  onReset: () => void
}

const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[] }) => {
  if (!active || !payload || !payload.length) return null;
  
  const sector = payload[0].payload;
  const percentage = sector.percentage || payload[0].value || 0;
  
  return (
    <div className="cyber-tooltip" style={{
      backgroundColor: 'rgba(10, 15, 30, 0.98)',
      border: '1px solid #00ffff',
      borderRadius: '4px',
      padding: '8px 12px',
      boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)',
      color: '#00ffff',
      fontFamily: '"Orbitron", sans-serif',
      minWidth: '140px',
      textAlign: 'center'
    }}>
      <div className="cyber-tooltip-content">
        <p style={{ margin: 0, padding: '2px 0', fontWeight: 'bold' }}>{sector.name}</p>
        <p style={{ margin: 0, padding: '2px 0', color: '#99ccff' }}>{percentage}%</p>
      </div>
    </div>
  );
};

export function CareerRoadmapResults({ results, onReset }: CareerRoadmapResultsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null)
  const [activeSector, setActiveSector] = useState<number | null>(null)
  const [dynamicData, setDynamicData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [videoRoadmap, setVideoRoadmap] = useState<any[]>([])
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [careerPathData, setCareerPathData] = useState<any>(null)
  const [isCareerPathLoading, setIsCareerPathLoading] = useState(true)

  // Fetch dynamic career data when component mounts
  useEffect(() => {
    const fetchCareerData = async () => {
      setIsLoading(true)
      try {
        const jobRole = results?.jobRole || "Full Stack Developer"
        const sector = results?.sector || "Technology"
        
        console.log(`Fetching career data for ${jobRole} in ${sector} sector...`)
        const data = await generateCareerData(jobRole, sector)
        
        if (data) {
          console.log("Successfully fetched career data:", data)
          setDynamicData(data)
        } else {
          console.log("Failed to fetch career data, using fallback")
          setDynamicData(null)
        }
      } catch (error) {
        console.error("Error fetching career data:", error)
        setDynamicData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCareerData()
  }, [results?.jobRole, results?.sector])

  // Fetch learning roadmap with videos
  useEffect(() => {
    const fetchVideoRoadmap = async () => {
      setIsVideoLoading(true)
      try {
        const jobRole = results?.jobRole || "Full Stack Developer"
        const sector = results?.sector || "Technology"
        
        console.log(`Fetching learning roadmap with videos for ${jobRole} in ${sector} sector...`)
        
        const response = await fetch('/api/perplexity/learning-roadmap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobRole, sector })
        })
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }
        
        const data = await response.json()
        const roadmap = data.roadmap || []
        
        if (roadmap && roadmap.length > 0) {
          console.log("Successfully fetched video roadmap:", roadmap)
          setVideoRoadmap(roadmap)
        } else {
          console.log("Failed to fetch video roadmap, using fallback")
          setVideoRoadmap([])
        }
      } catch (error) {
        console.error("Error fetching video roadmap:", error)
        setVideoRoadmap([])
      } finally {
        setIsVideoLoading(false)
      }
    }

    fetchVideoRoadmap()
  }, [results?.jobRole, results?.sector])

  // Fetch career path data
  useEffect(() => {
    const fetchCareerPath = async () => {
      setIsCareerPathLoading(true)
      try {
        const jobRole = results?.jobRole || "Full Stack Developer"
        const sector = results?.sector || "Technology"
        
        console.log(`Fetching career path data for ${jobRole} in ${sector} sector...`)
        const data = await generateCareerPath(jobRole, sector)
        
        if (data) {
          console.log("Successfully fetched career path data:", data)
          setCareerPathData(data)
        } else {
          console.log("Failed to fetch career path data, using fallback")
          setCareerPathData(null)
        }
      } catch (error) {
        console.error("Error fetching career path data:", error)
        setCareerPathData(null)
      } finally {
        setIsCareerPathLoading(false)
      }
    }

    fetchCareerPath()
  }, [results?.jobRole, results?.sector])

  // Comprehensive fallback data to prevent undefined errors
  const safeResults = {
    ...results,
    careerPath: careerPathData?.careerPath || results?.careerPath || [],
    additionalResources: careerPathData?.additionalResources || results?.additionalResources || [],
    recommendedVideos: results?.recommendedVideos || [],
    // Use dynamic data if available, otherwise fallback to results data
    topSectors: dynamicData?.topSectors || results?.topSectors || [],
    topCompanies: dynamicData?.topCompanies || results?.topCompanies || [],
    requiredSkills: dynamicData?.requiredSkills || results?.requiredSkills || [],
    hiringLocations: dynamicData?.hiringLocations || results?.hiringLocations || [],
    skillResources: dynamicData?.skillResources || results?.skillResources || [],
    locationInsights: dynamicData?.locationInsights || results?.locationInsights || [],
    learningPath: videoRoadmap.length > 0 ? videoRoadmap : (results?.learningPath || results?.roleRoadmap || []),
    roleRoadmap: videoRoadmap.length > 0 ? videoRoadmap : (results?.roleRoadmap || results?.learningPath || [])
  };

  // Sample/fallback data for demo purposes
  const fallbackSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS', 'Docker'
  ];
  
  const fallbackLocations = [
    'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Gurgaon', 'Noida'
  ];

  const fallbackSkillResources = [
    { title: 'Frontend Development', description: 'Learn modern frontend technologies and frameworks' },
    { title: 'Backend Development', description: 'Master server-side programming and APIs' },
    { title: 'Database Management', description: 'Understand database design and optimization' }
  ];

  const fallbackLocationInsights = [
    { 
      location: 'Bangalore', 
      description: 'Tech hub with highest number of IT companies',
      averageSalary: 800000,
      costOfLiving: 'Medium'
    },
    {
      location: 'Mumbai',
      description: 'Financial capital with diverse opportunities',
      averageSalary: 900000,
      costOfLiving: 'High'
    }
  ];

  // Use fallback data if results data is missing
  const displaySkills = safeResults.requiredSkills && safeResults.requiredSkills.length > 0 
    ? safeResults.requiredSkills 
    : fallbackSkills;
    
  const displayLocations = safeResults.hiringLocations && safeResults.hiringLocations.length > 0 
    ? safeResults.hiringLocations 
    : fallbackLocations;
    
  const displaySkillResources = safeResults.skillResources && safeResults.skillResources.length > 0 
    ? safeResults.skillResources 
    : fallbackSkillResources;
    
  const displayLocationInsights = safeResults.locationInsights && safeResults.locationInsights.length > 0 
    ? safeResults.locationInsights 
    : fallbackLocationInsights;

  // Debug logging to see what data we have
  console.log('Dynamic data loaded:', dynamicData ? 'Yes' : 'No');
  console.log('Video roadmap loaded:', videoRoadmap.length > 0 ? `Yes (${videoRoadmap.length} videos)` : 'No');
  console.log('Results data:', {
    requiredSkills: safeResults.requiredSkills?.length || 0,
    hiringLocations: safeResults.hiringLocations?.length || 0,
    skillResources: safeResults.skillResources?.length || 0,
    locationInsights: safeResults.locationInsights?.length || 0,
    topCompanies: safeResults.topCompanies?.length || 0,
    topSectors: safeResults.topSectors?.length || 0,
    roleRoadmap: safeResults.roleRoadmap?.length || 0,
  });
  
  console.log('Display data:', {
    displaySkills: displaySkills?.length || 0,
    displayLocations: displayLocations?.length || 0,
    displaySkillResources: displaySkillResources?.length || 0,
    displayLocationInsights: displayLocationInsights?.length || 0,
  });

  // Improved filtering logic - always show companies if available
  const filteredSectors = Array.isArray(safeResults.topSectors) && safeResults.topSectors.length > 0
    ? safeResults.topSectors
    : [];

  const filteredCompanies = Array.isArray(safeResults.topCompanies) && safeResults.topCompanies.length > 0
    ? safeResults.topCompanies
    : [];

  console.log('Filtered data:', {
    sectorsCount: filteredSectors.length,
    companiesCount: filteredCompanies.length,
    isLoading,
    isVideoLoading,
    videoRoadmapCount: videoRoadmap.length
  });

  // Colors for charts - Cyber theme
  const COLORS = [
    '#00ffff', // Bright Cyan
    '#00f7ff', // Electric Blue
    '#00a8ff', // Neon Blue
    '#9d00ff', // Purple
    '#ff00ff', // Magenta
    '#ff0099', // Pink
    '#ff5500', // Orange
    '#f9f900', // Yellow
    '#00ff88', // Green
    '#00ffd5'  // Turquoise
  ]
  const CHART_BACKGROUND = "#0a0a0f"

  return (
    <div className="cyber-container">
      {/* Animated Background */}
      <div className="cyber-bg">
        <div className="cyber-grid"></div>
        <div className="cyber-particles"></div>
        <div className="cyber-lines"></div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between cyber-header">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset} 
            className="cyber-btn cyber-btn-outline gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="cyber-text">BACK</span>
          </Button>
          {/* Removed Download Report button */}
        </div>

        <div className="text-center mb-6 cyber-title-section">
          <h2 className="cyber-title-main">
            <span className="cyber-glitch" data-text="YOUR CAREER ROADMAP">YOUR CAREER ROADMAP</span>
          </h2>
          <p className="cyber-subtitle">
            Based on your preferences for {safeResults.jobRole} in the {safeResults.sector} sector
          </p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="cyber-tabs-list grid grid-cols-3 sm:grid-cols-6 mb-4 gap-1 h-auto">
            <TabsTrigger value="overview" className="cyber-tab text-xs sm:text-sm">OVERVIEW</TabsTrigger>
            <TabsTrigger value="skills" className="cyber-tab text-xs sm:text-sm">SKILLS</TabsTrigger>
            <TabsTrigger value="locations" className="cyber-tab text-xs sm:text-sm">LOCATIONS</TabsTrigger>
            <TabsTrigger value="roadmap" className="cyber-tab text-xs sm:text-sm">CAREER PATH</TabsTrigger>
            <TabsTrigger value="role-roadmap" className="cyber-tab text-xs sm:text-sm">ROLE ROADMAP</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h2 className="cyber-title text-2xl md:text-2xl font-bold mb-3">
                  Your Career Roadmap as a {safeResults.jobRole}
                </h2>
                <p className="cyber-text mb-4 text-sm">
                  Based on your interests and skills, here's a comprehensive career path in the {safeResults.sector} sector.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="cyber-section">
                    <h3 className="cyber-section-title flex items-center gap-2 text-sm mb-2">
                      <Briefcase className="h-5 w-5 cyber-icon" />
                      TOP HIRING SECTORS
                    </h3>
                    <div className="min-h-[300px] max-h-[400px] flex flex-col pb-6">
                      <div className="flex-1 flex flex-col items-center justify-center">
                        {filteredSectors.length > 0 ? (
                          <div className="relative w-full min-h-[300px] flex flex-col items-center justify-center max-h-[400px] p-2 max-w-[300px] mx-auto">
                            <div className="mb-6">
                              <PieChart width={300} height={250}>
                              <defs>
                                <filter id="cyber-glow" height="300%" width="300%" x="-75%" y="-75%">
                                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                                  <feFlood floodColor="#00ffff" floodOpacity="0.5" result="color" />
                                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                                </filter>
                              </defs>
                          <Pie
                            data={filteredSectors}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="percentage"
                            label={false}
                            labelLine={false}
                            stroke="#0a0a0f"
                            strokeWidth={1.5}
                            onClick={(data, index) => {
                              setActiveSector(activeSector === index ? null : index);
                            }}
                            onMouseEnter={(_, index) => setActiveSector(index)}
                            onMouseLeave={() => setActiveSector(null)}
                          >
                            {filteredSectors.map((entry: any, index: number) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]}
                                style={{
                                  filter: activeSector === index ? 'brightness(1.2) drop-shadow(0 0 6px rgba(0, 255, 255, 0.8))' : 'url(#cyber-glow)',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer',
                                  opacity: activeSector === index ? 1 : 0.9
                                }}
                              />
                            ))}
                              </Pie>
                              <Tooltip 
                                content={<CustomTooltip />}
                                wrapperStyle={{
                                  zIndex: 1000,
                                  pointerEvents: 'none'
                                }}
                                cursor={{ fill: 'transparent' }}
                              />
                              <Legend 
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                wrapperStyle={{
                                  paddingTop: '10px',
                                  color: '#99ccff',
                                  fontFamily: '"Orbitron", sans-serif',
                                  fontSize: '0.75rem',
                                  letterSpacing: '0.05em',
                                  maxHeight: '100px',
                                  overflowY: 'auto',
                                  padding: '0 10px',
                                  marginTop: '1rem'
                                }}
                                iconType="circle"
                                iconSize={10}
                                formatter={(value) => (
                                  <span className="cyber-legend-text">{value}</span>
                                )}
                              />
                            </PieChart>
                          </div>
                        </div>
                      ) : (
                        <div className="cyber-no-data">No sector data available.</div>
                      )}
                    </div>
                  </div>
                  </div>

                  <div className="cyber-section">
                    <h3 className="cyber-section-title flex items-center gap-2 text-sm mb-2">
                      <DollarSign className="h-5 w-5 cyber-icon" />
                      SALARY INSIGHTS (PER MONTH)
                    </h3>
                    <div className="space-y-4">
                      <div className="cyber-salary-card cyber-stat-primary">
                        <div className="cyber-salary-label">Average Salary Range</div>
                        <div className="cyber-salary-value">₹{safeResults.averageSalary ? Math.round(safeResults.averageSalary / 12).toLocaleString() : 'N/A'}/month</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="cyber-salary-card cyber-stat-secondary">
                          <div className="cyber-salary-label">Entry Level</div>
                          <div className="cyber-salary-value-sm">₹{safeResults.entrySalary ? Math.round(safeResults.entrySalary / 12).toLocaleString() : 'N/A'}/month</div>
                        </div>
                        <div className="cyber-salary-card cyber-stat-tertiary">
                          <div className="cyber-salary-label">Experienced</div>
                          <div className="cyber-salary-value-sm">₹{safeResults.experiencedSalary ? Math.round(safeResults.experiencedSalary / 12).toLocaleString() : 'N/A'}/month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5 cyber-icon" />
                  TOP COMPANIES HIRING
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {isLoading ? (
                    <div className="col-span-full text-center py-8">
                      <div className="cyber-loading">
                        <div className="cyber-spinner"></div>
                        <p className="cyber-text mt-4">Loading companies data...</p>
                      </div>
                    </div>
                  ) : filteredCompanies.length > 0 ? (
                    filteredCompanies.slice(0, Math.min(filteredCompanies.length, 12)).map((company: any, index: number) => (
                      <div
                        key={index}
                        className={`cyber-company-card ${selectedCompany === company ? 'expanded' : ''}`}
                        onClick={() => setSelectedCompany(selectedCompany === company ? null : company)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="cyber-company-avatar">
                            {typeof company === "string" ? company.charAt(0).toUpperCase() : company.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div className="cyber-company-name">
                            {typeof company === "string" ? company : company.name || "Unknown Company"}
                          </div>
                        </div>
                        
                        {/* Expanded Content */}
                        {selectedCompany === company && (
                          <div className="cyber-company-expanded-content">
                            <div className="cyber-modal-section">
                              <h3 className="cyber-modal-subtitle">About Company</h3>
                              <div className="cyber-modal-content">
                                {selectedCompany.details && typeof selectedCompany.details === "string" ? (
                                  <div className="cyber-company-description">
                                    {selectedCompany.details.split("\n").map((line: string, i: number) => (
                                      <p key={i} className="cyber-description-line">{line}</p>
                                    ))}
                                  </div>
                                ) : selectedCompany.description ? (
                                  <p className="cyber-description-line">{selectedCompany.description}</p>
                                ) : (
                                  <p className="cyber-no-data">No details available for this company yet.</p>
                                )}
                              </div>
                            </div>

                            <div className="cyber-modal-section">
                              <h3 className="cyber-modal-subtitle">Key Facilities & Benefits</h3>
                              <div className="cyber-facilities-grid">
                                {Array.isArray(selectedCompany.facilities) && selectedCompany.facilities.length > 0 ? (
                                  selectedCompany.facilities.slice(0, 10).map((facility: string, i: number) => (
                                    <div key={i} className="cyber-facility-item">
                                      <span className="cyber-facility-icon">•</span>
                                      <span className="cyber-facility-text">{facility}</span>
                                    </div>
                                  ))
                                ) : selectedCompany.facility ? (
                                  <div className="cyber-facility-item">
                                    <span className="cyber-facility-icon">•</span>
                                    <span className="cyber-facility-text">{selectedCompany.facility}</span>
                                  </div>
                                ) : (
                                  <p className="cyber-no-data">No facility data available for this company.</p>
                                )}
                              </div>
                            </div>

                            <div className="cyber-modal-section">
                              <h3 className="cyber-modal-subtitle">Salary Information (Per Month)</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="cyber-salary-card cyber-salary-entry">
                                  <div className="cyber-salary-label">Entry Level</div>
                                  <div className="cyber-salary-value">₹{selectedCompany.entrySalary ? Math.round(selectedCompany.entrySalary / 12).toLocaleString() : selectedCompany.entry_level_salary ? Math.round(selectedCompany.entry_level_salary / 12).toLocaleString() : selectedCompany.salaryEntry ? Math.round(selectedCompany.salaryEntry / 12).toLocaleString() : <span className='cyber-no-data'>Not available</span>}/month</div>
                                </div>
                                <div className="cyber-salary-card cyber-salary-exp">
                                  <div className="cyber-salary-label">Experienced</div>
                                  <div className="cyber-salary-value">₹{selectedCompany.experiencedSalary ? Math.round(selectedCompany.experiencedSalary / 12).toLocaleString() : selectedCompany.experienced_salary ? Math.round(selectedCompany.experienced_salary / 12).toLocaleString() : selectedCompany.salaryExperienced ? Math.round(selectedCompany.salaryExperienced / 12).toLocaleString() : <span className='cyber-no-data'>Not available</span>}/month</div>
                                </div>
                                <div className="cyber-salary-card cyber-salary-avg">
                                  <div className="cyber-salary-label">Average</div>
                                  <div className="cyber-salary-value">₹{selectedCompany.averageSalary ? Math.round(selectedCompany.averageSalary / 12).toLocaleString() : selectedCompany.average_salary ? Math.round(selectedCompany.average_salary / 12).toLocaleString() : selectedCompany.salaryAverage ? Math.round(selectedCompany.salaryAverage / 12).toLocaleString() : <span className='cyber-no-data'>Not available</span>}/month</div>
                                </div>
                              </div>
                              {!(selectedCompany.entrySalary || selectedCompany.entry_level_salary || selectedCompany.salaryEntry) &&
                                !(selectedCompany.experiencedSalary || selectedCompany.experienced_salary || selectedCompany.salaryExperienced) &&
                                !(selectedCompany.averageSalary || selectedCompany.average_salary || selectedCompany.salaryAverage) && (
                                  <div className="mt-4 cyber-no-data">No salary data available for this company.</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <div className="cyber-no-data">
                        <p>Unable to load company data.</p>
                        <p className="text-sm mt-2 opacity-75">Please check your internet connection and try refreshing the page.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 cyber-icon" />
                  ADDITIONAL BENEFITS
                </h3>
                <div className="cyber-benefits-grid">
                  <div className="cyber-benefit-card">
                    <div className="cyber-benefit-icon">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h4 className="cyber-benefit-title">Remote Work Options</h4>
                    <p className="cyber-benefit-desc">Many companies offer flexible work arrangements including remote and hybrid options.</p>
                  </div>
                  <div className="cyber-benefit-card">
                    <div className="cyber-benefit-icon">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <h4 className="cyber-benefit-title">Performance Bonuses</h4>
                    <p className="cyber-benefit-desc">Earn additional compensation through performance-based bonuses and profit sharing.</p>
                  </div>
                  <div className="cyber-benefit-card">
                    <div className="cyber-benefit-icon">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <h4 className="cyber-benefit-title">Learning & Development</h4>
                    <p className="cyber-benefit-desc">Access to training programs, certifications, and continuous learning opportunities.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title mb-6">Top Skills Required for {safeResults.jobRole}</h3>
                <div className="mb-4">
                  <p className="text-cyber-blue text-sm">
                    {safeResults.requiredSkills && safeResults.requiredSkills.length > 0 
                      ? `Showing ${safeResults.requiredSkills.length} skills from analysis` 
                      : 'Showing sample skills data'
                    }
                  </p>
                </div>
                <div className="h-[400px] cyber-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <filter id="cyber-glow-skills" height="300%" width="300%" x="-75%" y="-75%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                          <feFlood floodColor="#00ffff" floodOpacity="0.5" result="color" />
                          <feComposite in="color" in2="blur" operator="in" result="glow" />
                          <feComposite in="SourceGraphic" in2="glow" operator="over" />
                        </filter>
                      </defs>
                      <Pie
                        data={displaySkills.map((skill: any, index: number) => ({
                          name: typeof skill === "string" ? skill : skill.name || skill,
                          value: typeof skill === "string" ? Math.max(95 - index * 8, 20) : skill.importance || Math.max(95 - index * 8, 20),
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                        stroke="#0a0a0f"
                        strokeWidth={1.5}
                        isAnimationActive={false}
                      >
                        {displaySkills.map((skill: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            style={{
                              filter: 'url(#cyber-glow-skills)'
                            }}
                          />
                        ))}
                      </Pie>
                      <Legend 
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{
                          paddingTop: '20px',
                          color: '#99ccff',
                          fontFamily: '"Orbitron", sans-serif',
                          fontSize: '0.75rem',
                          letterSpacing: '0.05em'
                        }}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                          <span className="cyber-legend-text">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title mb-4">Skill Development Resources</h3>
                <div className="space-y-4">
                  {displaySkillResources.map((resource: any, index: number) => (
                    <div key={index} className="cyber-resource-card">
                      <h4 className="cyber-resource-title">{resource.title || `Resource ${index + 1}`}</h4>
                      <p className="cyber-resource-desc">{resource.description || "No description available"}</p>
                      {resource.link ? (
                        <a 
                          href={resource.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button variant="outline" size="sm" className="cyber-btn cyber-btn-outline">
                            LEARN MORE
                          </Button>
                        </a>
                      ) : (
                        <Button variant="outline" size="sm" className="cyber-btn cyber-btn-outline" disabled>
                          LEARN MORE
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 cyber-icon" />
                  TOP HIRING LOCATIONS
                </h3>
                <div className="mb-4">
                  <p className="text-cyber-blue text-sm">
                    {safeResults.hiringLocations && safeResults.hiringLocations.length > 0 
                      ? `Showing ${safeResults.hiringLocations.length} locations from analysis` 
                      : 'Showing sample location data'
                    }
                  </p>
                </div>
                <div className="h-[400px] cyber-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <filter id="cyber-glow-locations" height="300%" width="300%" x="-75%" y="-75%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                          <feFlood floodColor="#00ffff" floodOpacity="0.5" result="color" />
                          <feComposite in="color" in2="blur" operator="in" result="glow" />
                          <feComposite in="SourceGraphic" in2="glow" operator="over" />
                        </filter>
                      </defs>
                      <Pie
                        data={displayLocations.map((location: any, index: number) => ({
                          name: typeof location === "string" ? location : location.name || location,
                          value: typeof location === "string" ? Math.max(85 - index * 12, 15) : location.percentage || Math.max(85 - index * 12, 15),
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                        stroke="#0a0a0f"
                        strokeWidth={1.5}
                        isAnimationActive={false}
                      >
                        {displayLocations.map((location: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            style={{
                              filter: 'url(#cyber-glow-locations)'
                            }}
                          />
                        ))}
                      </Pie>
                      <Legend 
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{
                          paddingTop: '20px',
                          color: '#99ccff',
                          fontFamily: '"Orbitron", sans-serif',
                          fontSize: '0.75rem',
                          letterSpacing: '0.05em'
                        }}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                          <span className="cyber-legend-text">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title mb-4">Location Insights</h3>
                <div className="space-y-4">
                  {displayLocationInsights.map((insight: any, index: number) => (
                    <div key={index} className="cyber-insight-card">
                      <h4 className="cyber-insight-title">{insight.location || `Location ${index + 1}`}</h4>
                      <p className="cyber-insight-desc">{insight.description || "No description available"}</p>
                      <div className="cyber-insight-stats">
                        <span>Average Salary: ₹{insight.averageSalary?.toLocaleString() || "N/A"}</span>
                        <span>Cost of Living: {insight.costOfLiving || "N/A"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title flex items-center gap-2 mb-4">
                  <Youtube className="h-5 w-5 cyber-icon" />
                  RECOMMENDED LEARNING VIDEOS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {safeResults.recommendedVideos?.map((video: any, index: number) => (
                    <div key={index} className="cyber-video-card">
                      <div className="cyber-video-thumbnail">
                        <div className="cyber-video-icon">
                          <Youtube className="h-12 w-12" />
                        </div>
                        <div className="cyber-video-title-overlay">{video.title}</div>
                      </div>
                      <div className="cyber-video-content">
                        <h4 className="cyber-video-topic">{video.topic}</h4>
                        <p className="cyber-video-desc">{video.description}</p>
                        <Button variant="outline" size="sm" className="cyber-btn cyber-btn-outline">
                          WATCH VIDEO
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title mb-6">Your Career Path Roadmap</h3>
                <div className="mb-4">
                  <p className="text-cyber-blue text-sm">
                    {isCareerPathLoading 
                      ? "Loading personalized career path..." 
                      : careerPathData 
                        ? `Interactive career progression path with ${safeResults.careerPath?.length || 0} stages`
                        : "Interactive career progression path with timeline and salary expectations"
                    }
                  </p>
                </div>

                {isCareerPathLoading ? (
                  <div className="text-center py-12">
                    <div className="cyber-loading">
                      <div className="cyber-spinner"></div>
                      <p className="cyber-text mt-4">Fetching career path...</p>
                      <p className="text-sm mt-2 opacity-75">This may take a moment as we analyze the best career progression for your role</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {safeResults.careerPath?.length > 0 ? (
                      safeResults.careerPath.map((step: any, index: number) => (
                        <div key={index} className="mb-8 relative cyber-roadmap-step">
                          <div className="flex">
                            <div className="flex flex-col items-center mr-4">
                              <div className="cyber-step-number">
                                {index + 1}
                              </div>
                              {index < (safeResults.careerPath?.length || 0) - 1 && (
                                <div className="cyber-step-line"></div>
                              )}
                            </div>
                            <div className="cyber-step-content">
                              <h4 className="cyber-step-title">{step.title}</h4>
                              <p className="cyber-step-desc">{step.description}</p>
                              <div className="cyber-step-stats">
                                <div className="cyber-step-stat">
                                  <span className="cyber-step-stat-label">Timeline:</span> {step.timeline}
                                </div>
                                <div className="cyber-step-stat">
                                  <span className="cyber-step-stat-label">Salary Range:</span> ₹{step.salaryRange}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="cyber-no-data">
                          <p>Unable to load career path data.</p>
                          <p className="text-sm mt-2 opacity-75">Please check your internet connection and try refreshing the page.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title mb-4">Additional Resources</h3>
                {isCareerPathLoading ? (
                  <div className="text-center py-8">
                    <div className="cyber-loading">
                      <div className="cyber-spinner"></div>
                      <p className="cyber-text mt-4">Loading resources...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {safeResults.additionalResources?.length > 0 ? (
                      safeResults.additionalResources.map((resource: any, index: number) => (
                        <div key={index} className="cyber-resource-card">
                          <h4 className="cyber-resource-title">{resource.title}</h4>
                          <p className="cyber-resource-desc">{resource.description}</p>
                          {resource.link ? (
                            <a 
                              href={resource.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <Button variant="outline" size="sm" className="cyber-btn cyber-btn-outline">
                                EXPLORE
                              </Button>
                            </a>
                          ) : (
                            <Button variant="outline" size="sm" className="cyber-btn cyber-btn-outline" disabled>
                              EXPLORE
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <div className="cyber-no-data">
                          <p>No additional resources available.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="role-roadmap" className="space-y-6">
            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title mb-6">Learning Roadmap for {safeResults.jobRole}</h3>
                <div className="mb-4">
                  <p className="text-cyber-blue text-sm">
                    {isVideoLoading 
                      ? "Loading personalized learning path from Perplexity AI..." 
                      : videoRoadmap.length > 0 
                        ? `Interactive learning path with ${videoRoadmap.length} YouTube videos and estimated timeframes`
                        : "Interactive learning path with embedded YouTube videos and estimated timeframes"
                    }
                  </p>
                </div>

                {isVideoLoading ? (
                  <div className="text-center py-12">
                    <div className="cyber-loading">
                      <div className="cyber-spinner"></div>
                      <p className="cyber-text mt-4">Fetching learning videos from Perplexity AI...</p>
                      <p className="text-sm mt-2 opacity-75">This may take a moment as we search for the best educational content</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {(safeResults.learningPath || safeResults.roleRoadmap)?.length > 0 ? (
                      (safeResults.learningPath || safeResults.roleRoadmap)?.map((step: any, index: number) => (
                        <div key={index} className="cyber-learning-card">
                          <div className="cyber-learning-content">
                            <div className="cyber-learning-header">
                              <div className="cyber-learning-number">
                                {index + 1}
                              </div>
                              <h4 className="cyber-learning-title">{step.title}</h4>
                            </div>
                            <p className="cyber-learning-desc">{step.description}</p>
                            <div className="cyber-learning-tags items-center">
                              <div className="cyber-learning-tag">
                                <span className="cyber-learning-tag-label">Estimated Time:</span> {step.estimatedTime}
                              </div>
                              {step.videoId && (
                                <a
                                  href={`https://www.youtube.com/watch?v=${step.videoId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="cyber-btn px-4 py-2 cyber-btn-outline"
                                >
                                  Watch on YouTube
                                </a>
                              )}
                            </div>
                            {index < (safeResults.learningPath || safeResults.roleRoadmap).length - 1 && (
                              <div className="cyber-learning-next">
                                <span>Next:</span>{" "}
                                <span className="cyber-learning-next-title">{(safeResults.learningPath || safeResults.roleRoadmap)[index + 1].title}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="cyber-no-data">
                          <p>Unable to load learning videos from Perplexity AI.</p>
                          <p className="text-sm mt-2 opacity-75">Please check your internet connection and try refreshing the page.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title mb-4">Tips for Effective Learning</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="cyber-tip-card">
                    <h4 className="cyber-tip-title">Practice Regularly</h4>
                    <p className="cyber-tip-desc">
                      Consistent practice is key to mastering new skills. Try to dedicate at least 1-2 hours daily.
                    </p>
                  </div>
                  <div className="cyber-tip-card">
                    <h4 className="cyber-tip-title">Build Projects</h4>
                    <p className="cyber-tip-desc">
                      Apply what you learn by building real projects. This reinforces concepts and builds your portfolio.
                    </p>
                  </div>
                  <div className="cyber-tip-card">
                    <h4 className="cyber-tip-title">Join Communities</h4>
                    <p className="cyber-tip-desc">
                      Connect with others learning the same skills. Online forums and local meetups can provide support
                      and insights.
                    </p>
                  </div>
                  <div className="cyber-tip-card">
                    <h4 className="cyber-tip-title">Track Your Progress</h4>
                    <p className="cyber-tip-desc">
                      Keep a learning journal to document your progress, challenges, and achievements along the way.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Mock data for demonstration
const mockResults = {
  jobRole: "Full Stack Developer",
  sector: "Technology",
  averageSalary: 850000,
  entrySalary: 450000,
  experiencedSalary: 1500000,
  topSectors: [
    { name: "Technology", percentage: 45, category: "technology" },
    { name: "Finance", percentage: 25, category: "finance" },
    { name: "Healthcare", percentage: 20, category: "healthcare" },
    { name: "E-commerce", percentage: 10, category: "technology" }
  ],
  topCompanies: [
    { 
      name: "Google", 
      sector: "technology",
      details: "Leading technology company\nFocused on search and cloud services\nGlobal presence with innovative culture\nStrong emphasis on AI and machine learning\nExcellent work-life balance",
      facilities: ["Free meals", "Gym", "Health insurance", "Stock options", "Flexible hours", "Remote work", "Learning budget", "Childcare", "Transportation", "Wellness programs"],
      entrySalary: 600000,
      experiencedSalary: 2000000,
      averageSalary: 1200000
    },
    { 
      name: "Microsoft", 
      sector: "technology",
      details: "Global technology leader\nCloud computing and productivity software\nDiverse and inclusive workplace\nStrong focus on innovation\nExcellent career growth opportunities",
      facilities: ["Health benefits", "Retirement plans", "Flexible work", "Learning resources", "Employee discounts", "Wellness programs", "Parental leave", "Volunteer time", "Stock purchase", "Gym membership"],
      entrySalary: 550000,
      experiencedSalary: 1800000,
      averageSalary: 1100000
    },
    { 
      name: "Amazon", 
      sector: "technology",
      details: "E-commerce and cloud computing giant\nFast-paced work environment\nCustomer-obsessed culture\nGlobal scale operations\nInnovation at every level",
      facilities: ["Career advancement", "Health insurance", "Stock options", "Employee discounts", "Flexible schedules", "Learning opportunities", "Wellness programs", "Parental benefits", "Transportation", "Food services"],
      entrySalary: 500000,
      experiencedSalary: 1700000,
      averageSalary: 1000000
    }
  ],
  benefits: [
    "Comprehensive health insurance coverage",
    "Flexible working hours and remote work options",
    "Professional development and training programs",
    "Stock options and equity participation",
    "Generous paid time off and vacation policies",
    "Retirement savings plans with company matching"
  ],
  requiredSkills: [
    { name: "JavaScript", importance: 95 },
    { name: "React", importance: 90 },
    { name: "Node.js", importance: 85 },
    { name: "Python", importance: 80 },
    { name: "SQL", importance: 75 },
    { name: "AWS", importance: 70 }
  ],
  skillResources: [
    {
      title: "JavaScript Fundamentals",
      description: "Master the core concepts of JavaScript programming language",
      link: "#"
    },
    {
      title: "React Development",
      description: "Build modern web applications with React framework",
      link: "#"
    },
    {
      title: "Node.js Backend",
      description: "Learn to build scalable server-side applications",
      link: "#"
    },
    {
      title: "Database Design",
      description: "Master SQL and NoSQL database concepts",
      link: "#"
    }
  ],
  hiringLocations: [
    { name: "Bangalore", percentage: 35 },
    { name: "Mumbai", percentage: 25 },
    { name: "Delhi", percentage: 20 },
    { name: "Hyderabad", percentage: 15 },
    { name: "Pune", percentage: 5 }
  ],
  locationInsights: [
    {
      location: "Bangalore",
      description: "Tech capital of India with numerous opportunities in IT and startups. Home to many tech giants and innovative startups.",
      averageSalary: 900000,
      costOfLiving: "High"
    },
    {
      location: "Mumbai",
      description: "Financial capital with growing tech scene. Offers diverse opportunities in fintech and e-commerce sectors.",
      averageSalary: 850000,
      costOfLiving: "Very High"
    },
    {
      location: "Delhi/NCR",
      description: "Growing tech hub with many MNCs and startups. Strong presence of product-based companies.",
      averageSalary: 875000,
      costOfLiving: "High"
    },
    {
      location: "Hyderabad",
      description: "Emerging tech city with many IT parks and corporate offices. Lower cost of living compared to other metros.",
      averageSalary: 825000,
      costOfLiving: "Moderate"
    },
    {
      location: "Pune",
      description: "Educational hub with growing IT industry. Known for its pleasant weather and work-life balance.",
      averageSalary: 800000,
      costOfLiving: "Moderate"
    }
  ],
  recommendedVideos: [
    {
      title: "Full Stack Development Roadmap",
      topic: "Career Guidance",
      description: "Complete guide to becoming a full stack developer"
    }
  ],
  careerPath: [
    {
      title: "Junior Developer",
      description: "Start your career with basic programming skills",
      timeline: "0-2 years",
      salaryRange: "3-6 LPA"
    },
    {
      title: "Senior Developer",
      description: "Lead projects and mentor junior developers",
      timeline: "2-5 years",
      salaryRange: "8-15 LPA"
    }
  ],
  additionalResources: [
    {
      title: "Coding Bootcamps",
      description: "Intensive training programs for quick skill development"
    }
  ],
  roleRoadmap: [
    {
      title: "Programming Fundamentals",
      description: "Start with basic programming concepts, logic building, and problem-solving approaches",
      estimatedTime: "2-3 weeks",
      videoId: "zOjov-2OZ0E",
      videoTitle: "Programming for Beginners - Learn to Code"
    },
    {
      title: "Learn JavaScript Basics",
      description: "Master the fundamentals of JavaScript programming language including variables, functions, objects, and ES6+ features",
      estimatedTime: "4-6 weeks",
      videoId: "PkZNo7MFNFg",
      videoTitle: "JavaScript Full Course - Learn JavaScript in 12 Hours"
    },
    {
      title: "HTML & CSS Fundamentals",
      description: "Build solid foundation in web markup and styling for creating beautiful web pages",
      estimatedTime: "3-4 weeks",
      videoId: "mU6anWqZJcc",
      videoTitle: "HTML & CSS Full Course - Build a Website Tutorial"
    },
    {
      title: "Git & Version Control",
      description: "Learn essential version control skills for collaborative development and code management",
      estimatedTime: "1-2 weeks",
      videoId: "8JJ101D3knE",
      videoTitle: "Git Tutorial for Beginners: Learn Git in 1 Hour"
    },
    {
      title: "JavaScript DOM Manipulation",
      description: "Learn to make interactive web pages by manipulating the Document Object Model",
      estimatedTime: "2-3 weeks",
      videoId: "y17RuWkWdn8",
      videoTitle: "JavaScript DOM Manipulation Full Course"
    },
    {
      title: "React Development",
      description: "Build interactive user interfaces with React including components, state management, hooks, and modern patterns",
      estimatedTime: "6-8 weeks",
      videoId: "bMknfKXIFA8",
      videoTitle: "React Course - Beginner's Tutorial for React JavaScript Library"
    },
    {
      title: "TypeScript Fundamentals",
      description: "Add type safety to your JavaScript applications with TypeScript for better development experience",
      estimatedTime: "3-4 weeks",
      videoId: "BwuLxPH8IDs",
      videoTitle: "TypeScript Course for Beginners - Learn TypeScript"
    },
    {
      title: "Node.js Backend Development",
      description: "Learn server-side development with Node.js, Express.js, and building RESTful APIs",
      estimatedTime: "4-6 weeks",
      videoId: "f2EqECiTBL8",
      videoTitle: "Node.js Full Course for Beginners"
    },
    {
      title: "Express.js Framework",
      description: "Master the most popular Node.js framework for building web applications and APIs",
      estimatedTime: "3-4 weeks",
      videoId: "L72fhGm1tfE",
      videoTitle: "Express.js Tutorial - Node.js Framework"
    },
    {
      title: "Database Management with MongoDB",
      description: "Master NoSQL database concepts with MongoDB, data modeling, and database operations",
      estimatedTime: "3-4 weeks",
      videoId: "ExcRbA7fy_A",
      videoTitle: "MongoDB Full Course - Learn MongoDB in 3 Hours"
    },
    {
      title: "SQL & Relational Databases",
      description: "Learn structured query language and relational database management with MySQL/PostgreSQL",
      estimatedTime: "4-5 weeks",
      videoId: "HXV3zeQKqGY",
      videoTitle: "SQL Tutorial - Full Database Course for Beginners"
    },
    {
      title: "API Development & Testing",
      description: "Build robust APIs and learn testing strategies using tools like Postman and Jest",
      estimatedTime: "3-4 weeks",
      videoId: "VywxIQ2ZXw4",
      videoTitle: "REST API Tutorial - How to Build a REST API"
    },
    {
      title: "Frontend State Management",
      description: "Master advanced state management with Redux, Context API, and modern patterns",
      estimatedTime: "4-5 weeks",
      videoId: "CVpUuw9XSjY",
      videoTitle: "Redux Tutorial - Learn Redux from Scratch"
    },
    {
      title: "Full Stack Project Development",
      description: "Build a complete full-stack application integrating frontend, backend, and database components",
      estimatedTime: "8-10 weeks",
      videoId: "98BzS5Oz5E4",
      videoTitle: "Full Stack Web Development Project Tutorial"
    },
    {
      title: "Deployment and DevOps",
      description: "Learn to deploy applications using cloud platforms, CI/CD pipelines, and containerization with Docker",
      estimatedTime: "3-4 weeks",
      videoId: "3c-iBn73dDE",
      videoTitle: "DevOps Tutorial for Beginners - Learn DevOps in 7 Hours"
    }
  ]
}

export default function Page() {
  const [showResults, setShowResults] = useState(true)

  if (showResults) {
    return <CareerRoadmapResults results={mockResults} onReset={() => setShowResults(false)} />
  }

  return (
    <div className="cyber-container">
      <div className="cyber-bg">
        <div className="cyber-grid"></div>
        <div className="cyber-particles"></div>
        <div className="cyber-lines"></div>
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <Button onClick={() => setShowResults(true)} className="cyber-btn cyber-btn-primary">
          SHOW CAREER ROADMAP
        </Button>
      </div>
    </div>
  )
}
