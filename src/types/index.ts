export interface Author {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  published: boolean;
  views: number;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  postId: string;
  createdAt: string;
  parentId: string | null;
  replies?: Comment[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface SearchResult {
  posts: Pick<Post, "slug" | "title" | "excerpt" | "tags">[];
  query: string;
}
