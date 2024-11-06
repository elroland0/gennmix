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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useImages } from "@/contexts/image-context";
import {
  Model,
  Size,
  sizes,
  Style,
  Substyle,
  substyles,
} from "./recraft-types";

export function RecraftGenerate() {
  const [model, setModel] = useState<Model>("recraftv3");
  const [prompt, setPrompt] = useState<string>("");
  const [randomSeed, setRandomSeed] = useState<number>();
  const [size, setSize] = useState<Size>("1024x1024");
  const [style, setStyle] = useState<Style>({
    base: "realistic_image",
    substyle: undefined,
  });
  const [apiKey, setApiKey] = useState<string>("");
  const [rememberApiKey, setRememberApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addImage } = useImages();

  const router = useRouter();

  const generateImage = async () => {
    setIsLoading(true);
    if (!rememberApiKey) {
      localStorage.removeItem("recraft-api-key");
    } else {
      localStorage.setItem("recraft-api-key", apiKey);
    }
    try {
      const response = await fetch(
        "https://external.api.recraft.ai/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            n: 1,
            model,
            prompt,
            random_seed: randomSeed,
            size,
            style: style.base,
            substyle: style.substyle,
          }),
        }
      );

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
        "recraft",
        model,
        prompt,
        size,
        imageUrl,
        Date.now() + 1000 * 60 * 60 * 24 * 10000
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
    const apiKey = localStorage.getItem("recraft-api-key");
    if (apiKey) {
      setApiKey(apiKey);
      setRememberApiKey(true);
    }
  }, []);

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Recraft Image Generator</CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">
            Image Prompt<span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="prompt"
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="randomSeed">Random Seed</Label>
          <Input
            id="randomSeed"
            type="number"
            value={randomSeed}
            onChange={(e) => setRandomSeed(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select
            defaultValue={model}
            onValueChange={(value) => setModel(value as Model)}
          >
            <SelectTrigger id="model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recraftv3">Recraft V3</SelectItem>
              <SelectItem value="recraft20b">Recraft 20B</SelectItem>
              <SelectItem value="refm1">REFM1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Image Size</Label>
          <Select
            defaultValue={size}
            onValueChange={(value) => setSize(value as Size)}
          >
            <SelectTrigger id="size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="style">Style</Label>
          <Select
            defaultValue={style.base}
            onValueChange={(value) =>
              setStyle((prev) => ({ ...prev, base: value as Style["base"] }))
            }
          >
            <SelectTrigger id="style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realistic_image">Realistic Image</SelectItem>
              <SelectItem value="digital illustration">
                Digital Illustration
              </SelectItem>
              <SelectItem value="vector illustration">
                Vector Illustration
              </SelectItem>
              <SelectItem value="icon">Icon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="substyle">Substyle</Label>
          <Select
            defaultValue={style.substyle || "none"}
            onValueChange={(value) =>
              setStyle((prev) => ({
                ...prev,
                substyle: value === "none" ? undefined : (value as Substyle),
              }))
            }
          >
            <SelectTrigger id="substyle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">none</SelectItem>
              {substyles.map((substyle) => (
                <SelectItem key={substyle} value={substyle}>
                  {substyle}
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
              <TooltipProvider>
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
              </TooltipProvider>
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
