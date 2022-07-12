import {
    propEq, pickBy, pick,
} from 'ramda'

import {
    defindex,
    target
} from './controls'

const unusualifier = {
    controls: {
        defindex,
        target,
    },
    itemFn: pick([9258]),
    targetFn: pickBy(propEq('item_slot', 'taunt')),
    filters: {
        used_by_classes: used_by_classes(undefined, ['multi'])
    },
    defaults: {
        quality: '5',
        uncraftable: '1'
    },
    rules: {
        isTarget: true
    },
    validation: {
        single: ['defindex', 'target'],
        multi: ['defindex']
    }
}

export default unusualifier