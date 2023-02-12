import { Express, Request, Response } from 'express';
import { getSitemap } from './src/api';
const express = require("express")
const app: Express = express()
const port = 3000

app.get('/', async (req: Request, res: Response) => {
    const queryURL = req.query['url']
    let limit: number
    let garbage = req.query['url']
    console.log(garbage)

    if (req.query['limit']) {
        limit = Number(req.query['limit'])
    }
    else {
        // default limit
        limit = 5
    }

    if (!queryURL) {
        return res.status(404).json({ error: "No URL passed in" })
    }

    if (Number.isNaN(limit)) {
        return res.status(404).json({ error: "Limit should be number" })
    }

    if (typeof queryURL !== "string") {
        return res.status(500).json({ error: "Invalid URL" })
    }

    try {
        const results = await getSitemap(queryURL, limit)

        if (results.length === 0) {
            return res.send(`Invalid URL: ${queryURL}`);
        }

        // results are fetched
        return res.send(results);
    }
    catch (err) {
        return res.send(err)
    }


});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});