
import { serieslessDefindex } from '@juice789/tf2items'

import {
    compose, values, map, prop, reverse, pickBy, when, includes, __, allPass, indexOf, chain, has, indexBy, anyPass, equals
} from 'ramda'

import {
    uncraftable,
    defindex
} from './controls'

const crate = {
    controls: {
        uncraftable, //?
        defindex,
    },
    itemFn: compose(
        indexBy(prop('defindex')),
        chain(
            when(
                has('series'),
                (item) => map(s => ({
                    ...item,
                    defindex: item.defindex + '/' + s,
                    series: s,
                    item_name: item.item_name + " #" + s
                }), item.series)
            )
        ),
        values,
        pickBy(
            allPass([
                compose(equals(-1), indexOf('B '), reverse, prop('name')),
                anyPass([
                    has('series'),
                    compose(includes(__, serieslessDefindex), prop('defindex'))
                ])
            ])
        )
    ),
    defaults: {
        quality: '6'
    },
    validation: {
        single: ['defindex'],
    }
}

export default crate