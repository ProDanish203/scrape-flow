import { ExecutionEnvironment } from '@/types/executor'
import { PageToHtmlTask } from '../task/PageToHtml'

export async function PageToHtmlExecutor(environment: ExecutionEnvironment<typeof PageToHtmlTask>): Promise<boolean> {
    try {
        const html = await environment.getPage()!.content()
        environment.setOutput('Html', html)

        return true
    } catch (err) {
        console.log(err)
        return false
    }
}