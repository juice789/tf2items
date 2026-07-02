import { serieslessDefindex } from '@juice789/tf2items'

import {
    uncraftable,
    defindex
} from './controls'

// one crate -> one item per series number, composite defindex "base/series"
const expandSeries = item => 'series' in item
    ? item.series.map(s => ({
        ...item,
        defindex: item.defindex + '/' + s,
        series: s,
        item_name: item.item_name + " #" + s
    }))
    : [item]

const crate = {
    controls: {
        uncraftable,
        defindex: defindex(),
    },
    itemFn: items => {
        const filtered = Object.fromEntries(
            Object
                .entries(items)
                .filter(([, item]) =>
                    !/ B$/.test(item.name) // don't include if the name is like "crate B"
                    && ('series' in item || serieslessDefindex.includes(item.defindex))
                )
        )
        const expanded = Object.values(filtered).flatMap(expandSeries)
        return Object.fromEntries(expanded.map(item => [item.defindex, item]))
    },
    defaults: {
        quality: '6'
    },
    validation: {
        single: ['defindex'],
    }
}

export default crate