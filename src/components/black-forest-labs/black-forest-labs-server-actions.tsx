"use server";

import { z } from "zod";
import { schema } from "./black-forest-labs-schema";

export const generateImage = async (
  values: z.infer<typeof schema> & { apiKey: string }
) => {
  let endpoint = `https://api.us1.bfl.ai/v1/${values.model}`;
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
      `https://api.us1.bfl.ai/v1/get_result?id=${task.id}`
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

  return image;
};
