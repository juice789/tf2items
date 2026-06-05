import { call, getContext } from 'redux-saga/effects'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const vdf = require('vdf')

export function* fetchTextures() {
    const { fetchProtoObjDefs } = yield getContext('api')
    const protoObjDefs = yield call(fetchProtoObjDefs)
    const tokens = vdf.parse(protoObjDefs).lang.Tokens
    const result = {}
    for (const [key, val] of Object.entries(tokens)) {
        if (key.startsWith('9') && isNaN(val[0])) {
            result[key.replace(/^9_/, '').replace('_field { field_number: 2 }', '')] = val
        }
    }
    return result
}
