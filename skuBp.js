const crypto = require('crypto')
const { safeItems: items } = require('./schemaItems.js')
const { qualityNames } = require('./schemaHelper.json')
const { itemFromSku, getName } = require('./sku.js')
const { omit } = require('ramda')

const toBpQuality = (sku) => {

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

const toBpName = (sku) => {

    const item = omit(
        ['quality', 'elevated', 'uncraftable', 'craft', 'target', 'output', 'oq', 'effect', 'series'],
        itemFromSku(sku)
    )

    return getName(item, Boolean(item.texture))
}

const toBpPriceIndex = (sku) => {

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

const listingV1FromSku = (sku) => {
    const { uncraftable } = itemFromSku(sku)
    return {
        quality: toBpQuality(sku),
        craftable: uncraftable ? '0' : '1',
        item_name: toBpName(sku),
        priceindex: toBpPriceIndex(sku)
    }
}

const listingV2ResolvableFromSku = (sku) => {
    const { uncraftable } = itemFromSku(sku)
    return {
        quality: toBpQuality(sku),
        craftable: uncraftable ? '0' : '1',
        item: toBpName(sku),
        tradable: '1',
        priceindex: toBpPriceIndex(sku)
    }
}

const toBpSku = (sku) => {
    const item = omit(
        ['craft'],
        itemFromSku(sku)
    )
    return getName(item, null, Boolean(item.effect), true)
}

const toBpId = (sku) => crypto.createHash('md5').update(toBpSku(sku)).digest('hex')

module.exports = {
    toBpQuality,
    toBpName,
    toBpId,
    toBpPriceIndex,
    listingV1FromSku,
    listingV2ResolvableFromSku,
    toBpSku
}