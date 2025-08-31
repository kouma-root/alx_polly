import { Metadata } from "next"
import { CreatePollForm } from "@/components/polls/create-poll-form"
import { ProtectedRoute } from "@/components/auth/protected-route"

export const metadata: Metadata = {
  title: "Create Poll | Polling App",
  description: "Create a new poll to gather opinions from the community",
}

export default function CreatePollPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create a New Poll</h1>
            <p className="text-muted-foreground">
              Create a poll to gather opinions and make decisions together
            </p>
          </div>
          
          <CreatePollForm />
        </div>
      </div>
    </ProtectedRoute>
  )
}
