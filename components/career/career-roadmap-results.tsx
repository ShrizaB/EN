"use client"
import { useState } from "react"
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
  const [activeSector, setActiveSector] = useState<number | null>(null);

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
  const displaySkills = results.requiredSkills && results.requiredSkills.length > 0 
    ? results.requiredSkills 
    : fallbackSkills;
    
  const displayLocations = results.hiringLocations && results.hiringLocations.length > 0 
    ? results.hiringLocations 
    : fallbackLocations;
    
  const displaySkillResources = results.skillResources && results.skillResources.length > 0 
    ? results.skillResources 
    : fallbackSkillResources;
    
  const displayLocationInsights = results.locationInsights && results.locationInsights.length > 0 
    ? results.locationInsights 
    : fallbackLocationInsights;

  // Debug logging to see what data we have
  console.log('Results data:', {
    requiredSkills: results.requiredSkills,
    hiringLocations: results.hiringLocations,
    skillResources: results.skillResources,
    locationInsights: results.locationInsights
  });
  
  console.log('Display data:', {
    displaySkills,
    displayLocations,
    displaySkillResources,
    displayLocationInsights
  });

  // Defensive: fallback to all if filter is empty or data missing
  // Use original data if filter results in empty array
  const filteredSectors = Array.isArray(results.topSectors) && results.topSectors.length > 0
    ? (results.sector === "both"
        ? results.topSectors
        : (results.topSectors.filter((sector: any) => sector && sector.category && sector.category.toLowerCase() === results.sector?.toLowerCase())
            || results.topSectors)
      )
    : [];

  const filteredCompanies = Array.isArray(results.topCompanies) && results.topCompanies.length > 0
    ? (results.sector === "both"
        ? results.topCompanies
        : (results.topCompanies.filter((company: any) => company && company.sector && company.sector.toLowerCase() === results.sector?.toLowerCase())
            || results.topCompanies)
      )
    : [];

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
          <Button 
            variant="outline" 
            size="sm" 
            className="cyber-btn cyber-btn-outline gap-1"
          >
            <Download className="h-4 w-4" />
            <span className="cyber-text">DOWNLOAD REPORT</span>
          </Button>
        </div>

        <div className="text-center mb-6 cyber-title-section">
          <h2 className="cyber-title-main">
            <span className="cyber-glitch" data-text="YOUR CAREER ROADMAP">YOUR CAREER ROADMAP</span>
          </h2>
          <p className="cyber-subtitle">
            Based on your preferences for {results.jobRole} in the {results.sector} sector
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
                  Your Career Roadmap as a {results.jobRole}
                </h2>
                <p className="cyber-text mb-4 text-sm">
                  Based on your interests and skills, here's a comprehensive career path in the {results.sector} sector.
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
                      SALARY INSIGHTS (PER YEAR)
                    </h3>
                    <div className="space-y-4">
                      <div className="cyber-salary-card cyber-stat-primary">
                        <div className="cyber-salary-label">Average Salary Range</div>
                        <div className="cyber-salary-value">₹{results.averageSalary.toLocaleString()}/year</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="cyber-salary-card cyber-stat-secondary">
                          <div className="cyber-salary-label">Entry Level</div>
                          <div className="cyber-salary-value-sm">₹{results.entrySalary.toLocaleString()}/year</div>
                        </div>
                        <div className="cyber-salary-card cyber-stat-tertiary">
                          <div className="cyber-salary-label">Experienced</div>
                          <div className="cyber-salary-value-sm">₹{results.experiencedSalary.toLocaleString()}/year</div>
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
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.slice(0, Math.min(filteredCompanies.length, 9)).map((company: any, index: number) => (
                      <div
                        key={index}
                        className="cyber-company-card"
                        onClick={() => setSelectedCompany(company)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="cyber-company-avatar">
                            {typeof company === "string" ? company.charAt(0).toUpperCase() : company.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div className="cyber-company-name">
                            {typeof company === "string" ? company : company.name || "Unknown Company"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full cyber-no-data">No company data available.</div>
                  )}
                </div>

                {/* Company Details Modal */}
                {selectedCompany && (
                  <div className="cyber-modal-overlay">
                    <div className="cyber-modal">
                      <button
                        className="cyber-modal-close"
                        onClick={() => setSelectedCompany(null)}
                        aria-label="Close"
                      >
                        <span className="cyber-close-icon">✕</span>
                      </button>
                      <h2 className="cyber-modal-title flex items-center gap-2">
                        <Building className="h-6 w-6 text-cyan-400" />
                        <span className="cyber-company-title">{selectedCompany.name || (typeof selectedCompany === "string" ? selectedCompany : "Unknown")}</span>
                      </h2>
                      
                      <div className="cyber-modal-section">
                        <h3 className="cyber-modal-subtitle">About Company</h3>
                        <div className="cyber-modal-content">
                          {selectedCompany.details && typeof selectedCompany.details === "string" ? (
                            <div className="cyber-company-description">
                              {selectedCompany.details.split("\n").slice(0, 5).map((line: string, i: number) => (
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
                        <h3 className="cyber-modal-subtitle">Salary Information (Per Year)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="cyber-salary-card cyber-salary-entry">
                            <div className="cyber-salary-label">Entry Level</div>
                            <div className="cyber-salary-value">₹{selectedCompany.entrySalary?.toLocaleString() || selectedCompany.entry_level_salary?.toLocaleString?.() || selectedCompany.salaryEntry?.toLocaleString?.() || <span className='cyber-no-data'>Not available</span>}/year</div>
                          </div>
                          <div className="cyber-salary-card cyber-salary-exp">
                            <div className="cyber-salary-label">Experienced</div>
                            <div className="cyber-salary-value">₹{selectedCompany.experiencedSalary?.toLocaleString() || selectedCompany.experienced_salary?.toLocaleString?.() || selectedCompany.salaryExperienced?.toLocaleString?.() || <span className='cyber-no-data'>Not available</span>}/year</div>
                          </div>
                          <div className="cyber-salary-card cyber-salary-avg">
                            <div className="cyber-salary-label">Average</div>
                            <div className="cyber-salary-value">₹{selectedCompany.averageSalary?.toLocaleString() || selectedCompany.average_salary?.toLocaleString?.() || selectedCompany.salaryAverage?.toLocaleString?.() || <span className='cyber-no-data'>Not available</span>}/year</div>
                          </div>
                        </div>
                        {!(selectedCompany.entrySalary || selectedCompany.entry_level_salary || selectedCompany.salaryEntry) &&
                          !(selectedCompany.experiencedSalary || selectedCompany.experienced_salary || selectedCompany.salaryExperienced) &&
                          !(selectedCompany.averageSalary || selectedCompany.average_salary || selectedCompany.salaryAverage) && (
                            <div className="mt-4 cyber-no-data">No salary data available for this company.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                <h3 className="cyber-section-title mb-6">Top Skills Required for {results.jobRole}</h3>
                <div className="mb-4">
                  <p className="text-cyber-blue text-sm">
                    {results.requiredSkills && results.requiredSkills.length > 0 
                      ? `Showing ${results.requiredSkills.length} skills from analysis` 
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
                      <Button variant="outline" size="sm" className="cyber-btn cyber-btn-outline">
                        LEARN MORE
                      </Button>
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
                    {results.hiringLocations && results.hiringLocations.length > 0 
                      ? `Showing ${results.hiringLocations.length} locations from analysis` 
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
                  {results.recommendedVideos?.map((video: any, index: number) => (
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
                <div className="relative">
                  {results.careerPath.map((step: any, index: number) => (
                    <div key={index} className="mb-8 relative cyber-roadmap-step">
                      <div className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className="cyber-step-number">
                            {index + 1}
                          </div>
                          {index < results.careerPath.length - 1 && (
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
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title mb-4">Additional Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.additionalResources.map((resource: any, index: number) => (
                    <div key={index} className="cyber-resource-card">
                      <h4 className="cyber-resource-title">{resource.title}</h4>
                      <p className="cyber-resource-desc">{resource.description}</p>
                      <Button variant="outline" size="sm" className="cyber-btn cyber-btn-outline">
                        EXPLORE
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="role-roadmap" className="space-y-6">
            {results.youtubeApiError && (
              <div className="cyber-error-card">
                <strong>YouTube videos could not be loaded:</strong> {results.youtubeApiError}
                <br />
                <span className="cyber-error-sub">You may have reached the API quota or there is a configuration issue. Video links may be missing or incomplete.</span>
              </div>
            )}

            <Card className="cyber-card">
              <CardContent className="pt-6">
                <h3 className="cyber-section-title mb-6">Learning Roadmap for {results.jobRole}</h3>
                <div className="grid grid-cols-1 gap-8">
                  {results.roleRoadmap?.map((step: any, index: number) => (
                    <div key={index} className="cyber-learning-card">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Video Section */}
                        <div className="cyber-learning-video">
                          {step.videoId ? (
                            <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${step.videoId}`}
                              title={step.videoTitle || step.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <div className="cyber-learning-video-placeholder">
                              <Youtube className="h-12 w-12" />
                            </div>
                          )}
                        </div>
                        {/* Content Section */}
                        <div className="cyber-learning-content md:col-span-2">
                          <div className="cyber-learning-header">
                            <div className="cyber-learning-number">
                              {index + 1}
                            </div>
                            <h4 className="cyber-learning-title">{step.title}</h4>
                          </div>
                          <p className="cyber-learning-desc">{step.description}</p>
                          <div className="cyber-learning-tags">
                            <div className="cyber-learning-tag">
                              <span className="cyber-learning-tag-label">Estimated Time:</span> {step.estimatedTime}
                            </div>
                            {step.videoId && (
                              <a
                                href={`https://www.youtube.com/watch?v=${step.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cyber-learning-youtube-link"
                              >
                                <Youtube className="h-3.5 w-3.5" />
                                <span>Watch on YouTube</span>
                              </a>
                            )}
                          </div>
                          {index < results.roleRoadmap.length - 1 && (
                            <div className="cyber-learning-next">
                              <span>Next:</span>{" "}
                              <span className="cyber-learning-next-title">{results.roleRoadmap[index + 1].title}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
      title: "Learn JavaScript Basics",
      description: "Master the fundamentals of JavaScript programming",
      estimatedTime: "4-6 weeks",
      videoId: "PkZNo7MFNFg"
    },
    {
      title: "React Development",
      description: "Build interactive user interfaces with React",
      estimatedTime: "6-8 weeks",
      videoId: "bMknfKXIFA8"
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
