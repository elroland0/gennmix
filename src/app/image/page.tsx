"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageViewer } from "@/components/blocks/image-viewer";

export default function ImagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("url");

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.push("/");
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generated Image</DialogTitle>
          <DialogDescription>
            This image will expire in 1 hour. Please download it to keep a
            permanent copy.
          </DialogDescription>
        </DialogHeader>
        {imageUrl ? (
          <ImageViewer imageUrl={imageUrl} />
        ) : (
          <div>No image URL provided</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
