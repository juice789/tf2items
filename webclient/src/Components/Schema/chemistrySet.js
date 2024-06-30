import { safeItems as items } from '@juice789/tf2items'

import {
    compose,
    prop,
    pick,
    when,
    chain,
    has,
    indexBy
} from 'ramda'

import {
    defindex,
    getClasses
} from './controls'

const chemistrySet = {
    controls: {
        defindex: defindex()
    },
    itemFn: compose(
        indexBy(prop('defindex')),
        chain(
            when(has('td'),
                (item) => item.td.map(
                    td => ({
                        ...items[td],
                        ...item,
                        defindex: item.defindex + '<' + td,
                        td,
                        item_name: `${items[td].item_name} ${item.item_name}`
                    })
                ))
        ),
        chain((item) => item.od.map(
            (od) => ({
                ...items[od],
                ...item,
                defindex: item.defindex + '<' + od,
                od,
                item_name: `${item.oq === '14' ? "Collector's " : ''}${items[od].item_name} ${item.item_name}`
            })
        )),
        Object.values,
        pick([20000, 20001, 20005, 20006, 20007])
    ),
    filters: {
        used_by_classes: getClasses(),
        oq: {
            name: 'oq',
            label: "Collector's",
            isClearable: true,
            isSearchable: false,
            options: [
                ['14', 'Yes']
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