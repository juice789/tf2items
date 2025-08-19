const { call, getContext } = require('redux-saga/effects')
const vdf = require('vdf')

const { path, compose, pickBy, startsWith, reduce, replace, __, mapKeys } = require('ramda')

const sanitizeTexture = reduce((all, curr) => replace(curr, '', all), __, ['9_', '_field { field_number: 2 }'])

const transformTextures = compose(
    mapKeys(sanitizeTexture),
    pickBy((val, key) => startsWith('9', key) && isNaN(val[0])),
    path(['lang', 'Tokens'])
)

function* fetchTextures() {
    const { fetchProtoObjDefs } = yield getContext('api')
    const protoObjDefs = yield call(fetchProtoObjDefs)
    return transformTextures(vdf.parse(protoObjDefs))
}

module.exports = { fetchTextures }