import {
    getQuality,
    killstreakTier,
    defindex,
    getClasses,
    getSlot
} from './controls'

const festive = {
    controls: {
        quality: getQuality([11, 6]),
        killstreakTier,
        defindex: defindex()
    },
    itemFn: items => Object.fromEntries(
        Object
            .entries(items)
            .filter(([, item]) =>
                item.item_name.includes('Festive')
                && ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building'].includes(item.item_slot)
            )
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['all']),
        item_slot: getSlot(['melee', 'primary', 'secondary', 'building'])
    },
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default festive