import { fabricatorDefindex } from '@juice789/tf2items'

import {
    defindex,
    target,
    getClasses,
    getSlot
} from './controls'

const fabricatorNames = {
    '20002': 'Specialized Kit Fabricator',
    '20003': 'Professional Kit Fabricator'
}

const fabricator = {
    controls: {
        defindex: defindex({ isSearchable: false }),
        target: target()
    },
    defaults: {
        quality: 6,
        oq: 6
    },
    itemFn: items => Object.fromEntries(
        [20002, 20003]
            .filter(key => key in items)
            .map(key => [key, { ...items[key], item_name: fabricatorNames[items[key].defindex] }])
    ),
    targetFn: items => Object.fromEntries(
        fabricatorDefindex.filter(key => key in items).map(key => [key, items[key]])
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['all']),
        item_slot: getSlot(['melee', 'primary', 'secondary'])
    },
    validation: {
        single: ['defindex', 'target'],
        multi: ['defindex']
    }
}

export default fabricator