import { identity } from 'ramda'

import {
    quality,
    elevated,
    uncraftable,
    killstreakTier,
    festivized,
    wear,
    effect,
    texture,
    defindex,
    target,
    craftNumber,
    crateSeries,
    used_by_classes,
    item_slot,
    item_class,
    untradable
} from './controls'

const defaultCategory = {
    controls: {
        quality: quality(),
        elevated,
        uncraftable,
        killstreakTier,
        australium: {
            name: 'australium',
            label: 'Australium',
            type: 'toggle'
        },
        festivized,
        wear,
        effect: effect(),
        texture,
        defindex,
        target,
        craftNumber,
        crateSeries
    },
    itemFn: identity,
    targetFn: identity,
    filters: {
        used_by_classes: used_by_classes(),
        item_slot,
        item_class,
        untradable
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default defaultCategory