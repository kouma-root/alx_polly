import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Calendar } from "lucide-react"

// Placeholder data - replace with actual data fetching
const recentPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    totalVotes: 156,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Best framework for building web apps",
    totalVotes: 89,
    isActive: true,
    createdAt: "2024-01-14T15:30:00Z",
  },
  {
    id: "3",
    title: "Preferred database for production",
    totalVotes: 234,
    isActive: false,
    createdAt: "2024-01-13T09:15:00Z",
  },
]

export function RecentPolls() {
  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })
    const day = d.getUTCDate()
    return `${month} ${day}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Polls</CardTitle>
        <CardDescription>
          Your most recent polls and their current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPolls.map((poll) => (
            <div
              key={poll.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  <Link 
                    href={`/polls/${poll.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {poll.title}
                  </Link>
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Vote className="h-3 w-3" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(poll.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={poll.isActive ? "default" : "secondary"}>
                  {poll.isActive ? "Active" : "Closed"}
                </Badge>
                <Button asChild size="sm">
                  <Link href={`/polls/${poll.id}`}>
                    {poll.isActive ? "Vote" : "View"}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button asChild variant="outline" className="w-full">
            <Link href="/polls">View All Polls</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
