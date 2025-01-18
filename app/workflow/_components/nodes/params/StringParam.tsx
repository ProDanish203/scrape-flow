"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/task";
import React, { ChangeEvent, useEffect, useId, useState } from "react";

export const StringParam: React.FC<ParamProps> = ({
  param,
  value,
  disabled,
  updateNodeParamValue,
}) => {
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  const id = useId();

  let InputComponent: any = Input;
  if (param.variant === "textarea") {
    InputComponent = Textarea;
  }

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <InputComponent
        id={id}
        value={internalValue}
        className="text-xs resize-none"
        placeholder="Enter value here"
        disabled={disabled}
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
