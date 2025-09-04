import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const my = searchParams.get("my") === "true"
    const unanswered = searchParams.get("unanswered") === "true"
    const categoryId = searchParams.get("categoryId")
    const sort = searchParams.get("sort") || "latest"
    const q = searchParams.get("q")

    const whereClause: Prisma.ForumPostWhereInput = {}

    if (my) {
      const session = await auth()
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      whereClause.userId = session.user.id
    }

    if (categoryId && categoryId !== "all") {
      whereClause.categoryId = categoryId
    }

    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ]
    }

    if (unanswered) {
      whereClause.comments = {
        none: {}
      }
    }

    const orderBy: Prisma.ForumPostOrderByWithRelationInput[] = []
    
    if (sort === "popular") {
      orderBy.push(
        { isPinned: "desc" },
        { likes: { _count: "desc" } },
        { comments: { _count: "desc" } },
        { updatedAt: "desc" }
      )
    } else if (sort === "unanswered") {
      orderBy.push(
        { isPinned: "desc" },
        { comments: { _count: "asc" } },
        { createdAt: "desc" }
      )
    } else {
      orderBy.push(
        { isPinned: "desc" },
        { updatedAt: "desc" }
      )
    }

    const posts = await prisma.forumPost.findMany({
      where: whereClause,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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

    const { title, content, categoryId } = await request.json()

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      )
    }

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        categoryId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}