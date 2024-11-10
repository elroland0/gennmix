"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdeogramGenerate } from "./ideogram-generate";
import { Notify } from "../ui/notify";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Ideogram() {
  const [apiKeyExists, setApiKeyExists] = useState(false);

  useEffect(() => {
    setApiKeyExists(!!localStorage.getItem("ideogram-api-key"));
  }, []);

  return (
    <Tabs defaultValue="generate">
      <TabsList>
        <TabsTrigger value="generate">Generate</TabsTrigger>
      </TabsList>
      {!apiKeyExists && (
        <Notify className="mt-4">
          <p>
            To use this feature, you need to get an API key from the{" "}
            <Link
              href="https://ideogram.ai/manage-api"
              target="_blank"
              className="underline"
            >
              Ideogram
            </Link>
          </p>
        </Notify>
      )}
      <TabsContent value="generate">
        <IdeogramGenerate />
      </TabsContent>
    </Tabs>
  );
}
