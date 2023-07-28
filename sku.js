const {
    compose, split, map, reduce, pickBy, mergeRight, converge, concat, of, join, head, tail, filter
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
    series,
    craft
}) => [
    defindex,
    quality,
    ['1', true].includes(uncraftable) && 'uncraftable',
    ['1', true].includes(elevated) && 'strange',
    effect && 'u-' + effect,
    killstreakTier && ['1', '2', '3', 1, 2, 3].includes(killstreakTier) && 'kt-' + killstreakTier,
    ['1', true].includes(festivized) && 'festive',
    target && 'td-' + target,
    output && 'od-' + output,
    oq && 'oq-' + oq,
    texture && 'pk-' + texture,
    wear && 'w-' + wear,
    ['1', true].includes(australium) && 'australium',
    series && isNaN(series) === false && 'c-' + parseInt(series),
    craft && isNaN(craft) === false && 'no-' + parseInt(craft),
].filter(Boolean).join(';')

const rules = {
    uncraftable: 'uncraftable',
    strange: 'elevated',
    u: "effect",
    kt: "killstreakTier",
    festive: 'festivized',
    td: "target",
    od: "output",
    oq: "oq",
    pk: "texture",
    w: "wear",
    australium: 'australium',
    c: "series",
    no: "craft"
}

const decodeRules = compose(
    pickBy((v, k) => k !== 'undefined'),
    reduce(mergeRight, {}),
    map(
        compose(
            ([k, value = true]) => ({ [rules[k]]: value }),
            converge(concat, [compose(of, head), compose(filter(Boolean), of, join('-'), tail)]),
            split('-')
        )
    )
)

const itemFromSku = (sku) => {
    const [defindex, quality, ...more] = sku.split(';')
    const item = {
        defindex,
        quality,
        ...decodeRules(more)
    }
    item.sku = sku
    return item
}

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
    series,
    craft
},
    bpTexture = false,
    qualityBpStyle = false,
    useProperName = false
) => [
    craft && '#' + craft,
    uncraftable && 'Non-Craftable',
    elevated && 'Strange',
    quality && !['6', '15'].includes(quality.toString()) && (qualityBpStyle ? !effect : true) && qualityNames[quality],
    oq && oq.toString() !== '6' && qualityNames[oq],
    target && killstreakTier && killstreakTiers[killstreakTier],
    target && safeItems[target].item_name,
    output && safeItems[output].item_name,
    effect && particleEffects[effect],
    festivized && 'Festivized',
    !target && killstreakTier && killstreakTiers[killstreakTier],
    texture && textures[texture],
    bpTexture && '|',
    australium && 'Australium',
    useProperName && safeItems[defindex].propername === '1' && quality.toString() === '6' && !uncraftable && !elevated && !festivized && !killstreakTier && 'The',
    safeItems[defindex].item_name,
    wear && '(' + wears[wear] + ')',
    series && '#' + series
].filter(Boolean).join(' ').replace('\\n', `
`)

const itemNameFromSku = (sku, ...params) => {
    const item = itemFromSku(sku)
    return getName(item, ...params)
}

module.exports = {
    skuFromItem,
    itemFromSku,
    getName,
    itemNameFromSku
}