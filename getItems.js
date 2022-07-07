const { prop, map, compose, toLower, when, has, __, chain, assoc, reduce, omit, props, split, propOr, replace, mergeDeepLeft, mergeDeepWith } = require('ramda')

function* getItems(english, { items_game }) {

    var mergePrefab = (item) => mergeDeepLeft(
        omit(['prefab'], item),
        reduce(
            mergeDeepWith((p, n) => p + ' ' + n),
            {},
            props(split(' ', item.prefab), items_game.prefabs)
        )
    )

    var mergePrefabs = when(
        has('prefab'),
        (a) => mergePrefabs(mergePrefab(a))
    )

    var localize = (key) => chain(
        assoc(key),
        compose(
            prop(__, english),
            replace('#', ''),
            toLower,
            propOr('NaN', key)
        )
    )

    const items = map(
        compose(
            localize('item_type_name'),
            localize('item_name'),
            mergePrefabs
        ),
        items_game.items
    )

    return items

}

module.exports = { getItems }