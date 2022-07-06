const { call, delay, getContext } = require('redux-saga/effects')
const { prop, indexBy, pick, map, compose } = require('ramda')

const propsToKeep = [
    'image_url'
]

const transformItemsApi = compose(
    map(pick(propsToKeep)),
    indexBy(prop('defindex'))
)

function* fetchItemsApi() {
    try {
        const { getSchemaItems } = yield getContext('api')
        let start = 0, items = []
        do {
            yield delay(1000)
            const response = yield call(getSchemaItems, start)
            items = items.concat(response.result.items)
            start = response.result.next
        } while (start >= 0)

        return transformItemsApi(items)

    } catch (err) {
        console.log('error fetching API items', err)
    }
}


module.exports = { fetchItemsApi }