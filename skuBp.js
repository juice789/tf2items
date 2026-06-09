import { createHash } from 'node:crypto'
import { safeItems as items } from './schemaItems.js'
import schemaHelper from './schemaHelper.json' with { type: 'json' }
const { qualityNames } = schemaHelper
import { itemFromSku, getName } from './sku.js'

export const toBpQuality = (sku) => {

    const {
        defindex,
        quality,
        effect,
        elevated,
        texture,
    } = itemFromSku(sku)

    const isWeaponEffect = ['701', '702', '703', '704'].includes(effect)

    const isPainted = items[defindex].item_name === 'War Paint' || Boolean(texture) || isWeaponEffect

    return [
        (elevated || quality === '11' && isPainted) && 'Strange',
        isPainted
            ? !elevated && qualityNames[isWeaponEffect ? '5' : '15']
            : qualityNames[quality]
    ].filter(Boolean).join(' ')
}

export const toBpName = (sku) => {

    const { quality, elevated, uncraftable, craft, target, output, oq, effect, series, ...item } = itemFromSku(sku)

    return getName(item, Boolean(item.texture))
}

export const toBpPriceIndex = (sku) => {

    const {
        effect,
        killstreakTier,
        target,
        output,
        oq,
        series
    } = itemFromSku(sku)

    return [
        effect,
        !oq && killstreakTier && target && killstreakTier + '-' + target,//kit
        output && target && oq && output + '-' + oq + '-' + target,//fabricator, strangifier chemistry set
        !target && output && oq && output + '-' + oq, //collector's chemistry set
        !killstreakTier && target && !output && target, //unusualifier
        series
    ].filter(Boolean).join('/')
}

export const listingV1FromSku = (sku) => {
    const { uncraftable } = itemFromSku(sku)
    return {
        quality: toBpQuality(sku),
        craftable: uncraftable ? '0' : '1',
        item_name: toBpName(sku),
        priceindex: toBpPriceIndex(sku)
    }
}

export const listingV2ResolvableFromSku = (sku) => {
    const { uncraftable } = itemFromSku(sku)
    return {
        quality: toBpQuality(sku),
        craftable: uncraftable ? '0' : '1',
        item: toBpName(sku),
        tradable: '1',
        priceindex: toBpPriceIndex(sku)
    }
}

export const toBpSku = (sku) => {
    const { craft, ...item } = itemFromSku(sku)
    return getName(item, null, Boolean(item.effect), true)
}

export const toBpId = (sku) => createHash('md5').update(toBpSku(sku)).digest('hex')
