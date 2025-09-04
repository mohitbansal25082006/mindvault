import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Email to admin (you)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: "mohitbansal.cse28@jecrc.ac.in",
      subject: `MindVault Support: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin: 0;">MindVault Support</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">New Support Request</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">Contact Information</h2>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">Message</h2>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #4f46e5;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p>This email was sent from the MindVault support form.</p>
            <p>Received on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    }

    // Email to user (confirmation)
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting MindVault Support",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5; margin: 0;">MindVault Support</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">Thank You for Reaching Out</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">Your Support Request</h2>
            <p>Dear ${name},</p>
            <p>Thank you for contacting MindVault Support. We have received your message regarding "${subject}" and our team will get back to you within 24 hours.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 10px 0 0 0;"><strong>Message:</strong></p>
              <div style="background-color: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <p>If you need immediate assistance, please check our <a href="https://mindvault-three.vercel.app/support" style="color: #4f46e5;">Support Center</a> or <a href="https://mindvault-three.vercel.app/docs" style="color: #4f46e5;">Documentation</a>.</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #6b7280;">While you wait, why not explore our features?</p>
            <div style="margin-top: 15px;">
              <a href="https://mindvault-three.vercel.app/features" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 0 5px;">Explore Features</a>
              <a href="https://mindvault-three.vercel.app/docs" style="display: inline-block; background-color: #f3f4f6; color: #4f46e5; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 0 5px;">Read Documentation</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p>© 2025 MindVault. All rights reserved.</p>
            <p>This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    }

    // Send emails
    await transporter.sendMail(adminMailOptions)
    await transporter.sendMail(userMailOptions)

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
