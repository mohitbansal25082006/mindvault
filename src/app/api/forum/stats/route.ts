import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get total users count
    const totalUsers = await prisma.user.count()

    // Get total posts count
    const totalPosts = await prisma.forumPost.count()

    // Get total comments count
    const totalComments = await prisma.forumComment.count()

    return NextResponse.json({
      totalUsers,
      totalPosts,
      totalComments,
    })
  } catch (error) {
    console.error("Error fetching forum stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch forum statistics" },
      { status: 500 }
    )
  }
}