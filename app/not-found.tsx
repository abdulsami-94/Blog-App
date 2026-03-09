import Link from "next/link";
import { APP_NAME } from "@/lib/utils";

export default function NotFound(): JSX.Element {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100">404</h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Back to {APP_NAME}
      </Link>
    </div>
  );
}
