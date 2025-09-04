import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.formData()
    const image: File | null = data.get("image") as unknown as File

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 })
    }

    // Check file type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ 
        error: "Only image files are supported" 
      }, { status: 400 })
    }

    // Check file size (limit to 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "Image size must be less than 5MB" 
      }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate a unique filename
    const fileName = `${session.user.id}-${Date.now()}-${image.name}`
    const path = join(process.cwd(), "public", "profile-images", fileName)

    // Save the file
    await writeFile(path, buffer)

    // Generate the URL for the image
    const imageUrl = `/profile-images/${fileName}`

    // Update user profile with the new image URL
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      imageUrl 
    })
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return NextResponse.json({ 
      error: "Failed to upload profile image" 
    }, { status: 500 })
  }
}