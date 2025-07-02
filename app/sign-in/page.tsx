"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

export default function SignInPage() {
  const { login, signup, error: authError, setError } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("signin")

  // Use either local error or auth context error
  const error = localError || authError

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setLocalError(null)
    setError(null)

    try {
      if (activeTab === "signin") {
        // Handle sign in using auth context
        await login(email, password)
      } else {
        // Handle sign up using auth context
        if (!name || !email || !password || !age) {
          throw new Error("All fields are required")
        }

        await signup(name, email, password, age)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setLocalError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8 bg-gradient-to-tl from-[#0a0717] via-black to-[#150303] [&_input]:focus:ring-0 [&_input]:focus:ring-offset-0 [&_input]:focus:outline-none [&_input]:focus:border-gray-600 [&_input]:focus:shadow-none">

      {/* Background Image with overlay */}
      <div className="absolute inset-0 flex items-center h-full w-full max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src="https://i.postimg.cc/c6yZDPN1/Ironman-PNG-Photoroom.png"
              alt="Ironman"
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
              alt="Superman"
              className="opacity-90 w-[300px] fixed top-16 right-10 h-auto scale-x-[-1] drop-shadow-[0_0_40px_#001a4d] animate-glow"
            />
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md bg-gray-900 backdrop-blur-sm border border-gray-700 shadow-lg transition-shadow duration-300">
        <CardHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-900/50" />
          <CardTitle className="text-3xl font-bold text-center text-white drop-shadow-[0_2px_2px_rgba(255,0,0,0.8)]">
            Welcome to EduNova
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Join the league or assemble your team
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-b border-gray-700">
            <TabsTrigger 
              value="signin" 
              className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-700 transition-all duration-200"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-700 transition-all duration-200"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-900/30 border-red-700 text-white animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignIn}>
              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hero.email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-semibold">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 transition-all duration-200"
                  />
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white font-semibold">Hero Name</Label>
                  <Input
                    id="name"
                    placeholder="Bruce Wayne"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="text-white font-semibold">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="hero.email@marveldc.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-signup" className="text-white font-semibold">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-white font-semibold">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="18"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 transition-all duration-200"
                  />
                </div>
              </TabsContent>

              <CardFooter className="flex justify-center pt-6 px-0">
                <Button 
                  type="submit" 
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all duration-300 transform hover:scale-105 border border-gray-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Activating Hero Mode
                    </>
                  ) : activeTab === "signin" ? (
                    "Join the Mission"
                  ) : (
                    "Become a Hero"
                  )}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Tabs>
      </Card>
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  )
}