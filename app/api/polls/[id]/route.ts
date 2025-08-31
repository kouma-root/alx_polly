import { NextRequest, NextResponse } from "next/server"
import { pollService } from "@/lib/db/poll-service"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const poll = await pollService.getPollById(id)
    
    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: poll,
    })
  } catch (error) {
    console.error("Get poll error:", error)
    return NextResponse.json(
      { error: "Failed to fetch poll" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    
    if (!body.optionId) {
      return NextResponse.json(
        { error: "Option ID is required" },
        { status: 400 }
      )
    }

    // TODO: Get actual user ID from session
    const userId = "1"
    
    await pollService.vote(id, body.optionId, userId)
    
    return NextResponse.json({
      success: true,
      message: "Vote submitted successfully",
    })
  } catch (error) {
    console.error("Vote error:", error)
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    )
  }
}
