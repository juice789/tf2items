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
    compose,
    toPairs,
    omit,
    pickBy,
    when,
    __,
    pick,
    complement,
    isEmpty
} from 'ramda'

const pickOmitOptions = (whitelist = [], blacklist = [], list) => compose(
    toPairs,
    omit(blacklist),
    when(() => complement(isEmpty)(whitelist), pick(whitelist)),
)(list)

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
    options: toPairs(killstreakTiers)
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
    options: toPairs(wears)
}

export const getEffect = (whitelist, blacklist = impossibleEffects) => ({
    name: "effect",
    label: "Effect",
    options: pickOmitOptions(whitelist, blacklist, particleEffects)
})

export const texture = {
    name: "texture",
    label: "Texture",
    isClearable: true,
    options: toPairs(pickBy((v, k) => k >= 102, textures))
}

export const defindex = {
    name: "defindex",
    label: "Item",
    options: []
}

export const target = {
    name: "target",
    label: "Target",
    options: []
}

export const craftNumber = {
    name: "craftNumber",
    label: "Craft number",
    type: 'input'
}

export const crateSeries = {
    name: "crateSeries",
    label: "Crate series",
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
    options: toPairs(itemClasses)
}

export const untradable = {
    name: 'untradable',
    label: 'Not tradable',
    options: [
        ['1', 'Not tradable']
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