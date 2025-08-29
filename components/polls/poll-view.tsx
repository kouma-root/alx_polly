"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Vote, Users, Calendar } from "lucide-react"
import { toast } from "sonner"

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

interface PollViewProps {
  poll: Poll
}

export function PollView({ poll }: PollViewProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = async () => {
    if (!selectedOption) {
      toast.error("Please select an option to vote")
      return
    }

    setIsVoting(true)
    
    try {
      // TODO: Implement actual voting logic
      console.log("Voting for option:", selectedOption)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Vote submitted successfully!")
      setHasVoted(true)
    } catch (error) {
      toast.error("Failed to submit vote. Please try again.")
    } finally {
      setIsVoting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    const year = d.getUTCFullYear()
    const month = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" })
    const day = d.getUTCDate()
    return `${month} ${day}, ${year}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{poll.title}</CardTitle>
            <CardDescription className="text-base">
              {poll.description}
            </CardDescription>
          </div>
          <Badge variant={poll.isActive ? "default" : "secondary"}>
            {poll.isActive ? "Active" : "Closed"}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Vote className="h-4 w-4" />
            <span>{poll.totalVotes} total votes</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(poll.createdAt)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {poll.isActive && !hasVoted ? (
          <div className="space-y-4">
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-3"
            >
              {poll.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-base cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={handleVote} 
              disabled={isVoting || !selectedOption}
              className="w-full"
            >
              {isVoting ? "Submitting..." : "Submit Vote"}
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {hasVoted 
                ? "Thank you for voting!" 
                : "This poll is no longer accepting votes."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
