const { call, getContext } = require('redux-saga/effects')
const vdf = require('vdf')
const { toLower } = require('ramda')
const { renameKeysWith } = require('ramda-adjunct')

function* fetchTfEnglish() {
    try {
        const { fetchTfEnglish } = yield getContext('api')
        const english = yield call(fetchTfEnglish)
        const englishVdf = vdf.parse(english)
        return renameKeysWith(toLower, englishVdf[Object.keys(englishVdf)[0]].Tokens)
    } catch (err) {
        console.log('error fetching tf english', err)
    }
}

module.exports = { fetchTfEnglish }