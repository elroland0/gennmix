"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecraftGenerate } from "./recraft-generate";
import { RecraftVectorize } from "./recraft-vectorize";
import { RecraftRemoveBackground } from "./recraft-remove-background";
import { Notify } from "../ui/notify";
import { useEffect, useState } from "react";

export function Recraft() {
  const [apiKeyExists, setApiKeyExists] = useState(false);

  useEffect(() => {
    setApiKeyExists(!!localStorage.getItem("recraft-api-key"));
  }, []);

  return (
    <Tabs defaultValue="generate">
      <TabsList>
        <TabsTrigger value="generate">Generate</TabsTrigger>
        <TabsTrigger value="vectorize">Vectorize</TabsTrigger>
        <TabsTrigger value="remove-background">Remove Background</TabsTrigger>
      </TabsList>
      {!apiKeyExists && (
        <Notify className="mt-4">
          <p>
            To use this feature, you need to get an API key from the{" "}
            <Link
              href="https://www.recraft.ai/docs"
              target="_blank"
              className="underline"
            >
              Recraft
            </Link>
          </p>
        </Notify>
      )}
      <TabsContent value="generate">
        <RecraftGenerate />
      </TabsContent>
      <TabsContent value="vectorize">
        <RecraftVectorize />
      </TabsContent>
      <TabsContent value="remove-background">
        <RecraftRemoveBackground />
      </TabsContent>
    </Tabs>
  );
}
