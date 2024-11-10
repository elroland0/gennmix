"use client";

import { useEffect, useState } from "react";
import { OpenAiGenerate } from "./openai-generate";
import { Notify } from "../ui/notify";
import Link from "next/link";

export function OpenAi() {
  const [apiKeyExists, setApiKeyExists] = useState(false);

  useEffect(() => {
    setApiKeyExists(!!localStorage.getItem("openai-api-key"));
  }, []);

  return (
    <>
      {!apiKeyExists && (
        <Notify className="mt-4">
          <p>
            To use this feature, you need to get an API key from the{" "}
            <Link
              href="https://platform.openai.com/api-keys"
              target="_blank"
              className="underline"
            >
              OpenAI
            </Link>
          </p>
        </Notify>
      )}
      <OpenAiGenerate />
    </>
  );
}
