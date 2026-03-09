import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata = {
  title: "Sign up",
  description: "Create an account",
};

export default function RegisterPage(): JSX.Element {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Sign up</h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Log in
        </Link>
      </p>
      <RegisterForm />
    </div>
  );
}
