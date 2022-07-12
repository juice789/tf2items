import { paintableDefindex } from '@juice789/tf2items'

import {
    range, pick
} from 'ramda'

import {
    getQuality,
    elevated,
    killstreakTier,
    wear,
    texture,
    getEffect,
    defindex,
    getClasses,
    getSlot,
} from './controls'

const skinPainted = {
    controls: {
        quality: getQuality([11, 5, 15]),
        elevated,
        killstreakTier,
        wear,
        texture,
        effect: getEffect(range(701, 705)),
        defindex
    },
    itemFn: pick(paintableDefindex),
    filters: {
        used_by_classes: getClasses(undefined, ['all']),
        item_slot: getSlot()
    },
    rules: {
        effect: {
            quality: ['5'],
            ignore: true
        },
        elevated: {
            quality: ['11'],
            reverse: true,
            ignore: false
        }
    },
    multiEffect: {
        name: 'multiEffect',
        label: 'Multi effects',
        isClearable: true,
        options: [
            ['wep', 'All'],
            ['wep2', 'No Energy Orb']
        ]
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality'],
        effect: ['defindex']
    }
}

export default skinPainted