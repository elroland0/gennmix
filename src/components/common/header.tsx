"use client";

import Link from "next/link";
import { FeedbackPopover } from "./feedback-popover";
import { useRef, useState } from "react";

export function Header() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex justify-between items-center p-4">
      <h1 className="text-xl font-semibold">
        <Link href="/" className="hover:opacity-80">
          Gennmix
        </Link>
      </h1>
      <div className="flex items-center gap-4">
        <FeedbackPopover />
      </div>
    </div>
  );
}
