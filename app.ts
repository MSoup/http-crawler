import { Express, Request, Response } from 'express';
import { getSitemap } from './src/api';
const express = require("express")
const app: Express = express()
const port = 3000

app.get('/', async (req: Request, res: Response) => {
    console.log(req)
    const queryURL = req.query['url']
    const limit = req.query['limit']

    if (!queryURL) {
        return res.status(404).json({ error: "No URL passed in" })
    }
    if (typeof queryURL !== "string") {
        return res.status(500).json({ error: "Invalid URL" })
    }

    try {
        const results = await getSitemap(queryURL as string)

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