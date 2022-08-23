const path = require('path')
const fs = require('fs')
const ListingsPath = path.join(__dirname, "listingsV1")

const tests = []

const override = null

const fileNames = override || fs.readdirSync(ListingsPath)

fileNames.forEach(function (file) {
    const filePath = path.join(ListingsPath, file)
    const test = require(filePath)
    tests.push(test)
})

const { fromListingV1 } = require('../fromListingV1.js')

it('fromListingV1', () => {
    tests.forEach(({ listing, expected }) => expect(fromListingV1(listing)).toEqual(expected))
})

/*
{
    "listing":{},
    "expected": ""
}
*/