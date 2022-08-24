const {
    defaultTo,
    nth,
    compose,
    keys,
    length,
    prop,
    map,
    uncurryN,
    values,
    when,
    includes,
    __,
    propEq,
    identity,
    filter,
    assoc,
    chain,
    omit,
    pickBy,
    has,
    complement,
    allPass,
    converge,
    concat,
    of,
    unnest
} = require('ramda')
const { renameKeys } = require('ramda-adjunct')

const { safeItems: items } = require('./schemaItems.js')
const { skuFromItem } = require('./sku.js')

const choose = (n, xs) =>
    n < 1 || n > xs.length
        ? []
        : n == 1
            ? [...xs.map(x => [x])]
            : [
                ...choose(n - 1, xs.slice(1)).map(ys => [xs[0], ...ys]),
                ...choose(n, xs.slice(1))
            ]

const getCombos = uncurryN(3, (min, max, xs) =>
    xs.length == 0 || min > max
        ? []
        : [...choose(min, xs), ...getCombos(min + 1, max, xs)]
)

const unboxSkinsRemap = when(
    allPass([
        compose(includes(__, ['15', '5']), prop('quality')),//strange too
        complement(has)('texture'),//no texture
        compose(//is an unbox skin
            allPass([
                has('texture'),
                complement(propEq)('item_name', 'War Paint')
            ]),
            prop(__, items),
            prop('defindex')
        )
    ]),
    converge(
        concat,
        [
            of,
            compose(
                of,
                chain(assoc('defindex'), compose(
                    prop('defindex'),//change defindex from unbox skin defindex to weapon defindex
                    defaultTo({}),
                    nth(0),
                    values,
                    ({ item_name }) => pickBy(allPass([
                        propEq('item_quality', 6),
                        propEq('item_name', item_name)
                    ]), items),
                    prop(__, items),
                    prop('defindex')
                ))
            )
        ]
    )
)

const warPaintRemap = when(
    allPass([
        propEq('quality', '15'),
        complement(has)('texture'),
        compose(
            propEq('item_name', 'War Paint'),
            prop(__, items),
            prop('defindex')
        ),
    ]),
    assoc('defindex', '9536')
)

const remaps = compose(
    unboxSkinsRemap,
    warPaintRemap
)

const toIgnore = ['killstreakTier', 'elevated', 'festivized', 'effect', 'texture', 'wear', 'craft', 'series']

const blanketify = uncurryN(2, (skus, item) => compose(
    map(renameKeys({ sku2: 'sku', sku: 'originalSku' })),
    filter(compose(includes(__, skus), prop('sku2'))),
    map(chain(assoc('sku2'), skuFromItem)),
    unnest,
    map(remaps),
    map(omit(__, item)),
    chain(compose(getCombos(0), length), identity),
    filter(compose(Boolean, prop(__, item)))
)(toIgnore))

module.exports = {
    remaps,
    blanketify
}