import {
    compose, values, map, prop, pickBy, includes, allPass, chain, indexBy, has
} from 'ramda'

import {
    safeItems as items
} from '@juice789/tf2items'

import {
    defindex,
    getClasses
} from './controls'

const strangifier = {
    controls: {
        defindex: defindex(),
    },
    itemFn: compose(
        indexBy(prop('defindex')),
        chain((item) => map(target => ({
            ...items[target],
            ...item,
            defindex: item.defindex + '>' + target,
            target,
            item_name: items[target].item_name + " Strangifier"
        }), item.target)),
        values,
        pickBy(
            allPass([
                compose(includes('Strangifier'), prop('item_name')),
                has('target')
            ])
        )
    ),
    filters: {
        used_by_classes: getClasses()
    },
    defaults: {
        quality: '6',
    },
    validation: {
        single: ['defindex'],
    }
}

export default strangifier