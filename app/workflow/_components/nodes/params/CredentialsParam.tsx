"use client";
import { ParamProps } from "@/types/task";
import React, { useId } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";

export const CredentialsParam: React.FC<ParamProps> = ({
  param,
  updateNodeParamValue,
  value,
  disabled,
}) => {
  const id = useId();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: () => GetCredentialsForUser(),
    refetchInterval: 10000,
  });

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-500 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {!isLoading &&
              data &&
              data.length > 0 &&
              data.map((credential) => (
                <SelectItem key={credential.id} value={credential.value}>
                  {credential.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
