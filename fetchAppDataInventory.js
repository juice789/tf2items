const { call, getContext, delay } = require('redux-saga/effects')

const {
    groupBy, map, compose, uniq, values, mergeRight, indexBy, props, mapObjIndexed, when, complement, has, assoc, unnest, uncurryN, without
} = require('ramda')

const getAssetClassQuery = assetClassIds => assetClassIds.map(([classid, instanceid], index) => `&classid${index}=${classid}&instanceid${index}=${instanceid}`)

const getAssetClassIds = compose(
    uniq,
    map(props(['classid', 'instanceid']))
)

const transformAssetClasses = compose(
    indexBy(props(['classid', 'instanceid'])),
    map(
        when(
            complement(has)('instanceid'),
            assoc('instanceid', '0')
        )
    ),
    values
)

const mergeAssetClasses = uncurryN(2, (assetClasses) => compose(
    unnest,
    values,
    mapObjIndexed((v, k) => map(mergeRight(assetClasses[k]), v)),
    groupBy(props(['classid', 'instanceid']))
))

function* fetchAppDataInventory(inventory, d = 1000, cache = []) {
    let p = 0, assetClasses = transformAssetClasses(cache)
    const { getAssetClassInfo } = yield getContext('api')
    const ids = without(cache.map(props(['classid', 'instanceid'])), getAssetClassIds(inventory))
    while (ids.length > 0 && p < ids.length) {
        yield delay(d)
        const query = getAssetClassQuery(ids.slice(p, p + 150))
        const { result } = yield call(getAssetClassInfo, query)
        assetClasses = mergeRight(assetClasses, transformAssetClasses(result))
        p += 150
    }
    return mergeAssetClasses(assetClasses, inventory)
}

module.exports = {
    fetchAppDataInventory
}