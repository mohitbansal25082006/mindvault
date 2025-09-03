// E:\mindvault\src\app\api\search\route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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

    /**
     * Safely extract the `where` type from the prisma call parameter.
     * If extraction fails (because the inferred parameter type is unknown),
     * fall back to a generic object shape (Record<string, unknown>).
     */
    type FindManyArgs = Parameters<typeof prisma.document.findMany>[0]
    type ExtractedWhere = FindManyArgs extends { where?: infer W } ? NonNullable<W> : Record<string, unknown>
    type WhereType = ExtractedWhere

    const userId = session.user.id as string

    // Build a properly typed where object per branch (no unsafe spreads)
    let whereFinal: WhereType

    if (query && tag) {
      whereFinal = {
        userId,
        AND: [
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          },
          {
            tags: { has: tag },
          },
        ],
      } as WhereType
    } else if (query) {
      whereFinal = {
        userId,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      } as WhereType
    } else {
      // tag-only case
      whereFinal = {
        userId,
        tags: { has: tag! },
      } as WhereType
    }

    // Infer returned document type from prisma call
    type DocumentsArray = Awaited<ReturnType<typeof prisma.document.findMany>>
    type Doc = DocumentsArray extends Array<infer U> ? U : never

    const documents: Doc[] = await prisma.document.findMany({
      where: whereFinal,
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

    // Helper to safely convert unknown values to string (no `any`)
    const toStr = (v: unknown) => {
      if (typeof v === "string") return v
      if (v == null) return ""
      try {
        return String(v)
      } catch {
        return ""
      }
    }

    // Add simple relevance scoring
    type DocumentWithRelevance = Doc & { relevance: number }
    const q = query ?? ""

    const results: DocumentWithRelevance[] = documents
      .map((doc: Doc): DocumentWithRelevance => {
        let relevance = 0

        if (q) {
          const titleVal = toStr((doc as unknown as Record<string, unknown>)["title"])
          const contentVal = toStr((doc as unknown as Record<string, unknown>)["content"])

          const titleMatch = titleVal.toLowerCase().includes(q.toLowerCase())
          const contentMatch = contentVal.toLowerCase().includes(q.toLowerCase())

          if (titleMatch) relevance += 10
          if (contentMatch) relevance += 5
        }

        return {
          ...(doc as object),
          relevance,
        } as DocumentWithRelevance
      })
      .sort((a, b) => b.relevance - a.relevance)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
