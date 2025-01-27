import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

const BROWSER_WS = process.env.BRD_SCRAPING_BROWSER;

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website URL");
    // const browser = await puppeteer.launch({
    //   headless: false,
    // args: [`--proxy-server=${process.env.BRD_PROXY_SERVER}`],
    // });

    // Bright data scraping browser
    const browser = await puppeteer.connect({
      browserWSEndpoint: BROWSER_WS,
    });

    environment.setBrowser(browser);
    const page = await browser.newPage();
    // // For using proxy server from brightdata (without scraping browser)
    // await page.authenticate({
    //   username: process.env.BRD_PROXY_USER,
    //   password: process.env.BRD_PROXY_PASSWORD,
    // });
    await page.goto(websiteUrl);
    environment.setPage(page);

    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
}
