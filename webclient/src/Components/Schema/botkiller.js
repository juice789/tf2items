import {
    compose, prop, pickBy, includes, __, allPass
} from 'ramda'

import {
    getQuality,
    killstreakTier,
    defindex,
    getClasses
} from './controls'

const botkiller = {
    controls: {
        quality: getQuality([11, 6]),
        killstreakTier,
        defindex: defindex()
    },
    itemFn: pickBy(
        allPass([
            compose(includes('Botkiller'), prop('item_name')),
            compose(includes(__, ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building']), prop('item_slot'))
        ])
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['multi', 'all'])
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default botkiller