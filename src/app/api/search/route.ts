import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Define the interface for the returned documents
interface SearchResult {
  id: string
  createdAt: Date
  updatedAt: Date
  title: string
  content: string
  excerpt: string | null
  tags: string[]
}

// Define the where clause structure
interface WhereClause {
  userId: string
  AND?: Array<{
    OR?: Array<{
      title?: { contains: string; mode: "insensitive" }
      content?: { contains: string; mode: "insensitive" }
    }>
    tags?: { has: string }
  }>
  OR?: Array<{
    title?: { contains: string; mode: "insensitive" }
    content?: { contains: string; mode: "insensitive" }
  }>
  tags?: { has: string }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get("q")
    const rawTag = searchParams.get("tag")
    const query = rawQuery?.trim() ?? null
    const tag = rawTag?.trim() ?? null

    if (!query && !tag) {
      return NextResponse.json({ error: "Query or tag is required" }, { status: 400 })
    }

    const userId = session.user.id as string

    // Build the where clause with proper typing
    const whereClause: WhereClause = { userId }

    if (query && tag) {
      whereClause.AND = [
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        {
          tags: { has: tag },
        },
      ]
    } else if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ]
    } else if (tag) {
      whereClause.tags = { has: tag }
    }

    const documents: SearchResult[] = await prisma.document.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    })

    // Add simple relevance scoring
    interface DocumentWithRelevance extends SearchResult {
      relevance: number
    }

    const q = query ?? ""

    const results: DocumentWithRelevance[] = documents
      .map((doc): DocumentWithRelevance => {
        let relevance = 0

        if (q) {
          const titleMatch = doc.title.toLowerCase().includes(q.toLowerCase())
          const contentMatch = doc.content.toLowerCase().includes(q.toLowerCase())

          if (titleMatch) relevance += 10
          if (contentMatch) relevance += 5
        }

        return {
          ...doc,
          relevance,
        }
      })
      .sort((a, b) => b.relevance - a.relevance)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}