"use client";

import { z } from "zod";
import { GenForm } from "../common/gen-form";
import { useState } from "react";
import { useImages } from "@/contexts/image-context";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const sizeSchema = z
  .number()
  .min(256)
  .max(1440)
  .describe("range,32")
  .refine((n) => n % 32 === 0, "Must be a multiple of 32");

const schema = z
  .object({
    prompt: z.string().min(1).describe("textarea"),
  })
  .and(
    z
      .discriminatedUnion("model", [
        z.object({
          model: z.literal("flux-pro-1.1"),
          prompt_upsampling: z.boolean().default(false),
          width: sizeSchema,
          height: sizeSchema,
        }),
        z.object({
          model: z.literal("flux-pro-1.1-ultra"),
          aspect_ratio: z.enum([
            "21:9",
            "16:9",
            "3:2",
            "4:3",
            "1:1",
            "3:4",
            "2:3",
            "9:16",
            "9:21",
          ]),
          raw: z.boolean().default(false),
        }),
        z.object({
          model: z.literal("flux-pro"),
          prompt_upsampling: z.boolean().default(false),
          width: sizeSchema,
          height: sizeSchema,
          steps: z.number().min(1).max(50).describe("range,1").optional(),
          guidance: z.number().min(1.5).max(5).describe("range,0.1").optional(),
          interval: z.number().min(1).max(4).describe("range,1").optional(),
        }),
        z.object({
          model: z.literal("flux-dev"),
          prompt_upsampling: z.boolean().default(false),
          width: sizeSchema,
          height: sizeSchema,
          steps: z.number().min(1).max(50).describe("range,1").optional(),
          guidance: z.number().min(1.5).max(5).describe("range,0.1").optional(),
        }),
      ])
      .default({
        model: "flux-pro-1.1",
        width: 1024,
        height: 768,
      })
  )
  .and(
    z.object({
      output_format: z.enum(["png", "jpeg"]).default("png"),
      seed: z.number().int().optional(),
      safety_tolerance: z.number().min(0).max(6).describe("range,1").optional(),
    })
  );

export function BlackForestLabsGenerate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addImage } = useImages();
  const router = useRouter();

  const handleSubmit = async (
    values: z.infer<typeof schema> & { apiKey: string }
  ) => {
    try {
      setIsSubmitting(true);
      let endpoint = `https://api.bfl.ml/v1/${values.model}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Key": values.apiKey,
        },
        body: JSON.stringify({
          ...Object.fromEntries(
            Object.entries(values).filter(
              ([key]) => key !== "apiKey" && key !== "model"
            )
          ),
        }),
      });

      if (!res.ok) {
        const error = (await res.json()) as {
          detail: { msg: string }[] | string;
        };
        throw new Error(
          typeof error.detail === "string"
            ? error.detail
            : error.detail.map((d) => d.msg).join("\n")
        );
      }

      const task = (await res.json()) as { id: string };

      // Poll for result
      let image;
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = await fetch(
          `https://api.bfl.ml/v1/get_result?id=${task.id}`
        );

        if (!result.ok) {
          throw new Error("Error happened while generating image");
        }

        image = (await result.json()) as
          | {
              id: string;
              status:
                | "Task not found"
                | "Pending"
                | "Request Moderated"
                | "Content Moderated"
                | "Error";
              result: null;
            }
          | {
              id: string;
              status: "Ready";
              result: {
                duration: number;
                start_time: number;
                end_time: number;
                prompt: string;
                sample: string;
                seed: number;
              };
            };

        if (image.status === "Ready" || image.status === "Error") {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

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
