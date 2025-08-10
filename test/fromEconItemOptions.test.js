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

const { fromEconItemOptions } = require('../fromEconItem.js')

const options = {
    uncraftRemapDefindex: ['5021', '725']
}

it('fromEconItem', () => {
    tests.forEach(({ econItem, expected, expectedWithOptions }) => expect(fromEconItemOptions(options)(econItem)).toEqual(expectedWithOptions || expected))
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