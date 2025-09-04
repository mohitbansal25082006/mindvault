import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = id

    await prisma.forumPost.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    )
  }
}