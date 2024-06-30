import { pickBy } from 'ramda'

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
        ({ item_name, item_slot }) => item_name.includes('Botkiller') && ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building'].includes(item_slot)
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