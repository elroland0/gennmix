"use client";

import { z } from "zod";
import { GenForm } from "../common/gen-form";
import { useImages } from "@/contexts/image-context";
import { schema } from "./black-forest-labs-schema";
import { generateImage } from "./black-forest-labs-server-actions";
import { toast } from "sonner";

export function BlackForestLabsGenerate() {
  const { addImage } = useImages();

  const handleSubmit = async (
    values: z.infer<typeof schema> & { apiKey: string }
  ) => {
    toast.promise(
      async () => {
        const image = await generateImage(values);

        if (image.status === "Ready") {
          addImage({
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
        }

        if (image.status === "Error") {
          throw new Error("Error happened while generating image");
        }
      },
      {
        loading: "Generating...",
        success: "Image generated successfully",
        error: (e) => {
          if (e instanceof Error) {
            return e.message;
          } else {
            return "Something went wrong";
          }
        },
      }
    );
  };

  return (
    <GenForm
      provider="black-forest-labs"
      title="Generate Image"
      submitText="Generate"
      schema={schema}
      onSubmit={handleSubmit}
      isSubmitting={false}
    />
  );
}
