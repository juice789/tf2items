const helperObjects = require('./schemaHelper.json')
const schema = require('./schema.json')

const safeItems = new Proxy(schema.items, {
    get(receiver, name) {
        return name in receiver ? receiver[name] : {
            defindex: name,
            item_name: 'Undefined item'
        }
    }
})

module.exports = {
    ...helperObjects,
    ...schema,
    safeItems
}