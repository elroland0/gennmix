"use server";

import Replicate from "replicate";

export async function runReplicate<T>(
  apiKey: string,
  model: `${string}/${string}` | `${string}/${string}:${string}`,
  input: Record<string, any>
) {
  const replicate = new Replicate({
    auth: apiKey,
  });
  let prediction = await replicate.predictions.create({
    model,
    input: Object.fromEntries(
      Object.entries(input).filter(([key]) => key !== "apiKey")
    ),
  });
  while (
    prediction.status === "starting" ||
    prediction.status === "processing"
  ) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    prediction = await replicate.predictions.get(prediction.id);
  }
  return prediction;
}
