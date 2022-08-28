const { call, getContext } = require('redux-saga/effects')
const vdf = require('vdf')
const { toLower } = require('ramda')
const { renameKeysWith } = require('ramda-adjunct')

function* fetchTfEnglishSaga() {
    const { fetchTfEnglish } = yield getContext('api')
    const english = yield call(fetchTfEnglish)
    const englishVdf = vdf.parse(english)
    return renameKeysWith(toLower, englishVdf.lang.Tokens)
}

module.exports = { fetchTfEnglishSaga }