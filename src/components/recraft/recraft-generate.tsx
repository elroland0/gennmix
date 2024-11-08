"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useImages } from "@/contexts/image-context";
import { sizes, substyles } from "./recraft-types";
import { z } from "zod";
import { GenForm } from "../common/gen-form";

const schema = z.object({
  prompt: z.string().describe("textarea"),
  randomSeed: z.number().optional(),
  model: z.enum(["recraftv3", "recraft20b", "refm1"]).default("recraftv3"),
  size: z.enum(sizes).default("1024x1024"),
  style: z
    .enum([
      "realistic_image",
      "digital illustration",
      "vector illustration",
      "icon",
    ])
    .default("realistic_image"),
  substyle: z.enum(substyles).optional(),
  colors: z.array(z.array(z.number().min(0).max(255)).length(3)).default([]),
});

export function RecraftGenerate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addImage } = useImages();

  const handleSubmit = async (
    data: z.infer<typeof schema> & { apiKey: string }
  ) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        "https://external.api.recraft.ai/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.apiKey}`,
          },
          body: JSON.stringify({
            n: 1,
            model: data.model,
            prompt: data.prompt,
            random_seed: data.randomSeed,
            size: data.size,
            style: data.style,
            substyle: data.substyle,
            controls: {
              colors:
                data.colors.length > 0
                  ? data.colors.map((color) => ({
                      rgb: color,
                    }))
                  : undefined,
            },
          }),
        }
      );

      if (!response.ok) {
        const err = (await response.json()) as {
          code: string;
          message: string;
        };
        throw new Error(err.message);
      }

      const imageData = (await response.json()) as { data: { url: string }[] };
      const imageUrl = imageData.data[0].url;
      const { id } = addImage({
        type: "generate",
        ai: "recraft",
        model: data.model,
        prompt: data.prompt,
        size: data.size,
        url: imageUrl,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 10000,
      });
      router.push(`?image=${id}`);
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GenForm
      ai="recraft"
      title="Recraft Image Generator"
      submitText="Generate"
      schema={schema}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
