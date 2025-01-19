import { Browser } from "puppeteer";
import { WorkflowTask } from "./workflow";

export type Environment = {
    browser?: Browser,
    // Phases with nodeid as key
    phases: Record<
        string, // key as nodeid
        {
            inputs: Record<string, string>;
            outputs: Record<string, string>;
        }>
}

export type ExecutionEnvironment<T extends WorkflowTask> = {
    getInput(name: T["inputs"][number]["name"]): string;
}