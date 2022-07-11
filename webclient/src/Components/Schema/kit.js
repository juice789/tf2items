import { fabricatorDefindex } from '@juice789/tf2items'

import {
    compose, map, prop, pickBy, includes, __, allPass, chain, assoc
} from 'ramda'

import {
    defindex,
    target,
    used_by_classes
} from './controls'

const kit = {
    controls: {
        defindex,
        target,
    },
    defaults: {
        quality: '6',
        uncraftable: '1'
    },
    rules: {
        isTarget: true
    },
    itemFn: compose(
        map(
            chain(
                assoc('item_name'),
                compose(
                    prop(__, {
                        '6523': 'Specialized Killstreak Kit',
                        '6527': 'Killstreak Kit',
                        '6526': 'Professional Killstreak Kit'
                    }),
                    prop('defindex')
                )
            )
        ),
        pickBy(
            compose(includes(__, [6527, 6523, 6526]), prop('defindex')),
        )
    ),
    targetFn: pickBy(
        allPass([
            compose(includes(__, fabricatorDefindex), prop('defindex'))
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
    validation: {
        single: ['defindex', 'target'],
        multi: ['defindex']
    }
}

export default kit