import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const userId = searchParams.get("userId")

    if (!postId || !userId) {
      return NextResponse.json({ error: "Post ID and User ID are required" }, { status: 400 })
    }

    const like = await prisma.forumLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    return NextResponse.json({ isLiked: !!like })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json(
      { error: "Failed to check like status" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { postId, commentId, userId } = await request.json()

    if (!userId || (!postId && !commentId)) {
      return NextResponse.json(
        { error: "User ID and either Post ID or Comment ID are required" },
        { status: 400 }
      )
    }

    // Check if already liked
    let existingLike
    if (postId) {
      existingLike = await prisma.forumLike.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      })
    } else if (commentId) {
      existingLike = await prisma.forumLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      })
    }

    if (existingLike) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 })
    }

    const like = await prisma.forumLike.create({
      data: {
        userId,
        postId,
        commentId,
      },
    })

    return NextResponse.json(like, { status: 201 })
  } catch (error) {
    console.error("Error creating like:", error)
    return NextResponse.json(
      { error: "Failed to create like" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const commentId = searchParams.get("commentId")
    const userId = session.user.id

    if (!userId || (!postId && !commentId)) {
      return NextResponse.json(
        { error: "User ID and either Post ID or Comment ID are required" },
        { status: 400 }
      )
    }

    if (postId) {
      await prisma.forumLike.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      })
    } else if (commentId) {
      await prisma.forumLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting like:", error)
    return NextResponse.json(
      { error: "Failed to delete like" },
      { status: 500 }
    )
  }
}