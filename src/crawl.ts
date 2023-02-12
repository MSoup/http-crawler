import { JSDOM } from "jsdom"
import type { IPages } from "./types"

async function crawl(baseURL: string, currentURL: string, pages: IPages, limit: number = 5) {
    // not ideal: I don't want to be constantly changing the pages objects to an array
    if (limit && Object.keys(pages).length > limit) {
        return pages
    }
    if (limit < 1) {
        return pages
    }

    // strip trailing slashes from baseURL to prevent google.ca and google.ca/ 
    // from becoming two different base urls
    if (baseURL.slice(-1) === "/") {
        baseURL = baseURL.slice(0, -1)
    }

    // ignore URLs that are external to the site
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    // ignore external sites
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    // increment pages[url] if it already exists, else recursively crawl
    const normalizedURL = normalizeURL(currentURL)

    // pages object looks like {"http://google.ca": 1}
    if (normalizedURL in pages) {
        pages[normalizedURL] += 1
        return pages
    }
    // first time seeing url 
    pages[normalizedURL] = 1
    console.log("Crawling:", currentURL)

    try {
        const res = await fetch(currentURL)
        if (res.status > 399) {
            // client error or server error
            console.log(`Error with fetch on page ${currentURL}`, res.status)
            return pages
        }
        const contentType = res.headers.get("content-type")

        // very rare
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
            delete pages[normalizedURL]
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