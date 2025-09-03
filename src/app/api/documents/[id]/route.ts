import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { DocumentSchema } from "@/lib/validations"

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET single document
export async function GET(
  request: Request,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const session = await auth()
    const { id } = await context.params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const document = await prisma.document.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update document
export async function PUT(
  request: Request,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const session = await auth()
    const { id } = await context.params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = DocumentSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const { title, content, tags = [], isPublic = false } = validatedData.data

    // Generate excerpt from content
    const excerpt =
      typeof content === "string" && content.length > 150
        ? content.substring(0, 150) + "..."
        : (content as string)

    const updateResult = await prisma.document.updateMany({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        title,
        content,
        excerpt,
        tags,
        isPublic,
      },
    })

    if (updateResult.count === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const updatedDocument = await prisma.document.findUnique({
      where: { id: id },
    })

    return NextResponse.json(updatedDocument)
  } catch (error) {
    console.error("Error updating document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE document
export async function DELETE(
  request: Request,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const session = await auth()
    const { id } = await context.params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deleteResult = await prisma.document.deleteMany({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (deleteResult.count === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Document deleted" })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}