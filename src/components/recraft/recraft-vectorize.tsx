"use client";

import { useState } from "react";
import { GenForm } from "../common/gen-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useImages } from "@/contexts/image-context";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  image: z.instanceof(File).describe("image"),
});

export function RecraftVectorize() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addImage } = useImages();

  const handleSubmit = async (
    values: z.infer<typeof schema> & { apiKey: string }
  ) => {
    const formData = new FormData();
    formData.append("image", values.image);

    try {
      setIsSubmitting(true);
      const res = await fetch(
        "https://external.api.recraft.ai/v1/images/vectorize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${values.apiKey}`,
          },
          body: formData,
        }
      );
      if (!res.ok) {
        const err = (await res.json()) as {
          code: string;
          message: string;
        };
        throw new Error(err.message);
      }
      const { image } = (await res.json()) as { image: { url: string } };
      const { id } = addImage({
        type: "vectorize",
        ai: "recraft",
        url: image.url,
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
      title="Recraft Image Vectorize"
      ai="recraft"
      schema={schema}
      submitText="Vectorize"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
