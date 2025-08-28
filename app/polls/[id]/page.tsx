import { Metadata } from "next"
import { notFound } from "next/navigation"
import { PollView } from "@/components/polls/poll-view"
import { PollResults } from "@/components/polls/poll-results"

interface PollPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PollPageProps): Promise<Metadata> {
  // TODO: Fetch poll data and generate metadata
  return {
    title: `Poll | Polling App`,
    description: "View and vote on this poll",
  }
}

export default async function PollPage({ params }: PollPageProps) {
  // TODO: Fetch poll data by ID
  const pollId = params.id
  
  // Placeholder - replace with actual data fetching
  const poll = {
    id: pollId,
    title: "Sample Poll",
    description: "This is a sample poll for demonstration purposes.",
    options: [
      { id: "1", text: "Option 1", votes: 10 },
      { id: "2", text: "Option 2", votes: 15 },
      { id: "3", text: "Option 3", votes: 8 },
    ],
    totalVotes: 33,
    isActive: true,
    createdAt: new Date().toISOString(),
  }

  if (!poll) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="space-y-6">
        <PollView poll={poll} />
        <PollResults poll={poll} />
      </div>
    </div>
  )
}
