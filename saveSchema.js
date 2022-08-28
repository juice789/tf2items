const { call } = require('redux-saga/effects')

const {
    fetchItemsApiSaga,
    fetchItemsGameSaga,
    fetchParticleEffectsSaga,
    fetchTexturesSaga,
    fetchTfEnglishSaga
} = require('./sagas.js')

const {
    getCollections,
    getItems,
    transformItems
} = require('./sagaHelpers')

function* saveSchemaSaga() {
    try {

        const itemsApi = yield call(fetchItemsApiSaga)
        const itemsGame = yield call(fetchItemsGameSaga)
        const particleEffects = yield call(fetchParticleEffectsSaga)
        const textures = yield call(fetchTexturesSaga)
        const english = yield call(fetchTfEnglishSaga)

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

module.exports = { saveSchemaSaga }