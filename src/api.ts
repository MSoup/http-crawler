import { ParsedUrlQuery } from "querystring";
import { crawl } from "./crawl";
import { IPages, OutputIPages } from "./types"

// given a domain, returns object of all internal URLs of domain
async function getSitemap(baseURL: string, limit?: number) {
    let url;
    if (!((baseURL.includes("http://")) || (baseURL.includes("https://")))) {
        console.log("Protocol not detected, appending http://")
        baseURL = `http://${baseURL}`
    }

    try {
        url = new URL(baseURL)
    }
    catch (err) {
        return []
    }



    const pages = await crawl(baseURL, baseURL, {}, limit)

    const output: OutputIPages[] = []

    for (const page of Object.entries(pages)) {
        const url = page[0]
        const visits = page[1]

        output.push({ url: url, visits: visits })
    }

    return output
}

export { getSitemap }