"use client";

import { z } from "zod";
import { sizes, styles } from "./openai-types";
import { GenForm } from "../common/gen-form";
import { useState } from "react";
import { useImages } from "@/contexts/image-context";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const schema = z
  .object({
    prompt: z.string().min(1).describe("textarea"),
  })
  .and(
    z
      .discriminatedUnion("model", [
        z.object({
          model: z.literal("dall-e-3-standard"),
          size: z.enum(sizes["dall-e-3-standard"]).default("1024x1024"),
          style: z.enum(styles).default("vivid"),
        }),
        z.object({
          model: z.literal("dall-e-3-hd"),
          size: z.enum(sizes["dall-e-3-hd"]).default("1024x1024"),
          style: z.enum(styles).default("vivid"),
        }),
        z.object({
          model: z.literal("dall-e-2"),
          size: z.enum(sizes["dall-e-2"]).default("1024x1024"),
        }),
      ])
      .default({
        model: "dall-e-3-standard",
      })
  );

export function OpenAiGenerate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addImage } = useImages();

  const handleSubmit = async (
    data: z.infer<typeof schema> & { apiKey: string }
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.apiKey}`,
          },
          body: JSON.stringify({
            prompt: data.prompt,
            model: data.model === "dall-e-2" ? "dall-e-2" : "dall-e-3",
            quality: data.model.startsWith("dall-e-3")
              ? data.model === "dall-e-3-hd"
                ? "hd"
                : "standard"
              : undefined,
            size: data.size,
            style: data.model !== "dall-e-2" ? data.style : undefined,
            n: 1,
          }),
        }
      );

      if (!response.ok) {
        const err = (await response.json()) as any;
        throw new Error(err.error.message);
      }

      const imageData = (await response.json()) as { data: { url: string }[] };
      const imageUrl = imageData.data[0].url;
      const { id } = addImage({
        type: "generate",
        ai: "openai",
        model: data.model,
        prompt: data.prompt,
        size: data.size,
        url: imageUrl,
        expiresAt: Date.now() + 1000 * 60 * 60,
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
      ai="openai"
      title="OpenAI DALL-E"
      schema={schema}
      submitText="Generate"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
