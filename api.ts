import { crawl } from "./crawl";
import { IPages, OutputIPages } from "./types"


async function getSitemap(request, baseURL) {
    const pages = await crawl(baseURL, baseURL, {})

    const output: OutputIPages[] = []

    for (const page of Object.entries(pages)) {
        console.log(page)
        const url = page[0]
        const visits = page[1]

        output.push({ url: url, visits: visits })
    }

    return JSON.stringify(output)
}
