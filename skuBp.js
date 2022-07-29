const crypto = require('crypto')

const { safeItems: items } = require('./schemaItems.js')
const { qualityNames, killstreakTiers, wears } = require('./schemaHelper.json')
const { particleEffects, textures } = require('./schema.json')
const { itemFromSku } = require('./sku.js')

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
        elevated || quality === '11' && isPainted && 'Strange',
        isPainted
            ? !elevated && qualityNames[isWeaponEffect ? '5' : '15']
            : qualityNames[quality]
    ].filter(Boolean).join(' ')
}

const toBpName = (sku) => {

    const {
        defindex,
        killstreakTier,
        festivized,
        texture,
        wear,
        australium
    } = itemFromSku(sku)

    return [
        festivized && 'Festivized',
        killstreakTier && killstreakTiers[killstreakTier],
        australium && 'Australium',
        [
            texture && textures[texture],
            items[defindex].item_name.replace('\\n', '%0A')
        ].filter(Boolean).join(' | '),
        wear && '(' + wears[wear] + ')'
    ].filter(Boolean).join(' ')
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

const listingFromSku = (sku) => {
    const { uncraftable } = itemFromSku(sku)
    return {
        quality: toBpQuality(sku),
        craftable: uncraftable ? '0' : '1',
        item_name: toBpName(sku),
        priceindex: toBpPriceIndex(sku)
    }
}

const toBpSku = (sku) => {

    const {
        elevated,
        quality,
        effect
    } = itemFromSku(sku)

    return [
        elevated && 'Strange',
        !Boolean(['6', '15'].includes(quality) || effect) && qualityNames[quality],
        effect && particleEffects[effect],
        toBpName(sku)
    ].filter(Boolean).join(' ')
}

const toBpId = (sku) => {
    const bpSku = toBpSku(sku).replace(' | ', ' ')
    return crypto.createHash('md5').update(bpSku).digest('hex')
}

module.exports = {
    toBpQuality,
    toBpName,
    toBpId,
    toBpPriceIndex,
    listingFromSku,
    toBpSku
}