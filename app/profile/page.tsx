"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, UserIcon, Mail, Calendar, LogOut, Cake } from "lucide-react"
import { getUserData, updateUserProfile } from "@/lib/user-service"

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const [displayName, setDisplayName] = useState("")
  const [age, setAge] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || "")

      // Fetch additional user data
      const fetchData = async () => {
        const data = await getUserData(user.id)
        if (data) {
          setUserData(data)
          setAge(data.age?.toString() || "")
        }
      }

      fetchData()
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Update profile via API
      await updateUserProfile(displayName, age ? Number.parseInt(age) : undefined)

      setSuccess("Profile updated successfully")
      setIsEditing(false)
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  // If not logged in or loading, show loading state
  if (loading) {
    return (
      <div className="container py-12 md:py-20 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  // If not logged in, redirect to sign in page
  if (!user) {
    router.push("/signin")
    return (
      <div className="container py-12 md:py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Sign in to view your profile</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view and edit your profile.</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <a href="/signin">Sign In</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/signup">Create Account</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-tl from-[#0a0717] via-black to-[#150303] relative overflow-hidden">

      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/c6yZDPN1/Ironman-PNG-Photoroom.png"
              alt="Ultron 1"
              className="opacity-90 w-[300px] fixed top-16 left-10 h-auto scale-x-[-1] drop-shadow-[0_0_40px_#eb403460] animate-glow"
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/WpSMBjDJ/Superman-Flying-HD-PNG-Image-Transparent-photo-4-Free-Download-Photoroom.png"
              alt="Ultron 1"
              className="opacity-90 w-[300px] fixed top-16 right-10 h-auto scale-x-[-1] drop-shadow-[0_0_40px_#001a4d] animate-glow"
            />
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-5"></div>
      </div>

      <div className="absolute -left-20 -top-20 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent text-white">
          HERO PROFILE
        </h1>

        <div className="grid gap-8">
          <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 shadow-2xl shadow-red-900/20 hover:shadow-red-900/30 transition-all duration-300">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-2xl font-bold text-white">HERO DOSSIER</CardTitle>
              <CardDescription className="text-gray-400">Access your classified hero information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription className="text-green-500">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200 group-hover:duration-200"></div>
                  <Avatar className="w-28 h-28 border-2 border-white/10 relative">
                    <AvatarFallback className="text-3xl text-white font-bold bg-transparent">
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "H"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-4 flex-1 mt-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-red-400" />
                      <Label htmlFor="displayName" className="text-gray-300">HERO NAME</Label>
                    </div>
                    {isEditing ? (
                      <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                    ) : (
                      <p className="text-lg font-medium">{user.name || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Cake className="h-4 w-4 text-blue-400" />
                      <Label htmlFor="age" className="text-gray-300">EARTH YEARS</Label>
                    </div>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter your age"
                      />
                    ) : (
                      <p className="text-lg">{userData?.age || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-purple-400" />
                      <Label className="text-gray-300">CONTACT FREQUENCY</Label>
                    </div>
                    <p className="text-lg text-white font-mono">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-yellow-400" />
                      <Label className="text-gray-300">FIRST APPEARANCE</Label>
                    </div>
                    <p className="text-lg text-gray-300">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Classified"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="border-red-600 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
                  >
                    ABORT MISSION
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-bold transition-all"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        UPLOADING...
                      </>
                    ) : (
                      "SECURE PROFILE"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-2 border-red-600 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    LOG OUT
                  </Button>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
                  >
                    ACCESS PROTOCOL
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Hero Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
