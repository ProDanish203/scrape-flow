"use client";
import { ParamProps } from "@/types/task";
import React from "react";

export const BrowserInstanceParam: React.FC<ParamProps> = ({
  param,
  value,
  updateNodeParamValue,
  disabled,
}) => {
  return <p>{param.name}</p>;
};
