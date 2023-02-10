import { crawl } from "./crawl"

function main() {
    if (process.argv.length < 3) {
        console.log("No website provided")
        process.exit(1)
    }
    if (process.argv.length > 3) {
        console.log("Too many args, please provide a website")
        process.exit(1)
    }

    const website = process.argv[2]
    console.log("starting crawler on", website)
    crawl(website)
}


main()