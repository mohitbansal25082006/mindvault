

# 🧠 MindVault: AI-Powered Knowledge Management

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)
[![Neon](https://img.shields.io/badge/Neon-0A0E27?style=flat&logo=neon&logoColor=white)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-000000?style=flat&logo=vercel&logoColor=white)](https://mindvault-three.vercel.app/)

---

## 🌟 Overview

MindVault is an **AI-powered knowledge management platform** that transforms how you store, organize, and interact with your personal knowledge. 

Imagine having a **personal brain** that not only stores your notes but also **answers your questions** based on your own documents. 

Built with **Next.js 15**, **Neon PostgreSQL**, and **OpenAI**, MindVault combines the best of note-taking apps with intelligent AI assistance.

**👉 [Live Demo](https://mindvault-three.vercel.app/)**

---

## 🚀 Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/NextAuth-000000?style=for-the-badge&logo=nextauth&logoColor=white" alt="NextAuth" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Neon-0A0E27?style=for-the-badge&logo=neon&logoColor=white" alt="Neon" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

---

## ✨ Features

### 🔐 Authentication & Profiles
- **OAuth Integration**: Login with Google or GitHub
- **User Profiles**: Store name, email, and avatar
- **Secure Sessions**: NextAuth.js handles session management

### 📝 Knowledge Documents
- **Rich Text Editor**: Create and edit documents with Tiptap
- **Document Management**: Create, read, update, and delete documents
- **Organization**: Tag documents for easy categorization

### 🤖 AI Q&A on Docs
- **Context-Aware Answers**: Ask questions and get answers from your own documents
- **Embeddings**: Store document embeddings for semantic search
- **Source Attribution**: See which documents were used for each answer

### 🔍 Search & Tagging System
- **Keyword Search**: Search by title or content
- **Semantic Search**: Find documents by meaning, not just keywords
- **Tag Filtering**: Organize and filter documents by tags

### 📊 User Dashboard
- **Sidebar Navigation**: Easy access to all features
- **Document List**: View and manage your documents
- **AI Chat Interface**: Interact with your knowledge base

### 🎨 Modern UI & UX
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Built with Framer Motion and Three.js

---

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT,
    excerpt TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Embeddings for AI Search
CREATE TABLE embeddings (
    id UUID PRIMARY KEY,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT,
    embedding VECTOR(1536)  -- pgvector extension
);

-- NextAuth tables (Account, Session, VerificationToken) as per schema
```

---

## 🔄 User Flow

1. **Sign Up/Log In** → User authenticates with Google or GitHub
2. **Dashboard** → User sees their documents and can create new ones
3. **Create Document** → User writes and saves a document
4. **Ask AI** → User asks a question, and the AI responds with context from their documents
5. **Search** → User searches for documents by keywords, tags, or semantic similarity

---

## 🚀 Deployment

### Prerequisites
- Node.js 18+
- Neon PostgreSQL database
- Google/GitHub OAuth credentials
- OpenAI API key

### Environment Variables
```env
# Database
DATABASE_URL="your-neon-database-url-here"
DIRECT_URL="your-neon-direct-url-here"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

### Deployment Commands
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Build the application
npm run build

# Start the application
npm start
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

---

## 📦 Installation Guide

Follow the step-by-step guide below to set up MindVault locally.

### Part 1: Foundation & 3D Landing Page

#### Step 1: Project Creation
```bash
cd E:
mkdir Projects
cd Projects
npx create-next-app@latest mindvault --typescript --tailwind --eslint --app --use-npm
cd mindvault
npm install
```

#### Step 2: Project Structure Setup
```bash
mkdir src/components src/components/ui src/components/3d src/components/auth src/lib src/types src/styles
```
- Files Created:
  - `.gitignore`

#### Step 3: ShadCN UI Setup
```bash
npx shadcn@latest init
npx shadcn@latest add button card input label textarea dropdown-menu navigation-menu avatar badge switch
npx shadcn@latest add sonner
npm install next-themes lucide-react clsx class-variance-authority
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install @types/three
npm install framer-motion
```

#### Step 4: Theme Provider Setup
- Files Created:
  - `src/components/theme-provider.tsx`
  - `src/components/mode-toggle.tsx`

#### Step 5: Types Definition
- Files Created:
  - `src/types/index.ts`

#### Step 6: 3D Components
- Files Created:
  - `src/components/3d/scene.tsx`
  - `src/components/3d/loading.tsx`

#### Step 7: Authentication Components
- Files Created:
  - `src/components/auth/login-form.tsx`
  - `src/components/auth/register-form.tsx`
  - `src/components/auth/auth-modal.tsx`

#### Step 8: Landing Page Components
- Files Created:
  - `src/components/navigation.tsx`
  - `src/components/hero-section.tsx`
  - `src/components/features-section.tsx`

#### Step 9: Main Landing Page
- Files Modified:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`

#### Step 10: Custom Styles
- Files Modified:
  - `src/app/globals.css`

#### Step 11: Configuration Files
- Files Modified:
  - `tailwind.config.ts`
  - `next.config.js`
  - `tsconfig.json`
  - `package.json`

#### Step 12: Environment Setup
- Files Created:
  - `.env.local`

#### Step 13: Run the Project
```bash
npm install
npm run dev
```

### Part 2: Complete Database, Authentication & Dashboard

#### Step 1: Install Additional Dependencies
```bash
npm install prisma @prisma/client next-auth@beta @auth/prisma-adapter bcryptjs @types/bcryptjs
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-text-style @tiptap/extension-color
npm install zod react-hook-form @hookform/resolvers
npm install date-fns clsx class-variance-authority
npm install next-auth
```

#### Step 2: Database & Prisma Setup
```bash
npx prisma init
```
- Files Created:
  - `prisma/schema.prisma`
  - `src/lib/prisma.ts`
```bash
npx prisma db push
```

#### Step 3: Authentication Configuration
- Files Created:
  - `src/auth.ts`
  - `src/app/api/auth/[...nextauth]/route.ts`
  - `src/app/api/auth/register/route.ts`

#### Step 4: Middleware & Route Protection
- Files Created:
  - `middleware.ts`

#### Step 5: Form Validation & Types
- Files Created:
  - `src/lib/validations.ts`
- Files Modified:
  - `src/types/index.ts`

#### Step 6: Updated Authentication Components
- Files Modified:
  - `src/components/auth/login-form.tsx`
  - `src/components/auth/register-form.tsx`

#### Step 7: Dashboard Components
- Files Created:
  - `src/components/providers/session-provider.tsx`
  - `src/components/dashboard/sidebar.tsx`
  - `src/components/dashboard/dashboard-layout.tsx`
  - `src/components/dashboard/dashboard-stats.tsx`

#### Step 8: Document Management
- Files Created:
  - `src/app/api/documents/route.ts`
  - `src/app/api/documents/[id]/route.ts`
  - `src/components/editor/rich-text-editor.tsx`
  - `src/components/documents/document-form.tsx`
  - `src/components/documents/document-list.tsx`

#### Step 9: Page Components
- Files Modified:
  - `src/app/layout.tsx`
- Files Created:
  - `src/app/dashboard/page.tsx`
  - `src/app/documents/page.tsx`
  - `src/app/documents/new/page.tsx`
  - `src/app/documents/[id]/edit/page.tsx`

#### Step 10: AI Chat Components
- Files Created:
  - `src/app/api/chat/route.ts`
  - `src/components/chat/chat-interface.tsx`
  - `src/app/chat/page.tsx`

#### Step 11: Search Components
- Files Created:
  - `src/app/api/search/route.ts`
  - `src/components/search/search-interface.tsx`
  - `src/app/search/page.tsx`

#### Step 12: Settings Components
- Files Created:
  - `src/app/api/user/profile/route.ts`
  - `src/components/settings/settings-interface.tsx`
  - `src/app/settings/page.tsx`

#### Step 13: Database Setup & Environment Configuration
- Files Modified:
  - `.env`
```bash
npx prisma generate
npx prisma db push
npx prisma studio
```

#### Step 14: Enhanced AI Integration & Embeddings
```bash
npm install openai @pinecone-database/pinecone langchain @langchain/openai @langchain/community
npm install pdf-parse mammoth cheerio jsdom
npm install @types/pdf-parse
```
- Files Created:
  - `src/lib/openai.ts`
- Files Modified:
  - `src/app/api/documents/route.ts`
  - `prisma/schema.prisma`
  - `src/app/api/chat/route.ts`

#### Step 15: Enhanced UI Components
- Files Modified:
  - `src/components/chat/chat-interface.tsx`
```bash
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add tabs
npx shadcn@latest add progress
```

#### Step 16: Final Configuration & Deployment
- Files Modified:
  - `next.config.js`
  - `package.json`
  - `.gitignore`
- Files Created:
  - `scripts/deploy.sh`
```bash
npm install
npx prisma generate
npx prisma db push
npm run build
npm i -g vercel
vercel login
vercel
```

#### Step 17: Run the Project
```bash
npm install
npm run dev
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Neon](https://neon.tech/) for the serverless PostgreSQL
- [OpenAI](https://openai.com/) for the powerful AI capabilities
- [ShadCN UI](https://ui.shadcn.com/) for the beautiful UI components
- [Three.js](https://threejs.org/) for the 3D animations

---

<div align="center">
  Made with ❤️ by the MindVault Team<br>
  🌟 Star this project if you find it helpful!
</div>
