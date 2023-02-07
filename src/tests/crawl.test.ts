// const { normalizeURL } = require("../../crawl.ts")
// const { test, expect } = require("@jest/globals")

import { normalizeURL, getURLsFromHTML } from "../../crawl"
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

test("normalizeURL handle malformed URL", () => {
    const input = "/ca/path"
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



// test("normalizeURL handle malformed URL", () => {
//     const input = "/ca/path"
//     expect(() => {
//         normalizeURL(input);
//     }).toThrow("Invalid URL")
// })
// test("normalizeURL handle malformed URL", () => {
//     const input = "/ca/path"
//     expect(() => {
//         normalizeURL(input);
//     }).toThrow("Invalid URL")
// })