const skuFromItem753 = ({
    market_hash_name,
    game,
    border,
    type,
}) => [
    753,
    type === '2' ? `${type}-${border}` : type,
    game,
    encodeURIComponent(market_hash_name)
].filter(Boolean).join(';')

const itemFromSku753 = (sku) => {
    const [x, type, game, market_hash_name] = sku.split(';')
    const item = {
        type,
        border: type[1],
        game,
        market_hash_name: decodeURIComponent(market_hash_name)
    }
    item.sku = sku
    return item
}

module.exports = {
    skuFromItem753,
    itemFromSku753
}