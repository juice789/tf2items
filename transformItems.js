const { prop, pick, map, compose, complement, includes, equals, length, allPass, mapObjIndexed, when, has, __, chain, assoc, pathEq, omit, split, keys, propEq, propOr, nth, of, range, path } = require('ramda')

const { qualityIds } = require('./schemaHelper.json')

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

const transformItems = compose(
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
                assoc('used_by_classes', ['all'])//maybe create a new category to filter used_by_classes instead of overriding the default list. example: class2: single / multi / all
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
                chain(assoc('target'), compose(of, path(['static_attrs', 'tool target item'])))
            ),
            when(
                path(['static_attrs', 'hide crate series number']),
                assoc('seriesHidden', true)
            ),
            when(
                path(['static_attrs', 'set supply crate series']),
                chain(assoc('series'), compose(of, path(['static_attrs', 'set supply crate series'])))
            ),
            when(
                path(['attributes', 'tool target item', 'value']),
                chain(assoc('target'), compose(of, path(['attributes', 'tool target item', 'value'])))
            ),
            when(
                pathEq(['tags', 'can_be_festivized'], '1'),
                assoc('festivized', '1')
            ),
            when(
                pathEq(['attributes', 'cannot trade', 'value'], '1'),
                assoc('untradable', '1')
            ),
            when(
                pathEq(['tool', 'type'], 'paint_can'),
                assoc('type2', 'paint')
            ),
            when(
                pathEq(['tool', 'type'], 'decoder_ring'),
                assoc('type2', 'key')
            ),
            when(
                has('item_quality'),
                chain(assoc('item_quality'), compose(prop(__, qualityIds), nth(0), split(' '), prop('item_quality')))
            ),
            when(
                allPass([
                    compose(includes('paintkitweapon'), propOr('', 'item_quality')),
                    complement(propEq)('defindex', 9536)
                ]),
                chain(assoc('texture'), path(['static_attrs', 'paintkit_proto_def_index']))
            )
        )
    ),
    omit(['default']),
    mapObjIndexed((v, k) => assoc('defindex', parseInt(k), v))
)

module.exports = { transformItems }