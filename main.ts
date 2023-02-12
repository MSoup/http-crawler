import { crawl } from "./src/crawl"
import { IPages, OutputIPages } from "./src/types"
import { getSitemap } from "./src/api"

// if ran via npm run crawl [URL]
async function main() {
    if (process.argv.length < 3) {
        console.log("No website provided")
        process.exit(1)
    }
    if (process.argv.length > 3) {
        console.log("Too many args, please provide a website")
        process.exit(1)
    }

    let baseURL = process.argv[2]

    try {
        new URL(baseURL)
    }
    catch (err: unknown) {
        console.log("Invalid URL, exiting")
        process.exit(1)
    }

    console.log("starting crawler on", baseURL)

    // valid url from this point on
    return await getSitemap(baseURL)
}


main()