import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
// import OpenAi from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SystemPrompt } from "@/lib/data";
import { extractJSON } from "@/lib/helper/ai";

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

    // const mockExtractedData = {
    //   usernameSelector: "#username",
    //   passwordSelector: "#password",
    //   loginSelector: "body > div > form > input.btn.btn-primary",
    // };

    // environment.setOutput("Extracted data", JSON.stringify(mockExtractedData));

    // // Open Ai Implementation
    // const openai = new OpenAi({
    //   apiKey: decryptedCredentialValue,
    // });

    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     {
    //       role: "system",
    //       content: SystemPrompt,
    //     },
    //     {
    //       role: "user",
    //       content: content,
    //     },
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    //   temperature: 1,
    //   // max_tokens: 500,
    // });

    // environment.log.info(
    //   `Prompt tokens used: ${response.usage?.prompt_tokens}`
    // );
    // environment.log.info(
    //   `Completion tokens used: ${response.usage?.completion_tokens}`
    // );

    // const result = response.choices[0].message?.content;

    // // Gemini Implementation
    const gemini = new GoogleGenerativeAI(decryptedCredentialValue);
    const model = gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SystemPrompt,
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: content }],
        },
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig,
    });

    environment.log.info(
      `Prompt tokens used: ${response.response.usageMetadata?.promptTokenCount}`
    );
    environment.log.info(
      `Completion tokens used: ${response.response.usageMetadata?.candidatesTokenCount}`
    );

    const result = response.response.text();

    if (!result) {
      environment.log.error("Failed to get the response from AI");
      return false;
    }

    const parsedJson = extractJSON(result);
    environment.setOutput("Extracted data", JSON.stringify(parsedJson));

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
