import {
    compose, values, map, prop, pickBy, includes, allPass, chain, indexBy
} from 'ramda'

import {
    defindex,
    used_by_classes
} from './controls'

const strangifier = {
    controls: {
        defindex,
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
        pickBy(allPass([
            has('target'),
            compose(includes('Strangifier'), prop('item_name')),
        ]))
    ),
    filters: {
        used_by_classes: used_by_classes()
    },
    defaults: {
        quality: '6',
    },
    validation: {
        single: ['defindex'],
    }
}

export default strangifier