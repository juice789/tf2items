const path = require('path')
const fs = require('fs')
const ListingsPath = path.join(__dirname, "listingsV2")

const tests = []

const override = null

const fileNames = override || fs.readdirSync(ListingsPath)

fileNames.forEach(function (file) {
    const filePath = path.join(ListingsPath, file)
    const test = require(filePath)
    tests.push(test)
})

const { fromListingV2 } = require('../fromListingV2.js')

it('fromListingV2', () => {
    tests.forEach(({ listing, expected }) => expect(fromListingV2(listing)).toEqual(expected))
})

/*
{
    "listing":{},
    "expected": ""
}
*/