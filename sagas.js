const { fetchItemsApiSaga } = require('./fetchItemsApi.js')
const { fetchItemsGameSaga } = require('./fetchItemsGame.js')
const { fetchParticleEffectsSaga } = require('./fetchParticleEffects.js')
const { fetchTexturesSaga } = require('./fetchTextures.js')
const { fetchTfEnglishSaga } = require('./fetchTfEnglish.js')

module.exports = {
    fetchItemsApiSaga,
    fetchItemsGameSaga,
    fetchParticleEffectsSaga,
    fetchTexturesSaga,
    fetchTfEnglishSaga
}