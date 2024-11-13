"use client";

import Link from "next/link";
import { FeedbackPopover } from "./feedback-popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BellIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import { toast } from "sonner";

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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Studio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Studio Beta</DialogTitle>
              <DialogDescription>
                Studio is not available yet. We're working hard to bring you
                powerful image generation and editing capabilities. Stay tuned
                for the launch!
              </DialogDescription>
            </DialogHeader>
            <form
              className="flex items-center gap-2 mt-2"
              action={async (formData) => {
                try {
                  setSubmitted(true);
                  const res = await fetch("/feedback", {
                    method: "POST",
                    body: formData,
                  });
                  if (!res.ok) {
                    throw new Error();
                  }
                  toast.success("Successfully registered for Studio Beta!");
                  emailInputRef.current!.value = "";
                } catch (e) {
                  toast.error("Sorry, something went wrong. Please try again.");
                }
              }}
            >
              <input type="hidden" name="message" value="" />
              <Input
                ref={emailInputRef}
                type="email"
                name="path"
                placeholder="Email"
                autoComplete="off"
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                disabled={submitted}
              >
                <BellIcon />
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <FeedbackPopover />
      </div>
    </div>
  );
}
