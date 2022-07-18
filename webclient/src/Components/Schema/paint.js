import {
    compose, prop, propEq, pickBy, includes, __, allPass, complement,
} from 'ramda'

import {
    uncraftable,
    defindex
} from './controls'

const paint = {
    controls: {
        uncraftable,
        defindex: defindex(),
    },
    itemFn: pickBy(
        allPass([
            compose(complement(includes)(__, ['5023']), prop('defindex')),
            propEq('type2', 'paint')
        ])
    ),
    defaults: {
        quality: '6'
    },
    validation: {
        single: ['defindex']
    }
}

export default paint