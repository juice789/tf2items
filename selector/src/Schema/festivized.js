import {
    getQuality,
    elevated,
    uncraftable,
    killstreakTier,
    defindex,
    getClasses,
    getSlot,
    getRules
} from './controls'

const festivized = {
    controls: {
        quality: getQuality([1, 11, 14, 3, 6]),
        elevated,
        uncraftable,
        killstreakTier,
        defindex: defindex()
    },
    defaults: {
        festivized: '1'
    },
    itemFn: items => Object.fromEntries(
        Object
            .entries(items)
            .filter(([, item]) => 'festivized' in item && ![0, 15].includes(item.item_quality))
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['all']),
        item_slot: getSlot(['melee', 'primary', 'secondary'])
    },
    rules: getRules(['elevated']),
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default festivized