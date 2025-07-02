"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Atom, Info, Zap } from "lucide-react";
import { AtomVisualization } from "@/components/visuals/atom-visualization";
import { generateContent } from "@/lib/gemini-api";

export default function AtomStructurePage() {
  const [activeTab, setActiveTab] = useState("bohr");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedElement, setSelectedElement] = useState("hydrogen");

  const elements = [
    { id: "hydrogen", name: "Hydrogen", symbol: "H", protons: 1, neutrons: 0, electrons: 1 },
    { id: "helium", name: "Helium", symbol: "He", protons: 2, neutrons: 2, electrons: 2 },
    { id: "lithium", name: "Lithium", symbol: "Li", protons: 3, neutrons: 4, electrons: 3 },
    { id: "carbon", name: "Carbon", symbol: "C", protons: 6, neutrons: 6, electrons: 6 },
    { id: "oxygen", name: "Oxygen", symbol: "O", protons: 8, neutrons: 8, electrons: 8 },
  ];

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const prompt = `Explain the structure of an atom in simple terms for a child learning about the Bohr model. 
        Include information about:
        1. What is an atom?
        2. What are protons, neutrons, and electrons?
        3. How do electrons orbit around the nucleus?
        4. Why is the Bohr model important?
        
        Keep it educational, engaging, and easy to understand for children. Format with markdown headings and bullet points.`;

        const generatedContent = await generateContent(prompt);
        setContent(generatedContent);
      } catch (error) {
        console.error("Error fetching content:", error);
        setContent("Sorry, we couldn't load the content right now. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const formatContent = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-3 text-indigo-300">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2 text-indigo-200">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-3 mb-1 text-indigo-100">$1</h3>')
      .replace(/^\* (.*$)/gm, '<li class="ml-6 list-disc text-gray-300">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc text-gray-300">$1</li>')
      .replace(/^\d\. (.*$)/gm, '<li class="ml-6 list-decimal text-gray-300">$1</li>')
      .replace(/\n\n/g, "<br/><br/>");
  };

  return (
    <div className="container px-6 py-10 mx-auto mt-16 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      <div className="text-center mb-10 animate-fadeInUp">
        <div className="inline-block relative">
          <h1 className="text-5xl font-extrabold text-indigo-400 tracking-tight mb-4 relative">
            Atom Structure
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          </h1>
        </div>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
          Discover the building blocks of the universe with our stunning 3D atom visualizations!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Element selector sidebar */}
        <Card className="lg:col-span-1 h-fit bg-gray-800/80 border-none shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-5 text-indigo-300 flex items-center">
              <Atom className="mr-2 h-6 w-6 text-indigo-400" />
              Select Element
            </h2>
            <div className="space-y-3">
              {elements.map((element) => (
                <Button
                  key={element.id}
                  variant={selectedElement === element.id ? "default" : "outline"}
                  className={`w-full justify-start text-left transition-all duration-300 ${
                    selectedElement === element.id
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-indigo-900/50 hover:text-indigo-300"
                  } rounded-lg py-3`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-900/50 flex items-center justify-center mr-3 border border-indigo-500/30">
                      <span className="font-bold text-indigo-400">{element.symbol}</span>
                    </div>
                    <span className="font-medium">{element.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main content area */}
        <div className="lg:col-span-4 space-y-8">
          {/* Visualization tabs */}
          <Tabs defaultValue="bohr" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700 rounded-xs p-1 items-center">
              <TabsTrigger
                value="bohr"
                className={`text-base font-medium transition-all duration-300 rounded-xs ${
                    activeTab === "bohr"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-gray-700/50 hover:text-indigo-300"
                  }`}
              >
                <Atom className="mr-2 h-5 w-5" />
                Bohr Model
              </TabsTrigger>
              <TabsTrigger
                value="orbital"
                className={`text-base font-medium transition-all duration-300 rounded-xs ${
                    activeTab === "orbital"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-gray-700/50 hover:text-indigo-300"
                  }`}
              >
                <Zap className="mr-2 h-5 w-5" />
                3D Orbitals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bohr" className="mt-6">
              <Card className="bg-gray-800/80 border-none shadow-xl">
                <CardContent className="p-0">
                  <div className="h-[500px] w-full min-h-[500px] bg-gradient-to-br from-gray-900 to-indigo-950 rounded-lg overflow-hidden">
                    <AtomVisualization
                      element={elements.find((e) => e.id === selectedElement) || elements[0]}
                      mode="bohr"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orbital" className="mt-6">
              <Card className="bg-gray-800/80 border-none shadow-xl">
                <CardContent className="p-0">
                  <div className="h-[500px] w-full min-h-[500px] bg-gradient-to-br from-gray-900 to-blue-950 rounded-lg overflow-hidden">
                    <AtomVisualization
                      element={elements.find((e) => e.id === selectedElement) || elements[0]}
                      mode="orbital"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Element details */}
          <Card className="bg-gray-800/80 border-none shadow-lg">
            <CardContent className="p-8">
              {elements.find((e) => e.id === selectedElement) && (
                <div>
                  <h2 className="text-3xl font-bold text-indigo-400 mb-6 tracking-tight">
                    {elements.find((e) => e.id === selectedElement)?.name} (
                    {elements.find((e) => e.id === selectedElement)?.symbol})
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-900/50 p-6 rounded-xl text-center border border-indigo-500/30 transition-transform hover:scale-105">
                      <h3 className="font-semibold text-indigo-300 mb-2">Protons</h3>
                      <p className="text-3xl font-bold text-white">{elements.find((e) => e.id === selectedElement)?.protons}</p>
                      <p className="text-sm text-gray-400">Positive charge</p>
                    </div>

                    <div className="bg-gray-900/50 p-6 rounded-xl text-center border border-blue-500/30 transition-transform hover:scale-105">
                      <h3 className="font-semibold text-blue-300 mb-2">Neutrons</h3>
                      <p className="text-3xl font-bold text-white">{elements.find((e) => e.id === selectedElement)?.neutrons}</p>
                      <p className="text-sm text-gray-400">No charge</p>
                    </div>

                    <div className="bg-gray-900/50 p-6 rounded-xl text-center border border-pink-500/30 transition-transform hover:scale-105">
                      <h3 className="font-semibold text-pink-300 mb-2">Electrons</h3>
                      <p className="text-3xl font-bold text-white">{elements.find((e) => e.id === selectedElement)?.electrons}</p>
                      <p className="text-sm text-gray-400">Negative charge</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Info className="h-6 w-6 text-indigo-400 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300 text-base">
                      Interact with the 3D model by clicking on atom parts to learn more. Rotate by dragging and zoom with the scroll wheel.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Earnings and referrals content */}
          <Card className="bg-gray-800/80 border-none shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-indigo-400 mb-6 tracking-tight flex items-center">
                Key Concepts
              </h2>

              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-6 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-full"></div>
                  <div className="h-6 bg-gray-700/50 rounded animate-pulse w-2/3 mt-4"></div>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-700/50 rounded animate-pulse w-4/5"></div>
                </div>
              ) : (
                <div
                  className="prose dark:prose-invert max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: formatContent(content) }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}