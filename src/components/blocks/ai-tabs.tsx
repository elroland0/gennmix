"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AiTabs({ ai }: { ai: string }) {
  return (
    <Tabs value={ai}>
      <TabsList>
        <TabsTrigger value="dall-e">
          <Link href="/dall-e">DALL-E</Link>
        </TabsTrigger>
        <TabsTrigger value="recraft">
          <Link href="/recraft">Recraft</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
