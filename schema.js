const helperObjects = require('./schemaHelper.json')
const items = require('./schemaItems.js')
const sku = require('./sku.js')

module.exports = {
    ...helperObjects,
    ...items,
    ...sku
}