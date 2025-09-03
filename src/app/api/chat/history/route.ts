import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

interface ChatHistoryItem {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
  preview: string
}

interface PrismaChat {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
  title: string
  messages: Array<{
    id: string
    createdAt: Date
    content: string
    role: string
    chatId: string
  }>
  _count: {
    messages: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const chats = await prisma.chat.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          take: 1, // Just get the first message to use as a preview
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
    })
    // Format the response
    const formattedChats: ChatHistoryItem[] = chats.map((chat: PrismaChat) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messageCount: chat._count.messages,
      preview: chat.messages[0]?.content.substring(0, 100) + (chat.messages[0]?.content.length > 100 ? "..." : ""),
    }))
    return NextResponse.json(formattedChats)
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
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
    const { title } = await request.json()
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    // Create a new chat
    const chat = await prisma.chat.create({
      data: {
        title,
        userId: session.user.id,
      },
    })
    return NextResponse.json(chat)
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    )
  }
}

// DELETE chat (add this new endpoint)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get("id")
    
    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 })
    }
    
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
    
    // Delete the chat (this will also delete messages due to cascade)
    await prisma.chat.delete({
      where: { id: chatId },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}