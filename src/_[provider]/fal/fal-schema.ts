import { z } from "zod";

export const fal_models = ["fal-ai/flux-pro/v1.1-ultra"] as const;

export type SelectFalSchema<Model extends (typeof fal_models)[number] | null> =
  Model extends "fal-ai/flux-pro/v1.1-ultra"
    ? typeof flux_pro_ultra_schema
    : never;

export const flux_pro_ultra_schema = z.object({
  prompt: z.string().min(1).describe("textarea"),
  seed: z.number().default(Math.floor(Math.random() * 1000000)),
  enable_safety_checker: z.boolean().default(false),
  safety_tolerance: z.number().min(1).max(6).describe("range,1").default(2),
  aspect_ratio: z
    .enum(["21:9", "16:9", "4:3", "1:1", "3:4", "9:16", "9:21"])
    .default("1:1"),
  raw: z.boolean().default(false),
  output_format: z.enum(["jpeg"]).default("jpeg"),
});
