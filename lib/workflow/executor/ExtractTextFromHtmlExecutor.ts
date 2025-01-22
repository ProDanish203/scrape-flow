import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

export async function ExtractTextFromHtmlExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector not defined");
      return false;
    }
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("Html not defined");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      environment.log.error(`Element not found for selector "${selector}"`);
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      environment.log.error(`No text found for selector "${selector}"`);
      return false;
    }

    environment.setOutput("Extracted text", extractedText);

    return true;
  } catch (err: any) {
    console.log(err);
    environment.log.error(err.message);
    return false;
  }
}
