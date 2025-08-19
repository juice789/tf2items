const { prop, map, compose, toLower, mapObjIndexed, toPairs, when, has, __, chain, assoc, reduce, mergeRight, values, path, uncurryN, replace, mapKeys } = require('ramda')

const simplifyCollections = compose(
    reduce((curr, obj) => mergeRight(curr, obj), {}),
    values,
    mapObjIndexed(
        (collection, key) => map(assoc('collection', key), collection)
    ),
    map(
        compose(
            reduce((curr, obj) => mergeRight(curr, obj), {}),
            map(([rarity, items]) => map(() => ({ rarity }), items)),
            toPairs,
            prop('items')
        )
    ),
    (collections) => mapKeys((key) => replace('#', '', path([key, 'name'], collections)), collections),
    prop('item_collections')
)

const localizeCollections = uncurryN(2, (english) => map(
    when(
        compose(has(__, english), compose(toLower, prop('collection'))),
        chain(assoc('collection'), compose(prop(__, english), toLower, prop('collection')))
    )
))

const getCollections = uncurryN(2, (english) => compose(
    localizeCollections(english),
    simplifyCollections
))

module.exports = { getCollections }