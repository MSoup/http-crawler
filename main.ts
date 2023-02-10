import { crawl } from "./crawl"

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

    for (const page of Object.entries(pages)) {
        console.log(page)
    }


}


main()