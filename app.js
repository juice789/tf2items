const { runSaga } = require('redux-saga')
const { map, compose, replace } = require('ramda')
const { renameKeysWith } = require('ramda-adjunct')

const helperObjects = require('./schemaHelper.json')
const sagaHelpers = require('./sagaHelpers')

const items = require('./schemaItems.js')
const sku = require('./sku.js')
const skuBp = require('./skuBp.js')

const createApi = require('./api.js')

const sagas = require('./sagas.js')
const { saveSchemaSaga } = require('./saveSchema.js')

const { fromEconItem } = require('./fromEconItem.js')
const { fromListingV1 } = require('./fromListingV1.js')
const { fromListingV2 } = require('./fromListingV2.js')
const { blanketify } = require('./blanket.js')
const { toSearchParams } = require('./toSearchParams.js')

const getInstance = (options) => {
    const api = createApi(options)
    return compose(
        renameKeysWith(replace('Saga', '')),
        map(
            (saga) => (...args) => new Promise((resolve, reject) => {
                runSaga({
                    context: { api }
                }, saga, ...args)
                    .toPromise()
                    .then(resolve, reject)
            })
        ),
    )({ ...sagas, saveSchemaSaga })
}

module.exports = {
    ...helperObjects,
    ...items,
    ...sku,
    ...skuBp,
    ...sagas,
    ...sagaHelpers,
    saveSchemaSaga,
    getInstance,
    createApi,
    fromEconItem,
    fromListingV1,
    fromListingV2,
    blanketify,
    toSearchParams
}