"use client";

import dynamic from "next/dynamic";

const Studio = dynamic(
  () => import("@/components/_studio/studio").then((mod) => mod.Studio),
  {
    ssr: false,
  }
);

export default function StudioPage() {
  return <Studio />;
}
