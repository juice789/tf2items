import {
    defindex,
    getClasses,
    target
} from './controls'

const unusualifier = {
    controls: {
        defindex: defindex({ isSearchable: false }),
        target: target(),
    },
    itemFn: items => Object.fromEntries(
        [9258].filter(key => key in items).map(key => [key, items[key]])
    ),
    targetFn: items => Object.fromEntries(
        Object.entries(items).filter(([, item]) => item.item_slot === 'taunt')
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['multi'])
    },
    defaults: {
        quality: '5',
        uncraftable: '1'
    },
    validation: {
        single: ['defindex', 'target'],
        multi: ['defindex']
    }
}

export default unusualifier