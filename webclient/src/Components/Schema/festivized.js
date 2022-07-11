import {
    compose, prop, pickBy, includes, __, allPass, complement, has
} from 'ramda'

import {
    quality,
    elevated,
    uncraftable,
    killstreakTier,
    defindex,
    used_by_classes
} from './controls'

const festivized = {
    controls: {
        quality: quality([1, 11, 14, 3, 6]),
        elevated,
        uncraftable,
        killstreakTier,
        defindex
    },
    defaults: {
        festivized: '1'
    },
    itemFn: pickBy(
        allPass([
            has('festivized'),
            compose(complement(includes)(__, [0, 15]), prop('item_quality')),//no normal / decorated items
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
            ]
        }
    },
    rules: {
        elevated: {
            quality: ['11'],
            reverse: true,
            ignore: false
        }
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default festivized