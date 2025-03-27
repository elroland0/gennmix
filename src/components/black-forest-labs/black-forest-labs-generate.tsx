"use client";

import { z } from "zod";
import { GenForm } from "../common/gen-form";
import { useState } from "react";
import { useImages } from "@/contexts/image-context";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { schema } from "./black-forest-labs-schema";
import { generateImage } from "./black-forest-labs-server-actions";

export function BlackForestLabsGenerate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addImage } = useImages();
  const router = useRouter();

  const handleSubmit = async (
    values: z.infer<typeof schema> & { apiKey: string }
  ) => {
    try {
      setIsSubmitting(true);
      const image = await generateImage(values);

      if (image.status === "Ready") {
        const { id } = addImage({
          id: image.id,
          type: "generate",
          provider: "black-forest-labs",
          model: values.model,
          url: image.result.sample,
          prompt: values.prompt,
          size:
            values.model === "flux-pro-1.1-ultra"
              ? values.aspect_ratio
              : `${values.width}x${values.height}`,
          expiresAt: Date.now() + 1000 * 60 * 10,
          raw: values.model === "flux-pro-1.1-ultra" ? values.raw : undefined,
        });
        router.push(`?image=${id}`);
      }

      if (image.status === "Error") {
        throw new Error("Error happened while generating image");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <GenForm
      provider="black-forest-labs"
      title="Generate Image"
      submitText="Generate"
      schema={schema}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
