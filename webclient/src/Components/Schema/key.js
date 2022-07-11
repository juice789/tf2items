import {
    compose, map, prop, propEq, reverse, pickBy, when, __, allPass, indexOf, chain, assoc, complement, has, concat, equals
} from 'ramda'

import {
    uncraftable,
    defindex
} from './controls'

const key = {
    controls: {
        uncraftable,
        defindex,
    },
    itemFn: compose(
        map(
            when(
                allPass([propEq('item_name', 'Mann Co. Supply Crate Key'), complement(propEq)('name', 'Decoder Ring')]),
                chain(assoc('item_name'), compose(concat(__, ' (Mann Co. Supply Crate Key)'), prop('name')))
            )
        ),
        pickBy(
            allPass([
                compose(equals(-1), indexOf('weN '), reverse, prop('name')),
                propEq('type2', 'key'),
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