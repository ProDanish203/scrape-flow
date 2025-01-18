"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";

interface Props {
  taskType: TaskType;
  nodeId: string;
}

const NodeHeader: React.FC<Props> = ({ taskType, nodeId }) => {
  const task = TaskRegistry[taskType];

  const { deleteElements, getNode, addNodes } = useReactFlow();
  const handleDeleteNode = () => {
    deleteElements({
      nodes: [{ id: nodeId }],
    });
  };

  const handleDuplicateNode = () => {
    const node = getNode(nodeId) as AppNode;
    if (!node) return;
    const newX = node.position.x + 100;
    const newY = node.position.y + 100;
    const newNode = CreateFlowNode(node.data.type, { x: newX, y: newY });
    addNodes([newNode]);
  };
  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry Point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={handleDeleteNode}
              >
                <TrashIcon size={12} />
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={handleDuplicateNode}
              >
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeHeader;
