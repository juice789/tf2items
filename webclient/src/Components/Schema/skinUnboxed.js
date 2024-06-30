import { textures, weaponCollections } from '@juice789/tf2items'

import {
    compose, map, prop, propEq, pickBy, includes, allPass, assoc, complement, range, props, evolve, join, chain, __, identity
} from 'ramda'

import {
    getQuality,
    elevated,
    killstreakTier,
    wear,
    getEffect,
    defindex,
    festivized,
    getCollections,
    getRarities,
    getClasses,
    getRules
} from './controls'

const skinUnboxed = {
    controls: {
        quality: getQuality([11, 5, 15]),
        elevated,
        festivized,
        killstreakTier,
        wear,
        effect: getEffect(range(701, 705)),
        defindex: defindex()
    },
    itemFn: compose(
        map(
            chain(
                assoc('item_name'),
                compose(
                    join(' '),
                    evolve([prop(__, textures), identity]),
                    props(['texture', 'item_name'])
                )
            )
        ),
        pickBy(
            allPass([
                compose(
                    complement(includes)('War Paint'),
                    prop('item_name')
                ),
                propEq(15, 'item_quality')
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