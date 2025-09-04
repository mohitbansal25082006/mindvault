import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

/**
 * Helper: call a function that uses Prisma, retrying once on connection-pool timeout (P2024).
 * On P2024 we attempt to disconnect/connect and retry once with a small backoff.
 */
async function retryOnPoolError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (err: any) {
    // Prisma pool timeout error code
    if (err?.code === "P2024") {
      console.warn("Prisma pool timeout detected. Attempting reconnect and retry...", err?.meta ?? {})
      try {
        // Try to recover: disconnect then connect, then retry once
        try {
          await prisma.$disconnect()
        } catch (dErr) {
          // ignore disconnect errors
          console.warn("prisma.$disconnect() failed:", dErr)
        }

        // small backoff before reconnect
        await new Promise((r) => setTimeout(r, 300))

        try {
          await prisma.$connect()
        } catch (cErr) {
          console.warn("prisma.$connect() failed:", cErr)
        }

        // small backoff before retrying the query
        await new Promise((r) => setTimeout(r, 200))

        return await fn()
      } catch (retryErr: any) {
        // If retry also fails, rethrow so caller can handle
        console.error("Retry after reconnect failed:", retryErr)
        throw retryErr
      }
    }

    // not a pool error — rethrow
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
  } catch (error: any) {
    // If it's still a pool timeout, return 503 with helpful message
    if (error?.code === "P2024") {
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

    const { name, description, icon, color } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const category = await retryOnPoolError(() =>
      prisma.forumCategory.create({
        data: {
          name,
          description,
          icon,
          color,
        },
      })
    )

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    if (error?.code === "P2024") {
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
