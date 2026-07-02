import {
    getQuality,
    elevated,
    uncraftable,
    getEffect,
    defindex,
    getClasses,
    getRules
} from './controls'
import { range } from './helpers'

const taunt = {
    controls: {
        quality: getQuality([11, 6, 5, 1]),
        elevated,
        uncraftable,
        effect: getEffect(range(3000, 4000)),
        defindex: defindex()
    },
    itemFn: items => Object.fromEntries(
        Object
            .entries(items)
            .filter(([, item]) => item.item_slot === 'taunt' && !('untradable' in item))
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['multi'])
    },
    rules: getRules(['effect', 'elevated']),
    multiEffect: {
        name: 'multiEffect',
        label: 'Multi effects',
        isClearable: true,
        options: [
            ['taunt01', 'OG effects'],
            ['taunt02', 'Halloween 1'],
            ['taunt03', 'Halloween 2'],
            ['taunt04', 'Halloween 3'],
            ['taunt05', 'Halloween 4'],
            ['taunt06', 'Halloween 5'],
            ['taunt07', 'Winter 2020'],
            ['taunt08', 'Halloween 2021'],
            ['taunt09', 'Winter 2021'],
            ['taunt10', 'Halloween 2022'],
            ['taunt11', 'Winter 2022'],
            ['taunt12', 'Summer 2023'],
            ['taunt13', 'Halloween 2023'],
            ['taunt14', 'Winter 2023'],
            ['taunt15', 'Summer 2024'],
            ['taunt16', 'Halloween 2024'],
            ['taunt17', 'Winter 2024'],
            ['taunt18', 'Summer 2025'],
            ['taunt19', 'Halloween 2025'],
            ['taunt20', 'Winter 2025'],
        ]
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality'],
        effect: ['defindex']
    }
}

export default taunt