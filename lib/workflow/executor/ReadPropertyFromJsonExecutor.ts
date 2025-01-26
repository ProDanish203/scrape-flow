import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson";

export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    const json = environment.getInput("JSON");
    const propertyName = environment.getInput("Property Name");

    if (!json || !propertyName) {
      environment.log.error("JSON and Property Name are required");
      return false;
    }

    const parsedJson = JSON.parse(json);
    const propertyValue = parsedJson[propertyName];
    if (propertyValue === undefined) {
      environment.log.error(`Property ${propertyName} not found`);
      return false;
    }

    environment.setOutput("Property Value", propertyValue);

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
