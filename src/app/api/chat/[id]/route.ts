import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface MessageData {
  id: string
  role: string
  content: string
  timestamp: Date
  sources?: Array<{ id: string; title: string }>
}

interface PrismaMessage {
  id: string
  content: string
  role: string
  createdAt: Date
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
    
    // Await the params before using its properties
    const { id } = await params
    const chatId = id
    
    // Verify the chat belongs to the current user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      },
    })
    
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }
    
    // Get all messages for this chat
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: "asc",
      },
    })
    
    // Parse assistant messages to extract response and sources
    const formattedMessages: MessageData[] = messages.map((message: PrismaMessage) => {
      if (message.role === "assistant") {
        try {
          const parsedContent = JSON.parse(message.content)
          return {
            id: message.id,
            role: message.role,
            content: parsedContent.response,
            sources: parsedContent.sources || [],
            timestamp: message.createdAt,
          }
        } catch {
          // Fallback for messages that aren't in JSON format
          return {
            id: message.id,
            role: message.role,
            content: message.content,
            sources: [],
            timestamp: message.createdAt,
          }
        }
      } else {
        return {
          id: message.id,
          role: message.role,
          content: message.content,
          timestamp: message.createdAt,
        }
      }
    })
    
    return NextResponse.json(formattedMessages)
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat messages" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Await the params before using its properties
    const { id } = await params
    const chatId = id
    
    // Verify the chat belongs to the current user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: session.user.id,
      },
    })
    
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }
    
    // Delete the chat (this will also delete all messages due to cascade)
    await prisma.chat.delete({
      where: {
        id: chatId,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting chat:", error)
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    )
  }
}