import { australiumDefindex } from '@juice789/tf2items'

import {
    killstreakTier,
    festivized,
    defindex,
    getClasses
} from './controls'

const australium = {
    controls: {
        killstreakTier,
        festivized,
        defindex: defindex()
    },
    itemFn: items => Object.fromEntries(
        australiumDefindex.filter(key => key in items).map(key => [key, items[key]])
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['multi', 'all'])
    },
    defaults: {
        quality: '11',
        australium: '1'
    },
    validation: {
        single: ['defindex'],
    }
}

export default australium