import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Vote } from "lucide-react"

// TODO: Replace with actual poll type
interface Poll {
  id: string
  title: string
  description: string
  options: Array<{
    id: string
    text: string
    votes: number
  }>
  totalVotes: number
  isActive: boolean
  createdAt: string
}

interface PollResultsProps {
  poll: Poll
}

export function PollResults({ poll }: PollResultsProps) {
  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5" />
          Poll Results
        </CardTitle>
        <CardDescription>
          Current voting results for this poll
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedOptions.map((option, index) => {
            const percentage = poll.totalVotes > 0 
              ? Math.round((option.votes / poll.totalVotes) * 100) 
              : 0
            
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {option.text}
                    </span>
                    {index === 0 && option.votes > 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Leading
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {option.votes} votes ({percentage}%)
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Votes</span>
              <span className="font-medium">{poll.totalVotes}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
