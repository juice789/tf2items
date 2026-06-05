import helperObjects from './schemaHelper.json' with { type: 'json' }

export * from './schemaItems.js'
export * from './sku.js'
export * from './skuBp.js'
export * from './skuLinks.js'

export const {
    qualityNames, qualityIds, rarities, killstreakTiers, wears, classes, itemSlots, itemClasses,
    paintHex, paintDefindex, spellDefindex, cosmeticCollections, weaponCollections, warPaintCollections,
    fabricatorDefindex, strangifierTargets, australiumDefindex, crateSeries, paintableDefindex,
    chemsetDefindex, serieslessDefindex, impossibleEffects
} = helperObjects