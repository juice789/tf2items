export function getCollections(english, itemsGame) {
    const collections = {}
    for (const collection of Object.values(itemsGame.item_collections)) {
        collections[collection.name.replace('#', '')] = collection
    }

    const result = {}
    for (const [collectionName, collection] of Object.entries(collections)) {
        const localizedName = english[collectionName.toLowerCase()] ?? collectionName
        for (const [rarity, items] of Object.entries(collection.items)) {
            for (const key of Object.keys(items)) {
                result[key] = { rarity, collection: localizedName }
            }
        }
    }
    return result
}
