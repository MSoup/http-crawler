import { sortPages } from "../../report"
import { test, expect } from "@jest/globals"

test("sortPages", () => {
    const input = {
        "https://google.ca": 2,
        "https://google.com": 100,
        "https://google.co.jp": 5,
    }
    const actual = sortPages(input)
    const expected = [
        ["https://google.com", 100],
        ["https://google.co.jp", 5],
        ["https://google.ca", 2],
    ]

    expect(actual).toEqual(expected)
})

test("sortPages", () => {
    const input = {
        "https://google.ca": 1,
        "https://google.com": 2,
        "https://google.co.jp": 3,
    }
    const actual = sortPages(input)

    const expected = [
        ["https://google.co.jp", 3],
        ["https://google.com", 2],
        ["https://google.ca", 1],
    ]

    expect(actual).toEqual(expected)
})