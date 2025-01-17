"use clint";
import React from "react";

interface Props {
  nodeId: string;
  children: React.ReactNode;
}

const NodeCard: React.FC<Props> = ({ nodeId, children }) => {
  return <div>{children}</div>;
};

export default NodeCard;
