import { safeItems as items } from './schemaItems.js'
import { skuFromItem, itemFromSku } from './sku.js'

const choose = (n, xs) =>
    n < 1 || n > xs.length
        ? []
        : n === 1
            ? xs.map(x => [x])
            : [
                ...choose(n - 1, xs.slice(1)).map(ys => [xs[0], ...ys]),
                ...choose(n, xs.slice(1))
            ]

function getCombos(min, max, xs) {
    if (xs.length === 0 || min > max) return []
    return [...choose(min, xs), ...getCombos(min + 1, max, xs)]
}

const warPaintRemap = item =>
    !('texture' in item) && items[item.defindex]?.item_name === 'War Paint'
        ? { ...item, defindex: '9536' }
        : item

function unboxSkinsRemap(item) {
    const schemaItem = items[item.defindex]
    if ('texture' in item || !schemaItem || !('texture' in schemaItem) || schemaItem.item_name === 'War Paint') {
        return item
    }
    const weapon = Object.values(items).find(si => si.item_quality === 6 && si.item_name === schemaItem.item_name)
    return [item, { ...item, defindex: (weapon ?? {}).defindex }]
}

const remaps = item => unboxSkinsRemap(warPaintRemap(item))

const propListDefault = ['killstreakTier', 'elevated', 'festivized', 'effect', 'texture', 'wear', 'craft', 'series']

export const blanketify = (skus, propList = propListDefault) => item => {
    const itemObj = itemFromSku(item.sku)
    const filteredProps = propList.filter(p => Boolean(itemObj[p]))
    const combos = getCombos(0, filteredProps.length, filteredProps)
    return combos
        .map(combo => Object.fromEntries(Object.entries(itemObj).filter(([k]) => !combo.includes(k))))
        .flatMap(v => { const r = remaps(v); return Array.isArray(r) ? r : [r] })
        .map(v => ({ ...v, _sku: skuFromItem(v) }))
        .filter(v => skus.includes(v._sku))
        .map(v => ({ ...item, sku: v._sku, originalSku: item.sku }))
}
