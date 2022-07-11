import {
    qualities,
    effects,
    textures,
    killstreakTiers,
    wears,
    itemSlots,
    itemClasses,
    rarities,
    classes
} from '@juice789/tf2items'

import {
    compose,
    toPairs,
    keys,
    omit,
    pickBy,
    nthArg,
    when,
    includes,
    __,
    pick
} from 'ramda'

export const quality = (whiteList = keys(qualities)) => ({
    name: "quality",
    label: "Quality",
    options: toPairs(pick(whiteList, qualities)),
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

const impossibleEffects = [1, 2, 3, 5, 20, 28, 3002, 3040, 184, 3062, 3076, 3080, 3082, 3086, 194, 208, 217, 222]

export const effect = (whitelist) => ({
    name: "effect",
    label: "Effect",
    options: toPairs(
        when(
            () => whitelist,
            pickBy(
                compose(
                    includes(__, whitelist),
                    nthArg(1)
                )
            ),
            omit(impossibleEffects, effects)
        )
    )
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

export const used_by_classes = (blacklist = []) => ({
    name: "used_by_classes",
    label: "Class",
    isClearable: true,
    options: compose(
        omit(blacklist),
        toPairs(classes)
    )
})

export const item_slot = {
    name: 'item_slot',
    label: 'Slot',
    isClearable: true,
    options: toPairs(itemSlots)
}

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

export const getRarities = (whiteList = ['common', 'uncommon', 'rare', 'mythical', 'legendary', 'ancient']) => ({
    name: 'rarity',
    label: 'Rarity',
    isClearable: true,
    options: compose(
        pick(whiteList),
        toPairs(rarities)
    )
})

export const getCollections = options => ({
    name: 'collection',
    label: 'Collection',
    isClearable: true,
    options: options.map((n) => [n, n])
})