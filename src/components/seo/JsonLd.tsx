import type { Post } from "@/types";
import { APP_NAME, APP_URL } from "@/lib/utils";

export interface JsonLdProps {
  post: Post;
}

export function JsonLd({ post }: JsonLdProps): JSX.Element {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? `${APP_URL}${post.coverImage}` : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `${APP_URL}/blog?author=${post.author.id}`,
    },
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${APP_URL}/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
