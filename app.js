const helperObjects = require('./schemaHelper.json')
const items = require('./schemaItems.js')
const sku = require('./sku.js')
const skuBp = require('./skuBp.js')

module.exports = {
    ...helperObjects,
    ...items,
    ...sku,
    ...skuBp
}