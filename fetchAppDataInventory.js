import { call, getContext, delay } from 'redux-saga/effects'

const classKey = (classid, instanceid) => `${classid},${instanceid ?? '0'}`

const getAssetClassQuery = assetClassIds => assetClassIds.map(([classid, instanceid], index) => `&classid${index}=${classid}&instanceid${index}=${instanceid}`)

function getAssetClassIds(inventory) {
    const seen = new Set()
    const result = []
    for (const item of inventory) {
        const key = classKey(item.classid, item.instanceid)
        if (!seen.has(key)) {
            seen.add(key)
            result.push([item.classid, item.instanceid])
        }
    }
    return result
}

function transformAssetClasses(items) {
    return Object.fromEntries(
        Object.values(items)
            .filter(item => item !== null && typeof item === 'object')
            .map(item => {
                const withInstanceId = 'instanceid' in item ? item : { ...item, instanceid: '0' }
                return [classKey(withInstanceId.classid, withInstanceId.instanceid), withInstanceId]
            })
    )
}

function mergeAssetClasses(assetClasses, inventory) {
    const groups = Object.groupBy(inventory, item => classKey(item.classid, item.instanceid))
    return Object.keys(groups).flatMap(key => groups[key].map(item => ({ ...assetClasses[key], ...item })))
}

export function* fetchAppDataInventory(inventory, d = 1000, cache = []) {
    let p = 0, assetClasses = transformAssetClasses(cache)
    const { getAssetClassInfo } = yield getContext('api')
    const cacheKeys = new Set(cache.map(item => classKey(item.classid, item.instanceid)))
    const ids = getAssetClassIds(inventory).filter(([classid, instanceid]) => !cacheKeys.has(classKey(classid, instanceid)))
    while (ids.length > 0 && p < ids.length) {
        yield delay(d)
        const query = getAssetClassQuery(ids.slice(p, p + 125))
        const { result } = yield call(getAssetClassInfo, query)
        assetClasses = { ...assetClasses, ...transformAssetClasses(result) }
        p += 125
    }
    return mergeAssetClasses(assetClasses, inventory)
}
