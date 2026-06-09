import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { fromEconItem } from '../fromEconItem.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EconItemPath = join(__dirname, "EconItems")

const override = null

const fileNames = override || readdirSync(EconItemPath)

const tests = fileNames.map(file => JSON.parse(readFileSync(join(EconItemPath, file), 'utf-8')))

it('fromEconItem', () => {
    tests.forEach(({ econItem, expected }) => expect(fromEconItem(econItem)).toEqual(expected))
})

/*
{
    "econItem":{},
    "expected": {
        "sku":null,
        "id":null,
        "old_id": null, "contextid": null, "old_contextid": null
    }
}
*/
