const { call, getContext } = require('redux-saga/effects')
const vdf = require('vdf')
const { toLower, mapKeys } = require('ramda')

function* fetchTfEnglish() {
    const { fetchTfEnglish } = yield getContext('api')
    const english = yield call(fetchTfEnglish)
    const englishVdf = vdf.parse(english)
    return mapKeys(toLower, englishVdf.lang.Tokens)
}

module.exports = { fetchTfEnglish }