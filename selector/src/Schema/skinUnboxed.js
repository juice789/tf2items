import { textures, weaponCollections } from '@juice789/tf2items'

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

import { range } from './helpers'

const withTextureName = item => ({ ...item, item_name: `${textures[item.texture]} ${item.item_name}` })

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
    itemFn: items => {
        const filtered = Object.fromEntries(
            Object
                .entries(items)
                .filter(([, item]) => !item.item_name.includes('War Paint') && item.item_quality === 15)
        )
        return Object.fromEntries(
            Object.entries(filtered).map(([key, item]) => [key, withTextureName(item)])
        )
    },
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