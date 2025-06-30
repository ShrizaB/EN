"use client"

import { useEffect, useState } from "react"
import Editor from "@monaco-editor/react"

interface CodeEditorProps {
  code: string
  language: string
  onChange: (value: string) => void
}

export default function CodeEditor({ code, language, onChange }: CodeEditorProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors with monaco editor
  useEffect(() => {
    setMounted(true)
  }, [])

  const getLanguageId = (lang: string): string => {
    switch (lang.toLowerCase()) {
      case "python":
        return "python"
      case "javascript":
        return "javascript"
      case "java":
        return "java"
      case "c++":
        return "cpp"
      case "c":
        return "c"
      default:
        return "plaintext"
    }
  }

  if (!mounted) {
    return (
      <div className="w-full h-80 border rounded-md bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        height="400px"
        defaultLanguage={getLanguageId(language)}
        defaultValue={code}
        onChange={(value: string | undefined) => onChange(value || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          tabSize: 2,
          automaticLayout: true,
        }}
      />
    </div>
  )
}
