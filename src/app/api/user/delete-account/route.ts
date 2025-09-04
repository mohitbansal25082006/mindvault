import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

/**
 * POST /api/user/delete-account
 * Body: { password?: string }
 */
export async function POST(request: NextRequest) {
  try {
    console.log("[delete-account] called")

    const session = await auth()
    if (!session?.user?.id) {
      console.warn("[delete-account] no session or user id")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // parse JSON body safely
    let body: any = {}
    try {
      body = await request.json()
    } catch (e) {
      body = {}
    }
    const password = typeof body?.password === "string" ? body.password : undefined
    console.log("[delete-account] body received, hasPasswordProvided:", !!password)

    // Fetch user's hashed password (if any)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user) {
      console.warn("[delete-account] user not found in db:", session.user.id)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userHasPassword = !!user.password
    console.log("[delete-account] userHasPassword:", userHasPassword)

    // If user has a password, require and verify it
    if (userHasPassword) {
      if (!password) {
        console.warn("[delete-account] password required but not provided")
        return NextResponse.json({ error: "Password is required" }, { status: 400 })
      }

      const match = await bcrypt.compare(password, user.password!)
      console.log("[delete-account] password match:", match)
      if (!match) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 400 })
      }
    } else {
      // OAuth user - proceed without password
      console.log("[delete-account] OAuth user, skipping password verification")
    }

    // Delete user -- rely on cascade deletes / prisma relations to remove dependent data
    try {
      await prisma.user.delete({
        where: { id: session.user.id },
      })
      console.log("[delete-account] user deleted successfully:", session.user.id)
    } catch (deleteErr) {
      console.error("[delete-account] error deleting user:", deleteErr)
      return NextResponse.json({ error: "Failed to delete user data" }, { status: 500 })
    }

    // Success
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error("[delete-account] unexpected error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
