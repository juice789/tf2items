import { paintableDefindex } from '@juice789/tf2items'

import {
    range, pick
} from 'ramda'

import {
    getQuality,
    elevated,
    killstreakTier,
    wear,
    festivized,
    texture,
    getEffect,
    defindex,
    getClasses,
    getSlot,
    getRules,
} from './controls'

const skinPainted = {
    controls: {
        quality: getQuality([11, 5, 15]),
        elevated,
        festivized,
        killstreakTier,
        wear,
        texture, //todo: filter the textures by collection
        effect: getEffect(range(701, 705)),
        defindex: defindex()
    },
    itemFn: pick(paintableDefindex),
    filters: {
        used_by_classes: getClasses(undefined, ['all']),
        item_slot: getSlot()
    },
    rules: getRules(['effect', 'elevated']),
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