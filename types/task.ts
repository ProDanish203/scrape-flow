export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
  PAGE_TO_HTML = "PAGE_TO_HTML",
  EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
  FILL_INPUT = "FILL_INPUT",
  CLICK_ELEMENT = "CLICK_ELEMENT",
  WAIT_FOR_ELEMENT = "WAIT_FOR_ELEMENT",
  DELIVER_VIA_WEBHOOK = "DELIVER_VIA_WEBHOOK",
  EXTRACT_DATA_WITH_AI = "EXTRACT_DATA_WITH_AI",
}

export enum TaskParamType {
  STRING = "STRING",
  BROWSER_INSTANCE = "BROWSER_INSTANCE",
  SELECT = "SELECT",
  CREDENTIALS = "CREDENTIALS",
}

export interface TaskParam {
  name: string;
  type: TaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  [key: string]: any;
}

export interface ParamProps {
  param: TaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  disabled?: boolean;
}
