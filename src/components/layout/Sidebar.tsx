import { TagCloud } from "@/components/blog/TagCloud";

export interface SidebarProps {
  tagCounts?: { name: string; count: number }[];
}

export function Sidebar({ tagCounts = [] }: SidebarProps): JSX.Element {
  return (
    <aside data-sidebar className="no-print w-full shrink-0 lg:w-64">
      <div className="sticky top-20 space-y-8">
        <TagCloud tagCounts={tagCounts} />
      </div>
    </aside>
  );
}
