import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { cosineSimilarity } from "@/lib/openai"

interface PrismaDocument {
  id: string
  title: string
  content: string
  excerpt: string | null
  tags: string[]
  embedding: number[]
}

interface RelatedDocument {
  id: string
  title: string
  excerpt: string
  tags: string[]
  similarity: number
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const documentId = id

    // Get the current document
    const currentDocument = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: session.user.id,
      },
      include: {
        embeddings: {
          take: 1, // Just get one embedding to represent the document
        },
      },
    })

    if (!currentDocument || !currentDocument.embeddings.length) {
      return NextResponse.json([])
    }

    // Get all other documents by the user
    const otherDocuments = await prisma.document.findMany({
      where: {
        userId: session.user.id,
        id: {
          not: documentId,
        },
      },
      include: {
        embeddings: {
          take: 1, // Just get one embedding to represent the document
        },
      },
    })

    // Calculate similarity scores
    const currentEmbedding = currentDocument.embeddings[0].embedding
    const relatedDocs: RelatedDocument[] = []

    for (const doc of otherDocuments) {
      if (doc.embeddings.length > 0) {
        const similarity = cosineSimilarity(currentEmbedding, doc.embeddings[0].embedding)
        
        // Only include documents with some similarity
        if (similarity > 0.1) {
          relatedDocs.push({
            id: doc.id,
            title: doc.title,
            excerpt: doc.excerpt || "",
            tags: doc.tags,
            similarity,
          })
        }
      }
    }

    // Sort by similarity and return top 5
    const sortedDocs = relatedDocs
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)

    return NextResponse.json(sortedDocs)
  } catch (error) {
    console.error("Error fetching related documents:", error)
    return NextResponse.json(
      { error: "Failed to fetch related documents" },
      { status: 500 }
    )
  }
}