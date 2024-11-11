import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Rect, Transformer } from "react-konva";

export type ElementBase = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

export type ElementProps = {
  id: string;
  initial: Omit<ElementBase, "id">;
  selected: boolean;
  onSelect: (id: string, selected: boolean) => void;
};

export function Element({ id, initial, selected, onSelect }: ElementProps) {
  const ref = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const [{ x, y, width, height, fill }, setProps] = useState(initial);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const { x, y } = e.target.position();
    setProps({ x, y, width, height, fill });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    // transformer is changing scale of the node
    // and NOT its width or height
    // but in the store we have only width and height
    // to match the data better we will reset scale on transform end
    const node = ref.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // we will reset it back
    node.scaleX(1);
    node.scaleY(1);
    setProps({
      x: node.x(),
      y: node.y(),
      // set minimal value
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(node.height() * scaleY),
      fill,
    });
  };

  useEffect(() => {
    if (selected && ref.current && trRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([ref.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selected]);

  return (
    <>
      <Rect
        ref={ref}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        onTap={() => onSelect(id, true)}
        onClick={() => onSelect(id, true)}
        onDragEnd={handleDragEnd}
        draggable
      />
      {selected && (
        <Transformer
          ref={trRef}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          rotateEnabled={false}
          flipEnabled={false}
        />
      )}
    </>
  );
}
