const {
    compose,
    complement,
    propEq,
    hasPath,
    F,
    prop,
    chain,
    assoc,
    map,
    __,
    applyTo,
    cond,
    identity,
    T,
    flatten,
    toPairs,
    pathOr,
    pickBy,
    indexBy,
    propOr,
    path,
    find,
    includes,
    values,
    nth,
    has,
    when,
    allPass,
    converge,
    or,
    take,
    uncurryN
} = require('ramda')

const { safeItems: items } = require('./schemaItems.js')
const { textures } = require('./schema.json')
const { skuFromItem } = require('./sku.js')

const {
    kitRemap
} = require('./fromEconItem.js')

const findValue = uncurryN(2, (fns) => compose(
    find(Boolean),
    map(__, fns),
    applyTo
))

const isWeaponEffect = compose(includes(__, ['701', '702', '703', '704']), String)

const defindex = prop('defindex')

const quality = prop('quality')

const uncraftable = compose(Boolean, prop('flag_cannot_craft'))

const effectOptions = [
    path(['attributes', '134', 'float_value']),
    path(['attributes', '2041', 'value']),
]

const effect = findValue(effectOptions)

const elevated = cond(
    [
        [complement(propEq)('quality', 11), hasPath(['attributes', '214'])],
        [propEq('quality', 11), compose(isWeaponEffect, effect)],
        [T, F]
    ]
)

const ktRemap = {
    '6527': '1',
    '6523': '2',
    '6526': '3',
    '20002': '2',
    '20003': '3'
}

const ktOptions = [
    path(['attributes', '2025', 'float_value']),
    compose(prop(__, ktRemap), prop('defindex'))
]

const killstreakTier = findValue(ktOptions)

const festivized = hasPath(['attributes', '2053'])

const texture = path(['attributes', '834', 'value'])

const wears = {
    '0': null,
    '0.2': '1',
    '0.4': '2',
    '0.6': '3',
    '0.8': '4',
    '1': '5'
}

const wear = compose(
    prop(__, wears),
    take(3),
    String,
    pathOr('0', ['attributes', '725', 'float_value'])
)

const australium = hasPath(['attributes', '2027'])

const series = path(['attributes', '187', 'float_value'])

const findOutput = compose(
    find(compose(includes(__, [true, 'true']), prop('is_output'))),
    values,
    propOr({}, 'attributes')
)

const findRecipeTarget = compose(
    prop('float_value'),
    find(compose(includes(__, ['2012', 2012]), prop('defindex'))),
    propOr([], 'attributes'),
    findOutput
)

const targetOptions = [
    path(['attributes', '2012', 'float_value']),
    findRecipeTarget
]

const target = findValue(targetOptions)

const output = compose(
    prop('itemdef'),
    findOutput
)

const oq = compose(
    prop('quality'),
    findOutput
)

const fns = {
    defindex,
    quality,
    uncraftable,
    elevated,
    effect,
    killstreakTier,
    festivized,
    texture,
    wear,
    australium,
    series,
    target,
    output,
    oq
}

const remap = (fn1, fn2) => when(
    fn1,
    chain(
        assoc('defindex'),
        converge(
            or,
            [
                fn2,
                prop('defindex')
            ]
        )
    )
)

const remapStrangifier = remap(
    compose(
        propEq('item_name', 'Strangifier'),
        prop(__, items),
        prop('defindex')
    ),
    compose(
        prop('defindex'),
        nth(0),
        values,
        (listingTarget) => pickBy(
            compose(
                includes(listingTarget.toString()),
                propOr([], 'target')
            ),
            items
        ),
        prop('target')
    )
)

const strangifierSets = pickBy(allPass([
    has('td'),
    propEq('item_name', 'Chemistry Set')
]), items)

const remapStrangifierSet = remap(
    allPass([
        propEq('defindex', 20001),
        prop('output'),
        prop('target')
    ]),
    compose(
        prop('defindex'),
        nth(0),
        values,
        (listingTarget) => pickBy(
            compose(
                includes(listingTarget.toString()),
                prop('td')
            ),
            strangifierSets
        ),
        prop('target'),
    )
)

const collectorSets = pickBy(allPass([
    complement(prop)('td'),
    prop('od'),
    propEq('item_name', 'Chemistry Set'),
]), items)

const remapCollectorSet = remap(
    allPass([
        propEq('defindex', 20001),
        complement(prop)('target')
    ]),
    compose(
        prop('defindex'),
        nth(0),
        values,
        (listingOutput) => pickBy(
            compose(
                includes(listingOutput.toString()),
                prop('od')
            ),
            collectorSets
        ),
        prop('output')
    )
)


const weaponIndex = {
    "0": 190,
    "1": 191,
    "13": 200,
    "14": 201,
    "15": 202,
    "16": 203,
    "17": 204,
    "18": 205,
    "19": 206,
    "2": 192,
    "20": 207,
    "21": 208,
    "22": 209,
    "23": 209,
    "24": 210,
    "25": 737,
    "29": 211,
    "3": 193,
    "30": 212,
    "4": 194,
    "5": 195,
    "6": 196,
    "7": 197,
    "735": 736,
    "8": 198,
    "9": 199,
    "10": 199,
    "11": 199,
    "12": 199
}

const remapWeapon = when(
    compose(has(__, weaponIndex), prop('defindex')),
    chain(assoc('defindex'), compose(prop(__, weaponIndex), prop('defindex')))
)

const decodeSkinQuality = cond([
    [allPass([propEq('quality', 15), compose(isWeaponEffect, prop('effect'))]), assoc('quality', 5)], //decorated + effect = unusual
    [allPass([propEq('quality', 11), compose(isWeaponEffect, prop('effect'))]), assoc('quality', 5)], //strange + effect = unusual
    [allPass([propEq('quality', 15), complement(prop)('effect'), prop('elevated')]), assoc('quality', 11)], //decorated + elevated = strange
    [T, identity]
])

const unboxedSkins = map(
    (item) => assoc('item_name', textures[item.texture] + ' ' + item.item_name, item),
    pickBy(propEq('item_quality', 15), items)
)

const unboxSkinsRemap = remap(
    prop('texture'),
    compose(
        nth(0),
        flatten,
        toPairs,
        ({ defindex, texture }) => pickBy(
            propEq('item_name', textures[texture] + ' ' + items[defindex].item_name),
            unboxedSkins
        )
    )
)

const remapCrateSeries = remap(
    prop('series'),
    compose(
        prop('defindex'),
        find(
            __,
            values(items)
        ),
        (s) => compose(
            includes(s),
            propOr([], 'series')
        ),
        String,
        prop('series')
    )
)

const promoIndex = {
    "30720": "30740",
    "30721": "30741",
    "30724": "30739",
    "810": "831",
    "811": "832",
    "812": "833",
    "813": "834",
    "814": "835",
    "815": "836",
    "816": "837",
    "817": "838"
}

const promoRemap = when(
    allPass([
        compose(has(__, promoIndex), prop('defindex')),
        propEq('quality', 1)
    ]),
    chain(assoc('defindex'), compose(prop(__, promoIndex), prop('defindex')))
)

const remaps = compose(
    remapCrateSeries,
    unboxSkinsRemap,
    kitRemap,
    promoRemap,
    decodeSkinQuality,
    remapWeapon,
    remapCollectorSet,
    remapStrangifierSet,
    remapStrangifier
)

const fromListingV1 = compose(
    skuFromItem,
    remaps,
    map(__, fns),
    applyTo,
    chain(
        assoc('attributes'),
        compose(
            indexBy(prop('defindex')),
            propOr([], 'attributes')
        )
    )
)

module.exports = { fromListingV1, remaps }