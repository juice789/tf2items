import { fabricatorDefindex } from '@juice789/tf2items'

import {
    compose, map, prop, __, chain, assoc, pick
} from 'ramda'

import {
    defindex,
    target,
    getClasses,
    getSlots
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
        pick([20002, 20003])
    ),
    targetFn: pick(fabricatorDefindex),
    filters: {
        used_by_classes: getClasses(undefined, ['all']),
        item_slot: getSlots(['melee', 'primary', 'secondary'])
    },
    validation: {
        single: ['defindex', 'target'],
        multi: ['defindex']
    }
}

export default fabricator