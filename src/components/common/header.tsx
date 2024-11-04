import Link from "next/link";
import { FeedbackPopover } from "../blocks/feedback-popover";

export function Header() {
  return (
    <div className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-semibold">
        <Link href="/" className="hover:opacity-80">
          Gennmix
        </Link>
      </h1>
      <FeedbackPopover />
    </div>
  );
}
