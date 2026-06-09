import { call, getContext } from 'redux-saga/effects'

function transformEffects(particles) {
    const byName = {}
    for (const { id, name } of particles) {
        if (name && !name.includes('Attrib_Particle')) {
            byName[name] ??= id
        }
    }
    return Object.fromEntries(Object.entries(byName).map(([name, id]) => [id, name]))
}

export function* fetchParticleEffects() {
    const { getSchemaOverview } = yield getContext('api')
    const schema = yield call(getSchemaOverview)
    return transformEffects(schema.result.attribute_controlled_attached_particles)
}
