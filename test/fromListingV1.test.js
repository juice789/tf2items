import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { fromListingV1 } from '../fromListingV1.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ListingsPath = join(__dirname, "listingsV1")

const override = null

const fileNames = override || readdirSync(ListingsPath)

const tests = fileNames.map(file => JSON.parse(readFileSync(join(ListingsPath, file), 'utf-8')))

it('fromListingV1', () => {
    tests.forEach(({ listing, expected }) => expect(fromListingV1(listing)).toEqual(expected))
})

/*
{
    "listing":{},
    "expected": ""
}
*/
