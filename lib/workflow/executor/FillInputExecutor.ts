import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/FillInput";

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    const value = environment.getInput("Value");

    if (!selector || !value) {
      environment.log.error("Selector or value is missing");
      return false;
    }

    await environment.getPage()!.type(selector, value);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
