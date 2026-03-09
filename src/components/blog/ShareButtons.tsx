"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";
import { APP_NAME, APP_URL } from "@/lib/utils";

export interface ShareButtonsProps {
  title: string;
  slug: string;
}

const twitterShareUrl = (url: string, text: string): string =>
  `https://twitter.com/intent/tweet?${new URLSearchParams({ url, text })}`;
const linkedInShareUrl = (url: string): string =>
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

export function ShareButtons({ title, slug }: ShareButtonsProps): JSX.Element {
  const url = `${APP_URL}/blog/${slug}`;
  const [copied, setCopied] = useState(false);

  const copyLink = (): void => {
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div data-share className="flex items-center gap-2" aria-label="Share this post">
      <a
        href={twitterShareUrl(url, `${title} – ${APP_NAME}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        aria-label="Share on X (Twitter)"
      >
        <Twitter className="h-5 w-5" aria-hidden />
      </a>
      <a
        href={linkedInShareUrl(url)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5" aria-hidden />
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-5 w-5 text-green-600" aria-hidden /> : <Link2 className="h-5 w-5" aria-hidden />}
      </button>
    </div>
  );
}
