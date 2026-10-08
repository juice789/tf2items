import {
    uncraftable,
    defindex
} from './controls'

const renameKey = item =>
    item.item_name === 'Mann Co. Supply Crate Key' && item.name !== 'Decoder Ring'
        ? { ...item, item_name: item.name + ' (Mann Co. Supply Crate Key)' }
        : item

const key = {
    controls: {
        uncraftable,
        defindex: defindex(),
    },
    itemFn: items => {
        const filtered = Object.fromEntries(
            Object
                .entries(items)
                .filter(([, item]) =>
                    !/ New$/.test(item.name) //don't include if it ends with " New"
                    && item.type2 === 'key'
                    && !('untradable' in item)
                )
        )
        return Object.fromEntries(
            Object.entries(filtered).map(([itemKey, item]) => [itemKey, renameKey(item)])
        )
    },
    defaults: {
        quality: '6',
    },
    validation: {
        single: ['defindex']
    }
}

export default key