"use clint";
import { cn } from "@/lib/utils";
import React from "react";
import { useReactFlow } from "@xyflow/react";
import { useFlowValidation } from "@/store/FlowValidationProvider";

interface Props {
  nodeId: string;
  children: React.ReactNode;
  isSelected: boolean;
}

const NodeCard: React.FC<Props> = ({ nodeId, children, isSelected }) => {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();

  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);
  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;
        if (x === undefined || y === undefined) return;
        setCenter(x, y, {
          zoom: 1.5,
          duration: 500,
        });
      }}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2"
      )}
    >
      {children}
    </div>
  );
};

export default NodeCard;
