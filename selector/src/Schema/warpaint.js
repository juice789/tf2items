import { textures, warPaintCollections } from '@juice789/tf2items'

import {
    getQuality,
    elevated,
    wear,
    getEffect,
    defindex,
    getCollections,
    getRarities,
    getRules
} from './controls'

import { range } from './helpers'

const warpaint = {
    controls: {
        quality: getQuality([11, 5, 15]),
        elevated,
        wear,
        effect: getEffect(range(701, 704)),
        defindex: defindex()
    },
    itemFn: items => {
        const filtered = Object.fromEntries(
            Object
                .entries(items)
                .filter(([, item]) => item.item_name === 'War Paint' && 'texture' in item)
        )
        return Object.fromEntries(
            Object.entries(filtered).map(([key, item]) => [
                key,
                { ...item, item_name: textures[item.texture] + ' ' + item.item_name }
            ])
        )
    },
    filters: {
        collection: getCollections(warPaintCollections),
        rarity: getRarities()
    },
    rules: getRules(['effect', 'elevated']),
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