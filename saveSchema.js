const { runSaga } = require('redux-saga')
const { call } = require('redux-saga/effects')
const { fetchItemsApi } = require('./fetchItemsApi.js')
const { fetchItemsGame } = require('./fetchItemsGame.js')
const { fetchParticleEffects } = require('./fetchParticleEffects.js')
const { fetchTextures } = require('./fetchTextures.js')
const { fetchTfEnglish } = require('./fetchTfEnglish.js')
const { getCollections } = require('./getCollections.js')
const { getItems } = require('./getItems.js')
const { transformItems } = require('./transformItems.js')
const fs = require('fs')

const options = require('./options.json')
const api = require('./api.js')(options)

function* saveSchemaSaga() {
    try {

        const itemsApi = yield call(fetchItemsApi)
        const itemsGame = yield call(fetchItemsGame)
        const particleEffects = yield call(fetchParticleEffects)
        const textures = yield call(fetchTextures)
        const english = yield call(fetchTfEnglish)
        const collections = getCollections(english, itemsGame)
        const items = getItems(english, itemsGame)
        const transformedItems = transformItems(collections, itemsApi, items)

        fs.writeFileSync('schema.json', JSON.stringify({
            particleEffects,
            textures,
            collections,
            items: transformedItems
        }))

        return true

    } catch (err) {
        console.log('error saving schema', err)
    }
}

runSaga({
    context: { api }
}, saveSchemaSaga).toPromise().then(() => {
    console.log('schema saved!')
})