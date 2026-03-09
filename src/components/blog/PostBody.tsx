"use client";

import { useState, useMemo } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { cn } from "@/lib/utils";

export interface PostBodyProps {
  source: MDXRemoteSerializeResult;
  className?: string;
}

const defaultComponents = {
  pre: function PreWithCopy({ children, className, ...props }: React.ComponentProps<"pre">) {
    const code = useMemo(() => {
      const child = Array.isArray(children) ? children[0] : children;
      if (child && typeof child === "object" && "props" in child && child.props && typeof child.props === "object" && "children" in child.props) {
        return String((child.props as { children?: unknown }).children ?? "");
      }
      return "";
    }, [children]);
    return (
      <pre className={cn("relative rounded-lg bg-zinc-900 p-4 text-sm", className)} {...props}>
        <CopyButton code={code} />
        {children}
      </pre>
    );
  },
};

function CopyButton({ code }: { code: string }): JSX.Element {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      data-copy-button
      onClick={() => {
        void navigator.clipboard.writeText(code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="absolute right-2 top-2 rounded bg-zinc-700 px-2 py-1 text-xs text-white hover:bg-zinc-600"
      aria-label="Copy code"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function PostBody({ source, className }: PostBodyProps): JSX.Element {
  return (
    <article
      className={cn(
        "prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 prose-pre:bg-zinc-900 prose-pre:text-zinc-100",
        className
      )}
    >
      <MDXRemote {...source} components={defaultComponents} />
    </article>
  );
}
