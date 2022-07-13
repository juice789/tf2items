import { textures, weaponCollections } from '@juice789/tf2items'

import {
    compose, map, prop, propEq, pickBy, includes, allPass, assoc, complement, range
} from 'ramda'

import {
    getQuality,
    elevated,
    killstreakTier,
    wear,
    getEffect,
    defindex,
    getCollections,
    getRarities,
    getClasses,
    getRules
} from './controls'

const skinUnboxed = {
    controls: {
        quality: getQuality([11, 5, 15]),
        elevated,
        killstreakTier,
        wear,
        effect: getEffect(range(701, 705)),
        defindex
    },
    itemFn: compose(
        map((item) => assoc('item_name', textures[item.texture] + ' ' + item.item_name, item)),
        pickBy(
            allPass([
                compose(
                    complement(includes)('War Paint'),
                    prop('item_name')
                ),
                propEq('item_quality', 15)
            ])
        )
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['all']),
        collection: getCollections(weaponCollections),
        rarity: getRarities()
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

export default skinUnboxed