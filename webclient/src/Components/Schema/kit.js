import { fabricatorDefindex } from '@juice789/tf2items'

import {
    compose, map, prop, __, chain, assoc
} from 'ramda'

import {
    defindex,
    getClasses,
    getSlot,
    target
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
        pick([6527, 6523, 6526])
    ),
    targetFn: pick(fabricatorDefindex),
    filters: {
        used_by_classes: getClasses(undefined, ['all']),
        item_slot: getSlot(['melee', 'primary', 'secondary'])
    },
    validation: {
        single: ['defindex', 'target'],
        multi: ['defindex']
    }
}

export default kit