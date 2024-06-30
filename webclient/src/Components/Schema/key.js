import {
    compose, map, prop, propEq, test, pickBy, when, __, allPass, chain, assoc, complement, has, concat
} from 'ramda'

import {
    uncraftable,
    defindex
} from './controls'

const key = {
    controls: {
        uncraftable,
        defindex: defindex(),
    },
    itemFn: compose(
        map(
            when(
                allPass([
                    propEq('Mann Co. Supply Crate Key', 'item_name'),
                    complement(propEq)('Decoder Ring', 'name')
                ]),
                chain(
                    assoc('item_name'),
                    compose(concat(__, ' (Mann Co. Supply Crate Key)'), prop('name'))
                )
            )
        ),
        pickBy(
            allPass([
                compose(complement(test)(/ New$/), prop('name')), //don't include if it ends with " New"
                propEq('key', 'type2'),
                complement(has)('untradable')
            ])
        )
    ),
    defaults: {
        quality: '6',
    },
    validation: {
        single: ['defindex']
    }
}

export default key