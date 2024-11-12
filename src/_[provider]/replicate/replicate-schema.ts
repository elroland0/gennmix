import { z } from "zod";

export const replicate_models = [
  "black-forest-labs/flux-1.1-pro-ultra",
] as const;

export const flux_1_1_pro_ultra_schema = z.object({
  prompt: z.string().min(1).describe("textarea"),
  aspect_ratio: z
    .enum([
      "21:9",
      "16:9",
      "3:2",
      "4:3",
      "5:4",
      "1:1",
      "4:5",
      "3:4",
      "2:3",
      "9:16",
      "9:21",
    ])
    .default("1:1"),
  safety_tolerance: z.number().int().min(1).max(6).default(2),
  seed: z
    .number()
    .int()
    .default(Math.floor(Math.random() * 1000000)),
  raw: z.boolean().default(false),
  output_format: z.enum(["jpg", "png"]).default("jpg"),
});
