import { textures } from '@juice789/tf2items'

import {
    getQuality,
    elevated,
    uncraftable,
    killstreakTier,
    festivized,
    wear,
    getEffect,
    texture,
    defindex,
    craft,
    series,
    getSlot,
    item_class,
    untradable,
    getClasses,
    targetInput,
} from './controls'
import { markGenuine } from './helpers'

const appendDefindex = item => ({ ...item, item_name: item.item_name + ' ' + item.defindex })

// make tradable filter
const markTradable = item => 'untradable' in item ? item : { ...item, untradable: '2' }

// show normal quality in item name
const markNormalQuality = item => item.item_quality === 0
    ? { ...item, item_name: item.item_name + ' (normal)' }
    : item

// show defindex after chemistry sets
const chemistrySetDefindex = ['20000', '20001', '20005', '20006', '20007', '20008', '20009']
const disambiguateChemistrySets = item => chemistrySetDefindex.includes(item.defindex)
    ? appendDefindex(item)
    : item

// display the defindex if a crate has multiple series
const disambiguateMultiSeriesCrates = item => (item.series || []).length > 1
    ? appendDefindex(item)
    : item

// display the crate series if only 1 series exists per crate
const disambiguateSingleSeriesCrates = item => (item.series || []).length === 1
    ? { ...item, item_name: item.item_name + ' ' + item.series[0] }
    : item

// fix double stockpile crates
const fixDoubleStockpileCrates = item => item.item_name === 'Mann Co. Stockpile Crate'
    ? appendDefindex(item)
    : item

// fabricators
const disambiguateFabricators = item => ['20002', '20003'].includes(item.defindex)
    ? appendDefindex(item)
    : item

// old key names
const renameOldKeyNames = item =>
    item.item_name === 'Mann Co. Supply Crate Key' && item.name !== 'Decoder Ring'
        ? { ...item, item_name: item.name + ' (Mann Co. Supply Crate Key)' }
        : item

// new key variants
const disambiguateNewKeyVariants = item => item.type2 === 'key' && / New$/.test(item.name)
    ? appendDefindex(item)
    : item

// mvm drop kit + completed recipe spec and pro kits
const disambiguateKillstreakKits = item => ['6523', '6527', '6526'].includes(item.defindex)
    ? appendDefindex(item)
    : item

// unboxed kits
const disambiguateUnboxedKits = item =>
    item.item_class === 'tool' && item.item_name === 'Kit' && (item.target || []).length === 1
        ? appendDefindex(item)
        : item

// unboxed skins + war paints
const renameUnboxedSkinsAndWarPaints = item =>
    'texture' in item && item.item_quality === 15
        ? { ...item, item_name: `${textures[item.texture]} ${item.item_name}` }
        : item

// Strangifier
const disambiguateStrangifier = item => item.item_name === 'Strangifier'
    ? appendDefindex(item)
    : item

const normalizeItem = item => {
    item = markTradable(item)
    item = markNormalQuality(item)
    item = disambiguateChemistrySets(item)
    item = disambiguateMultiSeriesCrates(item)
    item = disambiguateSingleSeriesCrates(item)
    item = fixDoubleStockpileCrates(item)
    item = disambiguateFabricators(item)
    item = renameOldKeyNames(item)
    item = disambiguateNewKeyVariants(item)
    item = disambiguateKillstreakKits(item)
    item = disambiguateUnboxedKits(item)
    item = renameUnboxedSkinsAndWarPaints(item)
    item = disambiguateStrangifier(item)
    item = markGenuine(item)
    return item
}

const defaultCategory = {
    controls: {
        quality: getQuality(),
        elevated,
        uncraftable,
        killstreakTier,
        australium: {
            name: 'australium',
            label: 'Australium',
            type: 'toggle'
        },
        festivized,
        wear,
        effect: getEffect(undefined, []),
        texture,
        defindex: defindex({ type: 'virtual' }),
        target: targetInput,
        craft,
        series
    },
    itemFn: items => Object.fromEntries(
        Object.entries(items).map(([key, item]) => [key, normalizeItem(item)])
    ),
    filters: {
        used_by_classes: getClasses(),
        item_slot: getSlot(),
        item_class,
        untradable
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default defaultCategory
