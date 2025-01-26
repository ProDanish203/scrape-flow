import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const targetUrl = environment.getInput("Target URL");
    const body = environment.getInput("Body");

    if (!targetUrl) {
      environment.log.error("Target Url is required");
      return false;
    }
    if (!body) {
      environment.log.error("Body is required");
      return false;
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok || response.status !== 200) {
      environment.log.error(
        `Failed to deliver webhook: ${response.status}:${response.statusText}`
      );
      return false;
    }

    const responseBody = await response.json();
    environment.log.info(
      `Webhook delivered successfully: ${JSON.stringify(responseBody)}`
    );

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
