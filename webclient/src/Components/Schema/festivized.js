import {
    compose, prop, pickBy, includes, __, allPass, complement, has
} from 'ramda'

import {
    getQuality,
    elevated,
    uncraftable,
    killstreakTier,
    defindex,
    getClasses,
    getSlot,
    getRules
} from './controls'

const festivized = {
    controls: {
        quality: getQuality([1, 11, 14, 3, 6]),
        elevated,
        uncraftable,
        killstreakTier,
        defindex: defindex()
    },
    defaults: {
        festivized: '1'
    },
    itemFn: pickBy(
        allPass([
            has('festivized'),
            compose(
                complement(includes)(__, [0, 15]),
                prop('item_quality')
            ),
        ])
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['all']),
        item_slot: getSlot(['melee', 'primary', 'secondary'])
    },
    rules: getRules(['elevated']),
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default festivized