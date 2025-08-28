import { NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth/auth-utils"
import { RegisterData } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json()
    
    // TODO: Add validation
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      )
    }

    const user = await authService.register(body)
    
    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
