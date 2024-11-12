"use client";

import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { CopyIcon, DownloadIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Image as ImageType } from "@/contexts/image-context";

export function ImageViewer({ image }: { image: ImageType }) {
  const [isCopying, setIsCopying] = useState(false);
  const router = useRouter();

  const handleDownload = async () => {
    if (image.type === "generate" && image.raw) {
      window.open(image.url, "_blank");
      return;
    }
    var link = document.createElement("a");
    link.setAttribute("download", "");
    link.href = `/image/download?url=${encodeURIComponent(image.url)}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      let blob: Blob;
      if (
        image.provider === "openai" ||
        image.provider === "ideogram" ||
        image.provider === "black-forest-labs"
      ) {
        const response = await fetch(
          `/image/download?url=${encodeURIComponent(image.url)}`
        );
        blob = await response.blob();
      } else if (image.provider === "recraft") {
        const response = await fetch(image.url);
        blob = await response.blob();
      } else {
        throw new Error("Invalid AI type");
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      toast({
        title: "Image copied",
        description: "The image has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {image.provider === "openai"
              ? "OpenAI Image"
              : image.provider === "recraft"
              ? "Recraft Image"
              : image.provider === "ideogram"
              ? "Ideogram Image"
              : "Black Forest Labs Image"}
          </DialogTitle>
          <div className="flex items-center gap-2 pt-2">
            <Badge>{image.type}</Badge>
            {(image.type === "generate" || image.type === "text-to-image") && (
              <Badge variant="outline">{image.model}</Badge>
            )}
            {(image.type === "generate" || image.type === "text-to-image") && (
              <Badge variant="outline">{image.size}</Badge>
            )}
            {(image.type === "generate" || image.type === "text-to-image") && (
              <Tooltip defaultOpen={false}>
                <TooltipTrigger>
                  <Badge variant="outline" className="flex items-center">
                    <Pencil1Icon className="w-3 h-3 mr-1 mt-[2px]" />
                    prompt
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{image.prompt}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <DialogDescription className="flex flex-col gap-1 text-xs pt-2">
            <span>Please download it to keep a permanent copy.</span>
            {image.provider !== "recraft" && (
              <span>
                Expires at: {new Date(image.expiresAt).toLocaleString()}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <DownloadIcon className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleCopy} disabled={isCopying}>
              <CopyIcon className="w-4 h-4" />
              Copy
            </Button>
          </div>
          <div className="flex justify-center p-10">
            <div className="w-64 h-64 relative">
              <Image
                src={image.url}
                alt="Generated Image"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
