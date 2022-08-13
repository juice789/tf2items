const { call, delay, getContext } = require('redux-saga/effects')
const { prop, indexBy, pick, map, compose, evolve, replace, when } = require('ramda')

const propsToKeep = [
    'image_url'
]

const transformItemsApi = compose(
    map(
        compose(
            pick(propsToKeep),
            when(
                prop('image_url'),
                evolve({ image_url: replace('http://media.steampowered.com/apps/440/icons/', '') })
            )
        )),
    indexBy(prop('defindex'))
)

function* fetchItemsApi() {
    const { getSchemaItems } = yield getContext('api')
    let start = 0, items = []
    do {
        yield delay(1000)
        const response = yield call(getSchemaItems, start)
        items = items.concat(response.result.items)
        start = response.result.next
    } while (start >= 0)
    return transformItemsApi(items)
}


module.exports = { fetchItemsApi }