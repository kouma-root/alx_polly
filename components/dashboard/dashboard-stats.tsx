import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, Users, TrendingUp, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { pollService } from "@/lib/db/poll-service"

export async function DashboardStats() {
  let stats = [
    { title: "Total Polls", value: "0", description: "Polls you've created", icon: Vote },
    { title: "Total Votes", value: "0", description: "Votes across all polls", icon: Users },
    { title: "Active Polls", value: "0", description: "Currently active polls", icon: TrendingUp },
    { title: "This Month", value: "0", description: "Polls created this month", icon: Calendar },
  ]

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const userPolls = await pollService.getUserPolls(user.id)
      
      // Calculate total votes across all polls
      let totalVotes = 0
      userPolls.forEach(poll => {
        totalVotes += poll.totalVotes
      })
      
      // Calculate polls created this month
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const pollsThisMonth = userPolls.filter(poll => 
        new Date(poll.createdAt) >= thisMonth
      ).length
      
      // Calculate active polls
      const activePolls = userPolls.filter(poll => poll.isActive).length
      
      stats = [
        { 
          title: "Total Polls", 
          value: userPolls.length.toString(), 
          description: "Polls you've created", 
          icon: Vote 
        },
        { 
          title: "Total Votes", 
          value: totalVotes.toLocaleString(), 
          description: "Votes across all polls", 
          icon: Users 
        },
        { 
          title: "Active Polls", 
          value: activePolls.toString(), 
          description: "Currently active polls", 
          icon: TrendingUp 
        },
        { 
          title: "This Month", 
          value: pollsThisMonth.toString(), 
          description: "Polls created this month", 
          icon: Calendar 
        },
      ]
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Keep default stats if there's an error
  }

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
