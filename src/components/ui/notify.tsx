import { BellIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Notify({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  if (!isOpen) {
    return null;
  }
  return (
    <div className={cn("bg-muted rounded-lg p-4 relative", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-2 text-sm text-primary">
          <BellIcon className="w-4 h-4 mt-[2px]" />
          {children}
        </div>
      </div>
      <button
        className="absolute top-[2px] right-[2px] w-5 h-5 flex items-center justify-center"
        onClick={() => setIsOpen(false)}
      >
        <Cross2Icon className="text-muted-foreground" />
      </button>
    </div>
  );
}
