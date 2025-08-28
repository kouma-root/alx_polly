import { NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth/auth-utils"
import { LoginData } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: LoginData = await request.json()
    
    // TODO: Add validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = await authService.login(body)
    
    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}
