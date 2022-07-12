
import { serieslessDefindex } from '@juice789/tf2items'

import {
    compose, values, map, prop, test, pickBy, when, includes, __, allPass, chain, has, indexBy, anyPass, complement
} from 'ramda'

import {
    uncraftable,
    defindex
} from './controls'

const crate = {
    controls: {
        uncraftable,
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
                compose(complement(test)(/ B$/), prop('name')), // don't include if the name is like "crate B"
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