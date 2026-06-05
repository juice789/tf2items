import { call, getContext } from 'redux-saga/effects'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const vdf = require('vdf')

export function* fetchItemsGame() {
    const { getItemsGameUrl, getItemsGame } = yield getContext('api')
    const { result: { items_game_url } } = yield call(getItemsGameUrl)
    const itemsGameVdf = yield call(getItemsGame, items_game_url)
    const { items_game } = vdf.parse(itemsGameVdf)
    return items_game
}
