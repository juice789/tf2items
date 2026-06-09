import { call, delay, getContext } from 'redux-saga/effects'

const IMAGE_PREFIX = 'http://media.steampowered.com/apps/440/icons/'

function transformItemsApi(items) {
    const result = {}
    for (const item of items) {
        result[item.defindex] = item.image_url
            ? { image_url: item.image_url.replace(IMAGE_PREFIX, '') }
            : {}
    }
    return result
}

export function* fetchItemsApi() {
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
