import { textures, warPaintCollections } from '@juice789/tf2items'

import {
    compose, map, prop, pickBy, includes, range, __, toString, allPass, assoc, complement, equals
} from 'ramda'

import {
    quality,
    elevated,
    wear,
    effect,
    defindex,
    getCollections,
    getRarities
} from './controls'

const warpaint = {
    controls: {
        quality: quality([11, 5, 15]),
        elevated,
        wear,
        effect: effect(map(toString, range([701, 704]))),
        defindex
    },
    itemFn: compose(
        map((item) => assoc('item_name', textures[item.texture] + ' ' + item.item_name, item)),
        pickBy(
            allPass([
                compose(complement(includes)(__, [16391, 9536]), prop('defindex')),//smissmas sweater, ??
                compose(equals('War Paint'), prop('item_name')),
            ])
        )),
    filters: {
        collection: getCollections(warPaintCollections),
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
            ['wep2', 'All']
        ]
    },
    validation: {
        single: ['defindex', 'quality', 'wear'],
        multi: ['quality', 'wear'],
        effect: ['defindex', 'wear']
    }
}

export default warpaint