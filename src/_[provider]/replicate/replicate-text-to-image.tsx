import { GenForm } from "@/components/common/gen-form";
import { useState } from "react";
import {
  flux_1_1_pro_ultra_schema,
  replicate_models,
} from "./replicate-schema";
import { useImages } from "@/contexts/image-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import Replicate from "replicate";
import { toast } from "sonner";
import { runReplicate } from "./replicate-server-actions";

export function ReplicateTextToImage() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [model, setModel] = useState<(typeof replicate_models)[number] | null>(
    null
  );
  const { addImage } = useImages();

  const handleSubmit = async (
    data: z.infer<typeof flux_1_1_pro_ultra_schema> & { apiKey: string }
  ) => {
    if (!model) return;

    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 3000);

    toast.promise(
      async () => {
        const prediction = await runReplicate<{ id: string; output: string }>(
          data.apiKey,
          model,
          Object.fromEntries(
            Object.entries(data).filter(([key]) => key !== "apiKey")
          )
        );

        addImage({
          id: prediction.id,
          type: "text-to-image",
          provider: "replicate",
          model,
          prompt: data.prompt,
          size: data.aspect_ratio,
          url: prediction.output,
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
        });
      },
      {
        loading: "Generating image...",
        success: "Image generated successfully!",
        error: (e) => {
          console.error(e);
          return "Failed to generate image";
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={model ?? ""}
        onValueChange={(value) =>
          setModel(value as (typeof replicate_models)[number])
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {replicate_models.map((model) => (
            <SelectItem key={model} value={model}>
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {model && model === "black-forest-labs/flux-1.1-pro-ultra" && (
        <GenForm
          schema={flux_1_1_pro_ultra_schema}
          provider="replicate"
          submitText="Run"
          onSubmit={handleSubmit}
          isSubmitting={isDisabled}
        />
      )}
    </div>
  );
}
