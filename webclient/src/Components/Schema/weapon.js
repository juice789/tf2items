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

import { markGenuine } from './helpers'

const weapon = {
    controls: {
        quality: getQuality([0, 1, 11, 13, 14, 3, 6]),
        elevated,
        uncraftable,
        killstreakTier,
        defindex: defindex(),
    },
    itemFn: items => {
        const filtered = Object.fromEntries(
            Object
                .entries(items)
                .filter(([, item]) =>
                    !([850].includes(item.defindex)) //deflector
                    && !('untradable' in item)
                    && !([0, 15].includes(item.item_quality)) //no normal or decorated items
                    && ['primary', 'melee', 'secondary', 'pda', 'pda2', 'building'].includes(item.item_slot)
                    && !item.item_name.includes('Festive')
                    && !item.item_name.includes('Botkiller')
                    && !item.item_class.includes('_token')
                )
        )
        return Object.fromEntries(
            Object.entries(filtered).map(([key, item]) => [key, markGenuine(item)])
        )
    },
    filters: {
        used_by_classes: getClasses(),
        item_slot: getSlot(['melee', 'primary', 'secondary', 'pda', 'pda2', 'building'])
    },
    rules: getRules(['elevated']),
    validation: {
        single: ['defindex', 'quality'],
        multi: ['quality']
    }
}

export default weapon