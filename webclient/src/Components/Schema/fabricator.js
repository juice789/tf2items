import { fabricatorDefindex } from '@juice789/tf2items'

import {
    compose, map, prop, pickBy, includes, __, chain, assoc,
} from 'ramda'

import {
    defindex,
    target,
    used_by_classes
} from './controls'

const fabricator = {
    controls: {
        defindex,
        target
    },
    defaults: {
        quality: 6,
        oq: 6
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
                        '20002': 'Specialized Kit Fabricator',
                        '20003': 'Professional Kit Fabricator'
                    }),
                    prop('defindex')
                )
            )
        ),
        pickBy(
            compose(includes(__, [20002, 20003]), prop('defindex'))
        )
    ),
    targetFn: pickBy(
        compose(includes(__, fabricatorDefindex), prop('defindex'))
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

export default fabricator