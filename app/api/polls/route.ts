import { NextRequest, NextResponse } from "next/server"
import { pollService } from "@/lib/db/poll-service"
import { CreatePollData } from "@/lib/types"

export async function GET() {
  try {
    const polls = await pollService.getPolls()
    
    return NextResponse.json({
      success: true,
      data: polls,
    })
  } catch (error) {
    console.error("Get polls error:", error)
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePollData = await request.json()
    
    // TODO: Add validation and get user from session
    if (!body.title || !body.description || !body.options || body.options.length < 2) {
      return NextResponse.json(
        { error: "Title, description, and at least 2 options are required" },
        { status: 400 }
      )
    }

    // TODO: Get actual user ID from session
    const authorId = "1"
    
    const poll = await pollService.createPoll(body, authorId)
    
    return NextResponse.json({
      success: true,
      data: poll,
    })
  } catch (error) {
    console.error("Create poll error:", error)
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    )
  }
}
