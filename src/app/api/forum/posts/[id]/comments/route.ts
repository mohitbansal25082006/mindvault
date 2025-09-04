import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface CommentWithLikeStatus {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    image?: string
  }
  _count: {
    likes: number
  }
  isLiked?: boolean
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = id

    const comments = await prisma.forumComment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    // Check if current user has liked each comment
    const session = await auth()
    if (session?.user?.id) {
      const userId = session.user.id
      
      const commentsWithLikeStatus = await Promise.all(
        comments.map(async (comment) => {
          const like = await prisma.forumLike.findUnique({
            where: {
              userId_commentId: {
                userId,
                commentId: comment.id,
              },
            },
          })
          
          return {
            ...comment,
            isLiked: !!like,
          }
        })
      )
      
      return NextResponse.json(commentsWithLikeStatus)
    }

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const postId = id
    const { content, userId } = await request.json()

    if (!content || !userId) {
      return NextResponse.json(
        { error: "Content and userId are required" },
        { status: 400 }
      )
    }

    // Check if post exists and is not locked
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.isLocked) {
      return NextResponse.json({ error: "Post is locked" }, { status: 403 })
    }

    const comment = await prisma.forumComment.create({
      data: {
        content,
        postId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}