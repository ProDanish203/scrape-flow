import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";

export async function ExtractDataWithAiExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>
): Promise<boolean> {
  try {
    const content = environment.getInput("Content");
    const credentialId = environment.getInput("Credentials");
    const prompt = environment.getInput("Prompt");

    if (!content || !credentialId || !prompt) {
      environment.log.error("Content, credentials, and prompt are required");
      return false;
    }

    // Get Credentials From DB
    const credential = await prisma.credential.findUnique({
      where: {
        id: credentialId,
      },
    });

    if (!credential) {
      environment.log.error("Credential not found");
      return false;
    }

    const decryptedCredentialValue = symmetricDecrypt(credential.value);

    if (!decryptedCredentialValue) {
      environment.log.error("Failed to decrypt credential value");
      return false;
    }

    const mockExtractedData = {
      usernameSelector: "#username",
      passwordSelector: "#password",
      loginSelector: "body > div > form > input.btn.btn-primary",
    };

    environment.setOutput("Extracted data", JSON.stringify(mockExtractedData));

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
