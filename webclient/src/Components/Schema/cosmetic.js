import { cosmeticCollections } from '@juice789/tf2items'

import {
    compose, prop, pickBy, includes, range, __, allPass, indexOf, propOr, complement, has, equals
} from 'ramda'

import {
    getQuality,
    elevated,
    uncraftable,
    getEffect,
    defindex,
    getClasses,
    getCollections,
    getRarities,
    getRules
} from './controls'

const cosmeticRarities = [
    "rare",
    "mythical",
    "legendary",
    "ancient",
]

const cosmetic = {
    controls: {
        quality: getQuality(['0', '1', '11', '13', '14', '3', '5', '6']),
        elevated,
        uncraftable,
        effect: getEffect(range(7, 700)),
        defindex: defindex({ type: 'virtual' })
    },
    rules: getRules(['effect', 'elevated']),
    itemFn: compose(
        pickBy(
            allPass([
                compose(equals(-1), indexOf('Promo '), propOr('', 'name')),
                compose(includes(__, ['misc', 'head']), prop('item_slot')),
                complement(has)('untradable')
            ])
        )),
    filters: {
        used_by_classes: getClasses(undefined, ['multi']),
        collection: getCollections(cosmeticCollections),
        rarity: getRarities(cosmeticRarities),
    },
    multiEffect: {
        name: 'multiEffect',
        label: 'Multi effects',
        isClearable: true,
        options: [
            ['all', 'All'],
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