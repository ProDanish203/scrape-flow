import { waitFor } from '@/lib/helper/waitFor'
import { ExecutionEnvironment } from '@/types/executor'
import puppeteer from 'puppeteer'
import { LaunchBrowserTask } from '../task/LaunchBrowser'

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput('Website URL')
        console.log('Website Url: ', websiteUrl)
        const browser = await puppeteer.launch({
            headless: false,
        })

        await waitFor(4000)
        await browser.close()
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}