import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Users, Calendar } from "lucide-react"
import { pollService } from "@/lib/db/poll-service"

export async function PollsList() {
  let polls = []
  
  try {
    polls = await pollService.getPolls()
  } catch (error) {
    console.error("Error fetching polls:", error)
    // Return empty array if there's an error
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    // Use UTC to be deterministic between server and client
    const year = d.getUTCFullYear()
    const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })
    const day = d.getUTCDate()
    return `${month} ${day}, ${year}`
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
          <p className="text-sm">Be the first to create a poll and get the community voting!</p>
        </div>
        <Button asChild>
          <Link href="/polls/create">Create Your First Poll</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
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
