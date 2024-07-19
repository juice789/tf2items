const { call, delay, getContext } = require('redux-saga/effects')
const { prop, indexBy, map, compose, pickBy, complement, includes, path, nth, invert, invertObj } = require('ramda')

const transformEffects = compose(
    invertObj,
    map(nth(0)),
    invert,
    pickBy(Boolean),
    pickBy(complement(includes)('Attrib_Particle')),
    map(prop('name')),
    indexBy(prop('id')),
    path(['result', 'attribute_controlled_attached_particles'])
)

function* fetchParticleEffects() {
    const { getSchemaOverview } = yield getContext('api')
    const schema = yield call(getSchemaOverview)
    return transformEffects(schema)
}

module.exports = { fetchParticleEffects }