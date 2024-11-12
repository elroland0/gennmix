import { Layer, Stage } from "react-konva";
import { Element, ElementBase } from "./elements/element";
import { useState } from "react";

export function StudioCanvas() {
  const [elements, setElements] = useState<ElementBase[]>([
    { id: "1", x: 100, y: 100, width: 100, height: 100, fill: "red" },
    { id: "2", x: 200, y: 200, width: 100, height: 100, fill: "blue" },
    { id: "3", x: 300, y: 300, width: 100, height: 100, fill: "green" },
  ]);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string, selected: boolean) => {
    setSelected(selected ? id : null);
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {elements.map((element) => (
          <Element
            key={element.id}
            id={element.id}
            initial={element}
            selected={selected === element.id}
            onSelect={handleSelect}
          />
        ))}
      </Layer>
    </Stage>
  );
}
