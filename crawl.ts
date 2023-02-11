import { JSDOM } from "jsdom"
import type { IPages } from "./types"

async function crawl(baseURL: string, currentURL: string, pages: IPages) {
    // stop crawling upon hitting limit
    // not ideal: I don't want to be constantly changing the pages objects to an array
    // I'll keep it as-is for now
    if (Object.keys(pages).length > 15) {
        return pages
    }
    // ignore URLs that are external to the site
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    // base cases
    // ignore external site
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    // check if URL has been seen, if not, add URL to pages
    const normalizedURL = normalizeURL(currentURL)

    if (normalizedURL in pages) {
        pages[normalizedURL] += 1 // {"google.ca": 1}
        return pages
    }
    else {
        pages[normalizedURL] = 1
        console.log("Crawling:", currentURL)
    }

    try {
        const res = await fetch(currentURL)
        if (res.status > 399) {
            // client error or server error
            console.log(`Error with fetch on page ${currentURL}`, res.status)
            return pages
        }
        const contentType = res.headers.get("content-type")

        if (contentType === null) {
            console.log(`Could not get content type of ${currentURL}, exiting`)
            return pages
        }

        if (!contentType.includes("text/html")) {
            console.log(`${currentURL} is of type ${contentType}. Skipping...`)
            return pages
        }

        const htmlBody = await res.text()

        const nextURLs = getURLsFromHTML(htmlBody, baseURL)
        for (const nextURL of nextURLs) {
            pages = await crawl(baseURL, nextURL, pages)
        }
        return pages
    }
    catch (err: unknown) {
        if (err instanceof TypeError) {
            console.log(`Could not crawl ${currentURL}, it might be invalid`)
            return pages
        }
        else {
            console.log(`Could not crawl ${currentURL}, but not a TypeError`)
            return pages
        }
    }
}

function getURLsFromHTML(htmlBody: string, baseURL: string) {
    const urls: string[] = []
    const dom = new JSDOM(htmlBody)

    const linkElements = dom.window.document.querySelectorAll("a")
    for (const link of linkElements) {
        if (link.href.slice(0, 1) === "/") {
            // relative URL
            try {
                const url = new URL(`${baseURL}${link.href}`)
                urls.push(url.href)
            }
            catch (err: unknown) {
                if (err instanceof TypeError) {
                    console.log("Err with relative url:", err.message)
                }
                else {
                    continue
                }
            }
        }
        else {
            // absolute
            try {
                const url = new URL(`${link.href}`)
                urls.push(url.href)
            }
            catch (err: unknown) {
                if (err instanceof TypeError) {
                    continue
                }
                else {
                    continue
                }
            }
        }
    }
    return urls
}

// takes url as input and standardizes it
function normalizeURL(urlString: string) {
    const url = new URL(urlString)
    let hostPath = `${url.hostname}${url.pathname}`
    if ((hostPath.length) > 0 && hostPath.slice(-1) === "/") {
        hostPath = hostPath.slice(0, -1)
    }
    return hostPath
}

export { crawl, normalizeURL, getURLsFromHTML }