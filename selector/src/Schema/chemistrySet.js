import { safeItems as items } from '@juice789/tf2items'

import {
    defindex,
    getClasses
} from './controls'

// one chemistry set base item -> one item per possible output (item.od), composite defindex "base<output"
const expandOutputs = item => item.od.map(od => ({
    ...items[od],
    ...item,
    defindex: item.defindex + '<' + od,
    od,
    item_name: `${item.oq === '14' ? "Collector's " : ''}${items[od].item_name} ${item.item_name}`
}))

// if the item also restricts which item it can be used on (item.td), fan out again into one item
// per target, composite defindex "base<output<target"; otherwise leave it as a single item unchanged
const expandTargets = item => 'td' in item
    ? item.td.map(td => ({
        ...items[td],
        ...item,
        defindex: item.defindex + '<' + td,
        td,
        item_name: `${items[td].item_name} ${item.item_name}`
    }))
    : [item]

const chemistrySet = {
    controls: {
        defindex: defindex()
    },
    itemFn: input => {
        // only the raw chemistry set schema entries, not the expanded output/target combos
        const picked = [20000, 20001, 20005, 20006, 20007]
            .filter(key => key in input)
            .map(key => input[key])
        // expand each base item into every output x target combo, then re-key by the composite defindex
        const expanded = picked.flatMap(expandOutputs).flatMap(expandTargets)
        return Object.fromEntries(expanded.map(item => [item.defindex, item]))
    },
    filters: {
        used_by_classes: getClasses(),
        oq: {
            name: 'oq',
            label: "Collector's",
            isClearable: true,
            isSearchable: false,
            options: [
                ['14', 'Yes']
            ]
        }
    },
    defaults: {
        quality: '6'
    },
    validation: {
        single: ['defindex']
    }
}

export default chemistrySet