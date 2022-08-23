const {
    compose,
    ifElse,
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
    unless,
    flatten,
    toPairs,
    pathOr,
    pickBy,
    indexBy,
    propOr,
    path,
    find,
    toString,
    equals,
    includes,
    values,
    unary,
    nth,
    has,
    when,
    allPass,
    converge,
    or,
    pick,
    defaultTo,
    pathEq
} = require('ramda')


const { safeItems: items } = require('./schemaItems.js')
const { textures } = require('./schema.json')
const { skuFromItem } = require('./sku.js')

const {
    remaps
} = require('./fromListingV1.js')

const defindex = prop('defindex')

const quality = path(['quality', 'id'])

const uncraftable = compose(includes('Non-Craftable'), prop('name'))

const effect = path(['particle', 'id'])

const elevated = pathEq(['elevatedQuality', 'id'], 11)

const killstreakTier = prop('killstreakTier')

const festivized = propEq('festivized', true)

//const texture = path(['attributes', '834', 'value'])

/*const wears = {
    '0': undefined,
    '0.2': '1',
    '0.4': '2',
    '0.6': '3',
    '0.8': '4',
    '1': '5'
}

const wear = compose(
    prop(__, wears),
    (value) => new bignumber(value).dp(2).toString(),
    pathOr(0, ['attributes', '725', 'float_value'])
)*/

const australium = propEq('australium', true)

const series = prop('crateSeries')

const target = pathOr(null, ['recipe', 'targetItem', '_source', 'defindex'])
/*
const output = compose(
    prop('itemdef'),
    find(compose(includes(__, [true, 'true']), prop('is_output'))),
    values,
    propOr({}, 'attributes')
)

const oq = compose(
    prop('quality'),
    find(compose(includes(__, [true, 'true']), prop('is_output'))),
    values,
    propOr({}, 'attributes')
) */

const fns = {
    defindex,
    quality,
    uncraftable,
    elevated,
    effect,
    killstreakTier,
    festivized,
    //texture,
    //wear,
    australium,
    series,
    target,
    //output,
    //oq
}

const fromListingV2 = compose(
    skuFromItem,
    remaps,
    map(__, fns),
    applyTo,
    prop('item')
)

module.exports = { fromListingV2 }