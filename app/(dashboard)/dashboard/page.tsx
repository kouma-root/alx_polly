import { Metadata } from "next"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentPolls } from "@/components/dashboard/recent-polls"
import { CreatePollButton } from "@/components/dashboard/create-poll-button"

export const metadata: Metadata = {
  title: "Dashboard | Polling App",
  description: "Manage your polls and view your activity",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DashboardHeader
        heading="Dashboard"
        text="Welcome back! Here's an overview of your polls and activity."
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentPolls />
        </div>
        <div className="col-span-3">
          <CreatePollButton />
        </div>
      </div>
    </div>
  )
}
