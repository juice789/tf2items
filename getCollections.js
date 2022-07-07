const { prop, map, compose, toLower, mapObjIndexed, toPairs, when, has, __, chain, assoc, reduce, mergeRight, values, path, uncurryN, replace } = require('ramda')
const { renameKeysWith } = require('ramda-adjunct')

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
    (collections) => renameKeysWith((key) => replace('#', '', path([key, 'name'], collections)), collections),
    path(['items_game', 'item_collections'])
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