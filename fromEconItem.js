const {
    compose,
    includes,
    prop,
    propOr,
    find,
    flip,
    map,
    when,
    unary,
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
    pathOr,
    invertObj,
    mergeRight,
    values,
    replace,
    trim,
    reduce,
    nth,
    split,
    propSatisfies,
    pathEq,
    complement,
    either,
    concat,
    of,
    path,
    equals
} = require('ramda')

const { safeItems: items } = require('./schemaItems.js')
const { particleEffects: effects, textures } = require('./schema.json')
const { qualityNames: qualities, wears } = require('./schemaHelper.json')
const { skuFromItem } = require('./sku.js')
const { renameKeys } = require('ramda-adjunct')

const marketHashIncludes = curry((string, { market_hash_name }) => market_hash_name.indexOf(string) !== -1)

const removeStrings = curry((string, strings) => compose(
    trim,
    replace(/\s\s+/g, ' '),
    reduce((all, curr) => replace(curr, '', all), string)
)(strings))

const findTag = uncurryN(2, (tagName) => compose(
    prop('name'),
    find(propEq('category_name', tagName)),
    map(renameKeys({
        localized_category_name: 'category_name',
        localized_tag_name: 'name'
    })),
    propOr([], 'tags')
))

const old_id = ifElse(
    has('new_assetid'),
    prop('assetid'),
    always(null)
)

const id = chain(
    propOr(__, 'new_assetid'),
    prop('assetid')
)

const recipe = compose(
    defaultTo(null),
    find(__, ['Fabricator', 'Strangifier Chemistry Set', 'Chemistry Set']),
    flip(marketHashIncludes),
)


const series = ifElse(
    compose(equals('Crate'), findTag('Type')),
    ifElse(
        marketHashIncludes('#'),
        compose(
            defaultTo(null),
            nth(1),
            split('#'),
            prop('market_hash_name')
        ),
        compose(
            defaultTo(null),
            nth(0),
            propOr([], 'series'),
            prop(__, items),
            path(['app_data', 'def_index'])
        )
    ),
    always(null)
)

const craft = ifElse(
    allPass([
        propSatisfies(includes('#'), 'name'),
        propSatisfies(complement(includes)('#'), 'market_hash_name'),
    ]),
    compose(
        nth(1),
        split('#'),
        prop('market_hash_name')
    ),
    always(null)
)

const australium = allPass([
    pathEq(['app_data', 'quality'], '11'),
    marketHashIncludes('Australium')
])

const wear = compose(
    propOr(null, __, invertObj(wears)),
    trim,
    replace(/\s\s+/g, ' '),
    reduce((all, curr) => replace(curr, '', all), __, ['(', ')']),
    defaultTo(''),
    findTag('Exterior')
)

const texture = ifElse(
    findTag('Exterior'),
    compose(
        propOr('-1', __, invertObj(textures)),
        ({ app_data, market_hash_name }) => removeStrings(market_hash_name, [
            'Specialized Killstreak',
            'Professional Killstreak',
            'Killstreak',
            '(Field-Tested)',
            '(Well-Worn)',
            '(Battle Scarred)',
            '(Minimal Wear)',
            '(Factory New)',
            'Festivized',
            'Strange',
            qualities[app_data.quality],
            items[app_data.def_index].item_name
        ])
    ),
    always(null)
)

const festivized = marketHashIncludes('Festivized')

const killstreakTier = compose(
    propOr(null, __, { 'Professional Killstreak': '3', 'Specialized Killstreak': '2', 'Killstreak': '1' }),
    find(__, ['Professional Killstreak', 'Specialized Killstreak', 'Killstreak']),
    flip(marketHashIncludes)
)

const effect = ifElse(
    allPass([
        pathEq(['app_data', 'quality'], '5'),
        compose(
            find(propEq('color', 'ffd700')),
            propOr([], 'descriptions')
        )
    ]),
    compose(
        propOr('-1', __, invertObj(effects)),
        replace('★ Unusual Effect: ', ''),
        prop('value'),
        find(propEq('color', 'ffd700')),
        propOr([], 'descriptions')
    ),
    always(null)
)

const elevated = allPass([
    complement(pathEq)(['app_data', 'quality'], '11'),
    compose(
        includes('Strange'),
        ({ app_data, market_hash_name }) => replace(items[app_data.def_index].item_name, '', market_hash_name)
    )
])

const uncraftable = compose(
    Boolean,
    find(propEq('value', '( Not Usable in Crafting )')),
    propOr([], 'descriptions')
)

const market_hash_name = prop('market_hash_name')

const quality = pathOr('-1', ['app_data', 'quality'])

const defindex = pathOr('-1', ['app_data', 'def_index'])

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

const isTarget = either(
    compose(
        find(__, ['Strangifier', 'Fabricator', 'Strangifier Chemistry Set', 'Unusualifier']),
        flip(marketHashIncludes),
    ),
    allPass([
        marketHashIncludes('Kit'),
        marketHashIncludes('Killstreak')
    ])
)

const target = ifElse(
    isTarget,
    compose(
        propOr('-1', 'defindex'),
        find(__, values(items)),
        allPass,
        concat([propSatisfies(complement(includes)(__, [0, 15]), 'item_quality')]),
        of,
        propEq('item_name'),
        ({ market_hash_name, defindex }) => removeStrings(market_hash_name, [
            'Strangifier',
            'Unusual',
            'Unusualifier',
            items[defindex].item_name,
            'Specialized Killstreak',
            'Professional Killstreak',
            'Killstreak',
            "Collector's",
            'Series',
            'Kit',
            'Fabricator',
            'Chemistry Set',
            '#1',
            '#2',
            '#3'
        ])
    ),
    always(null)
)

const output = ({ recipe, market_hash_name, killstreakTier }) => {
    switch (recipe) {
        case 'Fabricator':
            const ktMap = {
                '2': '6523',
                '3': '6526'
            }
            return ktMap[killstreakTier]
        case 'Strangifier Chemistry Set':
            return '6522'
        case 'Chemistry Set':
            return compose(
                propOr('-1', 'defindex'),
                find(__, values(items)),
                allPass,
                concat([propSatisfies(complement(includes)(__, [0, 15]), 'item_quality')]),
                of,
                propEq('item_name'),
                removeStrings(__, ['Chemistry Set', "Collector's"])
            )(market_hash_name)
        default:
            return null
    }
}

const oq = ({ market_hash_name, recipe }) => recipe
    ? includes("Collector's", market_hash_name) ? '14' : '6'
    : null

const propsTf2_2 = {
    target,
    output,
    oq
}

const propsOtherGame = {
    sku: market_hash_name,
    id,
    old_id
}

const keyRemap = when(
    compose(
        includes(__, ['5021', '5049', '5067', '5072', '5073', '5079', '5081', '5628', '5631', '5632', '5713', '5716', '5717', '5762', '5791', '5792']),
        prop('defindex')
    ),
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