// Dashboard service to ensure pie chart data is available

import { getAllLearningHistory, type LearningHistory } from "./learning-history-service"
import { getUserData, logActivity, type UserProgress, type UserStats } from "./user-service"

// Define the extended learning history type with normalized subject
export interface NormalizedLearningHistory extends LearningHistory {
  normalizedSubject?: string;
}

// Store the latest dashboard data in memory
let cachedChartData: any[] = []
let lastFetchTime = 0
let appUsageTime = 0
let lastActivityTime = Date.now()
let isLoading = false
let totalLearningTime = 0

// Dark theme configuration
export const darkTheme = {
  backgroundColor: "#121212",
  cardBackgroundColor: "#1e1e1e",
  textColor: "#ffffff",
  secondaryTextColor: "#a0a0a0",
  borderColor: "#333333",
  chartBackgroundColor: "#1e1e1e",
  accentColor: "#6366f1",
  errorColor: "#f87171",
  successColor: "#34d399",
  warningColor: "#fbbf24",
  shadowColor: "rgba(0, 0, 0, 0.5)",
}

// Enable dark theme for the dashboard
export function enableDarkTheme(): void {
  if (typeof window !== "undefined") {
    try {
      // Add a class to the body to enable dark theme
      document.body.classList.add("dark-theme");
      
      // Store the preference in localStorage
      localStorage.setItem("theme", "dark");
      
      // Apply dark theme styles
      const style = document.createElement("style");
      style.textContent = `
        .dark-theme {
          background-color: ${darkTheme.backgroundColor};
          color: ${darkTheme.textColor};
        }
        .dark-theme .dashboard-card {
          background-color: ${darkTheme.cardBackgroundColor};
          border-color: ${darkTheme.borderColor};
          box-shadow: 0 4px 6px ${darkTheme.shadowColor};
        }
        .dark-theme .dashboard-header {
          color: ${darkTheme.textColor};
        }
        .dark-theme .dashboard-text {
          color: ${darkTheme.textColor};
        }
        .dark-theme .dashboard-secondary-text {
          color: ${darkTheme.secondaryTextColor};
        }
      `;
      document.head.appendChild(style);
      
      console.log("Dark theme enabled");
    } catch (error) {
      console.error("Error enabling dark theme:", error);
    }
  }
}

// Track app usage time
export function trackAppUsageTime(): void {
  if (typeof window !== "undefined") {
    try {
      // Load saved learning time from localStorage
      const savedTime = localStorage.getItem("totalLearningTime");
      if (savedTime) {
        totalLearningTime = parseFloat(savedTime);
        console.log("Loaded saved learning time:", totalLearningTime);
      }
      
      // Update the last activity time
      const updateActivity = () => {
        lastActivityTime = Date.now();
        calculateTimeSpent(); // Call immediately for instant feedback
      };
      
      // Calculate time spent when user is active
      const calculateTimeSpent = () => {
        const now = Date.now();
        const timeSpent = (now - lastActivityTime) / 1000; // Convert to seconds
        
        // Only count reasonable time increments (less than 5 minutes of inactivity)
        if (timeSpent < 300) {
          appUsageTime += timeSpent;
          totalLearningTime += timeSpent;
          
          // Save to localStorage every minute
          localStorage.setItem("totalLearningTime", totalLearningTime.toString());
          
          // Dispatch event to update UI
          window.dispatchEvent(new CustomEvent("learning-time-updated", { 
            detail: { 
              appUsageTime: getAppUsageTime(),
              totalLearningTime: getTotalLearningTime() 
            } 
          }));
        }
        
        lastActivityTime = now;
      };
      
      // Set up event listeners for user activity
      ["click", "mousemove", "keypress", "scroll", "touchstart"].forEach(event => {
        window.addEventListener(event, updateActivity);
      });
      
      // Update time spent every 30 seconds
      setInterval(calculateTimeSpent, 30000);
      
      // Also sync from the user's stats when available (to ensure data consistency)
      const syncTimeFromUserStats = async () => {
        try {
          const userData = await getUserData("current");
          if (userData && userData.stats && userData.stats.totalTimeSpent) {
            // If server has more time than local, update local
            if (userData.stats.totalTimeSpent > totalLearningTime) {
              totalLearningTime = userData.stats.totalTimeSpent;
              localStorage.setItem("totalLearningTime", totalLearningTime.toString());
              console.log("Updated local learning time from user stats:", totalLearningTime);
            } 
            // If local has more time, consider logging the extra time as an activity
            else if (totalLearningTime > userData.stats.totalTimeSpent + 60) { // Only if difference is significant (>1 min)
              const extraTime = totalLearningTime - userData.stats.totalTimeSpent;
              console.log("Local time ahead of server by:", extraTime, "seconds");
              // Log the additional time as an activity
              if (userData.id) {
                await logActivity(userData.id, {
                  type: "session",
                  timeSpent: extraTime,
                  subject: "general",
                  topic: "dashboard"
                });
                console.log("Logged extra time activity");
              }
            }
          }
        } catch (error) {
          console.error("Error syncing time from user stats:", error);
        }
      };
      
      // Sync with server every 2 minutes
      setTimeout(() => {
        syncTimeFromUserStats();
        setInterval(syncTimeFromUserStats, 120000);
      }, 3000); // Initial delay of 3 seconds to ensure auth is loaded
      
      console.log("App usage tracking initialized");
    } catch (error) {
      console.error("Error tracking app usage time:", error);
    }
  }
}

// Get app usage time in formatted string (HH:MM:SS)
export function getAppUsageTime(): string {
  const hours = Math.floor(appUsageTime / 3600);
  const minutes = Math.floor((appUsageTime % 3600) / 60);
  const seconds = Math.floor(appUsageTime % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Get total learning time in formatted string (HH:MM:SS)
export function getTotalLearningTime(): string {
  const hours = Math.floor(totalLearningTime / 3600);
  const minutes = Math.floor((totalLearningTime % 3600) / 60);
  const seconds = Math.floor(totalLearningTime % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Force refresh the dashboard data
export async function forceDashboardRefresh(): Promise<void> {
  try {
    console.log("🔄 FORCE REFRESHING DASHBOARD DATA");

    // Clear the cache
    cachedChartData = [];

    // If we're in the browser, dispatch events to refresh the UI
    if (typeof window !== "undefined") {
      // Dispatch multiple events to ensure the dashboard updates
      window.dispatchEvent(new CustomEvent("learning-history-updated"));
      window.dispatchEvent(new CustomEvent("force-dashboard-refresh"));

      // Try to find and click the refresh button
      setTimeout(() => {
        try {
          const refreshButtons = document.querySelectorAll('button[title="Refresh dashboard data"]');
          if (refreshButtons.length > 0) {
            console.log("Found dashboard refresh button, clicking it");
            (refreshButtons[0] as HTMLElement).click();
          }
        } catch (error) {
          console.error("Error trying to click refresh button:", error);
        }
      }, 300);

      // If we're on the dashboard page, refresh via event
      if (window.location.pathname.includes("/dashboard")) {
        console.log("On dashboard page, requesting data refresh");
        window.dispatchEvent(new CustomEvent("dashboard-data-refresh-requested"));
      }
    }
  } catch (error) {
    console.error("Error forcing dashboard refresh:", error);
  }
}

// Get chart data for the dashboard
export async function getDashboardChartData(userId: string): Promise<any[]> {
  try {
    // Set loading state
    const wasLoading = isLoading;
    isLoading = true;
    
    if (typeof window !== "undefined" && !wasLoading) {
      // Notify UI about loading state
      window.dispatchEvent(new CustomEvent("dashboard-loading", { detail: { isLoading: true } }));
    }
  
    // If we have cached data that's less than 20 seconds old, use it (increased to reduce lagging)
    const now = Date.now();
    if (cachedChartData.length > 0 && now - lastFetchTime < 20000) {
      console.log("Using cached chart data:", cachedChartData.length, "items");
      isLoading = false;
      
      if (typeof window !== "undefined") {
        // Notify UI that loading is complete
        window.dispatchEvent(new CustomEvent("dashboard-loading", { detail: { isLoading: false } }));
      }
      
      return cachedChartData;
    }

    console.log("🔍 Fetching fresh dashboard chart data for user:", userId);

    // Add timestamp to prevent caching
    const timestamp = Date.now();

    // Catch potential fetch errors and provide a fallback
    let history: NormalizedLearningHistory[] = [];
    try {
      // Fetch learning history with cache busting
      history = await getAllLearningHistory(`nocache=${timestamp}`) as NormalizedLearningHistory[];
      console.log("📊 Learning history fetched:", history?.length || 0, "items");
    } catch (fetchError) {
      console.error("Error fetching learning history:", fetchError);
      // If we have cached data, return it rather than failing completely
      if (cachedChartData.length > 0) {
        isLoading = false;
        
        if (typeof window !== "undefined") {
          // Notify UI that loading is complete
          window.dispatchEvent(new CustomEvent("dashboard-loading", { detail: { isLoading: false } }));
        }
        
        return cachedChartData;
      }
    }

    // Debug the learning history data
    if (history && history.length > 0) {
      console.log(
        "📋 First few history items:",
        history.slice(0, 3).map((item) => ({
          subject: item.subject,
          topic: item.topic,
          progress: item.progress,
        })),
      );
    } else {
      console.log("⚠️ No learning history found");
    }

    // Process learning history to count activities by subject
    const activityCountBySubject: Record<string, number> = {};
    const uniqueTopics = new Set<string>();

    // Process each history item
    history.forEach((item: NormalizedLearningHistory) => {
      if (!item || !item.subject || !item.topic) {
        console.log("⚠️ Skipping invalid history item:", item);
        return;
      }

      // Normalize the subject name and add it to the item
      let subject = item.subject.toLowerCase().trim();

      // Handle common variations
      if (subject.includes("math")) subject = "math";
      if (subject.includes("science")) subject = "science";
      if (subject.includes("read")) subject = "reading";
      if (subject.includes("cod") || subject.includes("program")) subject = "coding";
      
      // Store the normalized subject in the item
      item.normalizedSubject = subject;

      const key = `${subject}-${item.topic}`;
      console.log(`Processing activity: ${subject} - ${item.topic}`);

      // Only count each unique topic once
      if (!uniqueTopics.has(key)) {
        uniqueTopics.add(key);
        activityCountBySubject[subject] = (activityCountBySubject[subject] || 0) + 1;
        console.log(`Added activity for subject: ${subject}, count now: ${activityCountBySubject[subject]}`);
      }
    });

    // If we have no activities from history, try to get them from user progress
    if (Object.keys(activityCountBySubject).length === 0) {
      console.log("⚠️ No activities found in history, trying user progress");

      // Fetch user data
      const userData = await getUserData(userId);

      if (userData && userData.progress) {
        Object.entries(userData.progress).forEach(([subject, progress]) => {
          if (progress > 0) {
            const normalizedSubject = subject.toLowerCase().trim();
            activityCountBySubject[normalizedSubject] = 1;
            console.log(`Added activity from progress for subject: ${normalizedSubject}`);
          }
        });
      }
    }

    // Calculate total activities
    const totalActivities = Object.values(activityCountBySubject).reduce((sum, count) => sum + count, 0);
    console.log("Total activities:", totalActivities);

    // Use a single color palette for dark theme (mostly grays with one accent)
    const darkThemeColor = "#6366f1"; // Main accent color
    
    // Monochromatic gray shades for dark theme
    const grayShades = [
      "#4B5563", // Gray 600
      "#6B7280", // Gray 500
      "#9CA3AF", // Gray 400
      "#D1D5DB", // Gray 300
      "#E5E7EB", // Gray 200
      "#F3F4F6", // Gray 100
    ];

    // Prepare data for pie chart - use monochromatic theme
    const chartData = Object.entries(activityCountBySubject)
      .filter(([_, count]) => count > 0) // Only include subjects with activities
      .map(([key, count], index) => {
        // Calculate percentage of total activities
        const percentage = totalActivities > 0 ? Math.round((count / totalActivities) * 100) : 0;

        // Find the display name for this subject
        let displayName = key.charAt(0).toUpperCase() + key.slice(1);
        
        // Use a single color with varying opacity for dark theme
        const colorIndex = index % grayShades.length;
        const color = index === 0 ? darkThemeColor : grayShades[colorIndex];

        // Add styling properties for better visibility
        return {
          name: displayName,
          value: percentage,
          count: count,
          color: color,
          // Dark theme styling
          textColor: "#ffffff",
          fontWeight: "600",
          fontSize: "16px", // Increased font size
          animationDuration: 800,
          stroke: darkTheme.backgroundColor,
          strokeWidth: 2,
          shadowColor: darkTheme.shadowColor,
          shadowBlur: 10,
          labelOffset: 20,
          // Add specific styling for dark theme
          darkTheme: true
        };
      });

    console.log("📊 Chart data prepared:", chartData);

    // Cache the chart data
    cachedChartData = chartData;
    lastFetchTime = now;
    
    // Update loading state
    isLoading = false;
    
    if (typeof window !== "undefined") {
      // Notify UI that loading is complete
      window.dispatchEvent(new CustomEvent("dashboard-loading", { detail: { isLoading: false } }));
    }

    return chartData;
  } catch (error) {
    console.error("Error getting dashboard chart data:", error);
    // Reset loading state
    isLoading = false;
    
    if (typeof window !== "undefined") {
      // Notify UI that loading is complete, even with error
      window.dispatchEvent(new CustomEvent("dashboard-loading", { detail: { isLoading: false } }));
    }
    
    // Return cached data if available, empty array otherwise
    return cachedChartData.length > 0 ? cachedChartData : [];
  }
}

// Check if a fetch is in progress
export function isLoadingDashboard(): boolean {
  return isLoading;
}

// Call this after completing any activity
export function notifyActivityCompletion(subject: string, topic: string): void {
  console.log(`🎯 Activity completed: ${subject} - ${topic}`);

  // Clear the cache to force a refresh
  cachedChartData = [];

  // Force a dashboard refresh
  forceDashboardRefresh();
}

// Initialize on import
if (typeof window !== "undefined") {
  // Initialize app usage tracking
  trackAppUsageTime();
  
  // Initialize dark theme
  enableDarkTheme();
  
  // Set up loading indicator
  window.addEventListener("dashboard-loading", (event: any) => {
    try {
      const loadingIndicator = document.getElementById("dashboard-loading-indicator");
      if (loadingIndicator) {
        loadingIndicator.style.display = event.detail.isLoading ? "block" : "none";
      }
    } catch (error) {
      console.error("Error handling loading event:", error);
    }
  });
}
