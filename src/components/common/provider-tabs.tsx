"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProviderTabs({ provider }: { provider: string }) {
  const style =
    "hover:bg-neutral-900 hover:text-neutral-50 data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-50";
  return (
    <Tabs value={provider} className="overflow-auto w-full">
      <TabsList className="text-neutral-700 font-normal gap-1">
        <TabsTrigger value="fal" className={style}>
          <Link href="/fal">Fal</Link>
        </TabsTrigger>
        <TabsTrigger value="black-forest-labs" className={style}>
          <Link href="/black-forest-labs">Black Forest Labs</Link>
        </TabsTrigger>
        <TabsTrigger value="recraft" className={style}>
          <Link href="/recraft">Recraft</Link>
        </TabsTrigger>
        <TabsTrigger value="ideogram" className={style}>
          <Link href="/ideogram">Ideogram</Link>
        </TabsTrigger>
        <TabsTrigger value="replicate" className={style}>
          <Link href="/replicate">Replicate</Link>
        </TabsTrigger>
        <TabsTrigger value="openai" className={style}>
          <Link href="/openai">OpenAI</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
