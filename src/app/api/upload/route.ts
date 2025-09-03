import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    
    // Check file type
    if (file.type !== "application/pdf" && file.type !== "text/plain") {
      return NextResponse.json({ 
        error: "Only PDF and TXT files are supported" 
      }, { status: 400 })
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "File size must be less than 10MB" 
      }, { status: 400 })
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name}`
    const path = join(process.cwd(), "uploads", fileName)
    
    // Save the file
    await writeFile(path, buffer)
    
    let extractedText = ""
    
    // Extract text based on file type
    if (file.type === "application/pdf") {
      try {
        // Use pdfreader for PDF parsing
        const PdfReader = require("pdfreader").PdfReader
        
        // Parse PDF and extract text
        extractedText = await new Promise((resolve, reject) => {
          let textContent = ""
          
          new PdfReader().parseBuffer(buffer, (err: any, item: any) => {
            if (err) {
              reject(err)
            } else if (!item) {
              resolve(textContent)
            } else if (item.text) {
              textContent += item.text + " "
            }
          })
        })
      } catch (error) {
        console.error("Error parsing PDF:", error)
        return NextResponse.json({ 
          error: "Failed to parse PDF file" 
        }, { status: 500 })
      }
    } else if (file.type === "text/plain") {
      extractedText = buffer.toString("utf-8")
    }
    
    return NextResponse.json({
      fileName,
      extractedText,
      originalName: file.name,
      fileType: file.type,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}