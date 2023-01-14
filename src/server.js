import { httpRequest } from './utils.js'
import express from 'express'
import jsyaml from 'js-yaml'
import fs from 'fs'

const app = express()
const PORT = 8080

let config
try {
    const fileContents = fs.readFileSync("apikeys.yml")
    config = jsyaml.load(fileContents)
} catch (e) {
    console.error(e)
}

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.get('/api', async (req, res) => {
    const headers = new Headers({
        'X-RapidAPI-Key': config.footballApi.key,
        'X-RapidAPI-Host': config.footballApi.host
    })
    const response = await httpRequest(`${config.footballApi.url}?season=2022&league=39`, 'GET', headers)

    const json = await response.json()
    let teams = []
    for (const pos of json.response[0].league.standings[0]) {
        teams.push({ team: pos.team.name, pts: pos.points })
    }
    res.send(teams)
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
