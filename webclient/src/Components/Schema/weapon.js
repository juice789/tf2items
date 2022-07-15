import {
    compose, map, prop, pickBy, when, includes, __, allPass, indexOf, propOr, chain, assoc, complement, has, concat, equals
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

const weapon = {
    controls: {
        quality: getQuality([0, 1, 11, 13, 14, 3, 6]),
        elevated,
        uncraftable,
        killstreakTier,
        defindex: defindex(),
    },
    itemFn: compose(
        map(
            when(
                compose(equals(0), indexOf('Promo'), propOr('', 'name')),
                chain(
                    assoc('item_name'),
                    compose(concat(__, ' (promo)'), prop('item_name'))
                )
            )
        ),
        pickBy(
            allPass([
                compose(complement(includes)(__, [850]), prop('defindex')),//deflector
                complement(has)('untradable'),
                compose(complement(includes)(__, [0, 15]), prop('item_quality')),//no normal or decorated items
                compose(includes(__, ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building']), prop('item_slot')),
                compose(complement(includes)('Festive'), prop('item_name')),
                compose(complement(includes)('Botkiller'), prop('item_name')),
                compose(complement(includes)('_token'), prop('item_class'))
            ])
        )),
    filters: {
        used_by_classes: getClasses(),
        item_slot: getSlot(['melee', 'primary', 'secondary', 'pda', 'pda2', 'building'])
    },
    rules: getRules(['elevated']),
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default weapon