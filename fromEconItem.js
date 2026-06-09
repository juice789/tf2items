import { safeItems as items } from './schemaItems.js'
import schema from './schema.json' with { type: 'json' }
import schemaHelper from './schemaHelper.json' with { type: 'json' }
const { particleEffects, textures } = schema
const { qualityNames, wears, paintDefindex, spellDefindex, rchDefindex } = schemaHelper
import { skuFromItem } from './sku.js'
import { skuFromItem753 } from './sku753.js'

const invertObj = obj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]))

const wearsInv = invertObj(wears)
const texturesInv = invertObj(textures)
const particleEffectsInv = invertObj(particleEffects)
const qualityNamesInv = invertObj(qualityNames)
const rchSet = new Set(rchDefindex)

function removeStrings(string, strings) {
    return strings
        .reduce((acc, curr) => acc.replace(curr, ''), string || '')
        .replace(/\s\s+/g, ' ')
        .trim()
}

function findTag(tagName, displayProp, item) {
    const tag = (item.tags ?? [])
        .map(t => {
            const out = { ...t }
            if ('localized_category_name' in out) { out.category_name = out.localized_category_name; delete out.localized_category_name }
            if ('localized_tag_name' in out) { out.name = out.localized_tag_name; delete out.localized_tag_name }
            return out
        })
        .find(t => t.category_name === tagName)
    return tag?.[displayProp]
}

const old_id = ({ new_assetid, rollback_new_assetid, assetid }) => (new_assetid || rollback_new_assetid) ? assetid : null

const id = ({ new_assetid, rollback_new_assetid, assetid }) => new_assetid || rollback_new_assetid || assetid || null

const old_contextid = ({ new_contextid, rollback_new_contextid, contextid }) => (new_contextid || rollback_new_contextid) ? contextid : null

const contextid = ({ new_contextid, rollback_new_contextid, contextid }) => new_contextid || rollback_new_contextid || contextid || null

const appid = item => item.appid

const recipe = item =>
    ['Fabricator', 'Strangifier Chemistry Set', 'Chemistry Set']
        .find(s => item.market_hash_name.indexOf(s) !== -1) || null

function series(item) {
    if (findTag('Type', 'name', item) !== 'Crate') return null
    if (item.market_hash_name.indexOf('#') !== -1) return item.market_hash_name.split('#')[1]
    return (items[item?.app_data?.def_index]?.series ?? [])[0]
}

const craft = item =>
    item.name?.includes('#') && !item.market_hash_name?.includes('#')
        ? item.name.split('#')[1]
        : null

const australium = item =>
    item?.app_data?.quality === '11' && item.market_hash_name.indexOf('Australium') !== -1

const wear = item => {
    const wearName = findTag('Exterior', 'name', item)
    if (!wearName) return undefined
    return wearsInv[removeStrings(wearName, ['(', ')'])]
}

function texture(item) {
    if (!findTag('Exterior', 'name', item)) return null
    const name = removeStrings(item.market_hash_name, [
        'Specialized Killstreak',
        'Professional Killstreak',
        'Killstreak',
        '(Field-Tested)',
        '(Well-Worn)',
        '(Battle Scarred)',
        '(Minimal Wear)',
        '(Factory New)',
        'Festivized',
        'Strange',
        qualityNames[item.app_data.quality],
        items[item.app_data.def_index].item_name
    ])
    return texturesInv[name] ?? '-1'
}

const festivized = item => item.market_hash_name.indexOf('Festivized') !== -1

const ksMap = {
    'Professional Killstreak': '3',
    'Specialized Killstreak': '2',
    'Killstreak': '1'
}

const killstreakTier = item => {
    const ks = ['Professional Killstreak', 'Specialized Killstreak', 'Killstreak']
        .find(s => item.market_hash_name.indexOf(s) !== -1)
    return ks ? ksMap[ks] : undefined
}

function effect(item) {
    if (item?.app_data?.quality !== '5') return null
    const desc = (item.descriptions ?? []).find(d => d.color === 'ffd700')
    if (!desc) return null
    return particleEffectsInv[desc.value.replace('★ Unusual Effect: ', '')] ?? '-1'
}

const elevated = item =>
    item?.app_data?.quality !== '11' &&
    item.market_hash_name
        .replace(items[item.app_data?.def_index]?.item_name ?? '', '')
        .includes('Strange')

const uncraftable = item =>
    Boolean((item.descriptions ?? []).find(d => d.value === '( Not Usable in Crafting )'))

const paintOptions = Object.keys(paintDefindex).map(name => `Paint Color: ${name}`)

const paintColor = item => {
    const desc = (item.descriptions ?? []).find(d => paintOptions.includes(d.value))
    if (!desc) return desc
    return paintDefindex[desc.value.split('Paint Color: ')[1]]
}

const spellOptions = Object.keys(spellDefindex).map(name => `Halloween: ${name} (spell only active during event)`)

const halloweenSpell = item => {
    const spells = (item.descriptions ?? [])
        .filter(d => spellOptions.includes(d.value))
        .map(d => spellDefindex[d.value.split('Halloween: ')[1].replace(' (spell only active during event)', '')])
    return spells.length === 0 ? null : spells.join('_')
}

const rch = item => item?.app_data?.quality === '6' && !uncraftable(item) && rchSet.has(item?.app_data?.def_index) && item?.app_data?.def_index

const market_hash_name = item => item.market_hash_name

function setQuality(item) {
    if (item?.app_data?.quality) return item
    const qualityName = findTag('Quality', 'name', item)
    const qualityId = qualityNamesInv[qualityName]
    return { ...item, app_data: { ...(item.app_data ?? {}), quality: qualityId } }
}

const quality = item => item?.app_data?.quality ?? '-1'
const defindex = item => item?.app_data?.def_index ?? '-1'

const propsTf2_1 = {
    defindex,
    quality,
    market_hash_name,
    uncraftable,
    elevated,
    effect,
    killstreakTier,
    festivized,
    texture,
    wear,
    australium,
    series,
    craft,
    recipe,
    halloweenSpell,
    paintColor,
    rch,
    id,
    old_id,
    contextid,
    old_contextid,
    appid
}

const isTarget = item =>
    ['Strangifier', 'Fabricator', 'Strangifier Chemistry Set', 'Unusualifier']
        .find(s => item.market_hash_name.indexOf(s) !== -1) ||
    (item.market_hash_name.indexOf('Kit') !== -1 && item.market_hash_name.indexOf('Killstreak') !== -1)

function target(item) {
    if (!isTarget(item)) return null
    const cleanName = removeStrings(item.market_hash_name, [
        'Strangifier',
        'Unusual',
        'Unusualifier',
        items[item.defindex].item_name,
        'Specialized Killstreak',
        'Professional Killstreak',
        'Killstreak',
        "Collector's",
        'Series',
        'Kit',
        'Fabricator',
        'Chemistry Set',
        '#1',
        '#2',
        '#3'
    ])
    return Object.values(items).find(
        si => ![0, 15].includes(si.item_quality) && si.item_name === cleanName
    )?.defindex ?? '-1'
}

const output = ({ recipe, market_hash_name, killstreakTier }) => {
    switch (recipe) {
        case 'Fabricator': {
            const ktMap = {
                '2': '6523',
                '3': '6526'
            }
            return ktMap[killstreakTier]
        }
        case 'Strangifier Chemistry Set':
            return '6522'
        case 'Chemistry Set': {
            const cleanName = removeStrings(market_hash_name, ['Chemistry Set', "Collector's"])
            return Object.values(items).find(
                si => ![0, 15].includes(si.item_quality) && si.item_name === cleanName
            )?.defindex ?? '-1'
        }
        default:
            return null
    }
}

const oq = ({ market_hash_name, recipe }) => recipe
    ? market_hash_name.includes("Collector's") ? '14' : '6'
    : null

const propsTf2_2 = {
    target,
    output,
    oq
}

const propsOtherGame = {
    sku: ({ appid, market_hash_name }) => `other;${appid};${market_hash_name}`,
    id,
    old_id,
    appid
}

const props753 = {
    market_hash_name: item => item.market_hash_name,
    border: item => (findTag('Card Border', 'internal_name', item) ?? '').at(-1),
    game: item => findTag('Game', 'internal_name', item)?.split('_')[1],
    type: ({ tags = [] }) => (tags.find(tag => tag.category === 'item_class')?.internal_name || 'x').at(-1),
    id,
    old_id,
    contextid,
    old_contextid,
    appid
}

const oldKeyDefindexes = ['5021', '5049', '5067', '5072', '5073', '5079', '5081', '5628', '5631', '5632', '5713', '5716', '5717', '5762', '5791', '5792']

const keyRemap = item => oldKeyDefindexes.includes(String(item.defindex))
    ? { ...item, defindex: '5021' }
    : item

const uncraftRemap = uncraftRemapDefindex => item =>
    uncraftRemapDefindex.includes(String(item.defindex))
        ? { ...item, uncraftable: false }
        : item

export const kitRemap = item => (items[item.defindex]?.name ?? '').includes('Killstreakifier Basic')
    ? { ...item, defindex: '6527' }
    : item

const otherIndex = {
    5844: '5710', // fall acorns key
    5845: '5720', // strongbox key
    5846: '5740', // stockpile key
    5847: '5827', // gargoyle key
    5738: '5737', // stockpile crate
}

const otherRemap = item => item.defindex in otherIndex
    ? { ...item, defindex: otherIndex[item.defindex] }
    : item

const defaultOptions440 = {
    omitProps: ['paintColor', 'halloweenSpell', 'rch'],
    uncraftRemapDefindex: ['5021']
}

function applyFns(fns, item) {
    return Object.fromEntries(Object.entries(fns).map(([k, fn]) => [k, fn(item)]))
}

function fromEconItem440({ omitProps = [], uncraftRemapDefindex = [] } = defaultOptions440) {
    return function (econItem) {
        const item = setQuality(econItem)
        const filteredProps = omitProps.length
            ? Object.fromEntries(Object.entries(propsTf2_1).filter(([k]) => !omitProps.includes(k)))
            : propsTf2_1
        const mapped = applyFns(filteredProps, item)
        const merged = { ...mapped, ...applyFns(propsTf2_2, mapped) }
        const remapped = uncraftRemap(uncraftRemapDefindex)(kitRemap(keyRemap(otherRemap(merged))))
        const withSku = { ...remapped, sku: skuFromItem(remapped) }
        const { sku, id, old_id, contextid, old_contextid, appid } = withSku
        return { sku, id, old_id, contextid, old_contextid, appid }
    }
}

function fromEconItem753() {
    return function (econItem) {
        const mapped = applyFns(props753, econItem)
        const withSku = { ...mapped, sku: skuFromItem753(mapped) }
        const { sku, id, old_id, contextid, old_contextid, appid } = withSku
        return { sku, id, old_id, contextid, old_contextid, appid }
    }
}

function fromEconItemOther() {
    return function (econItem) {
        return applyFns(propsOtherGame, econItem)
    }
}

const mainFns = {
    440: fromEconItem440,
    753: fromEconItem753
}

export const fromEconItem = econItem => (mainFns[econItem.appid] || fromEconItemOther)()(econItem)

export const fromEconItemOptions = options => econItem => (mainFns[econItem.appid] || fromEconItemOther)(options)(econItem)
