import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";

export async function clickElementExecutor(
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");

    if (!selector) {
      environment.log.error("Selector is required");
      return false;
    }

    await environment.getPage()!.click(selector);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
