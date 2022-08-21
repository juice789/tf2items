const path = require('path')
const fs = require('fs')
const EconItemPath = path.join(__dirname, "EconItems")

const tests = []

const override = null

const fileNames = override || fs.readdirSync(EconItemPath)

fileNames.forEach(function (file) {
    const filePath = path.join(EconItemPath, file)
    const test = require(filePath)
    tests.push(test)
})

const { fromEconItem } = require('../fromEconItem.js')

it('fromEconItem', () => {
    tests.forEach(({ econItem, expected }) => expect(fromEconItem(econItem)).toEqual(expected))
})

/*
{
    "econItem":{},
    "expected": {
        "sku":null,
        "defindex":null,
        "quality":null,
        "market_hash_name":null,
        "uncraftable":null,
        "elevated":null,
        "effect":null,
        "killstreakTier":null,
        "festivized":null,
        "texture":null,
        "wear":null,
        "australium":null,
        "series":null,
        "craft":null,
        "recipe":null,
        "id":null,
        "old_id":null,
        "target":null,
        "output":null,
        "oq":null
    }
}
*/