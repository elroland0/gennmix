"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AiTabs({ ai }: { ai: string }) {
  return (
    <Tabs value={ai} className="overflow-auto">
      <TabsList className="text-neutral-700 font-normal gap-1">
        <TabsTrigger
          value="openai"
          className="hover:bg-neutral-900 hover:text-neutral-50 data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-50"
        >
          <Link href="/openai">OpenAI</Link>
        </TabsTrigger>
        <TabsTrigger
          value="recraft"
          className="hover:bg-neutral-900 hover:text-neutral-50 data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-50"
        >
          <Link href="/recraft">Recraft</Link>
        </TabsTrigger>
        <TabsTrigger
          value="ideogram"
          className="hover:bg-neutral-900 hover:text-neutral-50 data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-50"
        >
          <Link href="/ideogram">Ideogram</Link>
        </TabsTrigger>
        <TabsTrigger
          value="black-forest-labs"
          className="hover:bg-neutral-900 hover:text-neutral-50 data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-50"
        >
          <Link href="/black-forest-labs">Black Forest Labs</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
