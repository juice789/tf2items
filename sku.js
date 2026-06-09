import { safeItems } from './schemaItems.js'
import schemaHelper from './schemaHelper.json' with { type: 'json' }
import schema from './schema.json' with { type: 'json' }
const { qualityNames, killstreakTiers, wears } = schemaHelper
const { textures, particleEffects } = schema

export const skuFromItem = ({
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
    craft,
    paintColor,
    halloweenSpell,
    rch
}) => [
    (defindex === '0000' || (rch && !craft && !halloweenSpell)) ? '0000' : defindex,
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
    paintColor && 'pc-' + paintColor,
    halloweenSpell && 'hs-' + halloweenSpell,
    (rch && !craft && !halloweenSpell) && 'rch-' + rch
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
    no: "craft",
    pc: "paintColor",
    hs: "halloweenSpell",
    rch: "rch"
}

function decodeRules(parts) {
    const result = {}
    for (const part of parts) {
        const dash = part.indexOf('-')
        const k = dash === -1 ? part : part.slice(0, dash)
        const value = dash === -1 ? true : part.slice(dash + 1)
        const prop = rules[k]
        if (prop !== undefined) result[prop] = value
    }
    return result
}

export const itemFromSku = (sku) => {
    const [defindex, quality, ...more] = sku.split(';')
    const item = {
        defindex,
        quality,
        ...decodeRules(more)
    }
    item.sku = sku
    if(item.defindex === '0000' && item.rch){
        item.defindex = item.rch
    }
    return item
}

export const getName = ({
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
    craft,
    rch
},
    bpTexture = false,
    qualityBpStyle = false,
    useProperName = false,
    showUncraft = true
) => [
    craft && '#' + craft,
    uncraftable && showUncraft && 'Non-Craftable',
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
    defindex === '0000' && !rch ? 'Random Craft Hat' : safeItems[rch || defindex].item_name,
    wear && '(' + wears[wear] + ')',
    series && '#' + series
].filter(Boolean).join(' ').replace('\\n', `
`)

export const itemNameFromSku = (sku, ...params) => {
    const item = itemFromSku(sku)
    return getName(item, ...params)
}
