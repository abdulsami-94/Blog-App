import { NewPostForm } from "@/components/dashboard/NewPostForm";

export const metadata = {
  title: "New post",
  description: "Create a new post",
};

export default function NewPostPage(): JSX.Element {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">New post</h1>
      <NewPostForm />
    </div>
  );
}
