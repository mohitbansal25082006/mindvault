import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateEmbedding, chunkText } from "@/lib/openai"
import { DocumentSchema } from "@/lib/validations"

// GET all documents for user
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const documents = await prisma.document.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        tags: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST new document
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = DocumentSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const { title, content, tags = [], isPublic = false } = validatedData.data

    // Generate excerpt from content (first 150 chars)
    const excerpt = content.length > 150 
      ? content.substring(0, 150) + "..."
      : content

    // Create document first
    const document = await prisma.document.create({
      data: {
        title,
        content,
        excerpt,
        tags,
        isPublic,
        userId: session.user.id,
      }
    })

    // Generate embeddings for content chunks
    try {
      const chunks = chunkText(content, 1000)
      const embeddingPromises = chunks.map(async (chunk) => {
        const embedding = await generateEmbedding(chunk)
        return prisma.embedding.create({
          data: {
            documentId: document.id,
            content: chunk,
            embedding,
          },
        })
      })

      await Promise.all(embeddingPromises)
    } catch (embeddingError) {
      console.error("Error generating embeddings:", embeddingError)
      // Don't fail the document creation if embeddings fail
    }

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}