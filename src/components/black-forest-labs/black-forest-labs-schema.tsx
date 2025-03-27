import { z } from "zod";

export const sizeSchema = z
  .number()
  .min(256)
  .max(1440)
  .describe("range,32")
  .refine((n) => n % 32 === 0, "Must be a multiple of 32");

export const schema = z
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
