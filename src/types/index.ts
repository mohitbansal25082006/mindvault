import type { ElementType } from "react"

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  created_at: string
}

export interface Document {
  id: string
  title: string
  content: string
  excerpt: string | null
  tags: string[]
  isPublic: boolean
  created_at: string
  updated_at: string
  userId: string
}

export interface NavItem {
  name: string
  href: string
  /**
   * Icon is typed as a React ElementType (component or intrinsic element),
   * which works well for SVG icon components like lucide-react icons.
   */
  icon: ElementType
}

export interface SearchResult {
  id: string
  title: string
  excerpt: string
  relevance: number
}

/* ---------------- Forum Types ---------------- */

export interface ForumCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  views: number
  isPinned: boolean
  isLocked: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    image?: string
  }
  category: {
    id: string
    name: string
  }
  _count: {
    comments: number
    likes: number
  }
}

export interface ForumComment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    image?: string
  }
  _count: {
    likes: number
  }
  isLiked?: boolean
}

export interface ForumLike {
  id: string
  userId: string
  postId?: string
  commentId?: string
  createdAt: string
}
