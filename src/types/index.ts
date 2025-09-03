import type { ElementType } from "react";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  tags: string[];
  isPublic: boolean;
  created_at: string;
  updated_at: string;
  userId: string;
}

export interface NavItem {
  name: string;
  href: string;
  /**
   * Icon is typed as a React ElementType (component or intrinsic element),
   * which works well for SVG icon components like lucide-react icons.
   */
  icon: ElementType;
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  relevance: number;
}
