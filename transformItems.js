import { mergeDeepRight } from './utils.js'
import schemaHelper from './schemaHelper.json' with { type: 'json' }
const { qualityIds, strangifierTargets, crateSeries, chemsetDefindex } = schemaHelper

const propsToKeep = [
    'name',
    'defindex',
    'item_class',
    'item_name',
    'propername',
    'item_slot',
    'used_by_classes',
    'untradable',
    'festivized',
    'type2',
    'texture',
    'target',
    'series',
    'seriesHidden',
    'item_quality'
]

const WEAPON_SLOTS = new Set(['primary', 'melee', 'secondary', 'pda', 'pda2', 'building'])

function transformItem(item) {
    if (item.item_quality?.includes('paintkitweapon') && item.defindex !== '9536') {
        item.texture = item.static_attrs?.['paintkit_proto_def_index']
    }
    if ('item_quality' in item) {
        item.item_quality = qualityIds[item.item_quality.split(' ')[0]]
    }
    if (item.tool?.type === 'decoder_ring') item.type2 = 'key'
    if (item.tool?.type === 'paint_can') item.type2 = 'paint'
    if (item.attributes?.['cannot trade']?.value === '1') item.untradable = '1'
    if (item.tags?.can_be_festivized === '1') item.festivized = '1'
    if (item.attributes?.['tool target item']?.value) {
        item.target = [item.attributes['tool target item'].value]
    }
    if (item.static_attrs?.['set supply crate series']) {
        item.series = [item.static_attrs['set supply crate series']]
    }
    if (item.static_attrs?.['hide crate series number']) item.seriesHidden = true
    if (item.static_attrs?.['tool target item']) {
        item.target = [item.static_attrs['tool target item']]
    }
    if (!item.item_name) item.item_name = item.name
    if ('used_by_classes' in item && !Array.isArray(item.used_by_classes)) {
        item.used_by_classes = Object.keys(item.used_by_classes)
    }
    if (item.item_slot && item.used_by_classes?.length === 9) {
        item.used_by_classes = ['all']
    } else if (WEAPON_SLOTS.has(item.item_slot) && item.used_by_classes?.length >= 2 && item.used_by_classes?.length <= 8) {
        item.used_by_classes = ['multi']
    }

    const picked = {}
    for (const key of propsToKeep) {
        if (key in item) picked[key] = item[key]
    }
    return picked
}

export function transformItems(collections, itemsApi, items) {
    const transformedItems = {}
    for (const [defindex, item] of Object.entries(items)) {
        if (defindex === 'default') continue
        transformedItems[defindex] = transformItem({ ...item, defindex })
    }

    const merged = [itemsApi, crateSeries, strangifierTargets, chemsetDefindex, transformedItems]
        .reduce((acc, obj) => mergeDeepRight(acc, obj), {})

    const result = {}
    for (const [defindex, item] of Object.entries(merged)) {
        result[defindex] = mergeDeepRight(collections[item.name] ?? {}, item)
    }
    return result
}
