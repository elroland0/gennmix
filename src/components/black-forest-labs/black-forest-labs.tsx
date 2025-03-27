"use client";

import Link from "next/link";
import { Notify } from "../ui/notify";
import { BlackForestLabsGenerate } from "./black-forest-labs-generate";
import { useEffect, useState } from "react";

export function BlackForestLabs() {
  const [apiKeyExists, setApiKeyExists] = useState(false);

  useEffect(() => {
    setApiKeyExists(!!localStorage.getItem("black-forest-labs-api-key"));
  }, []);

  return (
    <>
      {!apiKeyExists && (
        <Notify className="mt-4">
          <p>
            To use this feature, you need to get an API key from{" "}
            <Link
              href="https://docs.bfl.ml"
              target="_blank"
              className="underline"
            >
              Black Forest Labs
            </Link>
          </p>
        </Notify>
      )}
      <BlackForestLabsGenerate />
    </>
  );
}
