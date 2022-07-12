import { australiumDefindex } from '@juice789/tf2items'
import { pick } from 'ramda'

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
        defindex
    },
    itemFn: pick(australiumDefindex),
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