import { ExecutionEnvironment } from '@/types/executor'
import { ExtractTextFromElementTask } from '../task/ExtractTextFromElement'
import * as cheerio from "cheerio"

export async function ExtractTextFromHtmlExecutor(environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>): Promise<boolean> {
    try {
        const selector = environment.getInput('Selector')
        if (!selector) return false
        const html = environment.getInput('Html')
        if (!html) return false

        const $ = cheerio.load(html)
        const element = $(selector)

        if (!element) {
            console.log(`Element not found for selector ${selector}`)
            return false
        }

        const extractedText = $.text(element)
        if (!extractedText) {
            console.log(`No text found for selector ${selector}`)
            return false
        }

        environment.setOutput('Extracted text', extractedText)

        return true
    } catch (err) {
        console.log(err)
        return false
    }
}