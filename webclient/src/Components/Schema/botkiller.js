import {
    compose, prop, pickBy, includes, __, allPass
} from 'ramda'

import {
    quality,
    killstreakTier,
    defindex,
    used_by_classes
} from './controls'

const botkiller = {
    controls: {
        quality: quality([11, 6]),
        killstreakTier,
        defindex
    },
    itemFn: pickBy(
        allPass([
            compose(includes('Botkiller'), prop('item_name')),
            compose(includes(__, ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building']), prop('item_slot'))
        ])
    ),
    filters: {
        used_by_classes: used_by_classes(['multi', 'all'])
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default botkiller