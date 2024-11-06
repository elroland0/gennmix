"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function CSPostHogProvider({
  env,
  children,
}: {
  env: { NEXT_PUBLIC_POSTHOG_KEY: string; NEXT_PUBLIC_POSTHOG_HOST: string };
  children: React.ReactNode;
}) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  }, []);
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
