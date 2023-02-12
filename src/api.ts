import { crawl } from "./crawl";
import { IPages, OutputIPages } from "./types"

// given a domain, returns a JSON of all internal URLs of domain
async function getSitemap(baseURL: string) {
    const pages = await crawl(baseURL, baseURL, {})

    const output: OutputIPages[] = []

    for (const page of Object.entries(pages)) {
        const url = page[0]
        const visits = page[1]

        output.push({ url: url, visits: visits })
    }

    console.log(output)
    return JSON.stringify(output)
}

export { getSitemap }