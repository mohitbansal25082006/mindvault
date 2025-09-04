import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

type CategoryBody = {
  name: string
  description?: string
  icon?: string
  color?: string
}

// Define the Prisma error structure
interface PrismaError extends Error {
  code?: string
  meta?: Record<string, unknown>
}

/**
 * Helper: call a function that uses Prisma, retrying once on connection-pool timeout (P2024).
 */
async function retryOnPoolError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (err: unknown) {
    const prismaError = err as PrismaError
    if (prismaError.code === "P2024") {
      console.warn("Prisma pool timeout detected. Attempting reconnect and retry...", prismaError.meta ?? {})
      try {
        try {
          await prisma.$disconnect()
        } catch (dErr) {
          console.warn("prisma.$disconnect() failed:", dErr)
        }

        await new Promise((r) => setTimeout(r, 300))

        try {
          await prisma.$connect()
        } catch (cErr) {
          console.warn("prisma.$connect() failed:", cErr)
        }

        await new Promise((r) => setTimeout(r, 200))

        return await fn()
      } catch (retryErr: unknown) {
        console.error("Retry after reconnect failed:", retryErr)
        throw retryErr
      }
    }

    throw err
  }
}

export async function GET() {
  try {
    const categories = await retryOnPoolError(() =>
      prisma.forumCategory.findMany({
        orderBy: { name: "asc" },
      })
    )

    return NextResponse.json(categories)
  } catch (error: unknown) {
    const prismaError = error as PrismaError
    if (prismaError.code === "P2024") {
      console.error("Prisma pool timeout (after retry):", error)
      return NextResponse.json(
        {
          error:
            "Database connection pool exhausted. Please try again later. Consider increasing the connection limit or using a single, shared Prisma client across requests.",
        },
        { status: 503 }
      )
    }

    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: CategoryBody = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const category = await retryOnPoolError(() =>
      prisma.forumCategory.create({
        data: {
          name: body.name,
          description: body.description,
          icon: body.icon,
          color: body.color,
        },
      })
    )

    return NextResponse.json(category, { status: 201 })
  } catch (error: unknown) {
    const prismaError = error as PrismaError
    if (prismaError.code === "P2024") {
      console.error("Prisma pool timeout (after retry) creating category:", error)
      return NextResponse.json(
        {
          error:
            "Database connection pool exhausted. Please try again later. Consider increasing the connection limit or using a single, shared Prisma client across requests.",
        },
        { status: 503 }
      )
    }

    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}