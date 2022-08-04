const {
    compose,
    includes,
    prop,
    propOr,
    find,
    flip,
    equals,
    map,
    when,
    unary,
    toLower,
    allPass,
    propEq,
    uncurryN,
    chain,
    __,
    ifElse,
    has,
    always,
    curry,
    defaultTo,
    applyTo,
    assoc,
    path,
    pathOr,
    invertObj,
    mergeRight,
    values,
    indexOf,
    replace,
    trim
} = require('ramda')

const { safeItems: items } = require('.schemaItems.js')
const { particleEffects: effects, textures } = require('./schema.json')
const { qualityNames: qualities, wears } = require('./schemaHelper.json')
const { skuFromItem } = require('./sku.js')

const marketHashIncludes = curry((string, item) => item.market_hash_name.indexOf(string) !== -1)

const findTag = uncurryN(2, (tagName) => compose(
    prop('name'),
    find(({ category_name }) => toLower(category_name) === toLower(tagName)),
    prop('tags')
))

const old_id = ifElse(has('new_assetid'), prop('assetid'), always(undefined))

const id = chain(propOr(__, 'new_assetid'), prop('assetid'))

const recipe = ({ market_hash_name }) => find(
    includes(__, market_hash_name),
    ['Fabricator', 'Strangifier Chemistry Set', 'Chemistry Set']
)

const series = ({ market_hash_name }) => indexOf('Chemistry', market_hash_name) >= 0
    ? undefined
    : market_hash_name.split('#')[1]

const craft = ({ name, market_hash_name }) => indexOf('#', name) !== -1 && indexOf('#', name) === -1 ? market_hash_name.split('#')[1] : undefined

const australium = (item) => item.app_data.quality === '11' && marketHashIncludes('Australium', item)

const wear = compose(
    propOr(null, __, invertObj(wears)),
    trim,
    replace(/\s\s+/g, ' '),
    reduce((all, curr) => replace(curr, '', all), __, ['(', ')']),
    defaultTo(''),
    findTag('exterior')
)

const texture = ifElse(
    findTag('exterior'),
    compose(
        propOr('NaN', __, invertObj(textures)),
        trim,
        replace(/\s\s+/g, ' '),
        ({ app_data, market_hash_name }) => reduce((all, curr) => replace(curr, '', all), market_hash_name, [
            "Specialized Killstreak",
            "Professional Killstreak",
            "Killstreak",
            "(Field-Tested)",
            "(Well-Worn)",
            "(Battle Scarred)",
            "(Minimal Wear)",
            "(Factory New)",
            "Festivized",
            "Strange",
            qualities[app_data.quality],
            items[app_data.def_index].item_name
        ])
    ),
    always(null)
)

const festivized = marketHashIncludes('Festivized')

const killstreakTier = compose(
    propOr(null, __, { 'Professional Killstreak': 3, 'Specialized Killstreak': 2, 'Killstreak': 1 }),
    find(__, ['Professional Killstreak', 'Specialized Killstreak', 'Killstreak']),
    flip(marketHashIncludes)
)

const effect = ifElse(
    allPass([
        compose(equals('5'), path(['app_data', 'quality'])),
        compose(
            find(compose(equals('ffd700'), prop('color'))),
            prop('descriptions')
        )
    ]),
    compose(
        propOr('NaN', __, invertObj(effects)),
        replace('★ Unusual Effect: ', ''),
        prop('value'),
        find(compose(equals('ffd700'), prop('color'))),
        prop('descriptions')
    ),
    always(null)
)

const elevated = ({ app_data, market_hash_name }) => app_data.quality === '11'
    ? false
    : includes(
        'Strange',
        replace(
            items[app_data.def_index].item_name,
            '',
            market_hash_name
        )
    )

const uncraftable = compose(
    Boolean,
    find(propEq('value', '( Not Usable in Crafting )')),
    prop('descriptions')
)

const market_hash_name = prop('market_hash_name')

const quality = pathOr('99', ['app_data', 'quality'])

const defindex = pathOr('0', ['app_data', 'def_index'])

const propsTf2_1 = {
    defindex,
    quality,
    market_hash_name,
    uncraftable,
    elevated,
    effect,
    killstreakTier,
    festivized,
    texture,
    wear,
    australium,
    series,
    craft,
    recipe,
    id,
    old_id
}

const isTarget = (market_hash_name) =>
    find(includes(__, market_hash_name), ['Strangifier', 'Fabricator', 'Strangifier Chemistry Set', 'Unusualifier']) ||
    (indexOf('Killstreak', market_hash_name) >= 0 && indexOf('Kit', market_hash_name) >= 0)

const target = ({ defindex, market_hash_name }) => {

    if (isTarget(market_hash_name)) {

        const itemName = compose(
            trim,
            replace(/\s\s+/g, ' '),
            reduce((all, curr) => replace(curr, '', all), __, [
                'Strangifier',
                'Unusual',
                'Unusualifier',
                items[defindex].item_name,
                "Specialized Killstreak",
                "Professional Killstreak",
                "Killstreak",
                "Collector's",
                "Series",
                'Kit',
                'Fabricator',
                'Chemistry Set',
                "#1",
                "#2",
                "#3"
            ]),
        )(market_hash_name)

        return find(
            ({ item_quality, item_name }) => ![0, 15].includes(item_quality) && item_name === itemName,
            values(items)
        ).defindex
    }
}

const output = ({ recipe, market_hash_name, killstreakTier }) => {
    switch (recipe) {
        case 'Fabricator':
            const ktMap = {
                '2': 6523,
                '3': 6526
            }
            return ktMap[killstreakTier]
        case 'Strangifier Chemistry Set':
            return 6522
        case 'Chemistry Set':
            const itemName = compose(
                trim,
                replace(/\s\s+/g, ' '),
                reduce((all, curr) => replace(curr, '', all), __, [
                    'Chemistry Set',
                    "Collector's",
                ]),
            )(market_hash_name)
            return find(
                ({ item_quality, item_name }) => ![0, 15].includes(item_quality) && item_name === itemName,
                values(items)).defindex
        default: return undefined
    }
}

const oq = ({ market_hash_name, recipe }) => recipe ? includes("Collector's", market_hash_name) ? '14' : '6' : undefined

const propsTf2_2 = {
    target,
    output,
    oq,
}

const propsOtherGame = {
    sku: market_hash_name,
    id,
    old_id
}

const keyRemap = when(
    compose(includes(__, ['5021', '5049', '5067', '5072', '5073', '5079', '5081', '5628', '5631', '5632', '5713', '5716', '5717', '5762', '5791', '5792']), prop('defindex')),
    compose(
        assoc('defindex', '5021'),
        assoc('uncraftable', false)
    )
)

const kitRemap = when(
    compose(
        includes('Killstreakifier Basic'),
        propOr('', 'name'),
        prop(__, items),
        prop('defindex')
    ),
    assoc('defindex', '6527')
)

const promoIndex = {
    831: '810',
    832: '811',
    833: '812',
    834: '813',
    835: '814',
    836: '815',
    837: '816',
    838: '817',
    30739: '30724',
    30740: '30720',
    30741: '30721',
}

const promoRemap = when(
    compose(has(__, promoIndex), prop('defindex')),
    chain(assoc('defindex'), compose(prop(__, promoIndex), prop('defindex')))
)

const otherIndex = {
    5844: '5710', //fall acorns key
    5845: '5720', //strongbox key
    5846: '5740', //stockpile key
    5847: '5827', //gargoyle key
    5738: '5737', //stockpile crate
}

const otherRemap = when(
    compose(has(__, otherIndex), prop('defindex')),
    chain(assoc('defindex'), compose(prop(__, otherIndex), prop('defindex')))
)

const remaps = compose(
    otherRemap,
    promoRemap,
    kitRemap,
    keyRemap
)

const fromEconItem440 = compose(
    chain(assoc('sku'), skuFromItem),
    remaps,
    chain(mergeRight, compose(map(__, propsTf2_2), applyTo)),
    map(__, propsTf2_1),
    unary(applyTo)
)

const fromEconItemOther = compose(
    map(__, propsOtherGame),
    unary(applyTo)
)

const fromEconItem = ifElse(
    propEq('appid', 440),
    fromEconItem440,
    fromEconItemOther
)

module.exports = { fromEconItem }