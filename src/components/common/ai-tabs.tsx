"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AiTabs({ ai }: { ai: string }) {
  return (
    <Tabs value={ai}>
      <TabsList className="text-neutral-700">
        <TabsTrigger value="openai">
          <Link href="/openai">OpenAI</Link>
        </TabsTrigger>
        <TabsTrigger value="recraft">
          <Link href="/recraft">Recraft</Link>
        </TabsTrigger>
        <TabsTrigger value="ideogram">
          <Link href="/ideogram">Ideogram</Link>
        </TabsTrigger>
        <TabsTrigger value="black-forest-labs">
          <Link href="/black-forest-labs">Black Forest Labs</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
