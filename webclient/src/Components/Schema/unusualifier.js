import {
    propEq, pickBy, pick,
} from 'ramda'

import {
    defindex,
    getClasses,
    target
} from './controls'

const unusualifier = {
    controls: {
        defindex: defindex({ isSearchable: false }),
        target: target(),
    },
    itemFn: pick([9258]),
    targetFn: pickBy(propEq('item_slot', 'taunt')),
    filters: {
        used_by_classes: getClasses(undefined, ['multi'])
    },
    defaults: {
        quality: '5',
        uncraftable: '1'
    },
    validation: {
        single: ['defindex', 'target'],
        multi: ['defindex']
    }
}

export default unusualifier