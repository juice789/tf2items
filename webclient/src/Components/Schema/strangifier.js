import {
    safeItems as items
} from '@juice789/tf2items'

import {
    defindex,
    getClasses
} from './controls'

// one strangifier -> one item per compatible target weapon, composite defindex "base>target"
const expandTargets = item => item.target.map(target => ({
    ...items[target],
    ...item,
    defindex: item.defindex + '>' + target,
    target,
    item_name: items[target].item_name + " Strangifier"
}))

const strangifier = {
    controls: {
        defindex: defindex(),
    },
    itemFn: input => {
        const filtered = Object
            .values(input)
            .filter(item => item.item_name.includes('Strangifier') && 'target' in item)
        const expanded = filtered.flatMap(expandTargets)
        return Object.fromEntries(expanded.map(item => [item.defindex, item]))
    },
    filters: {
        used_by_classes: getClasses()
    },
    defaults: {
        quality: '6',
    },
    validation: {
        single: ['defindex'],
    }
}

export default strangifier