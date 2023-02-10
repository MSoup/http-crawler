import { JSDOM } from "jsdom"


async function crawl(currentURL: string) {
    console.log("Crawling:", currentURL)
    try {
        const res = await fetch(currentURL)
        if (res.status > 399) {
            // client error or server error
            console.log(`Error with fetch on page ${currentURL}`, res.status)
            return
        }
        const contentType = res.headers.get("content-type")

        if (contentType === null) {
            console.log(`Could not get content type of ${currentURL}, exiting`)
            return
        }

        if (!contentType.includes("text/html")) {
            console.log(`${currentURL} is of type ${contentType}. Please provide text/html for parsing.`)
            return
        }
        console.log(await res.text())
    }
    catch (err: unknown) {
        if (err instanceof TypeError) {
            console.log(`Could not crawl ${currentURL}, it might be invalid`)
        }
        else {
            console.log(`Could not crawl ${currentURL}, but not a TypeError`)
            console.log(err)
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
                    console.log(err)
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
                console.log(err instanceof Error)
                console.log(err instanceof TypeError)
                if (err instanceof TypeError) {
                    console.log("Err with absolute url:", err.message)
                }
                else {
                    console.log(err)
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