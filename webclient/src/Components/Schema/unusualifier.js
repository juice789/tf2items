import {
    compose, prop, propEq, pickBy, includes, __, allPass, complement,
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
    itemFn: pickBy(
        compose(includes(__, [9258]), prop('defindex')),
    ),
    targetFn: pickBy(
        allPass([
            compose(complement(includes)(__, [1174, 438, 1175]), prop('defindex')), //director's vision, table tantrum, boiling point
            propEq('item_slot', 'taunt')
        ])
    ),
    filters: {
        used_by_classes: used_by_classes('multi')
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