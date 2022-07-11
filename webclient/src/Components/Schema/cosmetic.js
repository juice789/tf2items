import { cosmeticCollections } from '@juice789/tf2items'

import {
    compose, map, prop, pickBy, includes, range, __, toString, allPass, indexOf, propOr, complement, has, equals
} from 'ramda'

import {
    quality,
    elevated,
    uncraftable,
    effect,
    defindex,
    used_by_classes,
    getCollections,
    getRarities
} from './controls'

const cosmeticRarities = [
    "rare",
    "mythical",
    "legendary",
    "ancient",
]

const cosmetic = {
    controls: {
        quality: quality(['0', '1', '11', '13', '14', '3', '5', '6']),
        elevated,
        uncraftable,
        effect: effect(map(toString, range([7, 175]))),
        defindex
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
    itemFn: compose(
        pickBy(
            allPass([
                compose(equals(-1), indexOf('Promo '), propOr('', 'name')),
                compose(includes(__, ['misc', 'head']), prop('item_slot')),
                complement(has)('untradable')
            ])
        )),
    filters: {
        used_by_classes: used_by_classes('multi'),
        collection: getCollections(cosmeticCollections),
        rarity: getRarities(cosmeticRarities),
    },
    multiEffect: {
        name: 'multiEffect',
        label: 'Multi effects',
        isClearable: true,
        options: [
            ['gen1', 'Gen 1'],
            ['gen1low', 'Gen 1 Low'],
            ['gen1high', 'Gen 1 High'],
            ['gen2', 'Gen 2'],
            ['gen3', 'Gen 3'],
            ['halloween', 'Halloween OG'],
            ['robo', 'Robo'],
            ['eotl', 'EOTL'],
            ['invasion', 'Invasion'],
            ['h2015', 'Halloween 2015'],
            ['h2016', 'Halloween 2016'],
            ['h2018', 'Halloween 2018'],
            ['h2019', 'Halloween 2019'],
            ['w2019', 'Winter 2019'],
            ['s2020', 'Summer 2020'],
            ['h2020', 'Halloween 2020'],
            ['w2020', 'Winter 2020'],
            ['s2021', 'Summer 2021'],
            ['h2021', 'Halloween 2021'],
            ['w2021', 'Winter 2021'],
        ]
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality'],
        effect: ['defindex']
    }
}

export default cosmetic