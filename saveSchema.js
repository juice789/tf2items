import { call } from 'redux-saga/effects'
import { fetchItemsApi, fetchItemsGame, fetchParticleEffects, fetchTextures, fetchTfEnglish } from './sagas.js'
import { getCollections, getItems, transformItems } from './sagaHelpers.js'

export function* saveSchema() {
    try {

        const itemsApi = yield call(fetchItemsApi)
        const itemsGame = yield call(fetchItemsGame)
        const particleEffects = yield call(fetchParticleEffects)
        const textures = yield call(fetchTextures)
        const english = yield call(fetchTfEnglish)

        const collections = getCollections(english, itemsGame)
        const items = getItems(english, itemsGame)
        const transformedItems = transformItems(collections, itemsApi, items)

        return {
            particleEffects,
            textures,
            collections,
            items: transformedItems
        }

    } catch (err) {
        console.log('error saving schema', err)
    }
}
