const { runSaga } = require('redux-saga')
const { map } = require('ramda')

const helperObjects = require('./schemaHelper.json')
const sagaHelpers = require('./sagaHelpers')

const items = require('./schemaItems.js')
const sku = require('./sku.js')
const skuBp = require('./skuBp.js')
const skuLinks = require('./skuLinks.js')

const { createApi, api } = require('./api.js')

const sagas = require('./sagas.js')
const { saveSchema } = require('./saveSchema.js')

const { fromEconItem, fromEconItemOptions } = require('./fromEconItem.js')
const { fromListingV1 } = require('./fromListingV1.js')
const { fromListingV2 } = require('./fromListingV2.js')
const { blanketify } = require('./blanket.js')
const { toSearchParams } = require('./toSearchParams.js')

const getInstance = (options) => {
    const api = createApi(options)
    const fns = { ...sagas, saveSchema }
    return options.saga
        ? fns
        : map(
            (saga) => (...args) => new Promise((resolve, reject) => {
                runSaga({
                    context: { api }
                }, saga, ...args)
                    .toPromise()
                    .then(resolve, reject)
            }), fns
        )
}

module.exports = {
    ...helperObjects,
    ...items,
    ...sku,
    ...skuBp,
    ...sagas,
    ...sagaHelpers,
    ...skuLinks,
    saveSchema,
    getInstance,
    createApi,
    api,
    fromEconItem,
    fromEconItemOptions,
    fromListingV1,
    fromListingV2,
    blanketify,
    toSearchParams
}