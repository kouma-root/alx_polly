import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { pollService } from "@/lib/db/poll-service"

export async function RecentPolls() {
  let userPolls = []
  
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      userPolls = await pollService.getUserPolls(user.id)
      // Get only the 5 most recent polls
      userPolls = userPolls.slice(0, 5)
    }
  } catch (error) {
    console.error("Error fetching user polls:", error)
    // Return empty array if there's an error
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })
    const day = d.getUTCDate()
    return `${month} ${day}`
  }

  if (userPolls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Polls</CardTitle>
          <CardDescription>
            Your most recent polls and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
              <p className="text-sm">Create your first poll to get started!</p>
            </div>
            <Button asChild>
              <Link href="/polls/create">Create Your First Poll</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
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
          {userPolls.map((poll) => (
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
