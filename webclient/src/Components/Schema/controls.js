import {
    qualityNames,
    particleEffects,
    textures,
    killstreakTiers,
    wears,
    itemSlots,
    itemClasses,
    rarities,
    classes,
    impossibleEffects
} from '@juice789/tf2items'

import {
    pick,
    __
} from 'ramda'

const pickOmitOptions = (whiteList = [], blackList = [], list) => Object.entries(list).reduce((newList, [k, v]) =>
    (whiteList.length === 0 || whiteList.includes(k)) && blackList.includes(k) === false
        ? newList.concat([[k, v]])
        : newList,
    []
)

export const getQuality = (whiteList, blacklist) => ({
    name: "quality",
    label: "Quality",
    options: pickOmitOptions(whiteList, blacklist, qualityNames),
})

export const elevated = {
    name: "elevated",
    label: "Elevated Strange",
    type: 'toggle'
}

export const uncraftable = {
    name: "uncraftable",
    label: "Craftable",
    type: 'toggle',
    isOn: true,
    remap: { '1': '0', '0': '1' }
}

export const killstreakTier = {
    name: "killstreakTier",
    label: "Killstreak Tier",
    isClearable: true,
    isSearchable: false,
    options: Object.entries(killstreakTiers)
}

export const festivized = {
    name: 'festivized',
    label: 'Festivized',
    type: 'toggle'
}

export const wear = {
    name: "wear",
    label: "Wear",
    isClearable: true,
    isSearchable: false,
    options: Object.entries(wears)
}

export const getEffect = (whitelist, blacklist = impossibleEffects) => ({
    name: "effect",
    label: "Effect",
    isClearable: true,
    options: pickOmitOptions(whitelist, blacklist, particleEffects)
})

export const texture = {
    name: "texture",
    label: "Texture",
    isClearable: true,
    options: Object.entries(textures).filter(([k, v]) => k >= 102)
}

export const defindex = (settings = {}) => ({
    name: "defindex",
    label: "Item",
    options: [],
    isClearable: true,
    isSearchable: true,
    ...settings
})

export const target = (settings = {}) => ({
    name: "target",
    label: "Target",
    options: [],
    isClearable: true,
    isSearchable: true,
    ...settings
})

export const craft = {
    name: "craft",
    label: "Craft number",
    type: 'input'
}

export const series = {
    name: "series",
    label: "Crate series",
    type: 'input'
}

export const targetInput = {
    name: "target",
    label: "Target",
    type: 'input'
}

export const getClasses = (whiteList, blacklist) => ({
    name: "used_by_classes",
    label: "Class",
    isClearable: true,
    options: pickOmitOptions(whiteList, blacklist, classes)
})

export const getSlot = (whiteList, blacklist) => ({
    name: 'item_slot',
    label: 'Slot',
    isClearable: true,
    options: pickOmitOptions(whiteList, blacklist, itemSlots)
})

export const item_class = {
    name: 'item_class',
    label: 'Type',
    isClearable: true,
    options: Object.entries(itemClasses)
}

export const untradable = {
    name: 'untradable',
    label: 'Tradable',
    isClearable: true,
    isSearchable: false,
    options: [
        ['2', 'Tradable only'],
        ['1', 'Untradable only']
    ]
}

export const getRarities = (whiteList = ['common', 'uncommon', 'rare', 'mythical', 'legendary', 'ancient'], blacklist) => ({
    name: 'rarity',
    label: 'Rarity',
    isClearable: true,
    options: pickOmitOptions(whiteList, blacklist, rarities)
})

export const getCollections = options => ({
    name: 'collection',
    label: 'Collection',
    isClearable: true,
    options: options.map((n) => [n, n])
})

const rules = {
    effect: {
        quality: ['5'], //if the quality is 5 display the effect control. Otherwise hide it.
        hidden: true //hidden by default
    },
    elevated: {
        quality: ['11', '6', '15'], //if the quality is strange, unique or decorated do not display the elevated control. Otherwise display it.
        reverse: true, //helper flag to reverse the rule logic. Only used in the reducer.
        hidden: false //displayed by default
    }
}

export const getRules = pick(__, rules)