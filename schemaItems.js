import schema from './schema.json' with { type: 'json' }

export const safeItems = new Proxy(schema.items, {
    get(receiver, name) {
        return name in receiver ? receiver[name] : {
            defindex: name,
            item_name: 'Undefined item'
        }
    }
})

export const { particleEffects, textures, collections, items } = schema
