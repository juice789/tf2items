import { mergeDeepWith, mergeDeepRight } from './utils.js'

export function getItems(english, items_game) {

    function mergePrefab(item) {
        const prefabKeys = item.prefab.split(' ')
        const prefabs = prefabKeys.map(k => items_game.prefabs[k]).filter(Boolean)
        const mergedPrefabs = prefabs.reduce(
            (acc, prefab) => mergeDeepWith((p, n) => p + ' ' + n, acc, prefab),
            {}
        )
        const { prefab: _, ...rest } = item
        return mergeDeepRight(mergedPrefabs, rest)
    }

    function mergePrefabs(item) {
        if (!('prefab' in item)) return item
        return mergePrefabs(mergePrefab(item))
    }

    function localize(item, key) {
        const raw = (item[key] ?? 'NaN').toLowerCase().replace('#', '')
        return { ...item, [key]: english[raw] }
    }

    const result = {}
    for (const [defindex, item] of Object.entries(items_game.items)) {
        let processed = mergePrefabs(item)
        processed = localize(processed, 'item_name')
        processed = localize(processed, 'item_type_name')
        result[defindex] = processed
    }
    return result

}
