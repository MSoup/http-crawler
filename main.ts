import { crawl } from "./crawl"
import { IPages, OutputIPages } from "./types"

async function main() {
    if (process.argv.length < 3) {
        console.log("No website provided")
        process.exit(1)
    }
    if (process.argv.length > 3) {
        console.log("Too many args, please provide a website")
        process.exit(1)
    }

    const baseURL = process.argv[2]
    console.log("starting crawler on", baseURL)

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


main()