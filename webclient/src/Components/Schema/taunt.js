import {
    propEq, pickBy, allPass, complement, has, range
} from 'ramda'

import {
    getQuality,
    elevated,
    uncraftable,
    getEffect,
    defindex,
    getClasses
} from './controls'

const taunt = {
    controls: {
        quality: getQuality([11, 6, 5, 1]),
        elevated,
        uncraftable,
        effect: getEffect(range(7, 175)),
        defindex
    },
    itemFn: pickBy(
        allPass([
            propEq('item_slot', 'taunt'),
            complement(has)('untradable')
        ])
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['multi'])
    },
    rules: {
        elevated: {
            quality: ['11'],
            reverse: true,
            ignore: false
        },
        effect: {
            quality: ['5'],
            ignore: true
        }
    },
    multiEffect: {
        name: 'multiEffect',
        label: 'Multi effects',
        isClearable: true,
        options: [
            ['taunt1', 'OG effects'],
            ['taunt2', 'Halloween 1'],
            ['taunt3', 'Halloween 2'],
            ['taunt4', 'Halloween 3'],
            ['taunt5', 'Halloween 4'],
            ['taunt6', 'Halloween 5'],
            ['taunt7', 'Winter 2020'],
            ['taunt8', 'Halloween 2021'],
            ['taunt9', 'Winter 2021']
        ]
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality'],
        effect: ['defindex']
    }
}

export default taunt