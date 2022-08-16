const path = require('path')
const fs = require('fs')
const EconItemPath = path.join(__dirname, "EconItems")

const tests = []

fs.readdirSync(EconItemPath).forEach(function (file) {
    const filePath = path.join(EconItemPath, file)
    const test = require(filePath)
    tests.push(test)
})

const { fromEconItem } = require('../fromEconItem.js')

it('fromEconItem', () => {
    tests.forEach(({ econItem, expected }) => expect(fromEconItem(econItem)).toEqual(expected))
})