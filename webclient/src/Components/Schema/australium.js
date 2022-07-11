import { australiumDefindex } from '@juice789/tf2items'
import { compose, prop, pickBy, includes } from 'ramda'

import {
    killstreakTier,
    festivized,
    defindex,
    used_by_classes
} from './controls'

const australium = {
    controls: {
        killstreakTier,
        festivized,
        defindex
    },
    itemFn: pickBy(
        compose(
            includes(__, australiumDefindex),
            parseInt,
            prop('defindex')
        )
    ),
    filters: {
        used_by_classes: used_by_classes(['multi', 'all'])
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