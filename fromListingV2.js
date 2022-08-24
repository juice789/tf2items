const {
    compose,
    propEq,
    prop,
    map,
    __,
    applyTo,
    pathOr,
    includes,
    pathEq,
    propOr,
    ifElse,
    equals,
    length,
    split,
    allPass,
    nth,
    cond,
    T,
    F,
    complement
} = require('ramda')

const { skuFromItem } = require('./sku.js')
const { remaps } = require('./fromListingV1.js')

const defindex = prop('defindex')

const quality = pathOr(null, ['quality', 'id'])

const uncraftable = compose(includes('Non-Craftable'), prop('name'))

const effect = pathOr(null, ['particle', 'id'])

const elevated = cond(
    [
        [compose(complement(equals)(11), quality), compose(equals(11), pathOr(null, ['elevatedQuality', 'id']))],
        [compose(equals(11), quality), compose(includes(__, ['701', '702', '703', '704']), String, effect)],
        [T, F]
    ]
)

const killstreakTier = propOr(null, 'killstreakTier')

const festivized = propEq('festivized', true)

const texture = pathOr(null, ['texture', 'id'])

const wear = pathOr(null, ['wearTier', 'id'])

const australium = propEq('australium', true)

const series = propOr(null, 'crateSeries')

const target = ifElse(
    allPass([
        pathEq(['recipe', 'targetItem'], null),
        compose(equals(3), length, split('-'), prop('priceindex'))
    ]),
    compose(nth(2), split('-'), prop('priceindex')),
    pathOr(null, ['recipe', 'targetItem', '_source', 'defindex'])
)

const output = pathOr(null, ['recipe', 'outputItem', 'defindex'])

const oq = pathOr(null, ['recipe', 'outputItem', 'quality', 'id'])

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

const fromListingV2 = compose(
    skuFromItem,
    remaps,
    map(__, fns),
    applyTo
)

module.exports = { fromListingV2 }