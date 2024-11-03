"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sendFeedback } from "@/actions/send-feedback";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

export function FeedbackPopover() {
  const { pending } = useFormStatus();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const pathname = usePathname();

  const handleSubmit = async (formData: FormData) => {
    try {
      await sendFeedback(formData);
      setOpen(false);
      setMessage("");
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Feedback</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <form action={handleSubmit}>
          <input type="hidden" name="path" value={pathname} />
          <Textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
            placeholder="Bug report, feature request, etc."
          />
          <Button type="submit" disabled={pending} className="mt-4">
            {pending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
