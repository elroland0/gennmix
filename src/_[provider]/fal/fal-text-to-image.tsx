import { GenForm } from "@/components/common/gen-form";
import { useState } from "react";
import {
  fal_models,
  flux_pro_ultra_schema,
  SelectFalSchema,
} from "./fal-schema";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ApiError, fal } from "@fal-ai/client";
import { z } from "zod";
import { useImages } from "@/contexts/image-context";

export function FalTextToImage() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [model, setModel] = useState<(typeof fal_models)[number] | null>(null);
  const { addImage } = useImages();

  const handleSubmit = (
    values: z.infer<SelectFalSchema<typeof model>> & { apiKey: string }
  ) => {
    if (!model) return;

    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 3000);

    toast.promise(
      async () => {
        fal.config({ credentials: values.apiKey });
        const result = (await fal.subscribe(model, {
          input: values,
          pollInterval: 2000,
        })) as {
          data: {
            images: {
              url: string;
              content_type: string;
            }[];
          };
        };

        addImage({
          type: "text-to-image",
          provider: "fal",
          model,
          prompt: values.prompt,
          size: values.aspect_ratio,
          url: result.data.images[0].url,
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
        });
      },
      {
        loading: "Generating...",
        success: "Done!",
        error: (e) => {
          console.error(e);
          if (e instanceof ApiError) {
            if (e.status === 401) return "Invalid API key";
            const detail = e.body.detail as string | { msg: string }[];
            if (typeof detail === "string") return detail;
            return detail.map((d) => d.msg).join("\n");
          }
          return "An error occurred";
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={model ?? ""}
        onValueChange={(value) =>
          setModel(value as (typeof fal_models)[number])
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {fal_models.map((model) => (
            <SelectItem key={model} value={model}>
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {model && model === "fal-ai/flux-pro/v1.1-ultra" && (
        <GenForm
          schema={flux_pro_ultra_schema}
          provider="fal"
          submitText="Run"
          onSubmit={handleSubmit}
          isSubmitting={isDisabled}
        />
      )}
    </div>
  );
}
