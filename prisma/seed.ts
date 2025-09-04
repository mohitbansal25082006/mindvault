import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create default forum categories
  await prisma.forumCategory.createMany({
    data: [
      {
        name: "General Discussion",
        description: "Talk about anything related to the community",
        icon: "💬",
        color: "#3b82f6",
      },
      {
        name: "Q&A",
        description: "Ask questions and share knowledge",
        icon: "❓",
        color: "#f59e0b",
      },
      {
        name: "Announcements",
        description: "Official news and updates",
        icon: "📢",
        color: "#10b981",
      },
      {
        name: "Feedback",
        description: "Share your ideas and feedback",
        icon: "💡",
        color: "#ef4444",
      },
    ],
    skipDuplicates: true, // avoids duplicate seeding
  })

  console.log("✅ Categories seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
