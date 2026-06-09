import { skuFromItem } from './sku.js'
import { remaps } from './fromListingV1.js'

const defindex = item => item.defindex

const quality = item => item?.quality?.id ?? null

const uncraftable = item => item.name?.includes('Non-Craftable') ?? false

const effect = item => item?.particle?.id ?? null

const elevated = item => (item?.quality?.id ?? null) === 11
    ? ['701', '702', '703', '704'].includes(String(item?.particle?.id ?? null))
    : (item?.elevatedQuality?.id ?? null) === 11

const killstreakTier = item => item.killstreakTier ?? null

const festivized = item => item.festivized === true

const texture = item => item?.texture?.id ?? null

const wear = item => item?.wearTier?.id ?? null

const australium = item => item.australium === true

const series = item => item.crateSeries ?? null

const target = item => {
    const parts = (item.priceindex ?? '').split('-')
    if (item?.recipe?.targetItem === null && parts.length === 3) {
        return parts[2]
    }
    return item?.recipe?.targetItem?._source?.defindex ?? null
}

const output = item => item?.recipe?.outputItem?.defindex ?? null

const oq = item => item?.recipe?.outputItem?.quality?.id ?? null

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

export function fromListingV2(item) {
    const mapped = Object.fromEntries(Object.entries(fns).map(([k, fn]) => [k, fn(item)]))
    return skuFromItem(remaps(mapped))
}
