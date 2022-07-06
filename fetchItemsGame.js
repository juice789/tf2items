const { call, getContext } = require('redux-saga/effects')
const vdf = require('vdf')

function* fetchItemsGame() {
    try {

        const { getItemsGameUrl, getItemsGame } = yield getContext('api')
        const { result: { items_game_url } } = yield call(getItemsGameUrl)
        const itemsGameVdf = yield call(getItemsGame, items_game_url)

        const { items_game } = vdf.parse(itemsGameVdf)
        return items_game

    } catch (err) {
        console.log('error fetching items game', err)
    }
}

module.exports = { fetchItemsGame }