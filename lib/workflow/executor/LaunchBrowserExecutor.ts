import { ExecutionEnvironment } from '@/types/executor'
import puppeteer from 'puppeteer'
import { LaunchBrowserTask } from '../task/LaunchBrowser'

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput('Website URL')
        const browser = await puppeteer.launch({
            headless: false,
        })

        environment.setBrowser(browser)
        const page = await browser.newPage()
        await page.goto(websiteUrl)
        environment.setPage(page)

        return true
    } catch (err) {
        console.log(err)
        return false
    }
}