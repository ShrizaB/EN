"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Atom, Info, Zap, Sparkles } from "lucide-react";
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
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\d\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n\n/g, "<br/><br/>");
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-block relative">
          <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">Atom Structure</h1>
          <motion.div
            className="absolute -top-6 -right-6 text-yellow-500"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          >
            <Sparkles className="h-8 w-8" />
          </motion.div>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore the building blocks of matter with our interactive 3D atom models!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Element selector sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Atom className="mr-2 h-5 w-5 text-purple-500" />
              Select Element
            </h2>
            <div className="space-y-2">
              {elements.map((element) => (
                <Button
                  key={element.id}
                  variant={selectedElement === element.id ? "default" : "outline"}
                  className={`w-full justify-start ${
                    selectedElement === element.id
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  }`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2">
                      <span className="font-bold text-purple-600 dark:text-purple-400">{element.symbol}</span>
                    </div>
                    <span>{element.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main content area */}
        <div className="lg:col-span-4 space-y-6">
          {/* Visualization tabs */}
          <Tabs defaultValue="bohr" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bohr" className="text-base">
                <Atom className="mr-2 h-5 w-5" />
                Bohr Model
              </TabsTrigger>
              <TabsTrigger value="orbital" className="text-base">
                <Zap className="mr-2 h-5 w-5" />
                3D Orbitals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bohr" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="h-[500px] w-full min-h-[500px] bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                    <AtomVisualization
                      element={elements.find((e) => e.id === selectedElement) || elements[0]}
                      mode="bohr"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orbital" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="h-[500px] w-full min-h-[500px] bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
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
          <Card>
            <CardContent className="p-6">
              {elements.find((e) => e.id === selectedElement) && (
                <div>
                  <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                    {elements.find((e) => e.id === selectedElement)?.name} (
                    {elements.find((e) => e.id === selectedElement)?.symbol})
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg text-center">
                      <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-1">Protons</h3>
                      <p className="text-2xl font-bold">{elements.find((e) => e.id === selectedElement)?.protons}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Positive charge</p>
                    </div>

                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-center">
                      <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-1">Neutrons</h3>
                      <p className="text-2xl font-bold">{elements.find((e) => e.id === selectedElement)?.neutrons}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">No charge</p>
                    </div>

                    <div className="bg-pink-100 dark:bg-pink-900/30 p-4 rounded-lg text-center">
                      <h3 className="font-bold text-pink-600 dark:text-pink-400 mb-1">Electrons</h3>
                      <p className="text-2xl font-bold">{elements.find((e) => e.id === selectedElement)?.electrons}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Negative charge</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-purple-500 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 dark:text-gray-300">
                      Click on any part of the atom in the 3D model to learn more about it. You can rotate the view by
                      dragging, and zoom in/out using the scroll wheel.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Earnings and referrals content */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center">
                <Sparkles className="mr-2 h-6 w-6" />
                Key Concepts
              </h2>

              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3 mt-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5"></div>
                </div>
              ) : (
                <div
                  className="prose dark:prose-invert max-w-none"
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