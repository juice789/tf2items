const {
    curry, includes, when, compose, __, prop, chain, assoc, has, nth, split, map, reduce, pickBy, mergeRight
} = require('ramda')

const {
    safeItems
} = require('./schemaItems.js')

const {
    qualityNames,
    killstreakTiers,
    wears
} = require('./schemaHelper.json')

const {
    textures,
    particleEffects
} = require('./schema.json')

const ktRemap = {
    '6527': '1',
    '6523': '2',
    '6526': '3',
    '20002': '2',
    '20003': '3'
}

const odRemap = {
    '20002': '6523',
    '20003': '6526'
}

const skuFromItem = ({
    defindex,
    quality,
    uncraftable,
    elevated,
    effect,
    killstreakTier,
    festivized,
    target,
    output,
    oq,
    texture,
    wear,
    australium,
    series
}) => [
    defindex,
    quality,
    ['1', true].includes(uncraftable) && 'uncraftable',
    ['1', true].includes(elevated) && 'strange',
    effect && 'u-' + effect,
    killstreakTier && 'kt-' + killstreakTier,
    ['1', true].includes(festivized) && 'festive',
    target && 'td-' + target,
    output && 'od-' + output,
    oq && 'oq-' + oq,
    texture && 'pk-' + texture,
    wear && 'w-' + wear,
    ['1', true].includes(australium) && 'australium',
    series && 'c-' + series,
].filter(Boolean).join(';')

const skuFromForm = curry((obj, overrides) => compose(
    skuFromItem,
    when(
        compose(includes('>'), prop('defindex')),//strangifier
        compose(
            chain(assoc('defindex'), compose(nth(0), split('>'), prop('defindex'))),
            chain(assoc('target'), compose(nth(1), split('>'), prop('defindex')))
        )
    ),
    when(
        compose(includes('<'), prop('defindex')),//chemistry set
        compose(
            chain(assoc('oq'), compose(prop('oq'), prop(__, safeItems), prop('defindex'))),
            chain(assoc('defindex'), compose(nth(0), split('<'), prop('defindex'))),
            chain(assoc('target'), compose(nth(2), split('<'), prop('defindex'))),
            chain(assoc('output'), compose(nth(1), split('<'), prop('defindex')))
        )
    ),
    when(
        compose(includes('/'), prop('defindex')),//crates
        compose(
            chain(assoc('defindex'), compose(nth(0), split('/'), prop('defindex'))),
            chain(assoc('series'), compose(nth(1), split('/'), prop('defindex')))
        )
    ),
    when(
        compose(has('target'), prop(__, safeItems), prop('defindex')),
        chain(assoc('target'), compose(prop('target'), prop(__, safeItems), prop('defindex')))
    ),
    when(
        compose(has('texture'), prop(__, safeItems), prop('defindex')),
        chain(assoc('texture'), compose(prop('texture'), prop(__, safeItems), prop('defindex')))
    ),
    when(
        compose(prop(__, odRemap), prop('defindex')),
        chain(assoc('output'), compose(prop(__, odRemap), prop('defindex'))),
    ),
    when(
        compose(prop(__, ktRemap), prop('defindex')),
        chain(assoc('killstreakTier'), compose(prop(__, ktRemap), prop('defindex'))),
    )
)(mergeRight(obj, overrides)))

const rules = {
    c: "series",
    kt: "killstreakTier",
    od: "output",
    oq: "oq",
    pk: "texture",
    td: "target",
    u: "effect",
    w: "wear",
    festive: 'festivized',
    strange: 'elevated',
    australium: 'australium',
    uncraftable: 'uncraftable'
}

const decodeRules = compose(
    pickBy((v, k) => k !== 'undefined'),
    reduce(mergeRight, {}),
    map(
        compose(
            ([k, value = true]) => ({ [rules[k]]: value }),
            split('-')
        )
    )
)

const getName = ({
    defindex,
    quality,
    uncraftable,
    elevated,
    effect,
    killstreakTier,
    festivized,
    target,
    output,
    oq,
    texture,
    wear,
    australium,
    series
}) => [
    uncraftable && 'Non-Craftable',
    elevated && 'Strange',
    quality && !['6', '15'].includes(quality.toString()) && qualityNames[quality],
    oq && oq.toString() !== '6' && qualityNames[oq],
    target && killstreakTier && killstreakTiers[killstreakTier],
    target ? safeItems[target].item_name : null,
    output ? safeItems[output].item_name : null,
    effect && particleEffects[effect],
    festivized && 'Festivized',
    !target && killstreakTier && killstreakTiers[killstreakTier],
    texture && textures[texture],
    australium && 'Australium',
    quality.toString() === '6' ? safeItems[defindex].item_name : safeItems[defindex].item_name,
    wear && '(' + wears[wear] + ')',
    series && '#' + series
].filter(Boolean).join(' ')

const itemFromSku = (sku) => {
    const [defindex, quality, ...more] = sku.split(';')
    const item = {
        defindex,
        quality,
        ...decodeRules(more)
    }
    item.name = getName(item)
    return item
}

module.exports = {
    skuFromItem,
    skuFromForm,
    itemFromSku
}