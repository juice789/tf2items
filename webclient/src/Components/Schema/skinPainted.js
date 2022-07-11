import { paintableDefindex } from '@juice789/tf2items'

import {
    compose, map, prop, pickBy, includes, range, __, toString
} from 'ramda'

import {
    quality,
    elevated,
    killstreakTier,
    wear,
    texture,
    effect,
    defindex,
    used_by_classes,
    item_slot
} from './controls'

const skinPainted = {
    controls: {
        quality: quality([11, 5, 15]),
        elevated,
        killstreakTier,
        wear,
        texture,
        effect: effect(map(toString, range([701, 705]))),
        defindex
    },
    itemFn: pickBy(
        compose(includes(__, paintableDefindex), prop('defindex')),
    ),
    filters: {
        used_by_classes: used_by_classes('all'),
        item_slot
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
            ['wep2', 'All']
        ]
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality'],
        effect: ['defindex']
    }
}

export default skinPainted