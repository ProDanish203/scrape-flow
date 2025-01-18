"use client";

import { AppNodeMissingInputs } from "@/types/appNode";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type FlowValidationContextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
};

export const FlowValidationContext =
  createContext<FlowValidationContextType | null>(null);

export const FlowValidationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    []
  );

  const clearErrors = () => {
    setInvalidInputs([]);
  };
  return (
    <FlowValidationContext.Provider
      value={{ invalidInputs, setInvalidInputs, clearErrors }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
};

export const useFlowValidation = () => {
  const context = useContext(FlowValidationContext);
  if (!context) {
    throw new Error(
      "useFlowValidation must be used within a FlowValidationProvider"
    );
  }
  return context;
};
