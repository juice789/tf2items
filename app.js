import { runSaga } from 'redux-saga'
import helperObjects from './schemaHelper.json' with { type: 'json' }
import { createApi } from './api.js'
import * as sagas from './sagas.js'
import { saveSchema } from './saveSchema.js'

export * from './schemaItems.js'
export * from './sku.js'
export * from './skuBp.js'
export * from './sagas.js'
export * from './sagaHelpers.js'
export * from './skuLinks.js'
export { saveSchema } from './saveSchema.js'
export { fromEconItem, fromEconItemOptions } from './fromEconItem.js'
export { fromListingV1 } from './fromListingV1.js'
export { fromListingV2 } from './fromListingV2.js'
export { blanketify } from './blanket.js'
export { createApi, api } from './api.js'

export const {
    qualityNames, qualityIds, rarities, killstreakTiers, wears, classes, itemSlots, itemClasses,
    paintHex, paintDefindex, spellDefindex, cosmeticCollections, weaponCollections, warPaintCollections,
    fabricatorDefindex, strangifierTargets, australiumDefindex, crateSeries, paintableDefindex,
    chemsetDefindex, serieslessDefindex, impossibleEffects
} = helperObjects

export const getInstance = (options) => {
    const api = createApi(options)
    const fns = { ...sagas, saveSchema }
    return options.saga
        ? fns
        : Object.fromEntries(
            Object
                .entries(fns)
                .map(([k, saga]) => [k, (...args) => new Promise((resolve, reject) => {
                    runSaga({
                        context: { api }
                    }, saga, ...args)
                        .toPromise()
                        .then(resolve, reject)
                })])
        )
}
