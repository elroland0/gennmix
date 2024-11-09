"use client";

import { useImages } from "@/contexts/image-context";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ImageViewer } from "@/components/common/image-viewer";
import { useRef } from "react";
import { Button } from "../ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

export function ImageList() {
  const listRef = useRef<HTMLDivElement>(null);
  const { images, removeImage } = useImages();
  const searchParams = useSearchParams();
  const imageId = searchParams.get("image");

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full flex items-center justify-between h-32 p-4 shadow-inner">
        <Button
          variant="ghost"
          className="h-24 w-24"
          onClick={() => {
            if (!listRef.current) return;
            listRef.current.scrollTo({
              left: listRef.current.scrollLeft - 96 * 5,
              behavior: "smooth",
            });
          }}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        <div ref={listRef} className="flex-1 overflow-x-auto no-scrollbar px-4">
          <div className="space-x-4 flex items-center min-w-max">
            {images.map((image) => (
              <ImageItem key={image.id} image={image} onRemove={removeImage} />
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          className="h-24 w-24"
          onClick={() => {
            if (!listRef.current) return;
            listRef.current.scrollTo({
              left: listRef.current.scrollLeft + 96 * 5,
              behavior: "smooth",
            });
          }}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {imageId && (
        <ImageViewer image={images.find(({ id }) => id === imageId)!} />
      )}
    </>
  );
}

function ImageItem({
  image,
  onRemove,
}: {
  image: { id: string; url: string };
  onRemove: (id: string) => void;
}) {
  return (
    <div className="group relative w-24 h-24">
      <Link href={`?image=${image.id}`} className="absolute inset-0">
        <Image
          src={image.url}
          alt="Generated image"
          className="object-contain rounded-lg overflow-hidden"
          loading="lazy"
          fill
          unoptimized
        />
      </Link>
      <Button
        variant="ghost"
        className="absolute top-0 right-0 bg-red-400 text-neutral-50 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-neutral-100 p-0 w-6 h-6 rounded-md"
        onClick={() => onRemove(image.id)}
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
