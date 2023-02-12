import type { IPages } from "./types"

function sortPages(pages: IPages) {
    const pagesArr = Object.entries(pages)

    pagesArr.sort((a, b) => {
        return b[1] - a[1]
    })

    return pagesArr
}

export { sortPages }