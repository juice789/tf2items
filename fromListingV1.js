import { safeItems as items } from './schemaItems.js'
import schema from './schema.json' with { type: 'json' }
const { textures } = schema
import { skuFromItem } from './sku.js'
import { kitRemap } from './fromEconItem.js'

function coalesce(fns, item) {
    return fns.map(fn => fn(item)).find(Boolean)
}

const isWeaponEffect = x => ['701', '702', '703', '704'].includes(String(x))

const defindex = item => item.defindex

const quality = item => item.quality

const uncraftable = item => Boolean(item.flag_cannot_craft)

const effectOptions = [
    item => item?.attributes?.['134']?.float_value,
    item => item?.attributes?.['2041']?.value,
]

const effect = item => coalesce(effectOptions, item)

const elevated = item => item.quality === 11
    ? isWeaponEffect(effect(item))
    : '214' in (item.attributes ?? {})

const ktRemap = {
    '6527': '1',
    '6523': '2',
    '6526': '3',
    '20002': '2',
    '20003': '3'
}

const ktOptions = [
    item => item?.attributes?.['2025']?.float_value,
    item => ktRemap[item.defindex]
]

const killstreakTier = item => coalesce(ktOptions, item)

const festivized = item => '2053' in (item.attributes ?? {})

const texture = item => item?.attributes?.['834']?.value

const wears = {
    '0': null,
    '0.2': '1',
    '0.4': '2',
    '0.6': '3',
    '0.8': '4',
    '1': '5'
}

const wear = item => wears[String(item?.attributes?.['725']?.float_value ?? '0').slice(0, 3)]

const australium = item => '2027' in (item.attributes ?? {})

const series = item => item?.attributes?.['187']?.float_value

const findOutput = item => Object.values(item.attributes ?? {})
    .find(attr => [true, 'true'].includes(attr.is_output))

const findRecipeTarget = item => {
    const out = findOutput(item)
    const attr = (out?.attributes ?? []).find(a => ['2012', 2012].includes(a.defindex))
    return attr?.float_value
}

const targetOptions = [
    item => item?.attributes?.['2012']?.float_value,
    findRecipeTarget
]

const target = item => coalesce(targetOptions, item)

const output = item => findOutput(item)?.itemdef

const oq = item => findOutput(item)?.quality

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

const remap = (fn1, fn2) => item => fn1(item)
    ? { ...item, defindex: fn2(item) || item.defindex }
    : item

const remapStrangifier = remap(
    item => items[item.defindex]?.item_name === 'Strangifier',
    item => {
        const t = String(item.target)
        return Object.values(items).find(v => (v.target ?? []).includes(t))?.defindex
    }
)

const strangifierSets = Object.fromEntries(
    Object.entries(items).filter(([, v]) => 'td' in v && v.item_name === 'Chemistry Set')
)

const remapStrangifierSet = remap(
    item => item.defindex === 20001 && item.output && item.target,
    item => {
        const t = String(item.target)
        return Object.values(strangifierSets).find(v => v.td?.includes(t))?.defindex
    }
)

const collectorSets = Object.fromEntries(
    Object.entries(items).filter(([, v]) => !v.td && v.od && v.item_name === 'Chemistry Set')
)

const remapCollectorSet = remap(
    item => item.defindex === 20001 && !item.target,
    item => {
        const o = String(item.output)
        return Object.values(collectorSets).find(v => v.od?.includes(o))?.defindex
    }
)

const weaponIndex = {
    "0": 190,
    "1": 191,
    "13": 200,
    "14": 201,
    "15": 202,
    "16": 203,
    "17": 204,
    "18": 205,
    "19": 206,
    "2": 192,
    "20": 207,
    "21": 208,
    "22": 209,
    "23": 209,
    "24": 210,
    "25": 737,
    "29": 211,
    "3": 193,
    "30": 212,
    "4": 194,
    "5": 195,
    "6": 196,
    "7": 197,
    "735": 736,
    "8": 198,
    "9": 199,
    "10": 199,
    "11": 199,
    "12": 199
}

const remapWeapon = item => item.defindex in weaponIndex
    ? { ...item, defindex: weaponIndex[item.defindex] }
    : item

function decodeSkinQuality(item) {
    if (item.quality === 15 && isWeaponEffect(item.effect)) return { ...item, quality: 5 } // decorated + effect = unusual
    if (item.quality === 11 && isWeaponEffect(item.effect)) return { ...item, quality: 5 } // strange + effect = unusual
    if (item.quality === 15 && !item.effect && item.elevated) return { ...item, quality: 11 } // decorated + elevated = strange
    return item
}

const unboxedSkins = Object.fromEntries(
    Object.entries(items)
        .filter(([, v]) => v.item_quality === 15)
        .map(([k, v]) => [k, { ...v, item_name: textures[v.texture] + ' ' + v.item_name }])
)

const unboxSkinsRemap = remap(
    item => item.texture,
    item => {
        const expectedName = textures[item.texture] + ' ' + items[item.defindex].item_name
        return Object.entries(unboxedSkins).find(([, v]) => v.item_name === expectedName)?.[0]
    }
)

const remapCrateSeries = remap(
    item => item.series,
    item => {
        const s = String(item.series)
        return Object.values(items).find(v => (v.series ?? []).includes(s))?.defindex
    }
)

const promoIndex = {
    "30720": "30740",
    "30721": "30741",
    "30724": "30739",
    "810": "831",
    "811": "832",
    "812": "833",
    "813": "834",
    "814": "835",
    "815": "836",
    "816": "837",
    "817": "838"
}

const promoRemap = item => item.defindex in promoIndex && item.quality === 1
    ? { ...item, defindex: promoIndex[item.defindex] }
    : item

export const remaps = item => [
    remapStrangifier,
    remapStrangifierSet,
    remapCollectorSet,
    remapWeapon,
    decodeSkinQuality,
    promoRemap,
    kitRemap,
    unboxSkinsRemap,
    remapCrateSeries,
].reduce((acc, fn) => fn(acc), item)

export function fromListingV1(item) {
    const indexedAttrs = Object.fromEntries(
        (item.attributes ?? []).map(a => [a.defindex, a])
    )
    const normalized = { ...item, attributes: indexedAttrs }
    const mapped = Object.fromEntries(Object.entries(fns).map(([k, fn]) => [k, fn(normalized)]))
    return skuFromItem(remaps(mapped))
}
