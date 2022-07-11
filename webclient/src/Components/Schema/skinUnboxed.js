import { textures, weaponCollections } from '@juice789/tf2items'

import {
    compose, map, prop, propEq, pickBy, includes, allPass, assoc, complement, toString, range
} from 'ramda'

import {
    quality,
    elevated,
    killstreakTier,
    wear,
    effect,
    defindex,
    used_by_classes,
    getCollections,
    getRarities
} from './controls'

const skinUnboxed = {
    controls: {
        quality: quality([11, 5, 15]),
        elevated,
        killstreakTier,
        wear,
        effect: effect(map(toString, range([701, 705]))),
        defindex
    },
    itemFn: compose(
        map((item) => assoc('item_name', textures[item.texture] + ' ' + item.item_name, item)),
        pickBy(allPass([
            compose(complement(includes)('War Paint'), prop('item_name')),
            propEq('item_quality', 15)
        ]))
    ),
    filters: {
        used_by_classes: used_by_classes('all'),
        collection: getCollections(weaponCollections),
        rarity: getRarities()
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

export default skinUnboxed