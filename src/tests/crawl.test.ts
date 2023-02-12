import { normalizeURL, getURLsFromHTML } from "../crawl"
import { test, expect } from "@jest/globals"

test("normalizeURL strip protocol", () => {
    const input = "https://google.ca/path"
    const actual = normalizeURL(input)
    const expected = "google.ca/path"

    expect(actual).toEqual(expected)
})

test("normalizeURL strip trailing slashes", () => {
    const input = "https://google.ca/path/"
    const actual = normalizeURL(input)
    const expected = "google.ca/path"

    expect(actual).toEqual(expected)
})
test("normalizeURL strip trailing even in base path", () => {
    const input = "https://google.ca/"
    const actual = normalizeURL(input)
    const expected = "google.ca"

    expect(actual).toEqual(expected)
})

test("normalizeURL capitals", () => {
    const input = "https://GOOGLE.ca/path"
    const actual = normalizeURL(input)
    const expected = "google.ca/path"

    expect(actual).toEqual(expected)
})

test("normalizeURL strip http protocol", () => {
    const input = "http://google.ca/path"
    const actual = normalizeURL(input)
    const expected = "google.ca/path"

    expect(actual).toEqual(expected)
})

test("normalizeURL malformed URL", () => {
    const input = "/ca/path"
    expect(() => {
        normalizeURL(input);
    }).toThrow("Invalid URL")
})

test("normalizeURL invalid URL", () => {
    const input = "invalid"
    expect(() => {
        normalizeURL(input);
    }).toThrow("Invalid URL")
})




test("getURLsFromHTML absoluteURLs", () => {
    const htmlBody: string = `
<html>
    <body>
    <a href="https://blog.msoup.com">
        MSoup's Blog
    </a>
    </body>
</html>
`
    const inputBaseURL = "https://blog.msoup.com"
    const actual = getURLsFromHTML(htmlBody, inputBaseURL)
    const expected = ["https://blog.msoup.com/"]
    expect(actual).toEqual(expected)

})

test("getURLsFromHTML relativeURLs", () => {
    const htmlBody: string = `
<html>
    <body>
    <a href="/path/">
        MSoup's Blog
    </a>
    </body>
</html>
`
    const inputBaseURL = "https://blog.msoup.com"
    const actual = getURLsFromHTML(htmlBody, inputBaseURL)
    const expected = ["https://blog.msoup.com/path/"]
    expect(actual).toEqual(expected)
})

test("getURLsFromHTML fetch multipleURLs", () => {
    const htmlBody: string = `
<html>
    <body>
    <a href="https://blog.msoup.com/path1/">
        MSoup's Blog 1
    </a>
    <a href="#">
        MSoup's Blog 2
    </a>
    </body>
</html>
`
    const inputBaseURL = "https://blog.msoup.com"
    const actual = getURLsFromHTML(htmlBody, inputBaseURL)
    const expected = ["https://blog.msoup.com/path1/", "about:blank#",]
    expect(actual).toEqual(expected)
})

test("getURLsFromHTML skip invalid URL", () => {
    const htmlBody: string = `
<html>
    <body>
    <a href="invalid">
        No slash or protocol - broken link
    </a>
    </body>
</html>
`
    const inputBaseURL = "https://blog.msoup.com"
    const actual = getURLsFromHTML(htmlBody, inputBaseURL)
    const expected: [] = []
    expect(actual).toEqual(expected)
})


