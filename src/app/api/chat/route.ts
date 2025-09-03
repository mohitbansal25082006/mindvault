import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateEmbedding, generateResponse, cosineSimilarity } from "@/lib/openai"

interface EmbeddingWithSimilarity {
  id: string
  documentId: string
  content: string
  embedding: number[]
  createdAt: Date
  similarity: number
  document: {
    id: string
    title: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate embedding for the user's question
    const questionEmbedding = await generateEmbedding(message)

    // Get all embeddings for the user's documents
    const userEmbeddings = await prisma.embedding.findMany({
      where: {
        document: {
          userId: session.user.id,
        }
      },
      include: {
        document: {
          select: {
            id: true,
            title: true,
          }
        }
      },
    })

    // Calculate similarity scores with proper typing
    const similarities: EmbeddingWithSimilarity[] = userEmbeddings.map((embedding: any) => ({
      ...embedding,
      similarity: cosineSimilarity(questionEmbedding, embedding.embedding),
    }))

    // Get top 5 most similar chunks with proper typing
    const topMatches = similarities
      .sort((a: EmbeddingWithSimilarity, b: EmbeddingWithSimilarity) => b.similarity - a.similarity)
      .slice(0, 5)
      .filter((match: EmbeddingWithSimilarity) => match.similarity > 0.3) // Minimum similarity threshold

    if (topMatches.length === 0) {
      return NextResponse.json({
        response: "I couldn't find any relevant information in your documents to answer that question. Try asking about topics you've written about in your knowledge base.",
        sources: []
      })
    }

    // Prepare context from top matches
    const context = topMatches.map((match: EmbeddingWithSimilarity) => match.content).join('\n\n')
    const sources = [...new Set(topMatches.map((match: EmbeddingWithSimilarity) => ({
      id: match.document.id,
      title: match.document.title,
    })))]

    // Generate AI response
    const aiResponse = await generateResponse(message, context)

    return NextResponse.json({
      response: aiResponse,
      sources,
    })

  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to process your message" },
      { status: 500 }
    )
  }
}