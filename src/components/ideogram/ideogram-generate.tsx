"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useImages } from "@/contexts/image-context";
import {
  aspect_ratios,
  color_palette_names,
  magic_prompt_options,
  resolutions,
  style_types,
} from "./ideogram-types";
import { z } from "zod";
import { GenForm } from "../common/gen-form";
import { generateIdeogram } from "./ideogram-server-actions";

const schema = z
  .object({
    prompt: z.string().min(1).describe("textarea"),
    magicPromptOption: z.enum(magic_prompt_options).default("AUTO"),
    nagativePrompt: z.string().min(1).describe("textarea").optional(),
  })
  .and(
    z
      .discriminatedUnion("model", [
        z.object({
          model: z.literal("V_2"),
          size: z.enum([...aspect_ratios, ...resolutions]),
          style: z.enum(style_types),
        }),
        z.object({
          model: z.literal("V_2_TURBO"),
          size: z.enum([...aspect_ratios, ...resolutions]),
          style: z.enum(style_types),
        }),
        z.object({
          model: z.literal("V_1"),
          size: z.enum(aspect_ratios),
        }),
        z.object({
          model: z.literal("V_1_TURBO"),
          size: z.enum(aspect_ratios),
        }),
      ])
      .default({ model: "V_2", size: "ASPECT_1_1", style: "AUTO" })
  )
  .and(
    z
      .discriminatedUnion("colorPaletteType", [
        z.object({
          colorPaletteType: z.literal("none"),
        }),
        z.object({
          colorPaletteType: z.literal("name"),
          colorPalette: z.enum(color_palette_names),
        }),
        z.object({
          colorPaletteType: z.literal("members"),
        }),
      ])
      .default({ colorPaletteType: "none" })
  )
  .and(
    z.object({
      seed: z.number().int().optional(),
    })
  );

export function IdeogramGenerate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addImage } = useImages();
  const router = useRouter();

  const handleSubmit = async (
    data: z.infer<typeof schema> & { apiKey: string }
  ) => {
    try {
      setIsSubmitting(true);
      const generated = await generateIdeogram(
        data.apiKey,
        JSON.stringify({
          image_request: {
            model: data.model,
            prompt: data.prompt,
            magic_prompt_option: data.magicPromptOption,
            negative_prompt:
              data.nagativePrompt === "" ? undefined : data.nagativePrompt,
            seed: data.seed,
            style_type:
              data.model === "V_2" || data.model === "V_2_TURBO"
                ? data.style
                : undefined,
            color_palette:
              data.colorPaletteType !== "none"
                ? {
                    name:
                      data.colorPaletteType === "name"
                        ? data.colorPalette
                        : undefined,
                  }
                : undefined,
            aspect_ratio: data.size.startsWith("ASPECT")
              ? data.size
              : undefined,
            resolution: data.size.startsWith("RESOLUTION")
              ? data.size
              : undefined,
          },
        })
      );

      if ("error" in generated) {
        throw new Error(generated.error);
      }

      const imageUrl = generated.data[0].url;
      const { id } = addImage({
        type: "generate",
        provider: "ideogram",
        model: data.model,
        prompt: data.prompt,
        size: data.size,
        url: imageUrl,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24,
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
      provider="ideogram"
      title="Ideogram Image Generator"
      schema={schema}
      submitText="Generate"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
