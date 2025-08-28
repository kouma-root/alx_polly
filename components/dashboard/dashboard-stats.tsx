import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, Users, TrendingUp, Calendar } from "lucide-react"

const stats = [
  {
    title: "Total Polls",
    value: "12",
    description: "Polls you've created",
    icon: Vote,
  },
  {
    title: "Total Votes",
    value: "1,234",
    description: "Votes across all polls",
    icon: Users,
  },
  {
    title: "Active Polls",
    value: "5",
    description: "Currently active polls",
    icon: TrendingUp,
  },
  {
    title: "This Month",
    value: "3",
    description: "Polls created this month",
    icon: Calendar,
  },
]

export function DashboardStats() {
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
