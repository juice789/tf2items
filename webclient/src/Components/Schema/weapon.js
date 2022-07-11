import {
    compose, map, prop, pickBy, when, includes, __, allPass, indexOf, propOr, chain, assoc, complement, has, concat, equals
} from 'ramda'

import {
    quality,
    elevated,
    uncraftable,
    killstreakTier,
    defindex,
    used_by_classes
} from './controls'

const weapon = {
    controls: {
        quality: quality([0, 1, 11, 13, 14, 3, 6]),//no decorated
        elevated,
        uncraftable,
        killstreakTier,
        defindex,
    },
    itemFn: compose(
        map(
            when(
                compose(equals(0), indexOf('Promo'), propOr('', 'name')),
                chain(assoc('item_name'), compose(concat(__, ' (promo)'), prop('item_name')))
            )
        ),
        pickBy(
            allPass([
                compose(complement(includes)(__, [850]), prop('defindex')),//deflector
                complement(has)('untradable'),
                compose(complement(includes)(__, [0, 15]), prop('item_quality')),//no normal / decorated items
                compose(includes(__, ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building']), prop('item_slot')),
                compose(complement(includes)('Festive'), prop('item_name')),
                compose(complement(includes)('Botkiller'), prop('item_name')),
                compose(complement(includes)('_token'), prop('item_class'))
            ])
        )),
    filters: {
        used_by_classes: used_by_classes(),
        item_slot: {
            name: 'item_slot',
            label: 'Slot',
            isClearable: true,
            options: [
                ['melee', 'Melee'],
                ['primary', 'Primary'],
                ['secondary', 'Secondary'],
                ['pda', 'Pda'],
                ['pda2', 'Pda 2'],
                ['building', 'Building'],
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

export default weapon