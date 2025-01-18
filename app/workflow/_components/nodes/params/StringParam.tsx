"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParamProps } from "@/types/task";
import React, { ChangeEvent, useId, useState } from "react";

export const StringParam: React.FC<ParamProps> = ({
  param,
  value,
  updateNodeParamValue,
}) => {
  const [internalValue, setInternalValue] = useState(value || "");
  const id = useId();
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Input
        id={id}
        value={internalValue}
        className="text-xs"
        placeholder="Enter value here"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInternalValue(e.target.value)
        }
        onBlur={(e: ChangeEvent<HTMLInputElement>) => {
          updateNodeParamValue(e.target.value);
        }}
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
};
