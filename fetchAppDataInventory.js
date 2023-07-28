const { call, getContext, delay } = require('redux-saga/effects')

const {
    groupBy, map, compose, toPairs, uniq, pick, values, mergeRight, indexBy, props, mapObjIndexed, when, complement, has, assoc, unnest, uncurryN
} = require('ramda')

const getAssetClassQuery = compose(
    map(([key, { classid, instanceid }]) => `&classid${key}=${classid}&instanceid${key}=${instanceid}`),
    toPairs
)

const getAssetClassIds = compose(
    uniq,
    map(pick(['classid', 'instanceid']))
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

function* fetchAppDataInventory(inventory, d = 1000) {

    let p = 0, assetClasses = {}
    const { getAssetClassInfo } = yield getContext('api')
    const ids = getAssetClassIds(inventory)

    while (ids.length > 0 && p < ids.length) {
        yield delay(d)
        const query = getAssetClassQuery(ids.slice(p, p + 100))
        const { result } = yield call(getAssetClassInfo, query)
        assetClasses = mergeRight(assetClasses, transformAssetClasses(result))
        p += 100
    }

    return mergeAssetClasses(assetClasses, inventory)
}

module.exports = {
    fetchAppDataInventory
}