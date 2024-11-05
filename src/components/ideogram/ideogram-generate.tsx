"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Switch } from "../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  InfoCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useImages } from "@/contexts/image-context";
import {
  aspect_ratios,
  AspectRatio,
  ColorPalette,
  magic_prompt_options,
  MagicPromptOption,
  Model,
  Resolution,
  resolutions,
  style_types,
  StyleType,
} from "./ideogram-types";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type Size =
  | { type: "aspect_ratio"; value: AspectRatio }
  | { type: "resolution"; value: Resolution };

export function IdeogramGenerate() {
  const [model, setModel] = useState<Model>("V_2");
  const [prompt, setPrompt] = useState<string>("");
  const [nagativePrompt, setNagativePrompt] = useState<string>("");
  const [magicPromptOption, setMagicPromptOption] =
    useState<MagicPromptOption>("AUTO");
  const [randomSeed, setRandomSeed] = useState<number>();
  const [styleType, setStyleType] = useState<StyleType>("AUTO");
  const [colorPalette, setColorPalette] = useState<ColorPalette>();
  const [size, setSize] = useState<Size>({
    type: "aspect_ratio",
    value: "ASPECT_1_1",
  });

  const [apiKey, setApiKey] = useState<string>("");
  const [rememberApiKey, setRememberApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addImage } = useImages();

  const router = useRouter();

  const generateImage = async () => {
    setIsLoading(true);
    if (!rememberApiKey) {
      localStorage.removeItem("ideogram-api-key");
    } else {
      localStorage.setItem("ideogram-api-key", apiKey);
    }
    try {
      const body = {
        image_request: {
          model,
          prompt,
          magic_prompt_option: magicPromptOption,
          negative_prompt: nagativePrompt === "" ? undefined : nagativePrompt,
          random_seed: randomSeed,
          style_type: model.startsWith("V_1") ? undefined : styleType,
          color_palette: colorPalette,
          aspect_ratio: undefined as string | undefined,
          resolution: undefined as string | undefined,
        },
      };
      if (size.type === "aspect_ratio") {
        body.image_request.aspect_ratio = size.value;
      } else {
        body.image_request.resolution = size.value;
      }
      const response = await fetch("https://api.ideogram.ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": apiKey,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = (await response.json()) as {
          code: string;
          message: string;
        };
        throw new Error(err.message);
      }

      const data = (await response.json()) as { data: { url: string }[] };
      const imageUrl = data.data[0].url;
      const { id } = addImage(
        "ideogram",
        model,
        prompt,
        size.value,
        imageUrl,
        Date.now() + 1000 * 60 * 60
      );
      setPrompt("");
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const apiKey = localStorage.getItem("ideogram-api-key");
    if (apiKey) {
      setApiKey(apiKey);
      setRememberApiKey(true);
    }
  }, []);

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Ideogram Image Generator</CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="prompt">
              Image Prompt<span className="text-red-500 ml-1">*</span>
            </Label>
            <ToggleGroup
              type="single"
              size="sm"
              defaultValue={magicPromptOption}
              onValueChange={(value) =>
                setMagicPromptOption(value as MagicPromptOption)
              }
            >
              <Tooltip>
                <TooltipTrigger className="text-xs text-muted-foreground flex items-center mr-1">
                  Magic
                  <QuestionMarkCircledIcon className="w-3 h-3 ml-[2px]" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Determine if MagicPrompt should be used in generating the
                    request or not
                  </p>
                </TooltipContent>
              </Tooltip>
              {magic_prompt_options.map((option) => (
                <ToggleGroupItem
                  key={option}
                  value={option}
                  aria-label="Auto"
                  className="text-xs text-muted-foreground"
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <Textarea
            id="prompt"
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="colorPalette">Color Palette</Label>
          <Input
            id="colorPalette"
            placeholder="Enter a color palette"
            value={colorPalette}
          />
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="negativePrompt">Negative Prompt</Label>
          <Textarea
            id="negativePrompt"
            placeholder="Description of what to exclude from an image."
            value={nagativePrompt}
            onChange={(e) => setNagativePrompt(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Random Seed</Label>
          <Input
            type="number"
            value={randomSeed}
            onChange={(e) => setRandomSeed(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Model</Label>
          <Select
            defaultValue={model}
            onValueChange={(value) => setModel(value as Model)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="V_2">V2</SelectItem>
              <SelectItem value="V_2_TURBO">V2 Turbo</SelectItem>
              <SelectItem value="V_1">V1</SelectItem>
              <SelectItem value="V_1_TURBO">V1 Turbo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {model.startsWith("V_2") && (
          <div className="space-y-2">
            <Label>Style</Label>
            <Select
              defaultValue={styleType}
              onValueChange={(value) => setStyleType(value as StyleType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {style_types.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Image Size</Label>
          <Select
            defaultValue={size.value}
            onValueChange={(value) =>
              setSize(
                value.startsWith("ASPECT")
                  ? { type: "aspect_ratio", value: value as AspectRatio }
                  : { type: "resolution", value: value as Resolution }
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aspect_ratios.map((aspect_ratio) => (
                <SelectItem key={aspect_ratio} value={aspect_ratio}>
                  {aspect_ratio}
                </SelectItem>
              ))}
              {resolutions.map((resolution) => (
                <SelectItem
                  key={resolution}
                  value={resolution}
                  disabled={model.startsWith("V_1")}
                >
                  {resolution}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex items-center">
              <Switch
                id="rememberApiKey"
                checked={rememberApiKey}
                onCheckedChange={(checked) => {
                  setRememberApiKey(checked);
                }}
              />
              <Label
                htmlFor="rememberApiKey"
                className={cn(
                  "text-xs text-muted-foreground ml-2 mr-1",
                  rememberApiKey && "text-foreground"
                )}
              >
                Remember
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <InfoCircledIcon className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    This will save your API key in the browser&apos;s local
                    storage.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          className={cn(
            "font-normal",
            isLoading && "animate-pulse disabled:opacity-75"
          )}
          size="lg"
          onClick={generateImage}
          disabled={isLoading || !prompt || !apiKey}
        >
          Generate
        </Button>
      </CardFooter>
    </Card>
  );
}
