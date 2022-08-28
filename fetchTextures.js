const { call, getContext } = require('redux-saga/effects')
const vdf = require('vdf')

const { path, compose, pickBy, startsWith, reduce, replace, __ } = require('ramda')
const { renameKeysWith } = require('ramda-adjunct')

const sanitizeTexture = reduce((all, curr) => replace(curr, '', all), __, ['9_', '_field { field_number: 2 }'])

const transformTextures = compose(
    renameKeysWith(sanitizeTexture),
    pickBy((val, key) => startsWith('9', key) && isNaN(val[0])),
    path(['lang', 'Tokens'])
)

function* fetchTexturesSaga() {
    const { fetchProtoObjDefs } = yield getContext('api')
    const protoObjDefs = yield call(fetchProtoObjDefs)
    return transformTextures(vdf.parse(protoObjDefs))
}

module.exports = { fetchTexturesSaga }