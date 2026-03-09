import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata = {
  title: "Profile",
  description: "Your profile",
};

export default async function ProfilePage(): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Profile</h1>
      <div className="mt-6 flex items-start gap-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt=""
            width={80}
            height={80}
            className="rounded-full"
          />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 text-2xl font-medium dark:bg-zinc-700">
            {(session.user.name ?? session.user.email ?? "?").charAt(0).toUpperCase()}
          </span>
        )}
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{session.user.name ?? "—"}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{session.user.email}</p>
        </div>
      </div>
    </div>
  );
}
