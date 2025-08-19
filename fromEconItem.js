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
    path,
    equals,
    pick,
    assocPath,
    isEmpty,
    join,
    filter,
    omit,
    last,
    defaultTo,
    renameKeys
} = require('ramda')

const { safeItems: items } = require('./schemaItems.js')
const { particleEffects, textures } = require('./schema.json')
const { qualityNames, wears, paintDefindex, spellDefindex } = require('./schemaHelper.json')
const { skuFromItem } = require('./sku.js')
const { skuFromItem753 } = require('./sku753.js')

const marketHashIncludes = curry((string, { market_hash_name }) => market_hash_name.indexOf(string) !== -1)

const removeStrings = curry((string, strings) => compose(
    trim,
    replace(/\s\s+/g, ' '),
    reduce((all, curr) => replace(curr, '', all), string || '')
)(strings))

const findTag = uncurryN(3, (tagName, displayProp) => compose(
    prop(displayProp),
    find(propEq(tagName, 'category_name')),
    map(renameKeys({
        localized_category_name: 'category_name',
        localized_tag_name: 'name'
    })),
    propOr([], 'tags')
))

const old_id = ({ new_assetid, rollback_new_assetid, assetid }) => (new_assetid || rollback_new_assetid) ? assetid : null

const id = ({ new_assetid, rollback_new_assetid, assetid }) => new_assetid || rollback_new_assetid || assetid || null

const old_contextid = ({ new_contextid, rollback_new_contextid, contextid }) => (new_contextid || rollback_new_contextid) ? contextid : null

const contextid = ({ new_contextid, rollback_new_contextid, contextid }) => new_contextid || rollback_new_contextid || contextid || null

const recipe = compose(
    find(__, ['Fabricator', 'Strangifier Chemistry Set', 'Chemistry Set']),
    flip(marketHashIncludes),
)

const series = ifElse(
    compose(equals('Crate'), findTag('Type', 'name')),
    ifElse(
        marketHashIncludes('#'),
        compose(
            nth(1),
            split('#'),
            prop('market_hash_name')
        ),
        compose(
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
        prop('name')
    ),
    always(null)
)

const australium = allPass([
    pathEq('11', ['app_data', 'quality']),
    marketHashIncludes('Australium')
])

const wear = compose(
    prop(__, invertObj(wears)),
    removeStrings(__, ['(', ')']),
    findTag('Exterior', 'name')
)

const texture = ifElse(
    findTag('Exterior', 'name'),
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
            qualityNames[app_data.quality],
            items[app_data.def_index].item_name
        ])
    ),
    always(null)
)

const festivized = marketHashIncludes('Festivized')

const killstreakTier = compose(
    prop(__, { 'Professional Killstreak': '3', 'Specialized Killstreak': '2', 'Killstreak': '1' }),
    find(__, ['Professional Killstreak', 'Specialized Killstreak', 'Killstreak']),
    flip(marketHashIncludes)
)

const effect = ifElse(
    allPass([
        pathEq('5', ['app_data', 'quality']),
        compose(
            find(propEq('ffd700', 'color')),
            propOr([], 'descriptions')
        )
    ]),
    compose(
        propOr('-1', __, invertObj(particleEffects)),
        replace('★ Unusual Effect: ', ''),
        prop('value'),
        find(propEq('ffd700', 'color')),
        propOr([], 'descriptions')
    ),
    always(null)
)

const elevated = allPass([
    complement(pathEq)('11', ['app_data', 'quality']),
    compose(
        includes('Strange'),
        ({ app_data, market_hash_name }) => replace(items[app_data.def_index].item_name, '', market_hash_name)
    )
])

const uncraftable = compose(
    Boolean,
    find(propEq('( Not Usable in Crafting )', 'value')),
    propOr([], 'descriptions')
)

const paintOptions = Object.keys(paintDefindex).map(paintName => `Paint Color: ${paintName}`)

const paintColor = compose(
    when(Boolean, ({ value }) => paintDefindex[value.split('Paint Color: ')[1]]),
    find(compose(includes(__, paintOptions), prop('value'))),
    propOr([], 'descriptions')
)

const spellOptions = Object.keys(spellDefindex).map(spellName => `Halloween: ${spellName} (spell only active during event)`)

const halloweenSpell = compose(
    when(isEmpty, always(null)),
    join('_'),
    map(({ value }) => spellDefindex[value.split('Halloween: ')[1].replace(' (spell only active during event)', '')]),
    filter(compose(includes(__, spellOptions), prop('value'))),
    propOr([], 'descriptions')
)

const market_hash_name = prop('market_hash_name')

const setQuality = when(
    compose(complement(Boolean), path(['app_data', 'quality'])),
    chain(
        assocPath(['app_data', 'quality']),
        compose(prop(__, invertObj(qualityNames)), findTag('Quality', 'name'))
    )
)

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
    halloweenSpell,
    paintColor,
    id,
    old_id,
    contextid,
    old_contextid
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
        Array.of,
        propEq(__, 'item_name'),
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
                Array.of,
                propEq(__, 'item_name'),
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
    sku: ({ appid, market_hash_name }) => `other;${appid};${market_hash_name}`,
    id,
    old_id
}

const props753 = {
    market_hash_name: prop('market_hash_name'),
    border: compose(last, defaultTo(''), findTag('Card Border', 'internal_name')),
    game: compose(nth(1), split('_'), findTag('Game', 'internal_name')),
    type: compose(last, findTag('Item Type', 'internal_name')),
    id,
    old_id,
    contextid,
    old_contextid
}

const keyRemap = when(
    compose(
        includes(__, ['5021', '5049', '5067', '5072', '5073', '5079', '5081', '5628', '5631', '5632', '5713', '5716', '5717', '5762', '5791', '5792']), //old keys that turned into regular keys
        String,
        prop('defindex')
    ),
    assoc('defindex', '5021')
)

const uncraftRemap = (uncraftRemapDefindex) => when(
    compose(
        includes(__, uncraftRemapDefindex),
        String,
        prop('defindex')
    ),
    assoc('uncraftable', false)
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

const defaultOptions440 = {
    omitProps: ['paintColor', 'halloweenSpell'],
    uncraftRemapDefindex: ['5021']
}

const fromEconItem440 = ({ omitProps = [], uncraftRemapDefindex = [] } = defaultOptions440) => compose(
    pick(['sku', 'id', 'old_id', 'contextid', 'old_contextid']),
    chain(assoc('sku'), skuFromItem),
    uncraftRemap(uncraftRemapDefindex),
    kitRemap,
    keyRemap,
    otherRemap,
    chain(mergeRight, compose(map(__, propsTf2_2), applyTo)),
    map(__, omit(omitProps, propsTf2_1)),
    unary(applyTo),
    setQuality
)

const fromEconItem753 = () => compose(
    pick(['sku', 'id', 'old_id', 'contextid', 'old_contextid']),
    chain(assoc('sku'), skuFromItem753),
    map(__, props753),
    unary(applyTo)
)

const fromEconItemOther = (options = {}) => compose(
    map(__, propsOtherGame),
    unary(applyTo)
)

const mainFns = {
    440: fromEconItem440,
    753: fromEconItem753
}

const fromEconItem = (econItem) => (mainFns[econItem.appid] || fromEconItemOther)()(econItem)

const fromEconItemOptions = curry((options, econItem) => (mainFns[econItem.appid] || fromEconItemOther)(options)(econItem))

module.exports = {
    fromEconItem,
    fromEconItemOptions,
    kitRemap
}