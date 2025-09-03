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

interface PrismaEmbedding {
  id: string
  documentId: string
  content: string
  embedding: number[]
  createdAt: Date
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

    const { message, chatId } = await request.json()

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
    const similarities: EmbeddingWithSimilarity[] = userEmbeddings.map((embedding: PrismaEmbedding) => ({
      ...embedding,
      similarity: cosineSimilarity(questionEmbedding, embedding.embedding),
    }))

    // Get top 5 most similar chunks with proper typing
    const topMatches = similarities
      .sort((a: EmbeddingWithSimilarity, b: EmbeddingWithSimilarity) => b.similarity - a.similarity)
      .slice(0, 5)
      .filter((match: EmbeddingWithSimilarity) => match.similarity > 0.3) // Minimum similarity threshold

    if (topMatches.length === 0) {
      const aiResponse = "I couldn't find any relevant information in your documents to answer that question. Try asking about topics you've written about in your knowledge base."
      
      // Save messages to database if chatId is provided
      if (chatId) {
        await saveMessagesToDatabase(chatId, message, aiResponse, [])
      }
      
      return NextResponse.json({
        response: aiResponse,
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

    // Save messages to database if chatId is provided
    if (chatId) {
      await saveMessagesToDatabase(chatId, message, aiResponse, sources)
    }

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

async function saveMessagesToDatabase(chatId: string, userMessage: string, aiResponse: string, sources: any[]) {
  try {
    // Save user message
    await prisma.message.create({
      data: {
        content: userMessage,
        role: "user",
        chatId,
      },
    })

    // Save assistant message with sources as part of the content
    const assistantContent = JSON.stringify({
      response: aiResponse,
      sources,
    })

    await prisma.message.create({
      data: {
        content: assistantContent,
        role: "assistant",
        chatId,
      },
    })
  } catch (error) {
    console.error("Error saving messages to database:", error)
  }
}