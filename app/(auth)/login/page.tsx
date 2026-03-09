import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Log in",
  description: "Log in to your account",
};

export default function LoginPage(): JSX.Element {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Log in</h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Sign up
        </Link>
      </p>
      <LoginForm />
    </div>
  );
}
