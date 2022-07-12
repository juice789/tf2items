import { safeItems as items } from '@juice789/tf2items'

import {
    compose, values, map, prop, pick, when, __, chain, has, indexBy
} from 'ramda'

import {
    defindex,
    getClasses
} from './controls'

const chemistrySet = {
    controls: {
        defindex
    },
    itemFn: compose(
        indexBy(prop('defindex')),
        chain(
            when(has('td'),
                (item) => map(td => ({
                    ...items[td],
                    ...item,
                    defindex: item.defindex + '<' + td,
                    td,
                    item_name: `${items[td].item_name} ${item.item_name}`
                }), item.td))
        ),
        chain((item) => map(od => ({
            ...items[od],
            ...item,
            defindex: item.defindex + '<' + od,
            od,
            item_name: `${item.oq === '14' ? "Collector's " : ''}${items[od].item_name} ${item.item_name}`
        }), item.od)),
        values,
        pick([20000, 20001, 20005, 20006, 20007])
    ),
    filters: {
        used_by_classes: getClasses(),
        oq: {
            name: 'oq',
            label: "Collector's",
            isClearable: true,
            options: [
                [14, 'Yes']
            ]
        }
    },
    defaults: {
        quality: '6'
    },
    validation: {
        single: ['defindex']
    }
}

export default chemistrySet