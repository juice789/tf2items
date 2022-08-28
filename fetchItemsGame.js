const { call, getContext } = require('redux-saga/effects')
const vdf = require('vdf')

function* fetchItemsGameSaga() {
    const { getItemsGameUrl, getItemsGame } = yield getContext('api')
    const { result: { items_game_url } } = yield call(getItemsGameUrl)
    const itemsGameVdf = yield call(getItemsGame, items_game_url)
    const { items_game } = vdf.parse(itemsGameVdf)
    return items_game
}

module.exports = { fetchItemsGameSaga }