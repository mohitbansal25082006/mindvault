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

interface ChatWithMessages {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: Array<{
    content: string
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
    const formattedChats: ChatHistoryItem[] = chats.map((chat: ChatWithMessages) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
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