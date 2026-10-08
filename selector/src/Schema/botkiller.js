import {
    killstreakTier,
    defindex,
    getClasses
} from './controls'

const botkiller = {
    controls: {
        killstreakTier,
        defindex: defindex()
    },
    itemFn: items => Object.fromEntries(
        Object.entries(items).filter(([, item]) => item.item_name.includes('Botkiller'))
    ),
    filters: {
        used_by_classes: getClasses(undefined, ['multi', 'all'])
    },
    defaults: {
        quality: '11'
    },
    validation: {
        single: ['defindex']
    }
}

export default botkiller