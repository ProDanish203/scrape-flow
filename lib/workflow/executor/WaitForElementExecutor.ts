import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/FillInput";
import { WaitForElementTask } from "../task/WaitForElement";

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    const visibility = environment.getInput("Visibility");

    if (!selector || !visibility) {
      environment.log.error("Selector or visibility is missing");
      return false;
    }

    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });

    environment.log.info(`Element with selector ${selector} is ${visibility}`);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
