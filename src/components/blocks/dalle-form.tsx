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

export type Model = "dall-e-3-standard" | "dall-e-3-hd" | "dall-e-2";
export type ImageSize = "256x256" | "512x512" | "1024x1024";
export type Style = "vivid" | "natural";

export function DalleForm() {
  const [prompt, setPrompt] = useState<string>("");
  const [model, setModel] = useState<Model>("dall-e-3-standard");
  const [imageSize, setImageSize] = useState<ImageSize>("1024x1024");
  const [style, setStyle] = useState<Style>("vivid");
  const [apiKey, setApiKey] = useState<string>("");
  const [rememberApiKey, setRememberApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addImage } = useImages();

  const router = useRouter();

  const generateImage = async () => {
    setIsLoading(true);
    if (!rememberApiKey) {
      localStorage.removeItem("openai-api-key");
    } else {
      localStorage.setItem("openai-api-key", apiKey);
    }
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model === "dall-e-2" ? "dall-e-2" : "dall-e-3",
            quality: model === "dall-e-3-hd" ? "hd" : "standard",
            prompt,
            n: 1,
            size: imageSize,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = (await response.json()) as { data: { url: string }[] };
      const imageUrl = data.data[0].url;
      addImage(imageUrl, Date.now() + 1000 * 60 * 60);
      router.push(`/image?url=${encodeURIComponent(imageUrl)}`);
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while generating the image.",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const apiKey = localStorage.getItem("openai-api-key");
    if (apiKey) {
      setApiKey(apiKey);
      setRememberApiKey(true);
    }
  }, []);

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>DALL-E Image Generator</CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">Image Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
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
              <SelectItem value="dall-e-3-standard">
                DALL-E 3 Standard
              </SelectItem>
              <SelectItem value="dall-e-3-hd">DALL-E 3 HD</SelectItem>
              <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Image Size</Label>
          <Select
            defaultValue={imageSize}
            onValueChange={(value) => setImageSize(value as ImageSize)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {model === "dall-e-2" && (
                <>
                  <SelectItem value="1024x1024">1024x1024</SelectItem>
                  <SelectItem value="512x512">512x512</SelectItem>
                  <SelectItem value="256x256">256x256</SelectItem>
                </>
              )}
              {model !== "dall-e-2" && (
                <>
                  <SelectItem value="1792x1024">1792x1024</SelectItem>
                  <SelectItem value="1024x1792">1024x1792</SelectItem>
                  <SelectItem value="1024x1024">1024x1024</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {model !== "dall-e-2" && (
          <div className="space-y-2">
            <Label>Style</Label>
            <Select
              defaultValue={style}
              onValueChange={(value) => setStyle(value as Style)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vivid">vivid</SelectItem>
                <SelectItem value="natural">natural</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

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
