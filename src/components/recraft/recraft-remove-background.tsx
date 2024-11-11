"use client";

import { z } from "zod";
import { GenForm } from "../common/gen-form";
import { useImages } from "@/contexts/image-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  image: z.instanceof(File).describe("image"),
});

export function RecraftRemoveBackground() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addImage } = useImages();
  const router = useRouter();

  const handleSubmit = async (
    values: z.infer<typeof schema> & { apiKey: string }
  ) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("image", values.image);
      const res = await fetch(
        "https://external.api.recraft.ai/v1/images/removeBackground",
        {
          headers: {
            Authorization: `Bearer ${values.apiKey}`,
          },
          method: "POST",
          body: formData,
        }
      );
      const { image } = (await res.json()) as { image: { url: string } };
      if (!res.ok) {
        const err = (await res.json()) as {
          code: string;
          message: string;
        };
        throw new Error(err.message);
      }
      const { id } = addImage({
        type: "remove-background",
        url: image.url,
        provider: "recraft",
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 10000,
      });
      router.push(`?image=${id}`);
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
      provider="recraft"
      title="Remove Background"
      schema={schema}
      submitText="Remove Background"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
