import {
    uncraftable,
    defindex
} from './controls'

const paint = {
    controls: {
        uncraftable,
        defindex: defindex(),
    },
    itemFn: items => Object.fromEntries(
        Object
            .entries(items)
            .filter(([, item]) => !['5023'].includes(item.defindex) && item.type2 === 'paint')
    ),
    defaults: {
        quality: '6'
    },
    validation: {
        single: ['defindex']
    }
}

export default paint