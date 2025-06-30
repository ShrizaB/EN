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
import { ArrowLeft, Download, Briefcase, Building, GraduationCap, MapPin, DollarSign, Youtube } from "lucide-react"

interface CareerRoadmapResultsProps {
  results: any
  onReset: () => void
}

export function CareerRoadmapResults({ results, onReset }: CareerRoadmapResultsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null)

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

  // Colors for charts
  const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]
  const CHART_BACKGROUND = "white"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={onReset} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Your Career Roadmap</h2>
        <p className="text-muted-foreground">
          Based on your preferences for {results.jobRole} in the {results.sector} sector
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Required Skills</TabsTrigger>
          <TabsTrigger value="locations">Hiring Locations</TabsTrigger>
          <TabsTrigger value="videos">Learning Videos</TabsTrigger>
          <TabsTrigger value="roadmap">Career Path</TabsTrigger>
          <TabsTrigger value="role-roadmap">Role Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-indigo-500" />
                    Top Hiring Sectors
                  </h3>
                  <div className="h-[250px] bg-white dark:bg-gray-800 p-4 rounded-lg">
                    {filteredSectors.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={filteredSectors}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="percentage"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {filteredSectors.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center text-muted-foreground py-12">No sector data available.</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-indigo-500" />
                    Salary Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Average Salary Range</div>
                      <div className="text-2xl font-bold">₹{results.averageSalary.toLocaleString()}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Entry Level</div>
                        <div className="text-xl font-bold">₹{results.entrySalary.toLocaleString()}</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Experienced</div>
                        <div className="text-xl font-bold">₹{results.experiencedSalary.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-500" />
                Top Companies Hiring
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.slice(0, Math.max(6, Math.min(filteredCompanies.length, 10))).map((company: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col gap-2 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition"
                      onClick={() => setSelectedCompany(company)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold">
                          {typeof company === "string" ? company.charAt(0) : company.name?.charAt(0) || "?"}
                        </div>
                        <div className="font-medium text-lg">{typeof company === "string" ? company : company.name || "Unknown"}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-muted-foreground py-12">No company data available.</div>
                )}
              </div>

              {/* Company Details Modal */}
              {selectedCompany && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full p-8 relative animate-fade-in">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold"
                      onClick={() => setSelectedCompany(null)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h2 className="text-2xl font-bold mb-2 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                      <Building className="h-6 w-6" />
                      {selectedCompany.name || (typeof selectedCompany === "string" ? selectedCompany : "Unknown")}
                    </h2>
                    <div className="mb-4 text-gray-700 dark:text-gray-200 text-base">
                      {/* Show up to 5 lines of details, fallback to user-friendly message if missing */}
                      {selectedCompany.details && typeof selectedCompany.details === "string" ? (
                        <>
                          {selectedCompany.details.split("\n").slice(0, 5).map((line: string, i: number) => (
                            <div key={i}>{line}</div>
                          ))}
                        </>
                      ) : selectedCompany.description ? (
                        <div>{selectedCompany.description}</div>
                      ) : (
                        <div className="text-muted-foreground italic">No details available for this company yet.</div>
                        // <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 text-xs text-red-500">{JSON.stringify(selectedCompany, null, 2)}</pre>
                      )}
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-1">Top 10 Facilities:</h4>
                      <ul className="list-disc pl-6 text-sm text-gray-600 dark:text-gray-300">
                        {Array.isArray(selectedCompany.facilities) && selectedCompany.facilities.length > 0 ? (
                          selectedCompany.facilities.slice(0, 10).map((facility: string, i: number) => (
                            <li key={i}>{facility}</li>
                          ))
                        ) : selectedCompany.facility ? (
                          <li>{selectedCompany.facility}</li>
                        ) : (
                          <li className="text-muted-foreground italic">No facility data available for this company.</li>
                          // <li className="text-xs text-red-500"><pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">{JSON.stringify(selectedCompany, null, 2)}</pre></li>
                        )}
                      </ul>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mt-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Entry Level</div>
                        <div className="font-bold text-lg">₹{selectedCompany.entrySalary?.toLocaleString() || selectedCompany.entry_level_salary?.toLocaleString?.() || selectedCompany.salaryEntry?.toLocaleString?.() || <span className='text-muted-foreground'>Not available</span>}</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Experienced</div>
                        <div className="font-bold text-lg">₹{selectedCompany.experiencedSalary?.toLocaleString() || selectedCompany.experienced_salary?.toLocaleString?.() || selectedCompany.salaryExperienced?.toLocaleString?.() || <span className='text-muted-foreground'>Not available</span>}</div>
                      </div>
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Average</div>
                        <div className="font-bold text-lg">₹{selectedCompany.averageSalary?.toLocaleString() || selectedCompany.average_salary?.toLocaleString?.() || selectedCompany.salaryAverage?.toLocaleString?.() || <span className='text-muted-foreground'>Not available</span>}</div>
                      </div>
                    </div>
                    {/* User-friendly fallback for missing salary data */}
                    {!(selectedCompany.entrySalary || selectedCompany.entry_level_salary || selectedCompany.salaryEntry) &&
                      !(selectedCompany.experiencedSalary || selectedCompany.experienced_salary || selectedCompany.salaryExperienced) &&
                      !(selectedCompany.averageSalary || selectedCompany.average_salary || selectedCompany.salaryAverage) && (
                        <div className="mt-4 text-muted-foreground italic">No salary data available for this company.</div>
                        // <div className="mt-4 text-xs text-red-500"><pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">{JSON.stringify(selectedCompany, null, 2)}</pre></div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                Additional Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mt-0.5">
                      <span className="text-indigo-600 dark:text-indigo-400 text-sm">✓</span>
                    </div>
                    <div>{benefit}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6">Top Skills Required for {results.jobRole}</h3>
              <div className="h-[400px] bg-white dark:bg-gray-800 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={results.requiredSkills.map((skill: any, index: number) => ({
                      name: typeof skill === "string" ? skill : skill.name,
                      value: typeof skill === "string" ? 100 - index * 10 : skill.importance,
                    }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {results.requiredSkills.map((skill: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Skill Development Resources</h3>
              <div className="space-y-4">
                {results.skillResources.map((resource: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    <Button variant="outline" size="sm" className="text-indigo-600">
                      Learn More
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-500" />
                Top Hiring Locations
              </h3>
              <div className="h-[400px] bg-white dark:bg-gray-800 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={results.hiringLocations.map((location: any, index: number) => ({
                      name: typeof location === "string" ? location : location.name,
                      value: typeof location === "string" ? 100 - index * 15 : location.percentage,
                    }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {results.hiringLocations.map((location: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Location Insights</h3>
              <div className="space-y-4">
                {results.locationInsights.map((insight: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{insight.location}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Average Salary: ₹{insight.averageSalary.toLocaleString()}</span>
                      <span>Cost of Living: {insight.costOfLiving}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Youtube className="h-5 w-5 text-indigo-500" />
                Recommended Learning Videos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.recommendedVideos?.map((video: any, index: number) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Youtube className="h-12 w-12 text-indigo-500" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">{video.title}</div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-2">{video.topic}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                      <Button variant="outline" size="sm" className="text-indigo-600">
                        Watch Video
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6">Your Career Path Roadmap</h3>
              <div className="relative">
                {results.careerPath.map((step: any, index: number) => (
                  <div key={index} className="mb-8 relative">
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-10 w-10 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold">
                          {index + 1}
                        </div>
                        {index < results.careerPath.length - 1 && (
                          <div className="h-full w-0.5 bg-indigo-200 dark:bg-indigo-800 my-2"></div>
                        )}
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border-2 border-indigo-100 dark:border-indigo-900 flex-1">
                        <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                        <p className="text-muted-foreground mb-3">{step.description}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded">
                            <span className="font-medium">Timeline:</span> {step.timeline}
                          </div>
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded">
                            <span className="font-medium">Salary Range:</span> ₹{step.salaryRange}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Additional Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.additionalResources.map((resource: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                    <Button variant="outline" size="sm" className="text-indigo-600">
                      Explore
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="role-roadmap" className="space-y-6">
          {results.youtubeApiError && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-4 mb-4 text-center">
              <strong>YouTube videos could not be loaded:</strong> {results.youtubeApiError}
              <br />
              <span className="text-xs">You may have reached the API quota or there is a configuration issue. Video links may be missing or incomplete.</span>
            </div>
          )}

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6">Learning Roadmap for {results.jobRole}</h3>
              <div className="grid grid-cols-1 gap-8">
                {results.roleRoadmap?.map((step: any, index: number) => (
                  <div key={index} className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Video Section */}
                      <div className="aspect-video bg-gray-100 dark:bg-gray-900 relative">
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
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Youtube className="h-12 w-12 text-indigo-500" />
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-5 md:col-span-2">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="rounded-full h-8 w-8 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold">
                            {index + 1}
                          </div>
                          <h4 className="font-bold text-lg">{step.title}</h4>
                        </div>

                        <p className="text-muted-foreground mb-4">{step.description}</p>

                        <div className="flex flex-wrap gap-3">
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full text-sm">
                            <span className="font-medium">Estimated Time:</span> {step.estimatedTime}
                          </div>

                          {step.videoId && (
                            <a
                              href={`https://www.youtube.com/watch?v=${step.videoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                              <Youtube className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                              <span>Watch on YouTube</span>
                            </a>
                          )}
                        </div>

                        {index < results.roleRoadmap.length - 1 && (
                          <div className="mt-4 pt-4 border-t border-dashed flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Next:</span>{" "}
                            <span className="font-medium">{results.roleRoadmap[index + 1].title}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Tips for Effective Learning</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Practice Regularly</h4>
                  <p className="text-sm text-muted-foreground">
                    Consistent practice is key to mastering new skills. Try to dedicate at least 1-2 hours daily.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Build Projects</h4>
                  <p className="text-sm text-muted-foreground">
                    Apply what you learn by building real projects. This reinforces concepts and builds your portfolio.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Join Communities</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with others learning the same skills. Online forums and local meetups can provide support
                    and insights.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Track Your Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep a learning journal to document your progress, challenges, and achievements along the way.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
