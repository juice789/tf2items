const {
    always,
    prop,
    ifElse,
    propEq,
    compose,
    defaultTo,
    __,
    map,
    applyTo,
    complement,
    allPass,
    includes
} = require('ramda')

const { safeItems: items } = require('./schemaItems.js')
const { textures } = require('./schema.json')
const { itemFromSku } = require('./sku.js')

//collectors chem sets: output
//strangifier chem sets, strangifier, unusualifier, kit, fab: target

const item = ({ defindex, target, output }) => items[target || output || defindex].item_name

const quality = ({
    defindex,
    quality,
    effect,
    texture,
    elevated
}) => items[defindex].item_name === 'War Paint' || (Boolean(texture) || ['701', '702', '703', '704'].includes(effect))
        ? (elevated ? '11' : '5')
        : quality

const australium = ifElse(
    propEq(true, 'australium'),
    always(1),
    always(-1)
)

const killstreak_tier = compose(
    defaultTo(0),
    prop('killstreakTier')
)

const craftable = ifElse(
    propEq(true, 'uncraftable'),
    always(-1),
    always(1)
)

const particle = prop('effect')

const item_type = ({ target, output }) =>
    target
        ? 'target'
        : output
            ? 'output'
            : undefined

const wear_tier = prop('wear')

const texture_name = compose(prop(__, textures), prop('texture'))

const elevated = ifElse(
    allPass([
        propEq(true, 'elevated'),
        compose(
            complement(includes)(__, ['701', '702', '703', '704']),
            prop('effect')
        )
    ]),
    always(11),
    always(undefined)
)

const fns = {
    item_names: always(1),
    item,
    quality,
    intent: always('dual'),
    australium,
    killstreak_tier,
    craftable,
    page_size: always(30),
    particle,
    item_type,
    texture_name,
    wear_tier,
    elevated
}

const toSearchParams = compose(
    map(__, fns),
    applyTo,
    itemFromSku
)

module.exports = { toSearchParams }