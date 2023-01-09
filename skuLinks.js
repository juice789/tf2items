const {
    itemFromSku
} = require('./sku.js')

const {
    toBpQuality,
    toBpName,
    toBpPriceIndex
} = require('./skuBp.js')

const {
    qualityNames,
    killstreakTiers,
    wears
} = require('./schemaHelper.json')

const {
    safeItems: items
} = require('./schemaItems.js')

const {
    particleEffects,
    textures
} = require('./schema.json')

const manncoUrl = (sku) => {
    const {
        defindex,
        quality,
        uncraftable,
        killstreakTier,
        target,
        output,
        oq,
        elevated,
        festivized,
        texture,
        wear,
        australium,
        series,
        effect
    } = itemFromSku(sku)


    const chemSeries = {
        20000: 1,
        20005: 2
    }

    const manncoUrl = [
        440,
        uncraftable && 'uncraftable',
        oq && oq !== '6' && qualityNames[oq],
        effect && particleEffects[effect],
        elevated && 'strange',
        ['6', '15'].includes(quality) === false && qualityNames[quality],
        festivized && 'festivized',
        killstreakTier && killstreakTiers[killstreakTier],
        australium && 'australium',
        texture && textures[texture],
        target && items[target].item_name,
        output && items[output].item_name,
        items[defindex].propername === '1' && quality.toString() === '6' && 'The',
        items[defindex].item_name.replace('\\n', ' '),
        wear && wears[wear],
        chemSeries[defindex] && 'series-' + chemSeries[defindex],
        series && (!items[defindex].seriesHidden || ['111', '112', '113', '114', '115', '116'].includes(series)) && 'series-' + series
    ].filter(Boolean).join('-').replaceAll(/[^0-9a-zA-Z -]/g, '').replaceAll(' ', '-').toLowerCase()

    return 'https://mannco.store/item/' + manncoUrl
}

const scmUrl = (sku) => {

    const {
        defindex,
        quality,
        killstreakTier,
        target,
        output,
        oq,
        elevated,
        festivized,
        texture,
        wear,
        australium,
        series
    } = itemFromSku(sku)

    const chemSeries = {
        20000: 1,
        20005: 2
    }

    const scmUrl = [
        oq && oq !== '6' && qualityNames[oq],
        elevated && 'Strange',
        !['6', '15'].includes(quality) && qualityNames[quality],
        festivized && 'Festivized',
        killstreakTier && killstreakTiers[killstreakTier],
        australium && 'Australium',
        texture && textures[texture],
        target && items[target].item_name,
        output && items[output].item_name,
        items[defindex].propername === '1' && quality.toString() === '6' && 'The',
        items[defindex].item_name,
        wear && '(' + wears[wear] + ')',
        chemSeries[defindex] && 'Series%20%23' + chemSeries[defindex],
        series && !items[defindex].seriesHidden && 'Series%20%23' + series
    ].filter(Boolean).join(' ')


    return 'https://steamcommunity.com/market/listings/440/' + scmUrl
}

const bpUrl = (sku) => {

    const {
        uncraftable
    } = itemFromSku(sku)

    const bpUrl = [
        toBpQuality(sku),
        toBpName(sku),
        'Tradable',
        uncraftable === true ? 'Non-Craftable' : 'Craftable',
        toBpPriceIndex(sku)
    ].filter(Boolean).join('/').replace('%', '%25').replace('%250A', '%0A')

    return 'https://backpack.tf/stats/' + bpUrl
}

const marketplaceUrl = (sku) => {
    const {
        defindex,
        quality,
        uncraftable,
        killstreakTier,
        target,
        output,
        oq,
        elevated,
        festivized,
        texture,
        wear,
        australium,
        series,
        craft,
        effect
    } = itemFromSku(sku)


    const marketplaceSku = [
        defindex,
        quality,
        effect && 'u' + effect,
        wear && 'w' + wear,
        texture && 'pk' + texture,
        elevated && 'strange',
        series && 'c' + series,
        craft && 'n' + craft,
        uncraftable && 'uncraftable',
        australium && 'australium',
        killstreakTier && 'kt-' + killstreakTier,
        festivized && 'festive',
        target && 'td-' + target,
        output && 'od-' + output,
        oq && 'oq-' + oq
    ].filter(Boolean).join(';')

    return 'https://marketplace.tf/items/tf2/' + marketplaceSku
}

module.exports = {
    manncoUrl,
    marketplaceUrl,
    bpUrl,
    scmUrl
}
