import { chain, compose, when, propEq, assoc, concat, prop, __, map, props, join, includes, propOr, gt, length, evolve, identity, nth, equals, allPass, complement, test, has, startsWith } from 'ramda'

import { textures } from '@juice789/tf2items'

import {
    getQuality,
    elevated,
    uncraftable,
    killstreakTier,
    festivized,
    wear,
    getEffect,
    texture,
    defindex,
    craft,
    series,
    getSlot,
    item_class,
    untradable,
    getClasses,
    targetInput,
} from './controls'

const defaultCategory = {
    controls: {
        quality: getQuality(),
        elevated,
        uncraftable,
        killstreakTier,
        australium: {
            name: 'australium',
            label: 'Australium',
            type: 'toggle'
        },
        festivized,
        wear,
        effect: getEffect(undefined, []),
        texture,
        defindex: defindex({ type: 'virtual' }),
        target: targetInput,
        craft,
        series
    },
    itemFn: map(compose(
        when(//genuine rename
            compose(
                startsWith('Promo '),
                propOr('', 'name')
            ),
            chain(
                assoc('item_name'),
                compose(concat(__, ' (Genuine)'), prop('item_name'))
            )
        ),
        when(//Strangifier
            propEq('Strangifier', 'item_name'),
            chain(assoc('item_name'), compose(join(' '), props(['item_name', 'defindex'])))
        ),
        when(//unboxed skins + war paints
            allPass([
                has('texture'),
                propEq(15, 'item_quality')
            ]),
            chain(
                assoc('item_name'),
                compose(
                    join(' '),
                    evolve([prop(__, textures), identity]),
                    props(['texture', 'item_name'])
                )
            )
        ),
        when(//unboxed kits
            allPass([
                propEq('tool', 'item_class'),
                propEq('Kit', 'item_name'),
                compose(equals(1), length, propOr([], 'target'))
            ]),
            chain(assoc('item_name'), compose(join(' '), props(['item_name', 'defindex'])))
        ),
        when(//mvm drop kit + completed recipe spec and pro kits
            compose(includes(__, ['6523', '6527', '6526']), prop('defindex')),
            chain(assoc('item_name'), compose(join(' '), props(['item_name', 'defindex'])))
        ),
        when(//new key variants
            allPass([
                propEq('key', 'type2'),
                compose(test(/ New$/), prop('name')),
            ]),
            chain(assoc('item_name'), compose(join(' '), props(['item_name', 'defindex'])))
        ),
        when(//old key names
            allPass([
                propEq('Mann Co. Supply Crate Key', 'item_name'),
                complement(propEq)('Decoder Ring', 'name')
            ]),
            chain(assoc('item_name'), compose(concat(__, ' (Mann Co. Supply Crate Key)'), prop('name')))
        ),
        when(//fabricators
            compose(includes(__, ['20002', '20003']), prop('defindex')),
            chain(assoc('item_name'), compose(join(' '), props(['item_name', 'defindex'])))
        ),
        when(//fix double stockpile crates
            propEq('Mann Co. Stockpile Crate', 'item_name'),
            chain(assoc('item_name'), compose(join(' '), props(['item_name', 'defindex'])))
        ),
        when(//display the crate series if only 1 series exists per crate
            compose(equals(1), length, propOr([], 'series')),
            chain(assoc('item_name'), compose(join(' '), evolve([identity, nth(0)]), props(['item_name', 'series'])))
        ),
        when(//display the defindex if a crate has multiple series
            compose(gt(__, 1), length, propOr([], 'series')),
            chain(assoc('item_name'), compose(join(' '), props(['item_name', 'defindex'])))
        ),
        when(//show defindex after chemistry sets
            compose(includes(__, ['20000', '20001', '20005', '20006', '20007', '20008', '20009']), prop('defindex')),
            chain(assoc('item_name'), compose(join(' '), props(['item_name', 'defindex'])))
        ),
        when(//show normal quality in item name
            propEq(0, 'item_quality'),
            chain(assoc('item_name'), compose(concat(__, ' (normal)'), prop('item_name')))
        ),
        when(//make tradable filter
            complement(has)('untradable'),
            assoc('untradable', '2')
        )
    )),
    filters: {
        used_by_classes: getClasses(),
        item_slot: getSlot(),
        item_class,
        untradable
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default defaultCategory