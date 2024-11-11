"use client";

import { Button } from "../ui/button";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { StudioCanvas } from "./studio-canvas";

export function Studio() {
  return (
    <div className="relative">
      <div className="fixed top-0 left-0 flex items-center gap-2 p-2 z-10">
        <Button variant="outline">
          <MagicWandIcon /> Generate
        </Button>
      </div>
      <StudioCanvas />
    </div>
  );
}
