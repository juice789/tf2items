import { identity } from 'ramda'

import {
    getQuality,
    elevated,
    uncraftable,
    killstreakTier,
    festivized,
    wear,
    getEffect,
    texture,
    defindex,
    target,
    craftNumber,
    crateSeries,
    getSlot,
    item_class,
    untradable,
    getClasses
} from './controls'

const defaultCategory = {
    controls: {
        quality: getQuality(),
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
        effect: getEffect(undefined, []),
        texture,
        defindex: defindex({ type: 'virtual' }), //todo consider merging all modifications to the other categories, also consider doing all item_name modifications
        target: target({ type: 'virtual' }), //todo how to filter items that can't be targets?
        craftNumber,
        crateSeries
    },
    itemFn: identity,
    targetFn: identity,
    filters: {
        used_by_classes: getClasses(),
        item_slot: getSlot(),
        item_class,
        untradable
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default defaultCategory