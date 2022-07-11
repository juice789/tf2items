import {
    compose, prop, pickBy, includes, __, allPass,
} from 'ramda'

import {
    quality,
    killstreakTier,
    defindex,
    used_by_classes
} from './controls'

const festive = {
    controls: {
        quality: quality([11, 6]),
        killstreakTier,
        defindex
    },
    itemFn: pickBy(
        allPass([
            compose(includes('Festive'), prop('item_name')),
            compose(includes(__, ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building']), prop('item_slot')),
        ])
    ),
    filters: {
        used_by_classes: used_by_classes('all'),
        item_slot: {
            name: 'item_slot',
            label: 'Slot',
            isClearable: true,
            options: [
                ['melee', 'Melee'],
                ['primary', 'Primary'],
                ['secondary', 'Secondary'],
                ['building', 'Building'],
            ]
        }
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default festive