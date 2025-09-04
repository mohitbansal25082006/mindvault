export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { writeFile } from "fs/promises"
import { join } from "path"
import os from "os"

// Define types for pdfreader
interface PdfItem {
  text?: string
  [key: string]: unknown
}

type PdfReaderError = Error | null | string
type PdfReaderItem = PdfItem | null

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

    // Use the system temp dir (writable on Vercel)
    const tmpPath = join(os.tmpdir(), fileName)

    // OPTIONAL: save the file temporarily for debugging/processing.
    // On Vercel, your project dir is read-only — only os.tmpdir() is writable.
    try {
      await writeFile(tmpPath, buffer)
    } catch (err) {
      // If write fails, continue — we can still parse from buffer directly.
      console.warn("Failed to write temp file, continuing with in-memory buffer:", err)
    }
    
    let extractedText = ""
    
    // Extract text based on file type
    if (file.type === "application/pdf") {
      try {
        // Use pdfreader for PDF parsing with dynamic import (must run on Node runtime)
        const pdfreaderModule = await import("pdfreader")
        const PdfReader = pdfreaderModule.PdfReader
        
        // Parse PDF and extract text (from buffer - no disk required)
        extractedText = await new Promise<string>((resolve, reject) => {
          let textContent = ""
          
          new PdfReader().parseBuffer(buffer, (err: PdfReaderError, item: PdfReaderItem) => {
            if (err) {
              if (typeof err === 'string') {
                reject(new Error(err))
              } else {
                reject(err)
              }
            } else if (!item) {
              resolve(textContent)
            } else if (item?.text) {
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
      // NOTE: we intentionally don't return tmpPath in production (security). 
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
