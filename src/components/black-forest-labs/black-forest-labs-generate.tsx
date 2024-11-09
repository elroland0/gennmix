"use client";

import { z } from "zod";
import { GenForm } from "../common/gen-form";
import { useState } from "react";
import { useImages } from "@/contexts/image-context";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const schema = z
  .object({
    prompt: z.string().min(1).describe("textarea"),
    seed: z.number().optional(),
    safety_tolerance: z.number().min(0).max(6).optional(),
  })
  .and(
    z
      .discriminatedUnion("model", [
        z.object({
          model: z.literal("flux-pro-1.1"),
          prompt_upsampling: z.boolean().default(false),
          width: z.number().min(256).max(1440).default(1024),
          height: z.number().min(256).max(1440).default(768),
        }),
        z.object({
          model: z.literal("flux-pro-1.1-ultra"),
          aspect_ratio: z
            .enum([
              "21:9",
              "16:9",
              "3:2",
              "4:3",
              "1:1",
              "3:4",
              "2:3",
              "9:16",
              "9:21",
            ])
            .default("16:9"),
          raw: z.boolean().default(false),
        }),
        z.object({
          model: z.literal("flux-pro"),
          prompt_upsampling: z.boolean().default(false),
          width: z.number().min(256).max(1440),
          height: z.number().min(256).max(1440),
          steps: z.number().min(1).max(50).optional(),
          guidance: z.number().min(1.5).max(5).optional(),
          interval: z.number().min(1).max(4).optional(),
        }),
        z.object({
          model: z.literal("flux-dev"),
          prompt_upsampling: z.boolean().default(false),
          width: z.number().min(256).max(1440),
          height: z.number().min(256).max(1440),
          steps: z.number().min(1).max(50).optional(),
          guidance: z.number().min(1.5).max(5).optional(),
        }),
      ])
      .default({
        model: "flux-pro-1.1",
      })
      .and(
        z.object({
          output_format: z.enum(["png", "jpeg"]).default("png"),
        })
      )
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
          detail: { msg: string }[];
        };
        throw new Error(error.detail.map((d) => d.msg).join("\n"));
      }

      const task = (await res.json()) as { id: string };

      // Poll for result
      let image;
      while (true) {
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

        // Wait 2 seconds before next poll
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (image.status === "Ready") {
        const { id } = addImage({
          id: image.id,
          ai: "black-forest-labs",
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
      ai="black-forest-labs"
      title="Generate Image"
      submitText="Generate"
      schema={schema}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
