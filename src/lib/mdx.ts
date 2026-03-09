import { serialize } from "next-mdx-remote/serialize";
import rehypePrettyCode from "rehype-pretty-code";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

const rehypePrettyCodeOptions: Parameters<typeof rehypePrettyCode>[0] = {
  theme: "github-dark",
  onVisitLine(element) {
    element.properties = element.properties ?? {};
    element.properties.className = [...(element.properties.className ?? []), "line"];
  },
  onVisitHighlightedLine(element) {
    element.properties = element.properties ?? {};
    element.properties.className = [...(element.properties.className ?? []), "line--highlighted"];
  },
  onVisitHighlightedChars(element) {
    element.properties = element.properties ?? {};
    element.properties.className = [...(element.properties.className ?? []), "word--highlighted"];
  },
};

export async function serializeMdx(content: string): Promise<MDXRemoteSerializeResult> {
  return serialize(content, {
    mdxOptions: {
      rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
    },
  });
}
