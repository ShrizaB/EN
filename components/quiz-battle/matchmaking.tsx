"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface QuizBattleMatchmakingProps {
  onMatchFound: (matchData: any) => void
  onCancel: () => void
}

export function QuizBattleMatchmaking({ onCancel }: QuizBattleMatchmakingProps) {
  // Only show loading UI, no fake progress or match found
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <Card className="bg-gray-800/50 border-2 border-cyan-500/30 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-cyan-300 mb-2">Searching for a real opponent...</h2>
            <p className="text-gray-300 mb-4">Waiting for another player to join Quiz Battle.</p>
            <Button onClick={onCancel} variant="outline" className="mt-4">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
