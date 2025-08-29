"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Users, Calendar } from "lucide-react"

// TODO: Replace with actual poll type
interface Poll {
  id: string
  title: string
  description: string
  totalVotes: number
  isActive: boolean
  createdAt: string
  author: {
    name: string
  }
}

// Placeholder data - replace with actual data fetching
const mockPolls: Poll[] = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see which programming language is most popular among developers.",
    totalVotes: 156,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    author: { name: "John Doe" },
  },
  {
    id: "2",
    title: "Best framework for building web apps",
    description: "Which framework do you prefer for building modern web applications?",
    totalVotes: 89,
    isActive: true,
    createdAt: "2024-01-14T15:30:00Z",
    author: { name: "Jane Smith" },
  },
  {
    id: "3",
    title: "Preferred database for production",
    description: "What database do you use most often in production environments?",
    totalVotes: 234,
    isActive: false,
    createdAt: "2024-01-13T09:15:00Z",
    author: { name: "Mike Johnson" },
  },
]

export function PollsList() {
  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    // Use UTC to be deterministic between server and client
    const year = d.getUTCFullYear()
    const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })
    const day = d.getUTCDate()
    return `${month} ${day}, ${year}`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockPolls.map((poll) => (
        <Card key={poll.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="line-clamp-2">
                  <Link 
                    href={`/polls/${poll.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {poll.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {poll.description}
                </CardDescription>
              </div>
              <Badge variant={poll.isActive ? "default" : "secondary"}>
                {poll.isActive ? "Active" : "Closed"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Vote className="h-4 w-4" />
                  <span>{poll.totalVotes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{poll.author.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(poll.createdAt)}</span>
              </div>
            </div>
            <div className="mt-4">
              <Button asChild className="w-full">
                <Link href={`/polls/${poll.id}`}>
                  {poll.isActive ? "Vote Now" : "View Results"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
