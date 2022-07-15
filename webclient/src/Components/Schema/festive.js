import {
    compose, prop, pickBy, includes, __, allPass,
} from 'ramda'

import {
    getQuality,
    killstreakTier,
    defindex,
    getClasses,
    getSlot
} from './controls'

const festive = {
    controls: {
        quality: getQuality([11, 6]),
        killstreakTier,
        defindex: defindex()
    },
    itemFn: pickBy(
        allPass([
            compose(includes('Festive'), prop('item_name')),
            compose(includes(__, ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building']), prop('item_slot')),
        ])
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['all']),
        item_slot: getSlot(['melee', 'primary', 'secondary', 'building'])
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default festive