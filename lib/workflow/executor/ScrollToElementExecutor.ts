import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/ScrollToElement";

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");

    if (!selector) {
      environment.log.error("Selector is required");
      return false;
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element with selector ${selector} not found`);
      }

      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // const y = element.getBoundingClientRect().top + window.scrollY;
      // window.scrollTo({ top: y, behavior: "smooth" });
    }, selector);

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
