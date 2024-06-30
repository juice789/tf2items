const { prop, pick, map, compose, complement, includes, equals, length, allPass, mapObjIndexed, when, has, __, chain, assoc, pathEq, omit, split, keys, propEq, propOr, nth, range, path, uncurryN, mergeDeepRight, reduce, concat } = require('ramda')
const { qualityIds, strangifierTargets, crateSeries, chemsetDefindex } = require('./schemaHelper.json')

const propsToKeep = [
    'name',
    'defindex',
    'item_class',
    'item_name',
    'propername',
    'item_slot',
    'used_by_classes',
    'untradable',
    'festivized',
    'type2',
    'texture',
    'target',
    'series',
    'seriesHidden',
    'item_quality'
]

const transformItems = uncurryN(3, (collections, itemsApi) => compose(
    map((item) => mergeDeepRight(collections[item.name], item)),
    reduce(mergeDeepRight, {}),
    concat([itemsApi, crateSeries, strangifierTargets, chemsetDefindex]),
    Array.of,
    map(
        compose(
            pick(propsToKeep),
            when(
                allPass([
                    compose(Boolean, prop('item_slot')),
                    compose(includes(__, ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building']), prop('item_slot')),
                    compose(
                        includes(__, range(2, 9)),
                        length,
                        prop('used_by_classes')
                    )
                ]),
                assoc('used_by_classes', ['multi'])
            ),
            when(
                allPass([
                    compose(Boolean, prop('item_slot')),
                    compose(equals(9), length, prop('used_by_classes'))
                ]),
                assoc('used_by_classes', ['all'])
            ),
            when(
                has('used_by_classes'),
                chain(assoc('used_by_classes'), compose(keys, prop('used_by_classes')))
            ),
            when(
                compose(complement(Boolean), prop('item_name')),
                chain(assoc('item_name'), prop('name'))
            ),
            when(
                path(['static_attrs', 'tool target item']),
                chain(assoc('target'), compose(Array.of, path(['static_attrs', 'tool target item'])))
            ),
            when(
                path(['static_attrs', 'hide crate series number']),
                assoc('seriesHidden', true)
            ),
            when(
                path(['static_attrs', 'set supply crate series']),
                chain(assoc('series'), compose(Array.of, path(['static_attrs', 'set supply crate series'])))
            ),
            when(
                path(['attributes', 'tool target item', 'value']),
                chain(assoc('target'), compose(Array.of, path(['attributes', 'tool target item', 'value'])))
            ),
            when(
                pathEq('1', ['tags', 'can_be_festivized']),
                assoc('festivized', '1')
            ),
            when(
                pathEq('1', ['attributes', 'cannot trade', 'value']),
                assoc('untradable', '1')
            ),
            when(
                pathEq('paint_can', ['tool', 'type']),
                assoc('type2', 'paint')
            ),
            when(
                pathEq('decoder_ring', ['tool', 'type']),
                assoc('type2', 'key')
            ),
            when(
                has('item_quality'),
                chain(assoc('item_quality'), compose(prop(__, qualityIds), nth(0), split(' '), prop('item_quality')))
            ),
            when(
                allPass([
                    compose(includes('paintkitweapon'), propOr('', 'item_quality')),
                    complement(propEq)('9536', 'defindex')
                ]),
                chain(assoc('texture'), path(['static_attrs', 'paintkit_proto_def_index']))
            )
        )
    ),
    omit(['default']),
    mapObjIndexed((v, k) => assoc('defindex', k, v))
))

module.exports = { transformItems }