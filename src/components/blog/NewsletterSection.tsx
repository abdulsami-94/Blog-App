"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { subscribeNewsletter } from "@/app/actions";

export function NewsletterSection(): JSX.Element {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const result = await subscribeNewsletter(email);
    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setEmail("");
      setMessage("Thanks for subscribing!");
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900/50">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Newsletter</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Get the latest posts delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="sm:max-w-xs"
        />
        <Button type="submit" isLoading={status === "loading"} disabled={!email.trim()}>
          Subscribe
        </Button>
      </form>
      {message ? (
        <p
          className={`mt-2 text-sm ${status === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          role="alert"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
