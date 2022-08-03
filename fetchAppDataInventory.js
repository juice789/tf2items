const { call, getContext, delay } = require('redux-saga/effects')

const {
    prop, groupBy, map, compose, toPairs, uniq, pick, values, merge, indexBy, props, mapObjIndexed, when, complement, has, assoc, unnest
} = require('ramda')

const fromEconItem = require('./fromEconItem.js')

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

const mergeAssetClasses = (assetClasses, inventory) => compose(
    indexBy(prop('id')),
    map(fromEconItem),
    unnest,
    values,
    mapObjIndexed((v, k) => map(merge(assetClasses[k]), v)),
    groupBy(props(['classid', 'instanceid']))
)(inventory)

function* fetchAppDataInventory(inventory, d = 1000) {

    let pos = 0
    let assetClasses = {}

    const { getAssetClassInfo } = yield getContext('api')

    const ids = getAssetClassIds(inventory)

    while (ids.length > 0 && pos < ids.length) {
        console.log('pulling from', pos, 'ids:', ids.length)
        yield delay(d)
        const chunk = getAssetClassQuery(ids.slice(pos, pos + 100))
        const { result } = yield call(getAssetClassInfo, chunk)
        assetClasses = merge(assetClasses, transformAssetClasses(result))
        pos += 100
    }

    return mergeAssetClasses(assetClasses, inventory)
}

module.exports = {
    fetchAppDataInventory
}