"use client";

import { RgbColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export function ColorPickers({
  id,
  onChange,
}: {
  id: string;
  onChange: (colors: { r: number; g: number; b: number }[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>();
  const [colors, setColors] = useState<
    { key: string; r: number; g: number; b: number }[]
  >([]);

  useEffect(() => {
    onChange(colors);
  }, [colors]);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        {colors.map((color) => (
          <ShowPickerTrigger
            key={color.key}
            color={color}
            onClick={() => setSelectedColor(color.key)}
            onDelete={() =>
              setColors((prev) => prev.filter((c) => c.key !== color.key))
            }
          />
        ))}
        <PopoverTrigger
          id={id}
          className="w-10 h-10 flex items-center justify-center rounded-md border border-border cursor-pointer"
          onClick={() => {
            const key = crypto.randomUUID();
            setSelectedColor(key);
            setColors((prev) => [...prev, { key, r: 0, g: 0, b: 0 }]);
            setOpen(true);
          }}
        >
          <PlusIcon className="w-4 h-4" />
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <RgbColorPicker
            color={colors.find((c) => c.key === selectedColor)}
            onChange={(rgb) =>
              setColors((prev) =>
                prev.map((c) =>
                  c.key === selectedColor ? { ...c, ...rgb } : c
                )
              )
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ShowPickerTrigger({
  color,
  onClick,
  onDelete,
}: {
  color: { r: number; g: number; b: number };
  onClick: () => void;
  onDelete: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <PopoverTrigger
      className="w-10 h-10 flex items-center justify-center rounded-md border border-border cursor-pointer relative"
      style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <Cross2Icon
          className="w-3 h-3 bg-white text-muted-foreground border border-muted-foreground rounded-full absolute -top-1 -right-1"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        />
      )}
    </PopoverTrigger>
  );
}
