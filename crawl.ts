import { JSDOM } from "jsdom"

function getURLsFromHTML(htmlBody: string, baseURL: string) {
    const urls: string[] = []
    const dom = new JSDOM(htmlBody)

    const linkElements = dom.window.document.querySelectorAll("a")
    for (const link of linkElements) {
        if (link.href.slice(0, 1) === "/") {
            // relative URL
            urls.push(`${baseURL}${link.href}`)
        }
        else {
            // absolute
            urls.push(link.href)
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

export { normalizeURL, getURLsFromHTML }