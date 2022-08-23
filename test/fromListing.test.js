const path = require('path')
const fs = require('fs')
const ListingsPath = path.join(__dirname, "listings")

const tests = []

const override = ["buy Mann Co. Supply Crate #59.json"]

const fileNames = override || fs.readdirSync(ListingsPath)

fileNames.forEach(function (file) {
    const filePath = path.join(ListingsPath, file)
    const test = require(filePath)
    tests.push(test)
})

const { fromListing } = require('../fromListing.js')

it('fromListing', () => {
    tests.forEach(({ listing, expected }) => expect(fromListing(listing)).toEqual(expected))
})

/*
{
    "listing":{},
    "expected": ""
}
*/