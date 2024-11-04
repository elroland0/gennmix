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
import mime from "mime";

export function ImageViewer({
  image,
}: {
  image: {
    id: string;
    url: string;
    expiresAt: number;
    ai?: "dall-e" | "recraft";
    model?: string;
    prompt?: string;
    size?: string;
  };
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const router = useRouter();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      let blob: Blob;
      if (!image.ai || image.ai === "dall-e") {
        const res = await fetch(
          `/image/download?url=${encodeURIComponent(image.url)}`,
          {
            method: "POST",
          }
        );
        blob = await res.blob();
      } else if (image.ai === "recraft") {
        const res = await fetch(image.url);
        blob = await res.blob();
      } else {
        throw new Error("Invalid AI type");
      }

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      const format = mime.getExtension(blob.type);
      a.download = `generated-image.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      let blob: Blob;
      if (!image.ai || image.ai === "dall-e") {
        const response = await fetch(
          `/image/download?url=${encodeURIComponent(image.url)}`,
          {
            method: "POST",
          }
        );
        blob = await response.blob();
      } else if (image.ai === "recraft") {
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
          <DialogTitle className="flex items-center gap-2">
            {!image.ai || image.ai === "dall-e"
              ? "DALL-E Image"
              : "Recraft Image"}
            {image.model && <Badge>{image.model}</Badge>}
            {image.size && <Badge variant="outline">{image.size}</Badge>}
            {image.prompt && (
              // defaultOpen={false} doesn't work here why?
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
          </DialogTitle>
          <DialogDescription>
            {!Number.isFinite(image.expiresAt)
              ? "This image will expire in 1 hour. Please download it to keep a permanent copy."
              : "This image can be lost if the browser cache is cleared. Please download it to keep a permanent copy."}
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <DownloadIcon className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleCopy} disabled={isCopying}>
              <CopyIcon className="w-4 h-4" />
              Copy
            </Button>
          </div>
          <div className="flex justify-center p-10">
            <Image
              src={image.url}
              alt="Generated Image"
              width={256}
              height={256}
              unoptimized
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
