"use client";

import { useImages } from "@/contexts/image-context";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ImageViewer } from "@/components/common/image-viewer";
import { useRef } from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

export function ImageList() {
  const listRef = useRef<HTMLDivElement>(null);
  const { images } = useImages();
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
            {images.map(({ id, url }, index) => (
              <Link key={id} href={`?image=${id}`}>
                <Image
                  src={url}
                  alt={`Generated image ${index + 1}`}
                  width={96}
                  height={96}
                  className="object-cover rounded-lg"
                  unoptimized
                />
              </Link>
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
