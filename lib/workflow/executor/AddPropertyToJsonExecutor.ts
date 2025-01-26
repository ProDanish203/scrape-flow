import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyTojsonTask } from "../task/AddPropertyToJson";

export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyTojsonTask>
): Promise<boolean> {
  try {
    const json = environment.getInput("JSON");
    const propertyName = environment.getInput("Property Name");
    const propertyValue = environment.getInput("Property Value");

    if (!json || !propertyName || !propertyValue) {
      environment.log.error("Missing required inputs");
      return false;
    }

    const parsedJson = JSON.parse(json);
    parsedJson[propertyName] = propertyValue;

    environment.setOutput("Updated JSON", JSON.stringify(parsedJson));

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
