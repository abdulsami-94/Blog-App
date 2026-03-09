"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps): React.ReactPortal | null {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  if (typeof document === "undefined" || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
        tabIndex={0}
        role="button"
        aria-label="Close modal"
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-lg font-semibold">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
