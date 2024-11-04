"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ImageContextType = {
  images: { id: string; url: string; expiresAt: number }[];
  addImage: (url: string, expiresAt: number) => { id: string };
  clearImages: () => void;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<
    { id: string; url: string; expiresAt: number }[]
  >([]);

  useEffect(() => {
    const storedImages = localStorage.getItem("images");
    if (storedImages) {
      const parsedImages = JSON.parse(storedImages) as {
        id?: string;
        url: string;
        expiresAt: number;
      }[];
      const filteredImages = parsedImages.filter(
        (image) => image.expiresAt > Date.now()
      );
      const imagesWithId = filteredImages.map((image) => {
        if (!image.id) {
          return { ...image, id: crypto.randomUUID() };
        }
        return image;
      }) as { id: string; url: string; expiresAt: number }[];

      setImages(imagesWithId);
      localStorage.setItem("images", JSON.stringify(imagesWithId));
    } else {
      setImages([]);
    }
  }, []);

  const addImage = (url: string, expiresAt: number) => {
    const id = crypto.randomUUID();
    const newImages = [{ id, url, expiresAt }, ...images];
    localStorage.setItem("images", JSON.stringify(newImages));
    setImages(newImages);
    return { id };
  };

  const clearImages = () => {
    setImages([]);
    localStorage.removeItem("images");
  };

  return (
    <ImageContext.Provider value={{ images, addImage, clearImages }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImages() {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useImages must be used within an ImageProvider");
  }
  return context;
}
