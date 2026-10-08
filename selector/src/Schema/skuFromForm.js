import {
    safeItems,
    skuFromItem
} from '@juice789/tf2items'

const ktRemap = {
    '6527': '1',
    '6523': '2',
    '6526': '3',
    '20002': '2',
    '20003': '3'
}

const odRemap = {
    '20002': '6523',
    '20003': '6526'
}

const applyKtRemap = item =>
    ktRemap[item.defindex] ? { ...item, killstreakTier: ktRemap[item.defindex] } : item

const applyOdRemap = item =>
    odRemap[item.defindex] ? { ...item, output: odRemap[item.defindex] } : item

const applyTexture = item => {
    const data = safeItems[item.defindex]
    return data && 'texture' in data ? { ...item, texture: data.texture } : item
}

const applyTarget = item => {
    const data = safeItems[item.defindex]
    return data && 'target' in data ? { ...item, target: data.target } : item
}

const applyCrateSeries = item => {
    if (!item.defindex.includes('/')) return item
    const [defindex, series] = item.defindex.split('/')
    return { ...item, defindex, series }
}

const applyChemistrySet = item => {
    if (!item.defindex.includes('<')) return item
    const [defindex, output, target] = item.defindex.split('<')
    return { ...item, output, target, defindex, oq: safeItems[defindex]?.oq }
}

const applyStrangifier = item => {
    if (!item.defindex.includes('>')) return item
    const [defindex, target] = item.defindex.split('>')
    return { ...item, defindex, target }
}

const skuFromForm = (obj) => (overrides) => {
    let item = { ...obj, ...overrides }
    item = applyKtRemap(item)
    item = applyOdRemap(item)
    item = applyTexture(item)
    item = applyTarget(item)
    item = applyCrateSeries(item)
    item = applyChemistrySet(item)
    item = applyStrangifier(item)
    return skuFromItem(item)
}

export default skuFromForm
