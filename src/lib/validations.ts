import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt too long"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean(),
  tagNames: z.array(z.string().min(1)).optional().default([]),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment too long"),
  parentId: z.string().optional().nullable(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
