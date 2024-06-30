const {
    defaultTo,
    nth,
    compose,
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
    unnest,
    pick,
    mergeRight
} = require('ramda')
const { renameKeys } = require('ramda-adjunct')

const { safeItems: items } = require('./schemaItems.js')
const { skuFromItem, itemFromSku } = require('./sku.js')

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
        complement(has)('texture'),//no texture
        compose(//is an unbox skin
            allPass([
                has('texture'),
                complement(propEq)('War Paint', 'item_name')
            ]),
            prop(__, items),
            prop('defindex')
        )
    ]),
    converge(
        concat,
        [
            Array.of,
            compose(
                Array.of,
                chain(assoc('defindex'), compose(
                    prop('defindex'),//change defindex from unbox skin defindex to weapon defindex
                    defaultTo({}),
                    nth(0),
                    values,
                    ({ item_name }) => pickBy(allPass([
                        propEq(6, 'item_quality'),
                        propEq(item_name, 'item_name')
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
        complement(has)('texture'),
        compose(
            propEq('War Paint', 'item_name'),
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

const propListDefault = ['killstreakTier', 'elevated', 'festivized', 'effect', 'texture', 'wear', 'craft', 'series']

const blanketify = uncurryN(3, (propList, skus, item) => compose(
    map(compose(
        mergeRight(item),//merge the props with the item, keeping the assetid for use later
        pick(['sku', 'originalSku']),
        renameKeys({ _sku: 'sku', sku: 'originalSku' })//reset the sku, save the original sku
    )),
    filter(compose(includes(__, skus), prop('_sku'))),//find every new combination in the sku list
    map(chain(assoc('_sku'), skuFromItem)),//save the new sku
    unnest,
    map(remaps),//decode defindices that are not possible anymore
    map(omit(__, itemFromSku(item.sku))),//create items from the combinations
    //concat([[]]),//create the last combination where no prop is removed. If the skus includes the sku we can return it.
    chain(compose(getCombos(0), length), identity),//create every possible combination
    filter(compose(Boolean, prop(__, itemFromSku(item.sku))))//remove every prop from proplist that is not present in the item
)(propList || propListDefault))

module.exports = {
    blanketify
}