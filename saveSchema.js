const { call } = require('redux-saga/effects')

const {
    fetchItemsApi,
    fetchItemsGame,
    fetchParticleEffects,
    fetchTextures,
    fetchTfEnglish
} = require('./sagas.js')

const {
    getCollections,
    getItems,
    transformItems
} = require('./sagaHelpers')

function* saveSchema() {
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

module.exports = { saveSchema }