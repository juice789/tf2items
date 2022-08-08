import {
    compose, prop, pickBy, includes, __, allPass
} from 'ramda'

import {
    killstreakTier,
    defindex,
    getClasses
} from './controls'

const botkiller = {
    controls: {
        killstreakTier,
        defindex: defindex()
    },
    itemFn: pickBy(
        allPass([
            compose(includes('Botkiller'), prop('item_name')),
            compose(includes(__, ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building']), prop('item_slot'))
        ])
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['multi', 'all'])
    },
    defaults: {
        quality: '11'
    },
    validation: {
        single: ['defindex']
    }
}

export default botkiller