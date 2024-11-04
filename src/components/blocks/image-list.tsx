"use client";

import { useImages } from "@/contexts/image-context";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ImageViewer } from "@/components/blocks/image-viewer";

export function ImageList() {
  const { images } = useImages();
  const searchParams = useSearchParams();
  const imageId = searchParams.get("image");

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="overflow-x-auto h-32 p-4 shadow-inner">
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

      {imageId && (
        <ImageViewer image={images.find(({ id }) => id === imageId)!} />
      )}
    </>
  );
}
