import { fabricatorDefindex } from '@juice789/tf2items'

import {
    defindex,
    getClasses,
    getSlot,
    target
} from './controls'

const kitNames = {
    '6523': 'Specialized Killstreak Kit',
    '6527': 'Killstreak Kit',
    '6526': 'Professional Killstreak Kit'
}

const kit = {
    controls: {
        defindex: defindex({ isSearchable: false }),
        target: target(),
    },
    defaults: {
        quality: '6',
        uncraftable: '1'
    },
    itemFn: items => Object.fromEntries(
        [6527, 6523, 6526]
            .filter(key => key in items)
            .map(key => [key, { ...items[key], item_name: kitNames[items[key].defindex] }])
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

export default kit