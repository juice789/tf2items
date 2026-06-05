import { call, getContext } from 'redux-saga/effects'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const vdf = require('vdf')

export function* fetchTfEnglish() {
    const { fetchTfEnglish: fetchTfEnglishApi } = yield getContext('api')
    const english = yield call(fetchTfEnglishApi)
    const englishVdf = vdf.parse(english)
    const tokens = englishVdf.lang.Tokens
    return Object.fromEntries(Object.entries(tokens).map(([k, v]) => [k.toLowerCase(), v]))
}
